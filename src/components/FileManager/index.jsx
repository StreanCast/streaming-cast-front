import { useState, useRef } from "react";
import { File as FileIcon, Upload, Download } from "lucide-react";

const sampleFiles = [
    { id: 1, name: "musica", size: "3.2 MB", path: "/audios/musica.mp3" },
    { id: 2, name: "podcast", size: "2.5 MB", path: "/audios/podcast.mp3" },
    { id: 3, name: "audio2", size: "5.5 MB", path: "/audios/audio2.mp3" },
];

export default function FileManager() {
    const [files, setFiles] = useState(sampleFiles);
    const fileInputRef = useRef(null);

    return (
        <div className="min-h-screen p-6 flex flex-col bg-white">
            <h1 className="text-3xl font-bold mb-6">Gerenciador de arquivos</h1>

            <div className="rounded-lg border-3 p-5" style={{ borderColor: "#DDDDDD" }}>
                <div className="max-w-md max-w-md">
                    {/* Input escondido */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="audio/mpeg"
                        className="hidden"
                        id="file-upload"
                    />

                    {/* Label estilizado como botão */}
                    <label
                        htmlFor="file-upload"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xl rounded-lg border-3 p-3 w-full cursor-pointer flex items-center justify-center bg-white"
                        style={{ borderColor: "#DDDDDD" }}
                    > Escolher arquivos</label>
                </div>

                <div className="w-full mx-auto bg-white rounded-lg border-3 m-5" style={{ borderColor: "#DDDDDD" }}>
                    <table className="min-w-full rounded-lg bg-white divide-y divide-gray-200">
                        <thead>
                            <tr class="divide-y divide-gray-200 bg-gray-200">
                                <th colSpan={6} scope="col" className="px-6 py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap">Nome</th>
                                <th scope="col" className="px-6 py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap">Tamanho</th>
                                <th scope="col" className="px-6 py-3 text-left text-xl font-bold text-slate-700 whitespace-nowrap">Caminho</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            {sampleFiles.map((file) => (
                                <tr key={file.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-xl text-slate-800 whitespace-nowrap flex items-center gap-4"><Download size={25}/><div className="text-blue-600">{file.name}</div></td>
                                    <td className="px-6 py-4 text-xl text-slate-800 whitespace-nowrap"></td>
                                    <td className="px-6 py-4 text-xl text-slate-800 whitespace-nowrap"></td>
                                    <td className="px-6 py-4 text-xl text-slate-800 whitespace-nowrap"></td>
                                    <td className="px-6 py-4 text-xl text-slate-800 whitespace-nowrap"></td>
                                    <td className="px-6 py-4 text-xl text-slate-800 whitespace-nowrap"></td>
                                    <td className="px-6 py-4 text-xl text-slate-800 whitespace-nowrap">{file.size}</td>
                                    <td className="px-6 py-4 text-xl text-slate-800 whitespace-nowrap">{file.path}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}