import { useState, useEffect } from 'react';
import { Music as MusicIcon, Search, Power, X, Play, Pause } from 'lucide-react';
import { BASE_URL } from "../../config";
import LoadingModal from '../../components/LoadingModal';
import { Client } from '@stomp/stompjs';

const AutoDjPage = () => {
    const [message, setMessage] = useState("");
    const [metadataAudio, setMetadataAudio] = useState({});
    const [serverStatus, setServerStatus] = useState({});
    const [filesAudioPlaylist, setFilesAudioPlaylist] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const stationId = localStorage.getItem("stationId");

    async function playAutoDj() {
        setLoading(true);
        try {
            const response = await fetch(BASE_URL + "/api/player/playAutoDj", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) console.error("Erro ao dar play no auto dj");
            if (metadataAudio?.playlistName !== undefined) {
                setLoading(false);
            }
            fetchAudioPlaylists();
        } catch (err) {
            console.error("Erro ao dar play no auto dj: ", err);
            setLoading(false);
        }
    };
    async function pauseAutoDj() {
        setLoading(true);
        try {
            const response = await fetch(BASE_URL + "/api/player/pauseAutoDj", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) console.error("Erro ao dar pause no auto dj");
            setLoading(false);
        } catch (err) {
            console.error("Erro ao dar play no auto dj: ", err);
            setLoading(false);
        }
    };
    async function stopAutoDj() {
        setLoading(true);
        try {
            const response = await fetch(BASE_URL + "/api/player/stopAutoDj", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Erro ao desligar auto dj");
            setFilesAudioPlaylist([]);
            setMetadataAudio([]);
            setLoading(false);
        } catch (err) {
            console.error("Erro ao desligar auto dj: ", err);
            setLoading(false);
        }
    };

    async function fetchAudioPlaylists() {
        try {
            const response = await fetch(`${BASE_URL}/api/playlists/listAudio?playlistName=${metadataAudio?.playlistName}.m3u8`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 403 || response.status === 401) {
                // Token expirado → redireciona para login
                window.location.href = "/login";
            }
            if (!response.ok) throw new Error("Erro ao buscar arquivos");
            const data = await response.json(); // converte corretamente para JSON
            setFilesAudioPlaylist(data.musicFileList);
        } catch (error) {
            console.error("Erro ao buscar arquivos:", error);
        }
    };

    async function fetchMetadataAudio() {
        try {
            const response = await fetch(`${BASE_URL}/listeners/${stationId}/getmetadataaudio`);
            if (!response.ok) throw new Error("Erro ao buscar metadados do audio");
            const metadata = await response.json(); // converte corretamente para JSON
            setMetadataAudio(metadata.data);
        } catch (error) {
            throw new Error("Erro ao buscar metadados do audio")
        }
    }

    function verifyPlaying(path, musicName) {
        const fileName = path.split("/").pop();
        return fileName === musicName;
    }

    async function fetchStatusServer() {
        try {
            const response = await fetch(`${BASE_URL}/api/getStatusServer`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) throw new Error("Erro ao buscar o status do servidor");
            const status = await response.json(); // converte corretamente para JSON
            setServerStatus(status.data);
        } catch (error) {
            throw new Error("Erro ao buscar o status do servidor")
        }
    }

    useEffect(() => {
        fetchMetadataAudio();
        fetchStatusServer();
    }, []);

    useEffect(() => {
        if (metadataAudio?.playlistName) {
            if (serverStatus.autoDj === true) {
                fetchAudioPlaylists();
            }
            setLoading(false);
        }
    }, [metadataAudio?.playlistName]);

    useEffect(() => {
        const client = new Client({
            brokerURL: `${BASE_URL}/ws`,
            connectHeaders: {
                "station-id": stationId
            },
            reconnectDelay: 5000,
        });
        client.onConnect = () => {
            client.subscribe(`/queue/metadata-audio-user${stationId}`, (message) => {
                const metadata = JSON.parse(message.body);
                setMetadataAudio(metadata);
            });
            client.subscribe(`/queue/status-server-user${stationId}`, (message) => {
                const statusServer = JSON.parse(message.body);
                setServerStatus(statusServer);
            });
        };

        client.activate();

        return () => client.deactivate();
    }, [stationId]);

    return (
        <>
            <main className="flex-1 p-8 bg-gray-50 min-h-screen">
                {loading && (
                    <LoadingModal show={loading} />
                )}
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Auto DJ</h2>
                <div className="bg-white rounded-lg shadow-sm p-8">
                    {/* Music Icon and Search */}
                    <div className="flex items-start gap-8 mb-8">
                        <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <MusicIcon size={64} className="text-white" strokeWidth={2} />
                        </div>
                    </div>
                    {/* Current Playing */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Playlist: {metadataAudio?.playlistName}</h3>
                    <div className="bg-gray-50 rounded-lg w-full">
                        <div className="flex flex-wrap items-center justify-between px-5">
                            <div className="flex flex-wrap items-center justify-between p-10">
                                <div className='flex flex-wrap items-center gap-10'>
                                    <span className="text-gray-700 font-medium min-w-[150px]">{metadataAudio?.title}</span>
                                    <span className="text-gray-700 font-medium min-w-[150px]">{metadataAudio?.artist}</span>
                                </div>
                                <span className="text-gray-700 font-medium">{metadataAudio?.durationFormated}</span>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    className={`cursor-pointer p-4 rounded-full shadow-md text-white transition-all ${serverStatus?.autoDj ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}>
                                    {serverStatus?.autoDj ? <Pause size={24} onClick={pauseAutoDj} /> : <Play size={24} onClick={playAutoDj} />}
                                </button>
                                <button className={`cursor-pointer p-4 rounded-full shadow-md transition-all ${serverStatus?.autoDj ? "bg-red-500 text-white hover:bg-red-600" : "bg-red-200 text-white hover:bg-red-300"}`}>
                                    <Power size={24} onClick={stopAutoDj} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Queue Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fila</h3>

                        {filesAudioPlaylist.map((music, index) => (
                            <div key={index}>
                                <div className={`rounded-lg p-6 flex items-center justify-between  transition-colors ${verifyPlaying(metadataAudio.songUrl, music.name) ? "bg-green-200" : "bg-gray-50 hover:bg-gray-100"}`}>
                                    <div className="flex items-center gap-4 flex-1">
                                        <span className="text-gray-800 font-medium min-w-[200px]">
                                            {music.name}
                                        </span>
                                        <span className="text-gray-700 font-medium ml-auto mr-4"></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}

export default AutoDjPage;