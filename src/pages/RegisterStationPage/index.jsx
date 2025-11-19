import React, { useState } from 'react';
import { RadioTower, Lock, Eye, EyeOff, AudioWaveform } from 'lucide-react'; // Added User icon
import { BASE_URL } from "../../config";

export default function RegisterStationPage() {
  const [formData, setFormData] = useState({
    name: '',
    frequency: '',
    password: '',

  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const fetchRegister = async () => {
    if (!formData.termsAccepted) {
      setErrorMessage("É preciso aceitar os termos de serviço.");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/createStation`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          frequency: formData.frequency,
          password: formData.password
        })
      });
      // if (response.status === 403 || response.status === 401) {
      //   // Token expirado → redireciona para login
      //   window.location.href = "/login";
      // }
      if (!response.ok) {
        const errorData = await response.json();
        const { password, name } = errorData || {};
        const messages = [password ? password : null, name ? name : null].filter(Boolean); // remove os null/undefined
        const errorMessage = messages.join(". ");
        setErrorMessage(errorMessage);
        return;
      }
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage("Erro ao conectar ao servidor.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRegister();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-500 mb-2">
            Agora crie sua estação de rádio web!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Preencha os dados para criar sua rádio
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-xl">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                Nome da estação*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RadioTower className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name ?? ""}
                  onChange={handleChange}
                  placeholder="Digite o nome da sua estação de rádio"
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="frequency" className="block text-gray-700 text-sm font-medium mb-2">
                Frequência da estação
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AudioWaveform className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  id="frequency"
                  name="frequency"
                  value={formData.frequency ?? ""}
                  onChange={handleChange}
                  placeholder="Digite a frequência de sua estação"
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                Senha de transmissão*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password ?? ""}
                  onChange={handleChange}
                  placeholder="Digite a senha para transmissões ao vivo"
                  className="block w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              </div>
            </div>
            {/* Terms Accepted Checkbox */}
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted ?? false}
                  onChange={handleChange}
                  className="w-4 h-4 bg-gray-200 border-gray-300 rounded text-blue-500 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">Concordo com os Termos de Serviço*</span>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white transition-colors cursor-pointer">
              Criar
            </button>
          </form>
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center animate-fadeIn">
            <h2 className="text-xl font-bold mb-2 text-blue-500">
              Rádio web criada com sucesso!
            </h2>
            <p className="text-gray-700 mb-4">
              Sua rádio foi registrada. Agora você já pode fazer transmissões.
            </p>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                window.location.href = "/dashboard";
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}