'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Database,
  Terminal,
  Bookmark,
  Sparkles,
  Code2,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Query Builder', icon: Terminal },
  { href: '/schema', label: 'Schema Explorer', icon: Database },
  { href: '/history', label: 'Saved Queries', icon: Bookmark, badge: 'Library' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-[#060e14]/95 backdrop-blur-md border-b border-emerald-500/20 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center text-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white font-mono">
                QueryForge<span className="text-emerald-400">.AI</span>
              </span>
              <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30 font-mono">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden xl:block">
              AI Database Query Engine &amp; Visual Sandbox
            </p>
          </div>
        </Link>

        {/* Center Nav Links - Unified Shared Button Tab Style */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500 text-black font-bold shadow-sm'
                    : 'bg-[#0d1117] border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge && !isActive && (
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[8px] font-mono font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions - Fully Responsive without Overflow */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/schema"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs shadow-sm shadow-emerald-500/20 hover:scale-102 transition-all shrink-0"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Active Schema</span>
          </Link>

          <a
            href="https://github.com/abdulnabii/mini-projects"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-[#0d1117] border border-slate-800 px-3 py-1.5 text-xs font-mono font-medium text-slate-300 hover:border-emerald-500/50 hover:text-white transition-all shrink-0"
          >
            <svg className="w-3.5 h-3.5 fill-emerald-400" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12z" />
            </svg>
            <span className="hidden md:inline">GitHub</span>
          </a>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Sub-bar */}
      <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto px-4 py-2 bg-[#04080e] border-t border-slate-800/80">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-500 text-black font-bold shadow-sm'
                  : 'bg-[#0d1117] border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
