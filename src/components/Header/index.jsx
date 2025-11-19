import { useEffect, useState } from "react";
import { Menu, LogOut, User, Play, Volume2 } from "lucide-react";
import { BASE_URL } from "../../config";
import Player from "../Player";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dataListeners, setDataListeners] = useState({});
  const token = localStorage.getItem("token");

  async function fetchListeners() {
    try {
      const response = await fetch(`${BASE_URL}/api/getInfoState`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) console.error("Erro ao puxar dados");
      if (response.status === 403 || response.status === 401) {
        // Token expirado → redireciona para login
        window.location.href = "/login";
      }
      const data = await response.json();
      setDataListeners(data);
      localStorage.setItem("stationId", data.stationId);
    } catch (error) {
      console.error("Erro ao puxar dados da estação", error);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("stationId");
    window.location.href = "/login";
  }

  useEffect(() => {
    fetchListeners();
  }, []);

  return (
    <header className="bg-gray-50 shadow-md fixed z-5 w-full px-6 py-6 flex items-center justify-between">
      {/* Logo */}
      <h1 className="text-3xl font-bold text-gray-700">{dataListeners.stationName}</h1>

      <div className="flex items-center gap-10">
        <div className="flex items-center gap-4">
          <Player urlPlay={dataListeners.listenerUrl} />
        </div>

        {/* Menu de usuário */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <User className="w-5 h-5 text-gray-600 cursor-pointer" />
            <span className="text-gray-700">Minha Conta</span>
            <Menu className="w-4 h-4 text-gray-500" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-xl border border-gray-300 p-2 animate-fadeIn cursor-pointer">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-left text-gray-700 cursor-pointer"
                onClick={logout}>
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
