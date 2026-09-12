'use client';

import { Organization } from '@/types';
import { DashboardView } from '@/components/Sidebar';
import {
  Menu,
  Search,
  Command,
  Bell,
  Sparkles,
  Zap,
  Globe,
  Radio,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  activeOrg: Organization;
  activeView: DashboardView;
  onChangeView: (view: DashboardView) => void;
  onToggleSidebar: () => void;
  onOpenCommandPalette: () => void;
  onOpenDevModal: () => void;
  lastDeduction?: { amount: number; id: number } | null;
}

export default function TopBar({
  activeOrg,
  activeView,
  onChangeView,
  onToggleSidebar,
  onOpenCommandPalette,
  onOpenDevModal,
  lastDeduction,
}: Props) {
  const getViewTitle = (view: DashboardView) => {
    switch (view) {
      case 'playground':
        return 'AI Feature Studio';
      case 'billing':
        return 'Stripe Billing & Subscriptions';
      case 'api_keys':
        return 'Developer API Keys & Webhooks';
      case 'security':
        return 'RBAC Matrix & Audit Trail';
      case 'admin':
        return 'Executive Admin & MRR Metrics';
      case 'flags':
        return 'Feature Flags Engine';
      default:
        return 'Platform Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#060a12]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 flex items-center justify-between font-mono text-xs text-slate-300">
      {/* Left: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg bg-[#0d1424] border border-white/[0.08] text-slate-300 hover:text-white lg:hidden cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-bold hidden sm:inline truncate max-w-[140px]">
            {activeOrg.name}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <span className="text-white font-bold">{getViewTitle(activeView)}</span>
        </div>
      </div>

      {/* Middle/Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick Command Palette Button (⌘K) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0a0f1a] border border-white/[0.08] hover:border-white/[0.2] text-slate-400 hover:text-white text-xs transition-all cursor-pointer font-mono"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span>Quick Find...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-slate-400 font-mono border border-white/[0.08] flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Live Credit Deduct Flash Notification */}
        {lastDeduction && (
          <span className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold animate-pulse">
            <Zap className="w-3 h-3 fill-emerald-400" />
            <span>-{lastDeduction.amount} Credits Deducted</span>
          </span>
        )}

        {/* Environment Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0d1424] border border-white/[0.08] text-[10px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>us-east-1</span>
        </div>

        {/* Setup.sh Exporter CTA */}
        <button
          type="button"
          onClick={onOpenDevModal}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10 font-mono"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export CLI Starter</span>
          <span className="sm:hidden">CLI</span>
        </button>

        <a
          href="https://github.com/abdulnabii/mini-projects"
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded-lg bg-[#0d1424] border border-white/[0.08] hover:border-white/[0.2] text-slate-300 hover:text-white transition-all cursor-pointer"
          title="View GitHub Repository"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </header>
  );
}
