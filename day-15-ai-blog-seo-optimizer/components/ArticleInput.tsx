'use client';

import { useState } from 'react';
import { SampleArticle } from '@/types';
import { SAMPLE_ARTICLES } from '@/lib/sampleArticles';
import { Search, Sparkles, FileText, Globe, Layers, ArrowRight, Loader2 } from 'lucide-react';

interface Props {
  onRunAudit: (
    title: string,
    targetKeyword: string,
    metaDescription: string,
    content: string,
    secondaryKeywords: string[]
  ) => void;
  isLoading: boolean;
}

export default function ArticleInput({ onRunAudit, isLoading }: Props) {
  const [title, setTitle] = useState<string>(SAMPLE_ARTICLES[0].title);
  const [targetKeyword, setTargetKeyword] = useState<string>(SAMPLE_ARTICLES[0].targetKeyword);
  const [secondaryKeywords, setSecondaryKeywords] = useState<string>(
    SAMPLE_ARTICLES[0].secondaryKeywords.join(', ')
  );
  const [metaDescription, setMetaDescription] = useState<string>(SAMPLE_ARTICLES[0].metaDescription);
  const [content, setContent] = useState<string>(SAMPLE_ARTICLES[0].content);

  const handleSelectSample = (sample: SampleArticle) => {
    setTitle(sample.title);
    setTargetKeyword(sample.targetKeyword);
    setSecondaryKeywords(sample.secondaryKeywords.join(', '));
    setMetaDescription(sample.metaDescription);
    setContent(sample.content);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !targetKeyword.trim()) {
      alert('Please provide article content and a target focus keyword.');
      return;
    }

    const secondary = secondaryKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    onRunAudit(title, targetKeyword, metaDescription, content, secondary);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs text-slate-300">
      {/* Sample Benchmark Selector Chips */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          Load Benchmark Sample Blog Posts for Instant Audit
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_ARTICLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group flex flex-col justify-between gap-2"
            >
              <div>
                <span className="text-[9px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  {sample.targetKeyword}
                </span>
                <h4 className="font-bold text-white text-xs font-outfit mt-1 group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {sample.title}
                </h4>
              </div>
              <p className="text-[10px] text-slate-500 line-clamp-1">{sample.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Target Keyword & Title Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-300">
            Target Focus Keyword <span className="text-emerald-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="e.g. machine learning in healthcare"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-300">Secondary LSI Keywords (Comma separated)</label>
          <input
            type="text"
            value={secondaryKeywords}
            onChange={(e) => setSecondaryKeywords(e.target.value)}
            placeholder="e.g. medical imaging AI, diagnostic accuracy"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Blog Post Title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-bold text-slate-300">
            Blog Post Title Tag (H1) <span className="text-emerald-400">*</span>
          </label>
          <span className={`text-[10px] font-bold ${title.length > 60 ? 'text-amber-400' : 'text-slate-500'}`}>
            {title.length}/60 chars (SERP Limit)
          </span>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Machine Learning in Healthcare: 2026 Clinical Diagnostics Guide"
          required
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-outfit font-bold"
        />
      </div>

      {/* Meta Description */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-bold text-slate-300">
            Meta Description (Google SERP Snippet)
          </label>
          <span
            className={`text-[10px] font-bold ${
              metaDescription.length < 120 || metaDescription.length > 160 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {metaDescription.length}/160 chars (120–160 optimal)
          </span>
        </div>
        <textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          rows={2}
          placeholder="Brief summary shown in Google search results..."
          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Main Content Body */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-bold text-slate-300">
            Article Content (Markdown or Raw Text) <span className="text-emerald-400">*</span>
          </label>
          <span className="text-[10px] text-slate-500">
            {content.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          placeholder="Paste full blog post markdown or article paragraphs here..."
          required
          className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed placeholder-slate-600 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-amber-500 text-black font-extrabold text-xs font-outfit uppercase tracking-wider hover:opacity-95 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-black" />
            <span>Running 8-Point Technical SEO Audit &amp; Flesch-Kincaid Engine...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-black" />
            <span>Run 8-Point SEO Health Check &amp; SERP Intelligence</span>
          </>
        )}
      </button>
    </form>
  );
}
