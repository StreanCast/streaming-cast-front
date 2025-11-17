import { useState, useEffect } from 'react';
import { Radio, FileText, Image, Link as LinkIcon, BarChart } from 'lucide-react';
import { BASE_URL } from '../../config';

const StationConfigPage = () => {
    const [formData, setFormData] = useState({
        stationName: "",
        description: "",
        logoUrl: "",
        streamingUrl: "",
        bitrate: ""
    });

    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");
    
    useEffect(() => {
        const fetchStationData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/infoStationReader`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                if (response.status === 403 || response.status === 401) {
                    window.location.href = "/login";
                }

                if (!response.ok) {
                    throw new Error('Erro ao buscar dados da estação');
                }

                const data = await response.json();
                setFormData({
                    stationName: data.data.streamName,
                    description: data.data.streamDescription,
                    logoUrl: data.data.logoUrl,
                    streamingUrl: `${data.data.transmissionIpServer}:${data.data.transmissionPort}${data.data.transmissionMount}`,
                    bitrate: data.data.bitrate

                });

            } catch (error) {
                console.error(error);
                setMessage("Erro ao carregar dados da estação.");
            }
        };

        fetchStationData();
    }, [token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/infoStationUpdate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    streamUrl: null,
                    transmissionPassword: null,
                    mp3MetadataInterval: null,
                    burstSize: null,
                    bitrate: formData.bitrate,
                    transmissionUser: null,
                    type: null,
                    streamName: formData.stationName,
                    transmissionMount: null,
                    sourcePassword: null,
                    adminUser: null,
                    relayPassword: null,
                    genre: null,
                    streamDescription: formData.description,
                    adminPassword: null
                })
            });

            if (response.status === 403 || response.status === 401) {
                window.location.href = "/login";
            }

            if (!response.ok) {
                throw new Error('Erro ao salvar as configurações da estação');
            }

            setMessage('Configurações da estação salvas com sucesso!');

        } catch (error) {
            console.error(error);
            setMessage('Erro ao salvar as configurações da estação.');
        }
    };

    return (
        <div className="min-h-screen p-6 flex flex-col bg-white w-full">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Configuração da Estação</h1>

            <div className="rounded-lg border-3 p-5" style={{ borderColor: "#DDDDDD" }}>
                {message && (
                    <div className="w-full flex gap-3 justify-center items-center pb-5">
                        <p
                            className={`text-lg mt-3 ${message.includes("sucesso")
                                ? "text-green-600"
                                : "text-red-600"
                                }`}
                        >
                            {message}
                        </p>
                    </div>
                )}
                <div className="w-full max-w-2xl">
                    <div className="space-y-5 sm:space-y-6">
                        {/* Nome da Estação */}
                        <div>
                            <label htmlFor="stationName" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                Nome da Estação
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <Radio className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="stationName"
                                    name="stationName"
                                    value={formData.stationName}
                                    onChange={handleChange}
                                    className="block w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Descrição */}
                        <div>
                            <label htmlFor="description" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                Descrição
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="block w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* URL do Logo */}
                        <div>
                            <label htmlFor="logoUrl" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                URL do Logo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <Image className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="logoUrl"
                                    name="logoUrl"
                                    disabled
                                    value={formData.logoUrl ?? ""}
                                    onChange={handleChange}
                                    className="cursor-not-allowed block w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* URL do Streaming */}
                        <div>
                            <label htmlFor="streamingUrl" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                URL do Streaming
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <LinkIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="streamingUrl"
                                    name="streamingUrl"
                                    disabled
                                    value={formData.streamingUrl ?? ""}
                                    onChange={handleChange}
                                    className=" cursor-not-allowed block w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Bitrate */}
                        <div>
                            <label htmlFor="bitrate" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                Bitrate
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <BarChart className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="bitrate"
                                    name="bitrate"
                                    value={formData.bitrate}
                                    onChange={handleChange}
                                    className="block w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Botão Salvar */}
                        <div className="pt-2">
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 rounded-lg font-semibold border-3 text-white bg-blue-500 hover:bg-blue-700 cursor-pointer"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StationConfigPage;