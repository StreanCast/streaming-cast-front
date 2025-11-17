import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { BASE_URL } from '../../config';
import LoadingModal from '../../components/LoadingModal';

export default function LiveTransmissionPage() {
  const [transmissionInfo, setTransmissionInfo] = useState({
    transmissionType: '',
    transmissionPort: '',
    transmissionPassword: '',
    transmissionIpServer: '',
    transmissionMount: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage.getItem("token");

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

  useEffect(() => {
    fetchTransmissionInfo();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setTransmissionInfo(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="w-full">
      <div className='w-full flex-1 p-4 sm:p-6 lg:p-8'>
        {error && (
          <main className='w-full'>
            <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          </main>
        )}
        {loading && (
          <LoadingModal show={loading} />
        )}
        <div className="">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 tracking-wide">
            Transmissão ao vivo
          </h2>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
              <div className="bg-gray-600 rounded-lg flex items-center justify-center h-38 sm:h-54 md:h-70">
                <p className="text-white text-lg sm:text-xl font-medium">Transmissão ao vivo!</p>
              </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-6 tracking-wide">
              Informações da transmissão
            </h3>

            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <label htmlFor="type" className="text-gray-700 font-medium">Tipo</label>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    id="type"
                    value={transmissionInfo?.transmissionType}
                    onChange={handleInputChange}
                    disabled
                    className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <label htmlFor="ip" className="text-gray-700 font-medium">IP</label>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    id="ip"
                    value={transmissionInfo?.transmissionIpServer}
                    onChange={handleInputChange}
                    disabled
                    className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <label htmlFor="port" className="text-gray-700 font-medium">Porta</label>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    id="port"
                    value={transmissionInfo?.transmissionPort}
                    onChange={handleInputChange}
                    disabled
                    className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <label htmlFor="password" className="text-gray-700 font-medium">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={transmissionInfo?.transmissionPassword}
                    onChange={handleInputChange}
                    disabled
                    className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-1 top-1 flex justify-start text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <label htmlFor="mount" className="text-gray-700 font-medium">Ponto de montagem</label>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    id="mount"
                    value={transmissionInfo?.transmissionMount}
                    onChange={handleInputChange}
                    disabled
                    className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}