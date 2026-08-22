'use client';

import { useState, useEffect, useRef } from 'react';
import { Device, VoiceCommandResult } from '@/types';
import {
  isSpeechRecognitionSupported,
  createSpeechRecognitionInstance,
  speakText,
} from '@/lib/speech';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  CheckCircle2,
  Flame,
  Zap,
  Sliders,
  Send,
  Loader2,
  Terminal,
  Activity,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  currentDevices: Device[];
  onExecuteActions: (actions: VoiceCommandResult['actions']) => void;
}

const SAMPLE_VOICE_PROMPTS = [
  'Set the mood for movie night and lock the front door',
  'Goodnight, turn off all lights and set AC to 68 degrees',
  'Good morning, turn on kitchen lights and start coffee',
  'Lock the front door and arm security cameras',
];

export default function VoiceCommandCenter({ currentDevices, onExecuteActions }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [typedInput, setTypedInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<VoiceCommandResult | null>(null);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setHasSpeechSupport(isSpeechRecognitionSupported());
  }, []);

  // Audio Equalizer Waveform Simulator
  useEffect(() => {
    if (!isListening) {
      setAudioLevel(0);
      return;
    }
    const interval = setInterval(() => {
      setAudioLevel(Math.floor(Math.random() * 8) + 2);
    }, 120);
    return () => clearInterval(interval);
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const rec = createSpeechRecognitionInstance();
    if (!rec) {
      alert('Speech recognition is not supported in this browser. You can type commands below!');
      return;
    }

    rec.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    rec.onresult = (event: any) => {
      const current = event.results[event.results.length - 1][0].transcript;
      setTranscript(current);
    };

    rec.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
      if (transcript.trim()) {
        handleProcessCommand(transcript);
      }
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const handleProcessCommand = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: text,
          currentDevices,
        }),
      });

      const data: VoiceCommandResult = await res.json();
      setLastResult(data);
      onExecuteActions(data.actions);

      // Play audio spoken feedback
      if (data.confirmation) {
        speakText(data.confirmation);
      }

      if (data.actions.length > 0) {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#22d3ee', '#38bdf8', '#34d399'],
        });
      }
    } catch (e) {
      console.error('Command execution failed:', e);
    } finally {
      setIsProcessing(false);
      setTypedInput('');
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 shadow-2xl space-y-6 font-mono relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              AI Voice Command Studio
            </h3>
            <p className="text-xs text-slate-400">
              Speak or type complex instructions to control lights, climate, locks, and scenes
            </p>
          </div>
        </div>

        <span className="text-[10px] text-cyan-300 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-bold">
          Gemini 1.5 Low-Latency Voice Engine
        </span>
      </div>

      {/* Central Microphone Visualizer & Trigger */}
      <div className="flex flex-col items-center justify-center py-4 space-y-4 relative z-10">
        <div className="relative">
          {isListening && (
            <div className="absolute -inset-4 rounded-full bg-cyan-500/20 animate-ping pointer-events-none" />
          )}

          <button
            type="button"
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl cursor-pointer relative z-10 ${
              isListening
                ? 'bg-rose-500 text-white shadow-rose-500/40 scale-110'
                : 'bg-gradient-to-tr from-cyan-400 via-teal-400 to-indigo-500 text-black shadow-cyan-500/30 hover:scale-105'
            }`}
            title={isListening ? 'Stop Listening' : 'Start Voice Recognition'}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 animate-pulse" />
            ) : (
              <Mic className="w-8 h-8 fill-black font-black" />
            )}
          </button>
        </div>

        {/* Audio Equalizer Bars */}
        <div className="flex items-center gap-1.5 h-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-150 ${
                isListening
                  ? 'bg-cyan-400'
                  : 'bg-slate-800'
              }`}
              style={{
                height: isListening
                  ? `${Math.max(4, Math.sin(i + audioLevel) * 20 + 8)}px`
                  : '4px',
              }}
            />
          ))}
        </div>

        <span className="text-xs font-bold text-slate-300">
          {isListening ? (
            <span className="text-cyan-400 animate-pulse flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Listening... Speak now
            </span>
          ) : isProcessing ? (
            <span className="text-amber-400 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Gemini parsing intent &amp; executing state updates...
            </span>
          ) : (
            'Click microphone to speak or click a sample voice prompt below'
          )}
        </span>
      </div>

      {/* Quick 1-Click Sample Voice Prompts */}
      <div className="space-y-2 relative z-10">
        <span className="text-[11px] text-slate-400 font-bold uppercase">
          Try 1-Click Voice Commands:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {SAMPLE_VOICE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleProcessCommand(prompt)}
              disabled={isProcessing}
              className="px-3.5 py-1.5 rounded-xl bg-[#161b22] border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all text-left cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>"{prompt}"</span>
            </button>
          ))}
        </div>
      </div>

      {/* Text Command Input Fallback */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleProcessCommand(typedInput);
        }}
        className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#161b22] border border-slate-800 relative z-10"
      >
        <Terminal className="w-4 h-4 text-slate-500 ml-2" />
        <input
          type="text"
          value={typedInput}
          onChange={(e) => setTypedInput(e.target.value)}
          placeholder="Or type any smart home command (e.g. Set living room light to warm amber 40%)..."
          className="flex-1 bg-transparent px-2 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
        />

        <button
          type="submit"
          disabled={!typedInput.trim() || isProcessing}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-black font-extrabold text-xs transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Execute</span>
        </button>
      </form>

      {/* Live Result Feedback Banner */}
      {lastResult && (
        <div className="p-4 rounded-2xl bg-[#09152b] border border-cyan-500/40 space-y-3 animate-in fade-in duration-200 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Spoken Confirmation:</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              {lastResult.actions.length} Device(s) Updated
            </span>
          </div>

          <p className="text-xs font-sans text-white leading-relaxed bg-[#0e1d38] p-3 rounded-xl border border-cyan-500/20">
            "{lastResult.confirmation}"
          </p>

          <div className="flex items-center gap-2 flex-wrap text-[10px]">
            {lastResult.actions.map((act, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold"
              >
                {act.deviceName} → {act.action} ({String(act.value)})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
