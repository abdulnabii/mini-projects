'use client';

import { useState } from 'react';
import { Hint, InterviewMessage } from '@/types';
import { Bot, User, Send, Lightbulb, Sparkles, AlertCircle } from 'lucide-react';

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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="bg-[#0d1117] border border-emerald-500/20 rounded-3xl p-6 sm:p-7 flex flex-col justify-between h-full font-mono text-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-purple-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm font-outfit">Alex (AI Staff Engineer)</h3>
            <p className="text-[10px] text-emerald-400">Technical Interviewer Active</p>
          </div>
        </div>

        {/* Progressive Hint Button */}
        <button
          onClick={onRequestHint}
          disabled={isHintLoading || hintsGiven.length >= 3}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all font-bold text-[11px] disabled:opacity-50"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>{hintsGiven.length >= 3 ? 'Max Hints Used' : `Get Hint (Tier ${hintsGiven.length + 1})`}</span>
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[360px] min-h-[260px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'candidate' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'candidate'
                  ? 'bg-purple-600 text-white'
                  : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
              }`}
            >
              {m.sender === 'candidate' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === 'candidate'
                  ? 'bg-purple-950/60 border border-purple-500/30 text-purple-100'
                  : 'bg-slate-950 border border-slate-800 text-slate-200'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
              <span className="text-[9px] text-slate-500 mt-1 block text-right font-mono">{m.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>Alex is analyzing your approach...</span>
          </div>
        )}
      </div>

      {/* Hints Accordion (if given) */}
      {hintsGiven.length > 0 && (
        <div className="space-y-2 border-t border-slate-800 pt-3">
          <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            Progressive Hints Unlocked ({hintsGiven.length}/3)
          </label>
          <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
            {hintsGiven.map((h, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-200">
                <div className="font-bold flex items-center justify-between">
                  <span>{h.title}</span>
                  <span className="text-[9px] text-amber-400">-{h.penaltyPoints} pts</span>
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5 whitespace-pre-wrap">{h.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Talk through your approach or ask Alex a question..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
