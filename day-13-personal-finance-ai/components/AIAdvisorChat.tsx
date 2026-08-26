'use client';

import { useState } from 'react';
import { Bot, User, Send, Sparkles, HelpCircle, Mic, MicOff, Copy, Check } from 'lucide-react';

interface Props {
  onAskQuestion: (q: string) => Promise<string>;
  isLoading: boolean;
}

const QUICK_QUESTIONS = [
  'Should I prioritize paying off my 22.9% credit card or maxing my 401(k)?',
  'How much do I need in my liquid high-yield emergency fund?',
  'What is the quickest way to pull in my FIRE target date by 3 years?',
  'How should I reallocate my monthly dining budget into index funds?',
];

export default function AIAdvisorChat({ onAskQuestion, isLoading }: Props) {
  const [messages, setMessages] = useState<{ sender: 'user' | 'advisor'; text: string; time: string }[]>([
    {
      sender: 'advisor',
      text: 'Hello! I am your AI Certified Financial Planner. I have full visibility into your monthly income, expenses, FIRE target, and debt payoff schedule. How can I help optimize your financial independence today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Web Speech Voice Dictation
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice dictation is not supported in this browser.');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInputQuestion(transcript);
        handleSend(transcript);
      }
    };

    recognition.start();
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSend = async (qText?: string) => {
    const question = qText || inputQuestion;
    if (!question.trim() || isLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text: question,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!qText) setInputQuestion('');

    const answer = await onAskQuestion(question);

    const advisorMsg = {
      sender: 'advisor' as const,
      text: answer,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, advisorMsg]);
  };

  return (
    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl font-mono text-xs text-slate-300 flex flex-col min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm font-mono">AI Certified Financial Planner (CFP) Q&amp;A</h3>
            <p className="text-xs text-slate-400 prose-text">Grounds recommendations directly against your real portfolio numbers</p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold font-mono">
          GEMINI 1.5 CFP
        </span>
      </div>

      {/* Quick Question Chips */}
      <div className="space-y-1.5 shrink-0">
        <label className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-emerald-400" />
          <span>Recommended Financial Prompts:</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_QUESTIONS.map((qq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(qq)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-[#161b22] border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all text-[11px] disabled:opacity-50 text-left font-mono cursor-pointer"
            >
              {qq}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[360px] min-h-[220px]">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                m.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-3.5 rounded-xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-purple-950/40 border border-purple-500/30 text-purple-100'
                  : 'bg-[#161b22] border border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-4 border-b border-slate-800/60 pb-1 mb-1.5 text-[9px] text-slate-500 font-mono">
                <span>{m.sender === 'user' ? 'You' : 'AI Financial Planner'}</span>
                {m.sender === 'advisor' && (
                  <button
                    type="button"
                    onClick={() => handleCopy(m.text, idx)}
                    className="hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              <p className="whitespace-pre-wrap text-xs prose-text">{m.text}</p>
              <span className="text-[9px] text-slate-500 mt-1 block text-right font-mono">{m.time}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>AI Certified Financial Planner is computing recommendations...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2 border-t border-slate-800 shrink-0 font-mono"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask a question about debt payoff, FIRE target, or investment allocation..."
          className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
        />

        <button
          type="button"
          onClick={handleVoiceInput}
          className={`p-2.5 rounded-lg border text-slate-300 hover:text-white transition-all cursor-pointer ${
            isListening ? 'bg-rose-500 text-white animate-pulse border-rose-400' : 'bg-[#161b22] border-slate-800'
          }`}
          title="Voice dictation input"
        >
          {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

        <button
          type="submit"
          disabled={!inputQuestion.trim() || isLoading}
          className="px-4 py-2.5 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all disabled:opacity-50 cursor-pointer font-mono text-xs flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
}
