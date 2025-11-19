import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

export default function Player({ urlPlay }) {
    const audioRef = useRef(null);
    const retryInterval = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);

    // --- cria o áudio uma vez ---
    const createAudio = () => {
        const audio = new Audio(urlPlay);
        audio.volume = volume;
        audioRef.current = audio;

        audio.load();
        audio
            .play()
            .then(() => {
                setIsPlaying(true);
            })
            .catch(() => {
                setIsPlaying(false);
                onAudioEnded();
            });

        startListeners(audio);
    };

    // --- PLAY ---
    const playAudio = () => {
        if (!audioRef.current) {
            createAudio();
            return;
        }

        const audio = audioRef.current;
        audio.load();
        audio
            .play()
            .then(() => {
                setIsPlaying(true);
            })
            .catch(() => {
                setIsPlaying(false);
                onAudioEnded();
            });
    };

    // --- PAUSE ---
    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };

    // --- toggle ---
    const togglePlay = () => {
        if (isPlaying) {
            setIsPlaying(false);
            pauseAudio();
        } else {
            playAudio();
        }
    };

    // --- volume ---
    const adjustVolume = (e) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        if (audioRef.current) {
            audioRef.current.volume = v;
        }
    };

    // --- listeners do áudio ---
    const startListeners = (audio) => {
        audio.addEventListener("canplaythrough", () => {
        });

        audio.addEventListener(
            "playing",
            () => {
                clearInterval(retryInterval.current);
            },
            { once: true }
        );

        audio.addEventListener("pause", () => {
            setIsPlaying(false);
        });

        audio.addEventListener("ended", () => {
            clearInterval(retryInterval.current);
            setIsPlaying(false);
            onAudioEnded();
        });

        audio.addEventListener("error", () => {
            clearInterval(retryInterval.current);
            playAudio();
        });
    };

    // --- reconexão automática ---
    const onAudioEnded = () => {
        if (!retryInterval.current) {
            retryInterval.current = setInterval(() => {
                playAudio();
            }, 5000);
        }
    };

    // --- desmontar (ngOnDestroy) ---
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            clearInterval(retryInterval.current);
        };
    }, []);

    return (
        <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors cursor-pointer">
                {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />} 
            </button>
            <button className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                <Volume2 size={20} />
            </button>
            {/* Volume */}
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={adjustVolume} className="w-32 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500" />
        </div>
    );
}
