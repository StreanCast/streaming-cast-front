import { Volume2, Play, Headphones, HardDrive, Radio, Music } from 'lucide-react'
import StatusCard from '../../components/StatusCard'
import ContentSection from '../../components/ContentSection'

const Profile = () => {
    return (
        <>

            <main className="flex-1 p-8 bg-gray-50">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
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
                    <StatusCard
                        title="NO AR"
                        icon={Radio}
                        color="green"
                    />
                    <StatusCard
                        title="AUTODJ LIGADO"
                        icon={Volume2}
                        color="blue"
                    />
                    <StatusCard
                        title="OUVINTES"
                        icon={Headphones}
                        color="orange"
                        info="Online: 34"
                    />
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-2 gap-6 mb-6 items-stretch">
                    <ContentSection title="ESPAÇO" className="bg-gray-50">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <HardDrive size={18} />
                                <span className="font-bold">ESPAÇO TOTAL</span>
                            </div>
                            <p className="text-sm pl-6">📁 10 GB</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <HardDrive size={18} />
                                <span className="font-bold">ESPAÇO USADO</span>
                            </div>
                            <p className="text-sm pl-6">📁 72.4 MB</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <HardDrive size={18} />
                                <span className="font-bold">ESPAÇO DISPONÍVEL</span>
                            </div>
                            <p className="text-sm pl-6">📁 10 GB disponíveis</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <HardDrive size={18} />
                                <span className="font-bold">PORCENTAGEM</span>
                            </div>
                            <p className="text-sm pl-6">📁 0.71% usados</p>
                        </div>
                    </ContentSection>
                    <ContentSection title="TRANSMISSÃO AO VIVO" className="bg-gray-50">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">TIPO DE SERVIDOR</span>
                            </div>
                            <p className="text-sm pl-6">📡 Icecast 2</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">IP DO SERVIDOR</span>
                            </div>
                            <p className="text-sm pl-6">📡 192.168.0.110</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">PORTA DO SERVIDOR</span>
                            </div>
                            <p className="text-sm pl-6">📡 8001</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">SENHA</span>
                            </div>
                            <p className="text-sm pl-6">📡 bw85kG</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">PONTO DE MONTAGEM</span>
                            </div>
                            <p className="text-sm pl-6">📡 /live</p>
                        </div>
                    </ContentSection>
                </div >

                <div className="grid grid-cols-2 gap-6 items-stretch">
                    <ContentSection title="AUTO DJ">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Music size={18} />
                                <span className="font-bold">TÍTULO</span>
                            </div>
                            <p className="text-sm pl-6">🎵 Dont Wanna Know</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Music size={18} />
                                <span className="font-bold">ARTISTA</span>
                            </div>
                            <p className="text-sm pl-6">🎵 Maroon</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Music size={18} />
                                <span className="font-bold">ÁLBUM</span>
                            </div>
                            <p className="text-sm pl-6">🎵 Álbum desconhecido</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Music size={18} />
                                <span className="font-bold">DURAÇÃO</span>
                            </div>
                            <p className="text-sm pl-6">🎵 04:05</p>
                        </div>
                    </ContentSection>
                    <ContentSection title="INFORMAÇÕES DA ESTAÇÃO" className="bg-gray-50">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">URL DE ESCUTA</span>
                            </div>
                            <p className="text-sm pl-6 break-all">🎧 http://192.168.0.104:8001/live</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">BITRATE</span>
                            </div>
                            <p className="text-sm pl-6">🎧 64</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Radio size={18} />
                                <span className="font-bold">GÊNERO</span>
                            </div>
                            <p className="text-sm pl-6">🎧 classical</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Headphones size={18} />
                                <span className="font-bold">OUVINTES</span>
                            </div>
                            <p className="text-sm pl-6">🎧 Online: 0 online</p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Headphones size={18} />
                                <span className="font-bold">PICO DO OUVINTE</span>
                            </div>
                            <p className="text-sm pl-6">🎧 0 ouvintes</p>
                        </div>
                    </ContentSection>
                </div>
            </main >
        </>
    );
}

export default Profile;