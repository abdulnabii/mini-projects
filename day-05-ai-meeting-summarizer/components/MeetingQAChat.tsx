'use client';

import { useState } from 'react';
import { MeetingIntelligence } from '@/types';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';

interface Props {
  transcript: string;
  intelligence: MeetingIntelligence;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function MeetingQAChat({ transcript, intelligence }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `I've analyzed the transcript and extracted ${intelligence.actionItems.length} action items and ${intelligence.decisions.length} decisions. Ask me anything about this meeting!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const QUICK_QUESTIONS = [
    'What were the key blockers mentioned?',
    'Who is responsible for the top priority task?',
    'Summarize the core decisions made',
  ];

  const handleSend = async (questionText: string) => {
    const q = questionText.trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = { id: `u_${Date.now()}`, role: 'user', content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, intelligence, question: q }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'I could not find specific context for this question in the transcript.',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: 'Failed to process question. Please check connection.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-950 border border-purple-500/30 space-y-4 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-white text-sm font-outfit">AI Meeting Assistant Q&amp;A</h3>
        </div>
        <span className="text-purple-400 font-bold text-[10px]">Gemini 1.5 Flash</span>
      </div>

      {/* Quick Question Chips */}
      <div className="flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800 text-[10px] text-slate-300 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-2xl flex items-start gap-2.5 ${
              m.role === 'user'
                ? 'bg-purple-500/15 border border-purple-500/30 text-purple-100 ml-8'
                : 'bg-slate-900 border border-slate-800 text-slate-200 mr-8'
            }`}
          >
            {m.role === 'user' ? (
              <User className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed text-xs">{m.content}</p>
          </div>
        ))}

        {isLoading && (
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2 mr-8">
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            <span>Consulting meeting transcript context...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
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
          placeholder="Ask any question about decisions, deadlines, or speaker points..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all disabled:opacity-40 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
}
