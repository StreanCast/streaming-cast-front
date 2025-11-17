import { Volume2, Play, Headphones, Radio } from 'lucide-react'

const Profile = () => {
    return (
        <>

                    <main className="flex-1 p-8 bg-gray-50">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Rdio Digital Web Dashboard</h2>
                            <div className="flex items-center gap-4">
                                <button className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                                    <Play size={20} fill="white" />
                                </button>
                                <button className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                                    <Volume2 size={20} />
                                </button>
                                <input
                                    type="range"
                                    className="w-32 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    min="0"
                                    max="100"
                                    defaultValue="80"
                                />
                            </div>
                        </div>

                        {/* Status Cards */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                <h3 className="text-xl font-bold tracking-wide">NO AR</h3>
                                <Radio size={48} strokeWidth={2} />
                            </div>
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                <h3 className="text-xl font-bold tracking-wide">AUTODJ LIGADO</h3>
                                <Volume2 size={48} />
                            </div>
                            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                <h3 className="text-xl font-bold tracking-wide">OUVINTES</h3>
                                <Headphones size={48} strokeWidth={2} />
                                <p className="text-base font-semibold">Online: 34</p>
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="bg-white rounded-xl overflow-hidden shadow-md">
                                <h3 className="bg-blue-50 text-blue-700 px-6 py-4 text-lg font-bold tracking-wide">
                                    ESPAÇO
                                </h3>
                                <div className="p-8 min-h-[150px] bg-gray-50"></div>
                            </div>
                            <div className="bg-white rounded-xl overflow-hidden shadow-md">
                                <h3 className="bg-blue-50 text-blue-700 px-6 py-4 text-lg font-bold tracking-wide">
                                    TRANSMISSÃO AO VIVO
                                </h3>
                                <div className="p-8 min-h-[150px] bg-gray-50"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl overflow-hidden shadow-md">
                                <h3 className="bg-blue-50 text-blue-700 px-6 py-4 text-lg font-bold tracking-wide">
                                    AUTO DJ
                                </h3>
                                <div className="p-8 min-h-[150px]">
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        Losem inçãm dolor emtum de com de descites
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl overflow-hidden shadow-md">
                                <h3 className="bg-blue-50 text-blue-700 px-6 py-4 text-lg font-bold tracking-wide">
                                    INFORMAÇÕES DA ESTAÇÃO
                                </h3>
                                <div className="p-8 min-h-[150px] bg-gray-50"></div>
                            </div>
                        </div>
                    </main>
        </>
    );
}

export default Profile;