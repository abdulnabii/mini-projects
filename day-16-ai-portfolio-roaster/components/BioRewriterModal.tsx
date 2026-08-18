'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check, X, User, Zap, BookOpen } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  developerName: string;
  currentBio: string;
}

interface RewrittenOptions {
  highImpactOption: { tagline: string; bio: string; vibe: string };
  storytellerOption: { tagline: string; bio: string; vibe: string };
  minimalistOption: { tagline: string; bio: string; vibe: string };
  linkedInSummary: string;
}

export default function BioRewriterModal({ isOpen, onClose, developerName, currentBio }: Props) {
  const [data, setData] = useState<RewrittenOptions | null>(null);
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer');
  const [keySkills, setKeySkills] = useState('TypeScript, Next.js, PostgreSQL, Distributed Systems');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/fix-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: developerName,
          currentBio,
          targetRole,
          keySkills: keySkills.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error generating rewritten bio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono text-xs text-slate-300">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f1420] border-2 border-orange-500/40 p-6 sm:p-8 space-y-6 shadow-2xl shadow-orange-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">AI Bio &amp; Hero Headline Studio</h3>
              <p className="text-xs text-slate-400">Transform generic bios into high-converting recruiter hooks</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Target Role / Title</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Top Skills (comma separated)</label>
            <input
              type="text"
              value={keySkills}
              onChange={(e) => setKeySkills(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-black font-bold font-outfit text-xs hover:opacity-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synthesizing High-Impact Variations...' : 'Generate 3 Professional Bio Formats'}</span>
        </button>

        {/* Output Variations */}
        {data && (
          <div className="space-y-4 pt-2">
            {/* Option 1: High Impact */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  Format A: {data.highImpactOption.vibe}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `${data.highImpactOption.tagline}\n\n${data.highImpactOption.bio}`,
                      'optA'
                    )
                  }
                  className="text-[10px] font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1"
                >
                  {copiedKey === 'optA' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'optA' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <h5 className="font-bold text-white text-xs font-outfit">&quot;{data.highImpactOption.tagline}&quot;</h5>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{data.highImpactOption.bio}</p>
            </div>

            {/* Option 2: Minimalist */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  Format B: {data.minimalistOption.vibe}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `${data.minimalistOption.tagline}\n\n${data.minimalistOption.bio}`,
                      'optB'
                    )
                  }
                  className="text-[10px] font-bold text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                >
                  {copiedKey === 'optB' ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'optB' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <h5 className="font-bold text-white text-xs font-outfit">&quot;{data.minimalistOption.tagline}&quot;</h5>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{data.minimalistOption.bio}</p>
            </div>

            {/* LinkedIn Summary */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-400 uppercase flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  LinkedIn Search-Optimized Summary
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(data.linkedInSummary, 'optL')}
                  className="text-[10px] font-bold text-slate-400 hover:text-indigo-400 flex items-center gap-1"
                >
                  {copiedKey === 'optL' ? <Check className="w-3 h-3 text-indigo-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'optL' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{data.linkedInSummary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
