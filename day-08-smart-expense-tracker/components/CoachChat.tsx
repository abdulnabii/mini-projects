'use client';

import { useState } from 'react';
import { Transaction } from '@/types';
import { Bot, Send, User, Sparkles, Loader2 } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  budgets: Record<string, number>;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function CoachChat({ transactions, budgets }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi there! I am your AI Financial Advisor. Ask me anything about your spending habits, recurring subscriptions, or how to reach your savings goals faster.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const QUICK_QUESTIONS = [
    'Where did I spend the most this month?',
    'How can I save $250 more next month?',
    'Audit my recurring digital subscriptions',
  ];

  const handleSend = async (qText: string) => {
    const q = qText.trim();
    if (!q || loading) return;

    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, transactions, budgets }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'I am evaluating your recent spending records.',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: 'Failed to communicate with financial coach. Please try again.',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b1616] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-4 font-mono text-xs shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-white text-sm font-outfit">Interactive Financial Advisor Q&amp;A</h3>
        </div>
        <span className="text-emerald-400 font-bold text-[10px]">Gemini 1.5 Flash</span>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 text-[10px] text-slate-300 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3.5 rounded-2xl flex items-start gap-2.5 ${
              m.role === 'user'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-100 ml-8'
                : 'bg-slate-900 border border-slate-800 text-slate-200 mr-8'
            }`}
          >
            {m.role === 'user' ? (
              <User className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed text-xs">{m.content}</p>
          </div>
        ))}

        {loading && (
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2 mr-8">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Consulting financial ledger and budget rules...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2 pt-2 border-t border-slate-800"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your spending, budget rules, or savings rate..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all disabled:opacity-40 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
}
