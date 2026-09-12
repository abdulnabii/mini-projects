'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardView } from '@/components/Sidebar';
import {
  Search,
  Sparkles,
  Zap,
  CreditCard,
  Key,
  Sliders,
  Shield,
  BarChart3,
  Terminal,
  Building2,
  ExternalLink,
  ArrowRight,
  Command,
  X,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: DashboardView) => void;
  onOpenOrgModal: () => void;
  onOpenDevModal: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Actions' | 'Documentation';
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectView,
  onOpenOrgModal,
  onOpenDevModal,
}: Props) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = [
    {
      id: 'nav-overview',
      title: 'Platform Overview',
      subtitle: 'System architecture, health telemetry, and service topology',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-slate-400" />,
      action: () => {
        onSelectView('overview');
        onClose();
      },
    },
    {
      id: 'nav-playground',
      title: 'AI Feature Studio',
      subtitle: 'Gemini 1.5 Pro / Flash dual-pane playground and live credit deduction',
      category: 'Navigation',
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      shortcut: '⌘P',
      action: () => {
        onSelectView('playground');
        onClose();
      },
    },
    {
      id: 'nav-billing',
      title: 'Stripe Billing & Subscriptions',
      subtitle: 'Manage tiers, purchase credit packs, simulate webhooks',
      category: 'Navigation',
      icon: <CreditCard className="w-4 h-4 text-indigo-400" />,
      shortcut: '⌘B',
      action: () => {
        onSelectView('billing');
        onClose();
      },
    },
    {
      id: 'nav-api_keys',
      title: 'API Keys & Webhooks',
      subtitle: 'Generate secret keys, copy cURL / Node snippets, inspect webhook events',
      category: 'Navigation',
      icon: <Key className="w-4 h-4 text-amber-400" />,
      shortcut: '⌘K',
      action: () => {
        onSelectView('api_keys');
        onClose();
      },
    },
    {
      id: 'nav-flags',
      title: 'Feature Flags Engine',
      subtitle: 'Configure canary rollouts, percentage splits, and beta toggles',
      category: 'Navigation',
      icon: <Sliders className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onSelectView('flags');
        onClose();
      },
    },
    {
      id: 'nav-security',
      title: 'RBAC Matrix & Audit Trail',
      subtitle: 'Enterprise role-based permissions and immutable activity logs',
      category: 'Navigation',
      icon: <Shield className="w-4 h-4 text-rose-400" />,
      action: () => {
        onSelectView('security');
        onClose();
      },
    },
    {
      id: 'nav-admin',
      title: 'Executive Admin & MRR Metrics',
      subtitle: 'Real-time MRR, churn rate, active seats, and customer cohorts',
      category: 'Navigation',
      icon: <BarChart3 className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onSelectView('admin');
        onClose();
      },
    },
    {
      id: 'act-setup',
      title: 'Export setup.sh CLI Starter',
      subtitle: 'Download or copy production terminal bootstrapping script',
      category: 'Actions',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onClose();
        onOpenDevModal();
      },
    },
    {
      id: 'act-org',
      title: 'Switch / Manage Workspaces',
      subtitle: 'Change active tenant organization or invite collaborators',
      category: 'Actions',
      icon: <Building2 className="w-4 h-4 text-indigo-400" />,
      action: () => {
        onClose();
        onOpenOrgModal();
      },
    },
    {
      id: 'act-upgrade',
      title: 'Upgrade to Enterprise Tier',
      subtitle: 'Unlock 50,000 credits/mo, 99.99% SLA, and custom SLAs',
      category: 'Actions',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      action: () => {
        onSelectView('billing');
        onClose();
      },
    },
    {
      id: 'doc-github',
      title: 'Open 30-Days GitHub Repo',
      subtitle: 'View complete open-source repository & commit log',
      category: 'Documentation',
      icon: <ExternalLink className="w-4 h-4 text-slate-400" />,
      action: () => {
        window.open('https://github.com/abdulnabii/mini-projects', '_blank');
        onClose();
      },
    },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-[#090d16] border border-white/[0.12] shadow-2xl overflow-hidden font-mono text-xs z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-[#060a12]">
          <Search className="w-4 h-4 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search platform views..."
            className="flex-1 bg-transparent text-white text-xs placeholder:text-slate-500 focus:outline-none font-mono"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-slate-400 border border-white/[0.08]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <p>No matching commands found for "{query}"</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-white'
                      : 'hover:bg-white/[0.04] text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected ? 'bg-emerald-500/20' : 'bg-white/[0.04]'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs truncate text-white">
                          {item.title}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-400 uppercase">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[9px] text-slate-400 border border-white/[0.08]">
                        {item.shortcut}
                      </kbd>
                    )}
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#060a12] border-t border-white/[0.08] flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-slate-400">↑</kbd>{' '}
              <kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-slate-400">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-slate-400">↵</kbd> to select
            </span>
          </div>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-slate-400">esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
