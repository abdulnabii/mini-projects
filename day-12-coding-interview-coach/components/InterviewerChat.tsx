'use client';

import { useState, useEffect, useRef } from 'react';
import { Hint, InterviewMessage } from '@/types';
import { Bot, Send, User, Sparkles, Lightbulb, Mic, MicOff, Volume2, Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  messages: InterviewMessage[];
  hintsGiven: Hint[];
  onSendMessage: (text: string) => void;
  onRequestHint: () => void;
  isLoading: boolean;
  isHintLoading: boolean;
}

export default function InterviewerChat({
  messages,
  hintsGiven,
  onSendMessage,
  onRequestHint,
  isLoading,
  isHintLoading,
}: Props) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check Web Speech Recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setInputText((prev) => (prev ? `${prev} ${currentTranscript}` : currentTranscript));
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Recognition start failed:', err);
      }
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, hintsGiven]);

  return (
    <div className="bg-[#0d1117] border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[600px] h-full font-mono text-xs text-slate-300">
      {/* Interviewer Header */}
      <div className="bg-[#080c14] border-b border-slate-800/80 px-5 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-black text-xs font-outfit">
            AL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-outfit text-sm">Alex (Staff Engineer)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-slate-500">Live FAANG Technical Interviewer</span>
          </div>
        </div>

        {/* 3-Tier Hint Request Button */}
        <button
          type="button"
          onClick={onRequestHint}
          disabled={isHintLoading || hintsGiven.length >= 3}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all disabled:opacity-40"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {isHintLoading ? 'Consulting...' : `Hint (${hintsGiven.length}/3)`}
          </span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[500px]">
        {messages.map((m) => {
          const isUser = m.sender === 'candidate';
          return (
            <div
              key={m.id}
              className={`p-3.5 rounded-2xl flex items-start gap-2.5 max-w-[88%] leading-relaxed ${
                isUser
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-100 ml-auto'
                  : 'bg-[#080c14] border border-slate-800 text-slate-200 mr-auto'
              }`}
            >
              {isUser ? (
                <User className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Bot className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="text-xs font-sans whitespace-pre-wrap">{m.text}</p>
                <span className="text-[9px] text-slate-500 block">{m.timestamp}</span>
              </div>
            </div>
          );
        })}

        {/* Hints Rendered In-Line */}
        {hintsGiven.map((h, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-100 text-xs space-y-1 my-2"
          >
            <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px] uppercase">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hint Tier {h.tier} ({h.penaltyPoints}pt penalty): {h.title}</span>
            </div>
            <p className="font-sans leading-relaxed text-slate-200">{h.content}</p>
          </div>
        ))}

        {isLoading && (
          <div className="p-3.5 rounded-2xl bg-[#080c14] border border-slate-800 text-slate-400 flex items-center gap-2 max-w-xs mr-auto">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Alex is evaluating your approach...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Recording Pulse Banner */}
      {isRecording && (
        <div className="bg-rose-500/10 border-t border-rose-500/30 px-4 py-2 flex items-center justify-between text-xs text-rose-300 animate-pulse shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold">Listening ("Thinking Out Loud")...</span>
          </div>
          <button
            type="button"
            onClick={toggleRecording}
            className="text-[10px] text-rose-400 underline font-bold"
          >
            Stop Mic
          </button>
        </div>
      )}

      {/* Chat Input & Mic Trigger */}
      <form
        onSubmit={handleSend}
        className="bg-[#080c14] border-t border-slate-800/80 p-3.5 flex items-center gap-2 shrink-0"
      >
        {speechSupported && (
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-xl border transition-all ${
              isRecording
                ? 'bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40'
            }`}
            title="Think Out Loud with Voice Dictation"
          >
            {isRecording ? <MicOff className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
          </button>
        )}

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Explain your approach, ask clarifying questions, or discuss trade-offs..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all disabled:opacity-40 flex items-center gap-1.5 font-outfit uppercase shadow-md shadow-emerald-500/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
