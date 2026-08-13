'use client';

import { useState } from 'react';
import { Bot, User, Send, Sparkles, HelpCircle, MessageSquare } from 'lucide-react';

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
      text: 'Hello! I am your AI Certified Financial Planner. I have full visibility into your monthly income, expenses, FIRE target, and debt payoff schedule. How can I help optimize your financial growth today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');

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
    <div className="bg-[#0d1117] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl font-mono text-xs text-slate-300 flex flex-col min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-500 to-indigo-600 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">AI Financial Advisor Q&amp;A</h3>
            <p className="text-xs text-emerald-400">Contextual Portfolio Intelligence Active</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
          Gemini 1.5 CFP
        </span>
      </div>

      {/* Quick Question Chips */}
      <div className="space-y-2 shrink-0">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-amber-400" />
          Suggested Advisory Prompts
        </label>
        <div className="flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((qq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(qq)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white transition-all text-[11px] disabled:opacity-50 text-left"
            >
              {qq}
            </button>
          ))}
        </div>
      </div>

      {/* Messages thread */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[360px] min-h-[220px]">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                m.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-purple-950/60 border border-purple-500/30 text-purple-100'
                  : 'bg-slate-950 border border-slate-800 text-slate-200'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
              <span className="text-[9px] text-slate-500 mt-1 block text-right font-mono">{m.time}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>AI Certified Financial Planner is calculating recommendations...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-3 border-t border-slate-800 shrink-0"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask a question about your portfolio, debt, or index funds..."
          className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isLoading}
          className="p-3 rounded-xl bg-amber-400 text-black font-extrabold hover:bg-amber-300 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
