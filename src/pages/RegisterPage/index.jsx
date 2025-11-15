import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'; // Added User icon

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    plan: 'Plano Padrão', // Default plan
    termsAccepted: false // Changed from rememberMe
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cadastro:', formData);
    alert('Cadastro realizado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-500 mb-2">
            Crie sua conta
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Preencha os dados para se cadastrar
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                Nome
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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

            {/* Plan Field (Read-only/Hidden) */}
            <div>
              <label htmlFor="plan" className="block text-gray-700 text-sm font-medium mb-2">
                Plano
              </label>
              <input
                type="text"
                id="plan"
                name="plan"
                value={formData.plan}
                className="block w-full px-3 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Terms Accepted Checkbox */}
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="w-4 h-4 bg-gray-200 border-gray-300 rounded text-blue-500 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">Concordo com os Termos de Serviço</span>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white transition-colors"
            >
              Cadastrar
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Já tem uma conta?{' '}
            <a href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}