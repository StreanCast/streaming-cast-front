import React, { useState, useEffect } from 'react';
import { Volume2, Play, Headphones, HardDrive, Radio, Music } from 'lucide-react';
import StatusCard from '../../components/StatusCard';
import ContentSection from '../../components/ContentSection';
import { BASE_URL } from "../../config";
import { Client } from '@stomp/stompjs';
import LoadingModal from '../../components/LoadingModal';

const Dashboard = () => {

    const [transmissionInfo, setTransmissionInfo] = useState({
        transmissionType: '',
        transmissionPort: '',
        transmissionPassword: '',
        transmissionIpServer: '',
        transmissionMount: ''
    });

    const [infoServer, setInfoServer] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [metadataAudio, setMetadataAudio] = useState({});
    const [serverStatus, setServerStatus] = useState({});

    const token = localStorage.getItem("token");
    const stationId = localStorage.getItem("stationId");

    async function fetchTransmissionInfo() {
        try {
            const response = await fetch(`${BASE_URL}/api/infoStationReader`, {
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
            setTransmissionInfo(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar arquivos:", error);
            setLoading(false);
        }
    };

    async function fetchInfoServer() {
        try {
            const response = await fetch(`${BASE_URL}/api/files/list/infoServer`, {
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
            setInfoServer(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar arquivos:", error);
            setLoading(false);
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
        fetchTransmissionInfo();
        fetchInfoServer();
        fetchMetadataAudio();
        fetchStatusServer();
    }, []);

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
            <main className="flex-1 p-8 bg-gray-50">
                <div className="flex justify-between items-center mb-8">
                    {loading && (
                        <LoadingModal show={loading} />
                    )}
                    <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <button className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                            <Play size={20} fill="white" />
                        </button>
                        <button className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                            <Volume2 size={20} />
                        </button>
                        <input
                            type="range"
                            className="w-32 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            min="0"
                            max="100"
                            defaultValue="80"
                        />
                    </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <StatusCard title="NO AR" icon={Radio} color="green" />
                    {serverStatus.autoDj && (
                        <StatusCard title="AUTO-DJ LIGADO" icon={Volume2} color="blue" titleMusic={metadataAudio.title} playlistMusic={metadataAudio.playlistName} artistMusic={metadataAudio.artist} />
                    )}{!serverStatus.autoDj && (
                        <StatusCard title="AUTO-DJ DESLIGADO" icon={Volume2} color="red" />
                    )}
                    <StatusCard title="OUVINTES" icon={Headphones} color="orange" info={`Online: ${serverStatus?.listeners ? serverStatus.listeners : "0"}`} />
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-2 gap-6 mb-6 items-stretch">
                    <ContentSection title="ESPAÇO" className="bg-gray-50">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <HardDrive size={18} />
                                <span className="font-bold">ESPAÇO TOTAL</span>
                            </div>
                            <p className="text-sm pl-6">📁 {infoServer?.totalSpace}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <HardDrive size={18} />
                                <span className="font-bold">ESPAÇO USADO</span>
                            </div>
                            <p className="text-sm pl-6">📁 {infoServer?.usedSpace}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <HardDrive size={18} />
                                <span className="font-bold">ESPAÇO DISPONÍVEL</span>
                            </div>
                            <p className="text-sm pl-6">📁 {infoServer?.availableSpace}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <HardDrive size={18} />
                                <span className="font-bold">PORCENTAGEM DE ESPAÇO OCUPADO</span>
                            </div>
                            <p className="text-sm pl-6">📁 {infoServer?.percentUsedSpace}</p>
                        </div>
                    </ContentSection>
                    <ContentSection title="TRANSMISSÃO AO VIVO" className="bg-gray-50">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">TIPO DE SERVIDOR</span>
                            </div>
                            <p className="text-sm pl-6">📡 {transmissionInfo?.transmissionType}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">IP DO SERVIDOR</span>
                            </div>
                            <p className="text-sm pl-6">📡 {transmissionInfo?.transmissionIpServer}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">PORTA DO SERVIDOR</span>
                            </div>
                            <p className="text-sm pl-6">📡 {transmissionInfo?.transmissionPort}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">SENHA</span>
                            </div>
                            <p className="text-sm pl-6">📡 {transmissionInfo?.transmissionPassword}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">PONTO DE MONTAGEM</span>
                            </div>
                            <p className="text-sm pl-6">📡 {transmissionInfo?.transmissionMount}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">URL DE ESCUTA</span>
                            </div>
                            <a className="text-sm pl-6 break-all" target='blank' href={`http://${transmissionInfo?.transmissionIpServer}:${transmissionInfo?.transmissionPort}${transmissionInfo?.transmissionMount}`}>🎧 {transmissionInfo?.transmissionIpServer}:{transmissionInfo?.transmissionPort}{transmissionInfo?.transmissionMount}</a>
                        </div>
                    </ContentSection>
                </div >

                <div className="grid grid-cols-2 gap-6 items-stretch">
                    <ContentSection title="AUTO DJ">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Music size={18} />
                                <span className="font-bold">PLAYLIST</span>
                            </div>
                            <p className="text-sm pl-6">📋 {metadataAudio?.playlistName}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Music size={18} />
                                <span className="font-bold">TÍTULO</span>
                            </div>
                            <p className="text-sm pl-6">🎵 {metadataAudio?.title}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Music size={18} />
                                <span className="font-bold">ARTISTA</span>
                            </div>
                            <p className="text-sm pl-6">🎵 {metadataAudio?.artist}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Music size={18} />
                                <span className="font-bold">ÁLBUM</span>
                            </div>
                            <p className="text-sm pl-6">🎵 {metadataAudio?.album}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Music size={18} />
                                <span className="font-bold">DURAÇÃO</span>
                            </div>
                            <p className="text-sm pl-6">🎵 {metadataAudio?.durationFormated ? metadataAudio?.durationFormated : "Duração desconhecida"}</p>
                        </div>
                    </ContentSection>
                    <ContentSection title="INFORMAÇÕES DA ESTAÇÃO" className="bg-gray-50">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">URL DA PÁGINA DE OUVITES</span>
                            </div>
                            <a className="text-sm pl-6 break-all" target='blank' href={`${window.location.origin}/${stationId}/listeners`}>{`${window.location.origin}/${stationId}/listeners`}</a>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">BITRATE</span>
                            </div>
                            <p className="text-sm pl-6">🎧 {transmissionInfo?.bitrate}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">GÊNERO</span>
                            </div>
                            <p className="text-sm pl-6">🎧 {transmissionInfo?.genre}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Headphones size={18} />
                                <span className="font-bold">OUVINTES</span>
                            </div>
                            <p className="text-sm pl-6">🎧 {serverStatus?.listeners ? serverStatus.listeners + " ouvintes" : "0 ouvintes"}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Headphones size={18} />
                                <span className="font-bold">PICO DO OUVINTE</span>
                            </div>
                            <p className="text-sm pl-6">🎧 {serverStatus?.listenerPeak ? serverStatus.listenerPeak + " ouvintes" : "0 ouvintes"}</p>
                        </div>
                    </ContentSection>
                </div>
            </main >
        </>
    );
}

export default Dashboard;