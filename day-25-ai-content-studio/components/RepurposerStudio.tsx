'use client';

import { useState } from 'react';
import { TwitterThread, LinkedInPost, LinkedInCarousel, VoiceProfile } from '@/types';
import {
  Repeat,
  Sparkles,
  Loader2,
  FileText,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { TwitterIcon, LinkedInIcon } from './PlatformIcons';
import confetti from 'canvas-confetti';

interface Props {
  voiceProfile: VoiceProfile | null;
  onRepurposedComplete: (
    thread: TwitterThread,
    post: LinkedInPost,
    carousel: LinkedInCarousel
  ) => void;
}

export default function RepurposerStudio({
  voiceProfile,
  onRepurposedComplete,
}: Props) {
  const [rawText, setRawText] = useState(
    `Today we migrated our PostgreSQL database to SQLite edge replicas using Turso.

Why we did it:
1. Our AWS RDS bill was $420/month for a simple micro-SaaS.
2. Latency from Europe to US-East RDS was 180ms on every query.

How we migrated:
- Dumped existing schema and data.
- Rewrote Drizzle ORM config for libSQL.
- Placed replicas in London, Frankfurt, Tokyo, and Virginia.

Results:
- Global read latency dropped from 180ms to 12ms.
- Monthly database bill dropped from $420 to $29.
- Zero downtime during cutover.`
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleRepurpose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawContent: rawText, voiceProfile }),
      });

      const data = await res.json();
      if (res.ok && data.thread && data.post && data.carousel) {
        onRepurposedComplete(data.thread, data.post, data.carousel);
        confetti({
          particleCount: 40,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#8b5cf6'],
        });
      }
    } catch (e) {
      console.error('Repurpose failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 shadow-2xl space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              1-Click Multi-Platform Content Repurposer
            </h3>
            <p className="text-xs text-slate-400">
              Paste long-form notes, blog drafts, or changelogs → Transform into Threads, LinkedIn posts &amp; Carousels
            </p>
          </div>
        </div>

        <span className="text-[10px] text-cyan-300 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Generates 3 Platforms Simultaneously</span>
        </span>
      </div>

      {/* Input Area */}
      <form onSubmit={handleRepurpose} className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Paste Raw Long-Form Text, Notes, or Article:</span>
            </label>
            <span className="text-[10px] text-slate-500">{rawText.length} characters</span>
          </div>

          <textarea
            rows={8}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste your raw notes, README, or blog draft here..."
            className="w-full p-4 rounded-2xl bg-[#161b22] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 font-sans leading-relaxed"
          />
        </div>

        {/* 3 Output Format Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 flex items-center gap-2.5">
            <TwitterIcon className="w-4 h-4 fill-cyan-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-xs">10-Tweet X Thread</div>
              <span className="text-[10px] text-slate-500">Hook + Lessons + CTA</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 flex items-center gap-2.5">
            <LinkedInIcon className="w-4 h-4 fill-blue-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-xs">Authority LinkedIn Post</div>
              <span className="text-[10px] text-slate-500">Fold-proof See-More Hook</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <div className="font-bold text-white text-xs">6-Slide Visual Carousel</div>
              <span className="text-[10px] text-slate-500">Slide Deck Outline</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-800">
          <button
            type="submit"
            disabled={isLoading || !rawText.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 text-black font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-40 cursor-pointer flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Repurpose Into All 3 Formats</span>
          </button>
        </div>
      </form>
    </div>
  );
}
