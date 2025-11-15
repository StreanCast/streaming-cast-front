import { useState, useEffect } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { BASE_URL } from '../../config';

const AccountConfigPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");
    const stationId = localStorage.getItem("stationId");

    if (!stationId || stationId === "null") {
        window.location.href = "/login";
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/user/listAccountInformation`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                if (response.status === 403) {
                    window.location.href = "/login";
                }

                if (!response.ok) {
                    throw new Error('Erro ao buscar dados do usuário');
                }

                const data = await response.json();
                setFormData({
                    username: data.name,
                    email: data.email,
                    password: '',
                    confirmPassword: ''
                });

            } catch (error) {
                console.error(error);
                setMessage("Erro ao carregar dados do usuário.");
            }
        };

        fetchUserData();
    }, [token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
            setMessage('As senhas não coincidem!');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/user/updateAccountInformation`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: formData.email,
                    flat: null,
                    name: formData.username,
                    password: formData.password,
                })
            });

            if (response.status === 403) {
                window.location.href = "/login";
            }

            if (!response.ok) {
                throw new Error('Erro ao salvar as configurações');
            }

            setMessage('Configurações salvas com sucesso!');

        } catch (error) {
            console.error(error);
            setMessage('Erro ao salvar as configurações.');
        }
    };

    return (
        <div className="min-h-screen p-6 flex flex-col bg-white w-full">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Configuração de Conta</h1>

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
                        {/* Nome de usuário */}
                        <div>
                            <label htmlFor="username" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                Nome de usuário
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="block w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* E-mail */}
                        <div>
                            <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                E-mail
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Senha */}
                        <div>
                            <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                Nova Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                    placeholder="Deixe em branco para não alterar"
                                />
                            </div>
                        </div>

                        {/* Repetir senha */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                                Repetir nova senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text.gray-400" />
                                </div>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
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

export default AccountConfigPage;