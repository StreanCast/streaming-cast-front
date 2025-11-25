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
    const [metadataAudio, setMetadataAudio] = useState({});
    const [serverStatus, setServerStatus] = useState({});
    const [message, setMessage] = useState("");

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
            if (!response.ok) setMessage("Erro ao buscar arquivos");
            const data = await response.json(); // converte corretamente para JSON
            setTransmissionInfo(data.data);
            setLoading(false);
        } catch (error) {
            setMessage("Erro ao buscar arquivos:");
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
            if (!response.ok) setMessage("Erro ao buscar arquivos");
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
            if (!response.ok) setMessage("Erro ao buscar metadados do audio");
            const metadata = await response.json(); // converte corretamente para JSON
            setMetadataAudio(metadata.data);
        } catch (error) {
            setMessage("Erro ao buscar metadados do audio")
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
            if (!response.ok) setMessage("Erro ao buscar o status do servidor");
            const status = await response.json(); // converte corretamente para JSON
            setServerStatus(status.data);
        } catch (error) {
            setMessage("Erro ao buscar o status do servidor")
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
            <main className="mt-18 flex-1 p-8 bg-gray-100">
                <div className="flex justify-between items-center">
                    {loading && (
                        <LoadingModal show={loading} />
                    )}
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
                </div>

                {message && (
                    <div className={`m-6 p-4 rounded-xl shadow ${message.includes("sucesso") ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                        <p className="text-lg m-3" >
                            {message}
                        </p>
                    </div>
                )}
                {/* Status Cards */}
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatusCard title="NO AR" icon={Radio} color="green" />
                    {serverStatus?.autoDj && (
                        <StatusCard title="AUTO-DJ LIGADO" icon={Volume2} color="blue" titleMusic={metadataAudio?.title} playlistMusic={metadataAudio?.playlistName} artistMusic={metadataAudio?.artist} />
                    )}{!serverStatus?.autoDj && (
                        <StatusCard title="AUTO-DJ DESLIGADO" icon={Volume2} color="red" />
                    )}
                    <StatusCard title="OUVINTES" icon={Headphones} color="orange" info={`Online: ${serverStatus?.listeners ? serverStatus.listeners : "0"}`} />
                </div>

                {/* Content Sections */}
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mb-7 items-stretch">
                    <ContentSection title="ESPAÇO" className="bg-gray-50">
                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <HardDrive size={18} />
                                <span className="font-bold">ESPAÇO TOTAL</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">📁 {infoServer?.totalSpace}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <HardDrive size={18} />
                                <span className="font-bold">ESPAÇO USADO</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">📁 {infoServer?.usedSpace}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <HardDrive size={18} />
                                <span className="font-bold">ESPAÇO DISPONÍVEL</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">📁 {infoServer?.availableSpace}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <HardDrive size={18} />
                                <span className="font-bold">PORCENTAGEM DE ESPAÇO OCUPADO</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">📁 {infoServer?.percentUsedSpace}</p>
                        </div>
                    </ContentSection>
                    <ContentSection title="TRANSMISSÃO AO VIVO" className="bg-gray-50">
                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Radio size={18} />
                                <span className="font-bold">TIPO DE SERVIDOR</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">📡 {transmissionInfo?.transmissionType}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Radio size={18} />
                                <span className="font-bold">IP DO SERVIDOR</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">📡 {transmissionInfo?.transmissionIpServer}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Radio size={18} />
                                <span className="font-bold">PORTA DO SERVIDOR</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">📡 {transmissionInfo?.transmissionPort}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Radio size={18} />
                                <span className="font-bold">SENHA</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">📡 {transmissionInfo?.transmissionPassword}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Radio size={18} />
                                <span className="font-bold">PONTO DE MONTAGEM</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">📡 {transmissionInfo?.transmissionMount}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Radio size={18} />
                                <span className="font-bold">URL DE ESCUTA</span>
                            </div>
                            <a className="text-md text-blue-700 hover:text-blue-800 font-semibold pl-6 pb-1 break-all" target='blank' href={`http://${transmissionInfo?.transmissionIpServer}:${transmissionInfo?.transmissionPort}${transmissionInfo?.transmissionMount}`}>🎧 {transmissionInfo?.transmissionIpServer}:{transmissionInfo?.transmissionPort}{transmissionInfo?.transmissionMount}</a>
                        </div>
                    </ContentSection>
                </div >

                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    <ContentSection title="AUTO DJ">
                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Music size={18} />
                                <span className="font-bold">PLAYLIST</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">📋 {metadataAudio?.playlistName}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Music size={18} />
                                <span className="font-bold">TÍTULO</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">🎵 {metadataAudio?.title}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Music size={18} />
                                <span className="font-bold">ARTISTA</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">🎵 {metadataAudio?.artist}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Music size={18} />
                                <span className="font-bold">ÁLBUM</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">🎵 {metadataAudio?.album}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Music size={18} />
                                <span className="font-bold">DURAÇÃO</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">🎵 {metadataAudio?.durationFormated ? metadataAudio?.durationFormated : "Duração desconhecida"}</p>
                        </div>
                    </ContentSection>
                    <ContentSection title="INFORMAÇÕES DA ESTAÇÃO" className="bg-gray-50">
                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Radio size={18} />
                                <span className="font-bold">URL DA PÁGINA DE OUVITES</span>
                            </div>
                            <a className="text-md text-blue-700 hover:text-blue-800 font-semibold pl-6 pb-1 break-all" target='blank' href={`${window.location.origin}/${stationId}/listeners`}>{`${window.location.origin}/${stationId}/listeners`}</a>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Radio size={18} />
                                <span className="font-bold">BITRATE</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">🎧 {transmissionInfo?.bitrate}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Radio size={18} />
                                <span className="font-bold">GÊNERO</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">🎧 {transmissionInfo?.genre}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Headphones size={18} />
                                <span className="font-bold">OUVINTES</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">🎧 {serverStatus?.listeners ? serverStatus.listeners + " ouvintes" : "0 ouvintes"}</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 p-1">
                                <Headphones size={18} />
                                <span className="font-bold">PICO DO OUVINTE</span>
                            </div>
                            <p className="text-md font-semibold pl-6 pb-1">🎧 {serverStatus?.listenerPeak ? serverStatus.listenerPeak + " ouvintes" : "0 ouvintes"}</p>
                        </div>
                    </ContentSection>
                </div>
            </main >
        </>
    );
}

export default Dashboard;