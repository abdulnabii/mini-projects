'use client';

import { useState } from 'react';
import { PatientVitals } from '@/types';
import { Bot, User, Send, Sparkles, Stethoscope, HelpCircle, MessageSquare } from 'lucide-react';

interface Props {
  vitals: PatientVitals;
  riskPercent: number;
}

const PRESET_INQUIRIES = [
  'What biological mechanisms link a BMI > 30 to insulin resistance?',
  'How fast can fasting glucose drop with a low-glycemic dietary protocol?',
  'Why is diastolic blood pressure correlated with metabolic syndrome?',
  'What lab tests should be ordered next to verify HbA1c status?',
];

export default function ClinicalChat({ vitals, riskPercent }: Props) {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([
    {
      sender: 'bot',
      text: `Hello, I am your Clinical Endocrinology AI Assistant. I have analyzed your patient vitals (Fasting Glucose: ${vitals.glucose} mg/dL, BMI: ${vitals.bmi}, Risk: ${riskPercent}%). Ask me any question regarding lifestyle mitigation or metabolic markers!`,
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (qText?: string) => {
    const question = qText || inputQuestion;
    if (!question.trim() || isLoading) return;

    const userMsg = { sender: 'user' as const, text: question };
    setMessages((prev) => [...prev, userMsg]);
    if (!qText) setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, vitals, riskPercent }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.answer }]);
    } catch (err) {
      console.error('Error asking doctor chat:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0b1724] border border-teal-500/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl font-mono text-xs text-slate-300 flex flex-col min-h-[480px]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">Clinical Endocrinology AI Consultant</h3>
            <p className="text-xs text-slate-400">Evidence-based metabolic guidance &amp; physiological Q&amp;A</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-[10px] font-bold">
          Gemini 1.5 Clinical
        </span>
      </div>

      {/* Suggested Inquiries */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-teal-400" />
          Suggested Clinical Inquiries
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_INQUIRIES.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-[#07101a] border border-slate-800 hover:border-teal-500/40 text-slate-300 hover:text-white transition-all text-[11px] disabled:opacity-50 text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[300px]">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                m.sender === 'user' ? 'bg-teal-500 text-black' : 'bg-slate-900 border border-slate-800 text-teal-400'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-teal-950/60 border border-teal-500/40 text-teal-100'
                  : 'bg-[#07101a] border border-slate-800 text-slate-200'
              }`}
            >
              <p className="font-sans text-xs whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
            <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
            <span>Consultant is synthesizing endocrinology evidence...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-3 border-t border-slate-800"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask a question about glucose, insulin, or clinical protocols..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#07101a] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 font-mono"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isLoading}
          className="p-2.5 rounded-xl bg-teal-400 text-black font-extrabold hover:bg-teal-300 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
