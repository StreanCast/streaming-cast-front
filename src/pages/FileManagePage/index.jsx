import { useState, useRef, useEffect } from "react";
import { Download, Folder, Music, Trash } from "lucide-react";
import { Link } from "react-router-dom";

const sampleFiles = [
    { name: "musica", downloadLink: "download", deleteLink: "delete", openLink: "open", size: "3.2 MB", path: "/audios/musica.mp3", isDirectory: false },
    { name: "podcast", downloadLink: "download", deleteLink: "delete", openLink: "open", size: "2.5 MB", path: "/audios/podcast.mp3", isDirectory: false },
    { name: "audio2", downloadLink: "download", deleteLink: "delete", openLink: "open", size: "5.5 MB", path: "/audios/audio2.mp3", isDirectory: false },
    { name: "Chiclete com Banana", downloadLink: "download", deleteLink: "delete", openLink: "open", size: "5.5 MB", path: "/audios/audio2.mp3", isDirectory: true },
];

export default function FileManager() {
    const [files, setFiles] = useState(sampleFiles);
    const [currentPath, setCurrentPath] = useState(""); // caminho da pasta atual, vazio = raiz
    const fileInputRef = useRef(null);
    const [fileToDelete, setFileToDelete] = useState(null); // arquivo selecionado
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = localStorage.getItem("token");
    const stationId = localStorage.getItem("stationId");

    const openDeleteModal = (file) => {
        setFileToDelete(file);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setFileToDelete(null);
        setIsModalOpen(false);
    };

    const confirmDelete = () => {
        if (!fileToDelete) return;

        fetch(fileToDelete.deleteLink, { method: "DELETE" })
            .then(() => {
                // Remove da lista local
                setFiles(files.filter((f) => f.id !== fileToDelete.id));
                closeModal();
            })
            .catch((err) => console.error("Erro ao excluir arquivo:", err));
    };

    const fetchFiles = (path = "") => {
        fetch(`http://136.112.234.6:8080/api/files/${stationId}/list/audios?path=${path}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar arquivos");
                return res.json();
            })
            .then((data) => setFiles(data))
            .catch((err) => console.error(err));
    };


    useEffect(() => {
        fetchFiles(); // chama a função para carregar arquivos inicialmente
    }, []); // <- array de dependências do useEffect

    // Buscar arquivos iniciais
    useEffect(() => {
        fetchFiles(currentPath);
    }, [currentPath]);

    const openFolder = (file) => {
        if (file.isDirectory) {
            setCurrentPath(file.path); // atualiza o caminho da pasta
        }
    };

    const goBack = () => {
        if (!currentPath) return; // já está na raiz

        // Divide o caminho em partes, remove a última e junta novamente
        const parts = currentPath.split("/").filter(Boolean); // remove strings vazias
        parts.pop(); // remove a última pasta
        const parentPath = parts.join("/");
        setCurrentPath(parentPath); // atualiza o estado
    };

    return (
        <div className="min-h-screen p-6 flex flex-col bg-white">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Gerenciador de arquivos</h1>

            <div className="rounded-lg border-3 p-5" style={{ borderColor: "#DDDDDD" }}>
                <div className="w-full flex justify-between gap-3">
                    <div className="w-lg">
                        {/* Input escondido */}
                        <input ref={fileInputRef} type="file" multiple accept="audio/mpeg" className="hidden" id="file-upload" />
                        {/* Label estilizado como botão */}
                        <label htmlFor="file-upload" onClick={() => fileInputRef.current?.click()}
                            className="text-xl rounded-lg border-3 p-3 w-full cursor-pointer flex items-center justify-center bg-white hover:bg-blue-400 hover:text-white"
                            style={{ borderColor: "#DDDDDD" }}>
                            Escolher arquivos
                        </label>
                    </div>

                    <button
                        onClick={goBack}
                        disabled={!currentPath} // desabilita se estiver na raiz
                        className={`px-4 py-2 rounded-lg font-semibold border-3 text-white ${currentPath ? "bg-blue-500 hover:bg-blue-700 cursor-pointer" : "bg-gray-300 cursor-not-allowed"
                            } `} style={{ borderColor: "#DDDDDD" }}
                    >
                        Voltar
                    </button>

                </div>

                <div className="w-full mx-auto bg-white rounded-lg border-3 m-5 overflow-x-auto" style={{ borderColor: "#DDDDDD" }}>
                    <table className="w-full rounded-lg bg-white divide-y divide-gray-200">
                        <thead>
                            <tr className="divide-y divide-gray-200 bg-gray-200">
                                <th colSpan={2} scope="col" className="pl-8 py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap">Nome</th>
                                <th scope="col" className="pr-3 py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap flex items-center justify-center">Tamanho</th>
                                <th scope="col" className="py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap">Caminho</th>
                                <th scope="col" className="py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sampleFiles.map((file, index) => (
                                <tr key={index} className="hover:bg-slate-50">
                                    <td className="pl-6 py-4 text-xl text-slate-800 whitespace-nowrap flex items-center gap-4">
                                        {file.isDirectory ? (
                                            // Se for pasta, ícone de pasta e link para navegar para ela
                                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => openFolder(file)}>
                                                <Folder size={25} className="text-yellow-500 hover:text-yellow-700" />
                                                <div className="text-blue-500 hover:text-blue-700">{file.name}</div>
                                            </div>
                                        ) : (
                                            // Se for arquivo, ícone de download
                                            <div className="flex items-center justify-between w-full">
                                                {/* Lado esquerdo: ícone + nome */}
                                                <div className="flex items-center gap-3">
                                                    <Music size={25} className="text-purple-500" />
                                                    <div className="text-slate-800">{file.name}</div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 text-xl text-slate-800 whitespace-nowrap"></td>
                                    <td className="py-4 text-xl text-slate-800 whitespace-nowrap flex items-center justify-center">{file.size}</td>
                                    <td className="py-4 text-xl text-slate-800 whitespace-nowrap">{file.path}</td>
                                    {file.isDirectory ? (
                                        <td></td>
                                    ) : (
                                        <td className="px-4 py-4 text-xl text-slate-800 whitespace-nowrap flex">
                                            <Link title="Download" to={file.downloadLink} className="flex items-center justify-center">
                                                <Download size={25} className="text-blue-500 hover:text-blue-700 mr-3" />
                                            </Link>
                                            <Trash size={25} onClick={() => openDeleteModal(file)} className="text-red-500 hover:text-red-700 cursor-pointer" />
                                        </td>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                            <div className="bg-white rounded-lg p-6 w-96">
                                <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
                                <p className="mb-6">
                                    Tem certeza que deseja excluir <strong>{fileToDelete?.name}</strong>?
                                </p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                                    >Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}