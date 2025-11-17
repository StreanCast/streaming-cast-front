import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LiveTransmissionPage() {
  const [transmissionInfo, setTransmissionInfo] = useState({
    status: '',
    port: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Simula uma chamada de API
    const fetchTransmissionInfo = async () => {
      try {
        // Substitua isso por sua chamada de API real
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula a latência da rede
        
        // Dados mocados para fins de desenvolvimento
        const mockData = {
          status: 'Ao vivo',
          port: '8000',
          password: 'senha_da_transmissao'
        };

        setTransmissionInfo(mockData);
        setLoading(false);
      } catch (err) {
        setError('Falha ao carregar as informações da transmissão.');
        setLoading(false);
      }
    };

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

  if (loading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 uppercase tracking-wide">
          TRANSMISSÃO AO VIVO
        </h2>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
          <div className="bg-gray-600 rounded-lg flex items-center justify-center h-48 sm:h-64 md:h-80">
            <p className="text-white text-lg sm:text-xl font-medium">
              Transmissão ao vivo
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-6 uppercase tracking-wide">
            INFORMAÇÕES DA TRANSMISSÃO
          </h3>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <label className="text-gray-700 font-medium">Status</label>
              <div className="sm:col-span-2">
                <p className="text-gray-600">{transmissionInfo.status}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <label htmlFor="port" className="text-gray-700 font-medium">Porta</label>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  id="port"
                  value={transmissionInfo.port}
                  onChange={handleInputChange}
                  className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <label htmlFor="password" className="text-gray-700 font-medium">Senha</label>
              <div className="sm:col-span-2 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={transmissionInfo.password}
                  onChange={handleInputChange}
                  className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-1 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}