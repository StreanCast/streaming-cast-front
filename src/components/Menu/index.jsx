import { NavLink } from "react-router-dom";
import { User, Play, List, Folders, RadioTower, Cog } from "lucide-react";

export default function Menu() {
     {/*sm:	640px	Celulares maiores
 md:	768px	Tablets
lg:	1024px	Laptops
xl:	1280px	Monitores grandes
2xl: */}
    return (
        
        <div className="pl-5 pt-5 flex flex-col sm:w-[500px] md:w-[500px] lg:w-[500px] xl:w-[500px] 2xl:w-[500px] gap-1">
            <NavLink to="/"className={({ isActive }) =>
                       `flex gap-2 p-3 items-center font-semibold text-lg rounded-md ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}><User /> Perfil
            </NavLink>

            <NavLink to="/auto-dj" className={({ isActive }) =>
                    `flex gap-3 p-3 items-center font-semibold text-lg rounded-md ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}>
                        <Play /> Auto DJ
            </NavLink>

            <NavLink to="/playlists"className={({ isActive }) =>
                    `flex gap-3 p-3 items-center font-semibold text-lg rounded-md ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}>
                        <List /> Playlists
            </NavLink>

            <NavLink to="/file-manager" className={({ isActive }) =>
                    `flex gap-3 p-3 items-center font-semibold text-lg rounded-md ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}>
                        <Folders /> Gerenciador de Arquivos
            </NavLink>

            <NavLink to="/live-transmission" className={({ isActive }) =>
                    `flex gap-3 p-3 items-center font-semibold text-lg rounded-md ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}>
                <RadioTower /> Transmissão ao vivo
            </NavLink>

            <NavLink to="/account-config"className={({ isActive }) =>
                    `flex gap-3 p-3 items-center font-semibold text-lg rounded-md ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}>
                <Cog /> Configuração da conta
            </NavLink>

            <NavLink to="/station-config" className={({ isActive }) =>
                    `flex gap-3 p-3 items-center font-semibold text-lg rounded-md ${isActive
                        ? "bg-blue-500 text-white"
                        : "text-slate-800 hover:bg-blue-500 hover:text-white"}`}>
                <Cog /> Configurações da estação
            </NavLink>
        </div>
    );
}
