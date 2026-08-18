'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  textToSpeak: string;
  developerName: string;
}

export default function VoiceRoastPlayer({ textToSpeak, developerName }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const handleTogglePlay = () => {
    if (!isSupported || typeof window === 'undefined') return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    const fullSpeech = `Reviewing portfolio for ${developerName}. Here is the verdict: ${textToSpeak}`;
    const utterance = new SpeechSynthesisUtterance(fullSpeech);
    utterance.rate = speechRate;
    utterance.pitch = 0.95;

    // Pick an expressive English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find((v) => v.name.includes('Google UK English Male') || v.name.includes('Daniel') || v.name.includes('Natural')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      null;

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0d121f] to-slate-950 border border-orange-500/30 flex items-center justify-between flex-wrap gap-3 font-mono text-xs shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
          <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-xs font-outfit">Savage AI Audio Commentary</span>
            <span className="text-[9px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
              Web Speech TTS
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Listen to the critique read aloud by the AI critic</p>
        </div>
      </div>

      {/* Animated Soundwave Visualizer when playing */}
      {isPlaying && (
        <div className="flex items-center gap-1 h-5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
          <span className="w-1 bg-orange-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-4" />
          <span className="w-1 bg-red-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2.5" />
          <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.3s_ease-in-out_infinite] h-5" />
          <span className="w-1 bg-orange-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-3" />
          <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-4" />
        </div>
      )}

      {/* Play / Stop Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            isPlaying
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-lg shadow-orange-500/20'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-black" />}
          <span>{isPlaying ? 'Pause Voice Roast' : 'Play Voice Roast'}</span>
        </button>

        {isPlaying && (
          <button
            type="button"
            onClick={handleStop}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Stop audio"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
