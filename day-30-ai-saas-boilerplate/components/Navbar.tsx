'use client';

import { useState, useEffect } from 'react';
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
  Menu,
  X,
  Code2,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  activeOrg: Organization;
  onOpenOrgModal: () => void;
  activeView: 'landing' | 'playground' | 'billing' | 'admin' | 'flags';
  onChangeView: (view: 'landing' | 'playground' | 'billing' | 'admin' | 'flags') => void;
  onOpenDevModal: () => void;
  lastDeduction?: { amount: number; id: number } | null;
}

export default function Navbar({
  activeOrg,
  onOpenOrgModal,
  activeView,
  onChangeView,
  onOpenDevModal,
  lastDeduction,
}: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (!lastDeduction) return;
    setIsFlashing(true);
    const timer = setTimeout(() => setIsFlashing(false), 1400);
    return () => clearTimeout(timer);
  }, [lastDeduction]);

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

  // Strictly bound and calculate scoped percentage
  const scopedTotal = Math.max(1, activeOrg.creditsTotal);
  const scopedRemaining = Math.min(scopedTotal, Math.max(0, activeOrg.creditsRemaining));
  const usagePercentage = Math.min(100, Math.max(0, Math.round((scopedRemaining / scopedTotal) * 100)));

  const isZeroCredits = scopedRemaining <= 0;
  const isLowCredits = usagePercentage <= 10 && scopedRemaining > 0;

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#06090e]/95 backdrop-blur-xl font-mono text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-2.5">
        {/* Brand Lockup & Org Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              onChangeView('landing');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-emerald-500 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white font-mono">
                SaaSForge<span className="text-emerald-400">.AI</span>
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.2 rounded bg-white/[0.06] border border-white/[0.1] text-[9px] text-slate-300 font-bold">
                FINALE 30/30
              </span>
            </div>
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Org Selector Pill */}
          <button
            type="button"
            onClick={onOpenOrgModal}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-lg bg-[#0d121d] border border-white/[0.08] hover:border-white/[0.2] transition-colors cursor-pointer text-slate-200"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-bold text-xs max-w-[85px] sm:max-w-[120px] truncate">{activeOrg.name}</span>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase ${getPlanBadgeStyle()}`}>
              {activeOrg.plan}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
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

        {/* Right Status Controls: Live Scoped Credit Counter & Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Animated Credit Meter Badge with Scoped Capping & Ephemeral Toast */}
          <div className="relative">
            <div
              onClick={() => onChangeView('playground')}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-all ${
                isFlashing
                  ? 'bg-amber-500/30 border-amber-400 scale-105 shadow-lg shadow-amber-500/30'
                  : isZeroCredits
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  : isLowCredits
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-[#0d121d] border-white/[0.08] text-slate-300 hover:border-emerald-500/40'
              }`}
              title="Remaining Monthly AI Credits"
            >
              {isZeroCredits ? (
                <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              ) : isLowCredits ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : (
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
              )}
              <span
                className={`font-bold font-mono ${
                  isZeroCredits ? 'text-rose-400' : isLowCredits ? 'text-amber-400' : 'text-white'
                }`}
              >
                {scopedRemaining}
              </span>
              <span className="text-slate-500 hidden sm:inline">/ {scopedTotal}</span>
            </div>

            {/* Ephemeral deduction toast overlay */}
            {isFlashing && lastDeduction && (
              <span className="absolute -bottom-6 right-0 px-2 py-0.5 rounded bg-amber-500 text-black font-extrabold text-[9px] font-mono shadow-md animate-bounce">
                -{lastDeduction.amount} credits
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenDevModal}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-400 transition-all text-xs font-bold cursor-pointer font-mono"
            title="Export full-stack CLI setup.sh script & Drizzle schema"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>setup.sh</span>
          </button>

          {/* Mobile Menu Button (< lg) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-[#0d121d] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#080c14] p-3 space-y-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              onChangeView('landing');
              setMobileMenuOpen(false);
            }}
            className={`w-full p-2 rounded-lg text-left transition-colors flex items-center gap-2 ${
              activeView === 'landing' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-300 hover:bg-[#0f1422]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Overview &amp; Pricing</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeView('playground');
              setMobileMenuOpen(false);
            }}
            className={`w-full p-2 rounded-lg text-left transition-colors flex items-center gap-2 ${
              activeView === 'playground' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-300 hover:bg-[#0f1422]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>AI Feature Studio (Live Demo)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeView('billing');
              setMobileMenuOpen(false);
            }}
            className={`w-full p-2 rounded-lg text-left transition-colors flex items-center gap-2 ${
              activeView === 'billing' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-300 hover:bg-[#0f1422]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Stripe Subscription Billing</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeView('admin');
              setMobileMenuOpen(false);
            }}
            className={`w-full p-2 rounded-lg text-left transition-colors flex items-center gap-2 ${
              activeView === 'admin' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-300 hover:bg-[#0f1422]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Executive Admin Metrics</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeView('flags');
              setMobileMenuOpen(false);
            }}
            className={`w-full p-2 rounded-lg text-left transition-colors flex items-center gap-2 ${
              activeView === 'flags' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-300 hover:bg-[#0f1422]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Feature Flags &amp; RBAC</span>
          </button>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onOpenDevModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Export setup.sh &amp; Drizzle Schema</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
