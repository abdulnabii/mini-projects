'use client';

import { Organization, PlanTier } from '@/types';
import {
  Sparkles,
  Zap,
  CreditCard,
  Building2,
  Sliders,
  BarChart3,
  Key,
  Shield,
  Terminal,
  ChevronDown,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Code2,
  Radio,
  CheckCircle2,
  Plus,
  Flame,
  User,
} from 'lucide-react';

export type DashboardView =
  | 'overview'
  | 'playground'
  | 'billing'
  | 'api_keys'
  | 'security'
  | 'admin'
  | 'flags';

interface Props {
  activeOrg: Organization;
  activeView: DashboardView;
  onChangeView: (view: DashboardView) => void;
  onOpenOrgModal: () => void;
  onOpenDevModal: () => void;
  isSidebarOpen: boolean;
  onCloseSidebar: () => void;
  lastDeduction?: { amount: number; id: number } | null;
}

export default function Sidebar({
  activeOrg,
  activeView,
  onChangeView,
  onOpenOrgModal,
  onOpenDevModal,
  isSidebarOpen,
  onCloseSidebar,
  lastDeduction,
}: Props) {
  const planBadgeColor = (plan: PlanTier) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'pro':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-white/[0.08]';
    }
  };

  const navItems: {
    id: DashboardView;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    section: 'MAIN' | 'DEVELOPER' | 'GOVERNANCE';
  }[] = [
    {
      id: 'overview',
      label: 'Product Overview',
      icon: <Sparkles className="w-4 h-4" />,
      section: 'MAIN',
    },
    {
      id: 'playground',
      label: 'AI Feature Studio',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      badge: 'Gemini 1.5',
      section: 'MAIN',
    },
    {
      id: 'billing',
      label: 'Stripe Billing & Plans',
      icon: <CreditCard className="w-4 h-4 text-indigo-400" />,
      section: 'MAIN',
    },
    {
      id: 'api_keys',
      label: 'API Keys & Webhooks',
      icon: <Key className="w-4 h-4 text-amber-400" />,
      badge: 'SDK v2',
      section: 'DEVELOPER',
    },
    {
      id: 'flags',
      label: 'Feature Flags Engine',
      icon: <Sliders className="w-4 h-4 text-cyan-400" />,
      section: 'DEVELOPER',
    },
    {
      id: 'security',
      label: 'RBAC & Audit Trail',
      icon: <Shield className="w-4 h-4 text-rose-400" />,
      section: 'GOVERNANCE',
    },
    {
      id: 'admin',
      label: 'Executive Admin & MRR',
      icon: <BarChart3 className="w-4 h-4 text-emerald-400" />,
      section: 'GOVERNANCE',
    },
  ];

  const remaining = Math.min(activeOrg.creditsTotal, Math.max(0, activeOrg.creditsRemaining));
  const creditPercent = Math.min(100, Math.max(0, Math.round((remaining / activeOrg.creditsTotal) * 100)));

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={onCloseSidebar}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#080d17] border-r border-white/[0.08] flex flex-col font-mono text-xs text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.08] shrink-0">
          <button
            type="button"
            onClick={() => {
              onChangeView('overview');
              onCloseSidebar();
            }}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600 flex items-center justify-center text-black font-extrabold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 fill-black" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm font-mono tracking-tight">
                SaaSForge<span className="text-emerald-400">.AI</span>
              </span>
              <span className="px-1.5 py-0.2 rounded bg-white/[0.06] text-[9px] text-slate-400 font-bold">
                PRO
              </span>
            </div>
          </button>
        </div>

        {/* Workspace Switcher Selector */}
        <div className="p-3 border-b border-white/[0.06] shrink-0">
          <button
            type="button"
            onClick={onOpenOrgModal}
            className="w-full p-2 rounded-xl bg-[#04060c] border border-white/[0.06] hover:border-white/[0.15] transition-all flex items-center justify-between cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold shrink-0 text-[10px]">
                {activeOrg.name.charAt(0)}
              </div>
              <div className="overflow-hidden space-y-0.5">
                <p className="text-white font-bold text-xs truncate group-hover:text-emerald-400 transition-colors">
                  {activeOrg.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold border uppercase ${planBadgeColor(
                      activeOrg.plan
                    )}`}
                  >
                    {activeOrg.plan}
                  </span>
                  <span className="text-[9px] text-slate-500">
                    {activeOrg.members.length} members
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5">
          {/* Main Workspace Section */}
          <div className="space-y-1">
            <span className="px-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
              Core Platform
            </span>
            {navItems
              .filter((item) => item.section === 'MAIN')
              .map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChangeView(item.id);
                      onCloseSidebar();
                    }}
                    className={`w-full px-2.5 py-2 rounded-lg text-xs font-mono font-medium flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Developer Hub Section */}
          <div className="space-y-1">
            <span className="px-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
              Developer Hub
            </span>
            {navItems
              .filter((item) => item.section === 'DEVELOPER')
              .map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChangeView(item.id);
                      onCloseSidebar();
                    }}
                    className={`w-full px-2.5 py-2 rounded-lg text-xs font-mono font-medium flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 text-[9px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Governance & Analytics Section */}
          <div className="space-y-1">
            <span className="px-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
              Enterprise Governance
            </span>
            {navItems
              .filter((item) => item.section === 'GOVERNANCE')
              .map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChangeView(item.id);
                      onCloseSidebar();
                    }}
                    className={`w-full px-2.5 py-2 rounded-lg text-xs font-mono font-medium flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Live Credit Metering Card (Footer) */}
        <div className="p-3 border-t border-white/[0.06] shrink-0 space-y-2.5 bg-[#050811]">
          <div className="p-3 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>Credits Meter</span>
              </span>
              <span className="text-emerald-400 font-bold">
                {remaining} / {activeOrg.creditsTotal}
              </span>
            </div>

            <div className="w-full h-1.5 bg-[#03060c] rounded-full overflow-hidden border border-white/[0.06]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  creditPercent < 20
                    ? 'bg-rose-500'
                    : creditPercent < 50
                    ? 'bg-amber-400'
                    : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                }`}
                style={{ width: `${creditPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-[10px]">
              <button
                type="button"
                onClick={() => {
                  onChangeView('billing');
                  onCloseSidebar();
                }}
                className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
              >
                + Upgrade Plan
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenDevModal();
                  onCloseSidebar();
                }}
                className="text-slate-400 hover:text-white font-bold cursor-pointer flex items-center gap-0.5"
              >
                <Terminal className="w-3 h-3" />
                <span>setup.sh</span>
              </button>
            </div>
          </div>

          {/* User Session Pill */}
          <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-[9px]">
                AN
              </div>
              <span className="truncate max-w-[110px] text-slate-300 font-medium">
                Abdul Nabi
              </span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-white/[0.06] text-[8px] text-slate-400 uppercase font-bold">
              Owner
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
