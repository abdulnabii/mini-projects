'use client';

import { useState } from 'react';
import { ChatMessage } from '@/types';
import { MessageSquare, Send, Sparkles, Loader2, Bot, User, HelpCircle } from 'lucide-react';

interface Props {
  docText: string;
  docTitle: string;
}

const SUGGESTED_PROMPTS = [
  'Can the company terminate me without advance notice?',
  'Who owns code or side projects I build on weekends?',
  'What are the non-compete duration and geographic limits?',
  'Is there a cap on my personal financial liability?',
  'Are there any penalties for early contract cancellation?',
];

export default function DocumentChat({ docText, docTitle }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_msg',
      role: 'assistant',
      content: `Hello! I am your ClauseWise AI legal assistant. I have reviewed "${docTitle}". Ask me any questions about obligations, IP rights, termination terms, or liability limits in this document.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend.trim(),
          docText,
          chatHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        role: 'assistant',
        content: data.answer || 'I could not generate an answer based on this document context.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error('Chat error:', e);
      const errorMsg: ChatMessage = {
        id: 'ai_err_' + Date.now(),
        role: 'assistant',
        content: 'Unable to communicate with the document analysis service. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/20 space-y-6 font-mono shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-white text-base font-outfit">Ask Document Q&amp;A Assistant</h3>
        </div>
        <span className="text-[10px] text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
          Gemini 1.5 Grounded
        </span>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          Suggested Questions:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {SUGGESTED_PROMPTS.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="px-3 py-1 rounded-xl bg-[#161b22] border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all text-left cursor-pointer disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl max-w-xl space-y-1 font-sans text-xs leading-relaxed ${
                  isUser
                    ? 'bg-cyan-500/10 border border-cyan-500/30 text-white'
                    : 'bg-[#161b22] border border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] text-slate-400">
                  <span className="font-bold text-slate-300">{isUser ? 'You' : 'ClauseWise AI'}</span>
                  <span>{m.timestamp}</span>
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed">{m.content}</p>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Analyzing contract clauses...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#161b22] border border-slate-800"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this document (e.g. Can I work with other clients?)..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-black transition-all disabled:opacity-40 cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
