'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Utensils,
  Camera,
  Calendar,
  ShoppingCart,
  ChefHat,
  Activity,
  Sparkles,
  Flame,
  Zap,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Dashboard', icon: Utensils },
  { href: '/scan', label: 'Vision Scanner', icon: Camera, badge: 'AI' },
  { href: '/plan', label: '7-Day Planner', icon: Calendar },
  { href: '/grocery', label: 'Grocery List', icon: ShoppingCart },
  { href: '/recipes', label: 'Recipe Studio', icon: ChefHat },
  { href: '/analytics', label: 'Longevity Radar', icon: Activity },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3 pointer-events-none">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#08111e]/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl shadow-black/80 pointer-events-auto transition-all">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-4 h-4 text-black" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-base text-white tracking-tight font-outfit">
              NutriGenius<span className="text-emerald-400">.AI</span>
            </span>
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[8px] font-bold border border-emerald-500/30">
              PRO
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-950/60 border border-white/5">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge && !isActive && (
                  <span className="px-1 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[8px] font-mono">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/scan"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan Photo</span>
          </Link>
        </div>
      </header>

      {/* Mobile Nav Scroller */}
      <div className="flex lg:hidden items-center justify-center gap-1 overflow-x-auto pt-2 pb-1 scrollbar-none pointer-events-auto">
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#08111e]/95 backdrop-blur-xl border border-white/10 shadow-lg">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
