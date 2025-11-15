import { useState, useRef, useEffect } from "react";
import { Download, Folder, Music, Trash } from "lucide-react";
import { BASE_URL } from "../../config";

export default function FileManager() {
    const [files, setFiles] = useState([]);
    const [currentPath, setCurrentPath] = useState(""); // caminho da pasta atual, vazio = raiz
    const fileInputRef = useRef(null);
    const [fileToDelete, setFileToDelete] = useState(null); // arquivo selecionado
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isModalNewFolderOpen, setIsModalNewFolderOpen] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    
    const token = localStorage.getItem("token");
    const stationId = localStorage.getItem("stationId");

    if (!stationId || stationId === "null") {
        window.location.href = "/login";
    }

    const openDeleteModal = (file) => {
        setFileToDelete(file);
        setIsModalDeleteOpen(true);
    };

    const closeModal = () => {
        setFileToDelete(null);
        setIsModalDeleteOpen(false);
    };

    async function confirmDelete() {
        if (!fileToDelete) return;

        try {
            const response = await fetch(BASE_URL + fileToDelete.deleteLink, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Erro ao excluir o  arquivo");

            // Remove da lista local
            setFiles(files.filter((f) => f.name !== fileToDelete.name));
            closeModal();

        } catch (err) {
            console.error("Erro ao excluir:", err);
        }

    };

    const handleDownload = async (file) => {
        try {
            const response = await fetch(`${BASE_URL}${file.downloadLink}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Erro ao baixar o arquivo");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Cria um link temporário para forçar o download
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name; // nome do arquivo
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Erro ao baixar:", err);
        }
    };


    const fetchFiles = async (path = "") => {

        try {
            const response = await fetch(`${BASE_URL}/api/files/${stationId}/list/audios?path=${path}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 403) {
                // Token expirado → redireciona para login
                window.location.href = "/login";
            }
            if (!response.ok) throw new Error("Erro ao buscar arquivos");
            const data = await response.json(); // converte corretamente para JSON
            setFiles(data);
        } catch (error) {
            console.error("Erro ao buscar arquivos:", error);
        }
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
            const url = file.path.replace("music/", "/")
            setCurrentPath(url); // atualiza o caminho da pasta
        }
    };

    const goBack = () => {
        // Divide o caminho em partes, remove a última e junta novamente
        const parts = currentPath.split("/").filter(Boolean); // remove strings vazias
        parts.pop(); // remove a última pasta
        const parentPath = parts.join("/");
        setCurrentPath(parentPath); // atualiza o estado
    };

    const handleCreateFolder = () => {
        if (!folderName.trim()) {
            alert("Digite um nome para a pasta.");
            return;
        }

        handleNewFolder(folderName); // função passada pelo componente pai
        setIsModalNewFolderOpen(false);
        //setFiles((prevFiles) => [...prevFiles, { name: folderName, downloadLink: null, deleteLink: "delete", openLink: "open", size: "0 KB", path: "/audios/audio2.mp3", isDirectory: true }]);
        setFolderName("");
    };

    const handleCancelNewFolder = () => {
        setFolderName(""); // limpa o nome
        setIsModalNewFolderOpen(false);  // fecha o modal
    };

    async function handleNewFolder(folderName) {
        try {
            const response = await fetch(`${BASE_URL}/api/files/${stationId}/newFolder?path=music/${currentPath}/${folderName}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 403) {
                // Token expirado → redireciona para login
                window.location.href = "/login";
            }
            if (!response.ok) throw new Error("Erro ao criar pasta");
            fetchFiles(currentPath);
        } catch (error) {
            console.error("Erro ao criar pasta", error);
        }
    }

    const handleUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const directory = currentPath; // ou o diretório atual que você usa
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        formData.append("directory", directory);

        setIsUploading(true);
        setMessage("");
        setProgress(0);

        // Usamos XMLHttpRequest para ter acesso ao progresso
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                setProgress(percent);
            }
        });

        xhr.addEventListener("load", () => {
            setIsUploading(false);
            if (xhr.status >= 200 && xhr.status < 300) {
                setMessage("Upload concluído com sucesso!");
                fetchFiles(currentPath);
            } else {
                setMessage(`Erro no upload (${xhr.status})`);
            }
        });

        xhr.addEventListener("error", () => {
            setIsUploading(false);
            setMessage("Erro ao enviar os arquivos");
        });

        xhr.open("POST", BASE_URL + "/api/files/uploadAudio", true);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
    };

    return (
        <div className="min-h-screen p-6 flex flex-col bg-white w-full">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Gerenciador de arquivos</h1>

            <div className="rounded-lg border-3 p-5" style={{ borderColor: "#DDDDDD" }}>
                {/* Barra de progresso */}
                {isUploading && (
                    <div className="w-full flex gap-3 justify-center items-center pb-5">
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                            <div
                                className="bg-blue-500 h-4 rounded-full transition-all duration-200"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        {/* Texto de progresso */}
                        <p className="text-lg text-gray-700 mt-2">{progress}%</p>
                    </div>
                )}{/* Mensagem final */}
                {message && (
                    <div className="m-6 p-4 rounded-xl bg-blue-100 text-blue-700 shadow">
                        {message}
                    </div> )}
                {/* Texto de progresso */}

                <div className="w-full flex flex-wrap justify-between gap-3">
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => setIsModalNewFolderOpen(true)} className="px-4 py-2 rounded-lg font-semibold border-3 text-white bg-blue-500 hover:bg-blue-700 cursor-pointer" style={{ borderColor: "#DDDDDD" }}>
                            Nova pasta
                        </button>
                        <div className="w-auto sm:w-[200px] md:w-[350px] lg:w-[450px] lx:w-[600px]">
                            {/* Input escondido */}
                            <input ref={fileInputRef} type="file" multiple accept="audio/mpeg" className="hidden" id="file-upload" onChange={handleUpload} />
                            {/* Label estilizado como botão */}
                            <label htmlFor="file-upload"
                                className="text-xl rounded-lg border-3 p-3 w-full cursor-pointer flex items-center justify-center bg-white hover:bg-blue-400 hover:text-white"
                                style={{ borderColor: "#DDDDDD" }}>
                                Escolher arquivos
                            </label>
                        </div>
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
                                <th scope="col" className="pl-8 py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap">Nome</th>
                                <th scope="col" width="150px" className="px-3 py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap text-center">Tamanho</th>
                                <th scope="col" width="250px" className="py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap text-center">Caminho</th>
                                <th scope="col" width="100px" className="py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {files.map((file, index) => (
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
                                                    <div className="text-slate-800 truncate max-w-110">{file.name}</div>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 text-xl text-slate-800 whitespace-nowrap">{file.size}</td>
                                    <td className="py-4 text-xl text-slate-800 whitespace-nowrap truncate max-w-30">{file.path}</td>
                                    {file.isDirectory ? (
                                        <td className="px-4 py-4 text-xl text-slate-800 whitespace-nowrap flex justify-end">
                                            <Trash size={25} onClick={() => openDeleteModal(file)} className="text-red-500 hover:text-red-700 cursor-pointer" />
                                        </td>
                                    ) : (
                                        <td className="px-4 py-4 text-xl text-slate-800 whitespace-nowrap flex justify-end">
                                            <button title="Download" onClick={() => handleDownload(file)} className="flex items-center justify-center cursor-pointer">
                                                <Download size={25} className="text-blue-500 hover:text-blue-700 mr-3" />
                                            </button>
                                            <Trash size={25} onClick={() => openDeleteModal(file)} className="text-red-500 hover:text-red-700 cursor-pointer" />
                                        </td>
                                    )}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {isModalDeleteOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                            <div className="bg-white rounded-lg p-6 w-96">
                                <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
                                <p className="mb-6">
                                    Tem certeza que deseja excluir <strong>{fileToDelete?.name}</strong>?
                                </p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                                    >Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Modal */}
            {isModalNewFolderOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Criar nova pasta</h2>

                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Nome da pasta"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={handleCancelNewFolder}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateFolder}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-lg">
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}