import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Play, Pause, Radio } from "lucide-react";
import { BASE_URL } from "../../config";
import { Client } from '@stomp/stompjs';

export default function ListenersPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [dataListeners, setDataListeners] = useState({});
  const audioRef = useRef(null);
  const { stationId } = useParams();
  const [metadataAudio, setMetadataAudio] = useState({});
  const retryInterval = useRef(null);

  // --- cria o áudio uma vez ---
  const createAudio = () => {
    const audio = new Audio(dataListeners.listenerUrl);
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

  async function fetchListeners() {
    try {
      const response = await fetch(`${BASE_URL}/listeners/${stationId}/listeners`);
      if (!response.ok) throw new Error("Erro ao puxar dados");
      const data = await response.json();
      setDataListeners(data);
    } catch (error) {
      console.error("Erro ao puxar dados da estação", error);
    }
  }

  async function fetchMetadataAudio() {
    try {
      const response = await fetch(`${BASE_URL}/listeners/${stationId}/getmetadataaudio`);
      if (!response.ok) throw new Error("Erro ao buscar metadados do audio");
      const metadata = await response.json(); // converte corretamente para JSON
      setMetadataAudio(metadata.data);
    } catch (error) {
      throw new Error("Erro ao buscar metadados do audio")
    }
  }

  useEffect(() => {

    const client = new Client({
      brokerURL: `${BASE_URL}/ws`,
      connectHeaders: {
        "station-id": stationId
      },
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/queue/metadata-audio-user${stationId}`, (message) => {
        const metadata = JSON.parse(message.body);
        setMetadataAudio(metadata);
      });
    };

    client.activate();

    return () => client.deactivate();
  }, [stationId]);



  useEffect(() => {
    fetchListeners();
    fetchMetadataAudio();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-900 to-black text-white flex flex-col items-center p-6">
      <div className="text-center mt-10">
        <div className="flex justify-center mb-4">
          <Radio className="w-16 h-16 text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold mb-2">{dataListeners.stationName}</h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          {dataListeners.stationDescription}
        </p>
      </div>

      <div className="mt-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-md text-center">

        {metadataAudio?.imageAlbum && (
          <img
            src={`data:image/png;base64,${metadataAudio.imageAlbum}`}
            alt="Capa"
            className="w-50 h-50 mx-auto rounded-xl shadow-lg mb-4 object-cover"
          />
        )}


        {/* METADADOS */}
        <h2 className="text-xl font-semibold">{metadataAudio?.title}</h2>
        <p className="text-gray-300 mb-4">{metadataAudio?.artist}</p>

        <button onClick={togglePlay} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-3 text-lg font-semibold mt-3 cursor-pointer">
          {isPlaying ? (
            <><Pause className="w-6 h-6" /> Pausar</>
          ) : (
            <><Play className="w-6 h-6" /> Reproduzir</>
          )}
        </button>
      </div>

      <footer className="mt-auto py-6 text-gray-400 text-sm">
        © {new Date().getFullYear()} {dataListeners.stationName} — Todos os direitos reservados.
      </footer>
    </div>
  );
}