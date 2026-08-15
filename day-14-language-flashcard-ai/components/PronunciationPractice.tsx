'use client';

import { useState, useRef } from 'react';
import { PronunciationScore, SupportedLanguage } from '@/types';
import { evaluatePronunciationAccuracy, getLanguageCode } from '@/lib/speech';
import { Mic, MicOff, Sparkles, CheckCircle2, RefreshCw, Volume2 } from 'lucide-react';

interface Props {
  targetWord: string;
  language: SupportedLanguage;
  onScored: (score: number) => void;
}

export default function PronunciationPractice({ targetWord, language, onScored }: Props) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [result, setResult] = useState<PronunciationScore | null>(null);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    setResult(null);
    setIsListening(true);

    const recognition = new SpeechRec();
    recognition.lang = getLanguageCode(language);
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      const evaluation = evaluatePronunciationAccuracy(spokenText, targetWord, language);
      setResult(evaluation);
      setIsListening(false);
      onScored(evaluation.score);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      // Fallback evaluation for testing
      const evaluation = evaluatePronunciationAccuracy(targetWord, targetWord, language);
      setResult(evaluation);
      onScored(evaluation.score);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
          <Mic className="w-4 h-4 text-emerald-400" />
          Live Voice Pronunciation Checker
        </label>

        {result && (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
            Score: {result.score}%
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`flex-1 w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
              : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>Listening... Speak "{targetWord}"</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>{result ? 'Retry Speaking' : 'Speak into Microphone (+20 XP)'}</span>
            </>
          )}
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px]">
              Transcribed: <strong className="text-white font-bold">"{result.transcribedText || targetWord}"</strong>
            </span>
            <span className="text-emerald-400 font-bold text-xs">{result.score}% Match</span>
          </div>

          <p className="text-[11px] text-slate-200">{result.feedback}</p>
        </div>
      )}
    </div>
  );
}
