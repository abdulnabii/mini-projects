'use client';

import { useState } from 'react';
import { RoastResult } from '@/types';
import { Share2, Copy, Check, Award, Flame, ExternalLink, Code } from 'lucide-react';

interface Props {
  roast: RoastResult;
}

export default function ShareableBadgeCard({ roast }: Props) {
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const badgeHtml = `<a href="https://day-16-ai-portfolio-roaster.vercel.app" target="_blank">\n  <img src="https://img.shields.io/badge/Portfolio%20Roast%20Score-${roast.overallScore}%2F100-${roast.overallScore < 50 ? 'red' : roast.overallScore < 75 ? 'orange' : 'brightgreen'}?style=for-the-badge&logo=fire" alt="Portfolio Roast Score" />\n</a>`;
  const badgeMd = `[![Portfolio Roast Score](https://img.shields.io/badge/Portfolio%20Roast%20Score-${roast.overallScore}%2F100-${roast.overallScore < 50 ? 'red' : roast.overallScore < 75 ? 'orange' : 'brightgreen'}?style=for-the-badge&logo=fire)](https://day-16-ai-portfolio-roaster.vercel.app)`;

  const tweetText = encodeURIComponent(
    `🔥 My portfolio just got roasted by PortfolioRoaster.AI!\n\nScore: ${roast.overallScore}/100\nVerdict: "${roast.overallVerdict}"\n\nDare to get yours reviewed? 👇\nhttps://day-16-ai-portfolio-roaster.vercel.app`
  );

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1420] border border-slate-800 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">Shareable Social Roast Badge &amp; Shield</h3>
            <p className="text-xs text-slate-400">Embed your survivor badge on your README or share to X (Twitter)</p>
          </div>
        </div>

        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Share Roast on X / Twitter</span>
        </a>
      </div>

      {/* Visual Badge Preview */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase text-slate-500">Live Markdown Badge Preview:</span>
          <div className="pt-1">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold font-mono tracking-wider shadow-lg ${
                roast.overallScore >= 75
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                  : roast.overallScore >= 50
                  ? 'bg-orange-500/10 border-orange-500 text-orange-300'
                  : 'bg-rose-500/10 border-rose-500 text-rose-300'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>
                PORTFOLIO ROAST: {roast.overallScore}/100 • {roast.survivalBadge}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(badgeMd);
              setCopiedMd(true);
              setTimeout(() => setCopiedMd(false), 2000);
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all text-xs font-bold"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Copied Markdown' : 'Copy GitHub Markdown'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(badgeHtml);
              setCopiedBadge(true);
              setTimeout(() => setCopiedBadge(false), 2000);
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all text-xs font-bold"
          >
            {copiedBadge ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
            <span>{copiedBadge ? 'Copied HTML' : 'Copy HTML'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
