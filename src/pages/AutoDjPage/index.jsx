import { useState } from 'react'
import { Music as MusicIcon, Search, Power, X } from 'lucide-react'

const AutoDjPage = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [musicQueue] = useState([
        { id: 1, name: 'Nome da Música', artist: 'Cantor', duration: '03:45' }
    ])

    return (
        <>
            <main className="flex-1 p-8 bg-gray-50 min-h-screen">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Auto DJ</h2>

                <div className="bg-white rounded-lg shadow-sm p-8">
                    {/* Music Icon and Search */}
                    <div className="flex items-start gap-8 mb-8">
                        <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <MusicIcon size={64} className="text-white" strokeWidth={2} />
                        </div>

                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Pesquisar faixas"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Current Playing */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                <span className="text-gray-700 font-medium min-w-[150px]">Nome da Música</span>
                                <span className="text-gray-700 font-medium min-w-[150px]">Cantor</span>
                                <span className="text-gray-700 font-medium">03:45</span>
                            </div>
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <Power size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Queue Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fila</h3>

                        {musicQueue.map((music) => (
                            <div key={music.id} className="bg-gray-50 rounded-lg p-6 flex items-center justify-between hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4 flex-1">
                                    <span className="text-gray-800 font-medium min-w-[200px]">
                                        {music.name}- {music.artist}
                                    </span>
                                    <span className="text-gray-700 font-medium ml-auto mr-4">{music.duration}</span>
                                </div>
                                <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                    <X size={20} className="text-gray-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}

export default AutoDjPage;