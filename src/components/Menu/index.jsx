import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Play, List, Folders, RadioTower, Cog, ChevronLeft, ChevronRight } from "lucide-react";

export default function Menu() {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className={`relative flex flex-col pt-5 border-r border-gray-300 bg-white transition-all duration-300 h-screen overflow-y-auto ${isExpanded ? 'w-72 pl-5' : 'w-20 pl-3'}`}>
            <div className="flex flex-col gap-1 flex-1">
                <NavLink to="/dashboard" className={({ isActive }) =>
                    `flex gap-3 p-3 items-center font-semibold text-lg rounded-md whitespace-nowrap overflow-hidden ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}>
                    <LayoutDashboard className="flex-shrink-0" />
                    <span className={`transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>Dashboard</span>
                </NavLink>

                <NavLink to="/auto-dj" className={({ isActive }) =>
                    `flex gap-3 p-3 items-center font-semibold text-lg rounded-md whitespace-nowrap overflow-hidden ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}>
                    <Play className="flex-shrink-0" />
                    <span className={`transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>Auto DJ</span>
                </NavLink>

                <NavLink to="/playlists" className={({ isActive }) =>
                    `flex gap-3 p-3 items-center font-semibold text-lg rounded-md whitespace-nowrap overflow-hidden ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}>
                    <List className="flex-shrink-0" />
                    <span className={`transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>Playlists</span>
                </NavLink>

                <NavLink to="/file-manager" className={({ isActive }) =>
                    `flex gap-3 p-3 items-center font-semibold text-lg rounded-md whitespace-nowrap overflow-hidden ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}>
                    <Folders className="flex-shrink-0" />
                    <span className={`transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>Gerenciador de Arquivos</span>
                </NavLink>

                <NavLink to="/live-transmission" className={({ isActive }) =>
                    `flex gap-3 p-3 items-center font-semibold text-lg rounded-md whitespace-nowrap overflow-hidden ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}>
                    <RadioTower className="flex-shrink-0" />
                    <span className={`transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>Transmissão ao vivo</span>
                </NavLink>

                <NavLink to="/account-config" className={({ isActive }) =>
                    `flex gap-3 p-3 items-center font-semibold text-lg rounded-md whitespace-nowrap overflow-hidden ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}>
                    <Cog className="flex-shrink-0" />
                    <span className={`transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>Configuração da conta</span>
                </NavLink>

                <NavLink to="/station-config" className={({ isActive }) =>
                    `flex gap-3 p-3 items-center font-semibold text-lg rounded-md whitespace-nowrap overflow-hidden ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}>
                    <Cog className="flex-shrink-0" />
                    <span className={`transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>Configurações da estação</span>
                </NavLink>
            </div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-center p-3 mb-5 text-slate-800 hover:bg-gray-100 rounded-md transition-colors"
                aria-label={isExpanded ? "Retrair menu" : "Expandir menu"}
            >
                {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>
        </div>
    );
}
