import { useState, useRef, useEffect } from "react";
import { Download, Trash, Pencil, List, Music, Folder, CornerDownLeft, CircleX, MoveRight } from "lucide-react";
import { BASE_URL } from "../../config";
import LoadingModal from '../../components/LoadingModal';

export default function PlaylistPage() {
    const [filesPlaylist, setFilesPlaylist] = useState([]);
    const [filesAudioPlaylist, setFilesAudioPlaylist] = useState([]);
    const [filesMusic, setFilesMusic] = useState([]);
    const fileInputRef = useRef(null);
    const [fileToDelete, setFileToDelete] = useState(null); // arquivo selecionado
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState(""); // caminho da pasta atual, vazio = raiz
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [mensage, setMessage] = useState("");
    const [selected, setSelected] = useState(null);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isCreateNamePlaylist, setIsCreateNamePlaylist] = useState(false);
    const [playlistName, setPlaylistName] = useState("");
    const [uploadResult, setUploadResult] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const openFolder = (file) => {
        if (file.isDirectory) {
            setSelected(null);
            const url = file.path.replace("music/", "/")
            setCurrentPath(url); // atualiza o caminho da pasta
        }
    };

    const savePlaylist = () => {
        if (playlistName === "") {
            setIsCreateNamePlaylist(true);
        } else {
            fetchSavePlaylist();
        }
        setIsModalEditOpen(false);

    };

    const goBack = () => {
        // Divide o caminho em partes, remove a última e junta novamente
        const parts = currentPath.split("/").filter(Boolean); // remove strings vazias
        parts.pop(); // remove a última pasta
        const parentPath = parts.join("/");
        setCurrentPath(parentPath); // atualiza o estado
    };

    const addToRight = () => {
        if (selected !== null) {
            setFilesAudioPlaylist([...filesAudioPlaylist, selected]);
            setFilesMusic(filesMusic.filter((_, i) => i !== selected));
            setSelected(null);
        }
    };

    const openDeleteModal = (file) => {
        setFileToDelete(file);
        setIsModalDeleteOpen(true);
    };

    const closeModal = () => {
        setFileToDelete(null);
        setIsModalDeleteOpen(false);
    };

    const closeModalEditCreatePlaylist = () => {
        setIsCreateNamePlaylist(false);
        setPlaylistName("");
        setIsModalEditOpen(false);
        setFilesAudioPlaylist([]);
        setCurrentPath("");
    };

    const editPlaylist = (playlistName) => {
        setPlaylistName(playlistName);
        fetchFilesMusic();
        fetchAudioPlaylists(playlistName);
        setIsModalEditOpen(true);
    }
    const createPlaylist = () => {
        fetchFilesMusic();
        setIsModalEditOpen(true);
    }

    async function fetchSavePlaylist() {
        const paths = filesAudioPlaylist.map(item => item.path);
        try {
            const response = await fetch(`${BASE_URL}/api/playlists/update`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    playlistName: playlistName,
                    playList: paths
                })
            });
            if (response.status === 403 || response.status === 401) {
                // Token expirado → redireciona para login
                window.location.href = "/login";
            }
            if (!response.ok) throw new Error("Erro ao buscar arquivos");
            fetchFilesPlaylists();
            setPlaylistName("");
            setIsCreateNamePlaylist(false);
            setFilesAudioPlaylist([]);
        } catch (error) {
            console.error("Erro ao buscar arquivos:", error);
        }
    }

    async function fetchSavePlaylistMater(paths) {
        paths = paths.map(item => item.name.replace(".m3u8", ""));
        try {
            const response = await fetch(`${BASE_URL}/api/playlists/updateMaster`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ playList: paths })
            });
            if (response.status === 403 || response.status === 401) {
                // Token expirado → redireciona para login
                window.location.href = "/login";
            }

            if (!response.ok) throw new Error("Erro ao salvar arquivos");
            fetchFilesPlaylists();
            setPlaylistName("");
            setIsCreateNamePlaylist(false);
            setFilesAudioPlaylist([]);
        } catch (error) {
            console.error("Erro ao buscar arquivos:", error);
        }
    }

    async function fetchFilesMusic(path = "") {

        try {
            const response = await fetch(`${BASE_URL}/api/files/list/audios?path=${path}`, {
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
            setFilesMusic(data);
        } catch (error) {
            console.error("Erro ao buscar arquivos:", error);
        }
    };

    async function confirmDelete() {
        if (!fileToDelete) return;
        closeModal();
        setFilesPlaylist(filesPlaylist.filter((f) => f.name !== fileToDelete.name));

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
            setFilesPlaylist(filesPlaylist.filter((f) => f.name !== fileToDelete.name));
            closeModal();
            setFilesAudioPlaylist(filesAudioPlaylist.filter((f) => f.name !== fileToDelete.name));
            const filtrado = filesPlaylist.filter(item => item.name != fileToDelete.name);
            fetchSavePlaylistMater(filtrado);

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

            const contentLength = response.headers.get("Content-Length");
            if (!contentLength) {
                console.warn("Não foi possível obter o tamanho do arquivo");
            }

            const total = contentLength ? parseInt(contentLength, 10) : 0;
            let loaded = 0;

            const reader = response.body.getReader();
            const chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                loaded += value.length;
                setIsDownloading(true);
                if (total) {
                    const progress = (loaded / total) * 100;
                    setProgress(progress.toFixed(2));
                    // Aqui você pode atualizar uma barra de progresso no seu estado React

                    if (progress === 100) {
                        setIsDownloading(false);
                    }
                }
            }

            // Concatena os chunks e cria o blob
            const blob = new Blob(chunks);
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error("Erro ao baixar:", err);
        }
    };


    async function fetchFilesPlaylists() {

        try {
            const response = await fetch(`${BASE_URL}/api/playlists/listMaster`, {
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
            setFilesPlaylist(data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar arquivos:", error);
            setLoading(false);
        }
    };

    async function fetchAudioPlaylists(playlistName) {
        try {
            const response = await fetch(`${BASE_URL}/api/playlists/listAudio?playlistName=${playlistName}.m3u8`, {
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
            setFilesAudioPlaylist(data.musicFileList);
        } catch (error) {
            console.error("Erro ao buscar arquivos:", error);
        }
    };


    useEffect(() => {
        fetchFilesPlaylists(); // chama a função para carregar arquivos inicialmente
    }, []); // <- array de dependências do useEffect

    useEffect(() => {
        fetchFilesMusic(currentPath);
    }, [currentPath]);

    const handleUpload = async (event) => {
        const file = event.target.files[0]; // apenas 1 arquivo
        if (!file) return;

        // 🔥 Bloqueia arquivos que não sejam .txt
        if (!file.name.toLowerCase().endsWith(".txt")) {
            setMessage("Envie apenas arquivos .txt");
            return;
        }

        const directory = currentPath;

        setIsUploading(true);
        setMessage("");
        setProgress(0);

        // Criar o formData (você esqueceu isso)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("directory", directory); // incluir pasta se necessário

        // Para acompanhar progresso:
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                setProgress(percent);
            }
        });

        xhr.addEventListener("load", () => {
            setIsUploading(false);

            let resposta;
            try {
                resposta = JSON.parse(xhr.responseText);
            } catch {
                resposta = null;
            }

            const valid = resposta.data?.valid ?? 0;
            const invalid = resposta.data?.invalid ?? 0;

            setUploadResult({
                valid: valid,
                invalid: invalid,
                message: resposta.mensage
            });

            if (xhr.status >= 200 && xhr.status < 300) {
                setMessage("Upload concluído com sucesso!");
                fetchFilesPlaylists();
            } else {
                setMessage(`Erro no upload (${xhr.status})`);
            }
        });

        xhr.addEventListener("error", () => {
            setIsUploading(false);
            setMessage("Erro ao enviar o arquivo");
        });

        xhr.open("POST", BASE_URL + "/api/playlists/upload", true);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
    };


    return (
        <div className="mt-22 min-h-screen p-6 flex flex-col bg-white w-full h-screen">
            {loading && (
                <LoadingModal show={loading} />
            )}
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Playlists</h1>

            <div className="rounded-lg border-3 p-5" style={{ borderColor: "#DDDDDD" }}>
                {/* Barra de progresso */}
                {isUploading || isDownloading && (
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
                {uploadResult && (
                    <div className="m-6 p-4 rounded-xl bg-blue-100 text-blue-700 shadow">
                        <p>{uploadResult.message}</p>
                        <p><strong>{uploadResult.valid}</strong> itens válidos</p>
                        <p><strong>{uploadResult.invalid}</strong> itens inválidos</p>
                    </div>
                )}

                {/* Texto de progresso */}

                <div className="w-full flex flex-wrap justify-between gap-3">
                    <div className="flex flex-wrap gap-3">
                        <div className="w-auto sm:w-[250px] md:w-[250px] lg:w-[250px] lx:w-[250px]">
                            {/* Input escondido */}
                            <input ref={fileInputRef} type="file" multiple accept="text/plain" className="hidden" id="file-upload" onChange={handleUpload} />
                            {/* Label estilizado como botão */}
                            <label htmlFor="file-upload"
                                className="text-xl rounded-lg border-3 p-3 w-full cursor-pointer flex items-center justify-center bg-white hover:bg-blue-400 hover:text-white"
                                style={{ borderColor: "#DDDDDD" }}>
                                Adicionar Playlist
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="w-auto sm:w-[250px] md:w-[250px] lg:w-[250px] lx:w-[250px]">

                            <button className="text-xl rounded-lg border-3 p-3 w-full cursor-pointer flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white" onClick={() => { createPlaylist() }} style={{ borderColor: "#DDDDDD" }}>
                                Criar Playlist
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full mx-auto bg-white rounded-lg border-3 m-5 overflow-x-auto" style={{ borderColor: "#DDDDDD" }}>
                    <table className="w-full rounded-lg bg-white divide-y divide-gray-200">
                        <thead>
                            <tr className="divide-y divide-gray-200 bg-gray-200">
                                <th scope="col" className="pl-8 py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap">Nome</th>
                                <th scope="col" width="150px" className="px-3 py-3 text-center text-xl font-bold text-slate-700 whitespace-nowrap text-center">Músicas</th>
                                <th scope="col" width="120px" className="py-3 text-center text-xl font-bold text-slate-700 whitespace-nowrap text-center">Duração</th>
                                <th scope="col" width="200px" className="py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filesPlaylist.map((file, index) => (
                                <tr key={index} className="hover:bg-slate-50">
                                    <td className="pl-6 py-4 text-xl text-slate-800 whitespace-nowrap gap-4">
                                        <div className="flex items-center gap-3">
                                            <List size={25} className="text-purple-500" />
                                            <div>{file.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 text-xl text-slate-800 whitespace-nowrap text-center">{file.audioCount}</td>
                                    <td className="py-4 text-xl text-slate-800 whitespace-nowrap text-center">{file.temPlaylist}</td>
                                    <td className="px-4 py-4 text-xl text-slate-800 whitespace-nowrap flex justify-end">
                                        <button title="Editar" className="flex items-center justify-center cursor-pointer">
                                            <Pencil size={25} className="text-yellow-500 hover:text-yellow-700 mr-3" onClick={() => { editPlaylist(file.name) }} />
                                        </button>
                                        <button title="Download" onClick={() => handleDownload(file)} className="flex items-center justify-center cursor-pointer">
                                            <Download size={25} className="text-blue-500 hover:text-blue-700 mr-3" />
                                        </button>
                                        <button title="Excluir" className="flex items-center justify-center cursor-pointer">
                                            <Trash size={25} onClick={() => openDeleteModal(file)} className="text-red-500 hover:text-red-700 cursor-pointer" />
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {isModalEditOpen && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-30 z-30">
                            <div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-6 w-full flex gap-4 h-200">
                                {/* Botão de Fechar */}
                                <CircleX size={40} className="cursor-pointer absolute top-10 right-32 text-black hover:text-red-500 text-2xl" onClick={closeModalEditCreatePlaylist} />
                                {/* Lista Esquerda */}
                                <div className="overflow-y-auto w-full">
                                    <h2 className="text-xl font-semibold mb-3">Lista de músicas</h2>
                                    <div className="space-y-2">
                                        <table className="w-full rounded-lg bg-white divide-y divide-gray-200">
                                            <thead>
                                                <tr className="divide-y divide-gray-200 bg-gray-200">
                                                    <th scope="col" className="pl-8 py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap">Nome</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filesMusic.map((file, index) => (
                                                    <tr key={index} className="hover:bg-slate-50">
                                                        <td className=" text-xl text-slate-800 whitespace-nowrap flex items-center gap-4 cursor-pointer" onClick={() => openFolder(file)}>
                                                            {file.isDirectory ? (
                                                                // Se for pasta, ícone de pasta e link para navegar para ela

                                                                <div className="pl-6 py-4 flex items-center gap-3" >
                                                                    <Folder size={25} className="text-yellow-500 hover:text-yellow-700" />
                                                                    <div className="text-blue-500 hover:text-blue-700 truncate max-w-60">{file.name}</div>
                                                                </div>
                                                            ) : (
                                                                // Se for arquivo, ícone de download
                                                                <div className={`flex items-center justify-between w-full pl-6 py-4 ${selected === file ? "bg-blue-200" : "hover:bg-gray-100"}`} onClick={() => setSelected(file)}>
                                                                    {/* Lado esquerdo: ícone + nome */}
                                                                    <div className="flex items-center gap-3">
                                                                        <Music size={25} className="text-purple-500" />
                                                                        <div className="text-slate-800 truncate max-w-60">{file.name}</div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Botão Central */}
                                <div className="flex pt-10 flex-col items-center justify-between">
                                    <button onClick={goBack} disabled={!currentPath} className={`px-4 py-2 rounded-lg font-semibold border-3 text-white ${currentPath ? "bg-blue-500 hover:bg-blue-700 cursor-pointer" : "bg-gray-300 cursor-not-allowed"} `} style={{ borderColor: "#DDDDDD" }} ><CornerDownLeft size={30} /></button>
                                    <button onClick={addToRight} disabled={selected === null} className="px-4 py-2 rounded-lg font-semibold border-3 text-white bg-blue-500 hover:bg-blue-700 cursor-pointer disabled:opacity-40"><MoveRight size={30} /></button>
                                    <button onClick={() => { savePlaylist() }} className="px-4 py-2 rounded-lg font-semibold border-3 text-white bg-blue-500 hover:bg-blue-700 cursor-pointer" style={{ borderColor: "#DDDDDD" }}>Salvar</button>
                                </div>
                                {/* Lista Direita */}

                                <div className="overflow-y-auto w-full">
                                    <h2 className="text-xl font-semibold mb-3">Playlist</h2>
                                    <div className="space-y-2">
                                        <table className="w-full rounded-lg bg-white divide-y divide-gray-200">
                                            <thead>
                                                <tr className="divide-y divide-gray-200 bg-gray-200">
                                                    <th scope="col" className="pl-8 py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap">Nome</th>
                                                    <td></td>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filesAudioPlaylist.map((file, index) => (
                                                    <tr key={index} className="hover:bg-slate-50">
                                                        <td className="pl-6 py-4 text-xl text-slate-800 whitespace-nowrap flex items-center gap-4">
                                                            <div className="flex items-center justify-between w-full">
                                                                <div className="flex items-center gap-3">
                                                                    <Music size={25} className="text-purple-500" />
                                                                    <div className="text-slate-800 truncate max-w-110">{file.name}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td><Trash size={25} onClick={() => setFilesAudioPlaylist(filesAudioPlaylist.filter((f) => f.name !== file.name))} className="text-red-500 hover:text-red-700 cursor-pointer" /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
                                        onClick={() => { confirmDelete(fileToDelete?.name) }}
                                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                                    >Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Modal */}
                    {isCreateNamePlaylist && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                            <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Criar nova playlist</h2>

                                <input
                                    type="text"
                                    value={playlistName}
                                    onChange={(e) => setPlaylistName(e.target.value)}
                                    placeholder="Nome da pasta"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />

                                <div className="flex justify-end mt-6 space-x-3">
                                    <button
                                        onClick={() => { closeModalEditCreatePlaylist() }}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-lg">
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => { savePlaylist() }}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-lg">
                                        Criar
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