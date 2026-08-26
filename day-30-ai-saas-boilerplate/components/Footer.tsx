'use client';

import { Sparkles, Heart, CheckCircle2, ShieldCheck, Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#04060a] py-10 text-center font-mono text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 space-y-4">
        {/* Celebration Trophy Callout */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>30 DAYS 30 AI PROJECTS — 100% COMPLETE &amp; DEPLOYED!</span>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-300">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-bold font-mono">SaaSForge.AI</span>
          <span>•</span>
          <span>Full-Stack Multi-Tenant AI SaaS Boilerplate &amp; Starter Kit</span>
        </div>

        <p className="text-[11px] text-slate-500 max-w-2xl mx-auto leading-relaxed prose-text">
          Engineered with Next.js 16 (Turbopack), Google Gemini 1.5 Flash, Stripe Subscriptions, Upstash Redis credit rate limiting, Clerk multi-tenancy, and Supabase RLS.
        </p>

        <div className="pt-2 flex items-center justify-center gap-1 text-[11px] text-slate-400">
          <span>Created with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
          <span>by</span>
          <a
            href="https://github.com/abdulnabii"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors font-mono"
          >
            Abdul Nabi
          </a>
        </div>
      </div>
    </footer>
  );
}
