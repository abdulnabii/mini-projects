'use client';

import { useState } from 'react';
import { Organization } from '@/types';
import {
  Sparkles,
  Building2,
  Zap,
  CreditCard,
  BarChart3,
  Sliders,
  Terminal,
  ChevronDown,
  Layers,
  Shield,
  Activity,
  Code2,
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  activeOrg: Organization;
  onOpenOrgModal: () => void;
  activeView: 'landing' | 'playground' | 'billing' | 'admin' | 'flags';
  onChangeView: (view: 'landing' | 'playground' | 'billing' | 'admin' | 'flags') => void;
  onOpenDevModal: () => void;
}

export default function Navbar({
  activeOrg,
  onOpenOrgModal,
  activeView,
  onChangeView,
  onOpenDevModal,
}: Props) {
  const getPlanBadgeStyle = () => {
    switch (activeOrg.plan) {
      case 'enterprise':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'pro':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-white/[0.08]';
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#06090e]/95 backdrop-blur-xl font-mono text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand Lockup & Org Switcher */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChangeView('landing')}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-emerald-500 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white font-mono">
                SaaSForge<span className="text-emerald-400">.AI</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-white/[0.06] border border-white/[0.1] text-[9px] text-slate-300 font-bold">
                FINALE 30/30
              </span>
            </div>
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Org Selector Pill */}
          <button
            type="button"
            onClick={onOpenOrgModal}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0d121d] border border-white/[0.08] hover:border-white/[0.2] transition-colors cursor-pointer text-slate-200"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-bold text-xs max-w-[130px] truncate">{activeOrg.name}</span>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase ${getPlanBadgeStyle()}`}>
              {activeOrg.plan}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
        </div>

        {/* View Switcher Tabs (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 p-0.5 rounded-lg bg-[#090d16] border border-white/[0.08]">
          <button
            type="button"
            onClick={() => onChangeView('landing')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium text-xs ${
              activeView === 'landing'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview &amp; Pricing
          </button>

          <button
            type="button"
            onClick={() => onChangeView('playground')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium text-xs flex items-center gap-1.5 ${
              activeView === 'playground'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>AI Studio</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeView('billing')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium text-xs flex items-center gap-1.5 ${
              activeView === 'billing'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3 h-3" />
            <span>Stripe Billing</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeView('admin')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium text-xs flex items-center gap-1.5 ${
              activeView === 'admin'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            <span>Executive Admin</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeView('flags')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer font-medium text-xs flex items-center gap-1.5 ${
              activeView === 'flags'
                ? 'bg-emerald-500 text-black font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Feature Flags</span>
          </button>
        </div>

        {/* Right Status Controls: Live Credit Counter & Setup Modal */}
        <div className="flex items-center gap-2">
          {/* Live Credit Meter Badge */}
          <div
            onClick={() => onChangeView('playground')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0d121d] border border-white/[0.08] text-xs text-slate-300 cursor-pointer hover:border-emerald-500/40 transition-colors"
            title="Remaining Monthly AI Credits"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span className="font-bold text-white font-mono">{activeOrg.creditsRemaining}</span>
            <span className="text-slate-500">/ {activeOrg.creditsTotal}</span>
          </div>

          <button
            type="button"
            onClick={onOpenDevModal}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-400 transition-all flex items-center gap-1 text-xs font-bold cursor-pointer font-mono"
            title="Export full-stack CLI setup.sh script & Drizzle schema"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">setup.sh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
