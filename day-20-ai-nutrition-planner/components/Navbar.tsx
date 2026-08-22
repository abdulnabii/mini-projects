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
  Droplet,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Overview', icon: Utensils },
  { href: '/scan', label: 'AI Vision Scan', icon: Camera, badge: 'AI' },
  { href: '/plan', label: '7-Day Plan', icon: Calendar },
  { href: '/grocery', label: 'Grocery List', icon: ShoppingCart },
  { href: '/recipes', label: 'AI Recipes', icon: ChefHat },
  { href: '/analytics', label: 'Longevity Radar', icon: Activity },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3.5 bg-[#070e17]/85 backdrop-blur-2xl border-b border-emerald-500/20 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg text-white tracking-tight">
                NutriGenius<span className="text-emerald-400">.AI</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Precision Vision Nutrition &amp; Longevity
            </p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge && !isActive && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[8px] font-mono">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/scan"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Scan Meal Photo</span>
          </Link>
        </div>
      </div>

      {/* Mobile Nav Scroller */}
      <div className="flex lg:hidden items-center gap-1 overflow-x-auto pt-2.5 pb-1 scrollbar-none border-t border-slate-800/80 mt-2">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
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
    </header>
  );
}
