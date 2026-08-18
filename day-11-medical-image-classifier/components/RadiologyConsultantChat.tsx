'use client';

import { useState } from 'react';
import { ClassificationResult } from '@/types';
import { Bot, Send, User, Sparkles, Loader2, BookOpen, Stethoscope } from 'lucide-react';

interface Props {
  result: ClassificationResult;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function RadiologyConsultantChat({ result }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      content: `Hello! I am your AI Radiology Consultant. I can explain the neural network activation patterns for this ${
        result.modelType === 'xray' ? 'Chest X-Ray' : 'Dermatology Lesion'
      }, break down the ${result.predictedClass} classification, or explain the anatomical relevance of the GradCAM heatmap.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const QUICK_QUESTIONS = [
    result.modelType === 'xray'
      ? 'Why did the AI focus on the lower lung field?'
      : 'What asymmetry features did the model detect in the lesion?',
    'What are the key radiological hallmarks of consolidation vs effusion?',
    'What follow-up clinical tests are recommended for this finding?',
  ];

  const handleSend = async (qText: string) => {
    const q = qText.trim();
    if (!q || loading) return;

    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask-radiology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          predictedClass: result.predictedClass,
          confidence: result.confidence,
          modelType: result.modelType,
          anatomicalRegion: result.educationalAnnotation?.anatomicalRegion,
        }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'Evaluating radiological parameters against clinical literature.',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: 'Unable to communicate with clinical assistant. Please check connection.',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#090d16] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-4 font-mono text-xs text-slate-300 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-white text-sm font-outfit">AI Clinical Teaching Consultant Q&amp;A</h3>
        </div>
        <span className="text-cyan-400 font-bold text-[10px]">Gemini 1.5 Flash</span>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 text-[10px] text-slate-300 transition-colors text-left"
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
                ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-100 ml-8'
                : 'bg-slate-950 border border-slate-800 text-slate-200 mr-8'
            }`}
          >
            {m.role === 'user' ? (
              <User className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed text-xs font-sans">{m.content}</p>
          </div>
        ))}

        {loading && (
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 flex items-center gap-2 mr-8">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Consulting radiology diagnostic guidelines...</span>
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
          placeholder="Ask a question about the GradCAM heatmap, pathology hallmarks, or differential diagnosis..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold transition-all disabled:opacity-40 flex items-center gap-1.5 font-outfit uppercase"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
}
