'use client';

import { useState } from 'react';
import { Sparkles, Code, Copy, Check, HelpCircle, Trophy, Globe } from 'lucide-react';

interface Props {
  title: string;
  targetKeyword: string;
  content: string;
}

interface FAQData {
  featuredSnippet: { question: string; answer: string };
  faqList: { question: string; answer: string }[];
}

export default function FAQSchemaGenerator({ title, targetKeyword, content }: Props) {
  const [data, setData] = useState<FAQData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/faq-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, targetKeyword, content }),
      });
      const json: FAQData = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error generating FAQ schema:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getJsonLd = () => {
    if (!data) return '';
    const schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faqList.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
    return JSON.stringify(schemaObj, null, 2);
  };

  const handleCopyJsonLd = () => {
    navigator.clipboard.writeText(getJsonLd());
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleCopySnippet = () => {
    if (!data) return;
    const txt = `## ${data.featuredSnippet.question}\n\n${data.featuredSnippet.answer}`;
    navigator.clipboard.writeText(txt);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              Google Position 0 (Featured Snippet) &amp; FAQ Schema Studio
            </h3>
            <p className="text-xs text-slate-400">
              Generate structured JSON-LD markup and targeted Q&amp;A blocks for zero-click search dominance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 text-black font-bold text-xs hover:opacity-95 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synthesizing FAQ Schema...' : data ? 'Regenerate Schema' : 'Generate Schema & FAQs'}</span>
        </button>
      </div>

      {!data && !isLoading && (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-amber-400/60 mx-auto" />
          <p className="text-slate-300 font-bold text-sm font-outfit">
            Target Google Rich Results with Valid Structured Data
          </p>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Click &quot;Generate Schema &amp; FAQs&quot; to synthesize 4 high-intent search questions and copy-ready JSON-LD markup.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
          <p className="font-bold text-white font-outfit">Analyzing search intent &amp; generating FAQ structured data...</p>
        </div>
      )}

      {data && !isLoading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Position 0 Featured Snippet Card */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                Target Featured Snippet (Google Position 0)
              </span>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="text-slate-400 hover:text-amber-300 flex items-center gap-1 text-[10px] font-bold"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm font-outfit">{data.featuredSnippet.question}</h4>
              <p className="text-xs text-amber-100 font-sans leading-relaxed">{data.featuredSnippet.answer}</p>
            </div>
          </div>

          {/* 4 People Also Ask FAQ Blocks */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              People Also Ask (PAA) Question Blocks ({data.faqList.length})
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.faqList.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase">Q#{idx + 1}</span>
                  <h5 className="font-bold text-white text-xs font-outfit">{faq.question}</h5>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* JSON-LD Code Block */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                Schema.org/FAQPage JSON-LD Script
              </span>
              <button
                type="button"
                onClick={handleCopyJsonLd}
                className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 text-[10px] font-bold"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'Copied JSON-LD' : 'Copy JSON-LD'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-black border border-slate-800 text-[10px] text-emerald-300 font-mono overflow-x-auto max-h-48 leading-relaxed">
              {getJsonLd()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
