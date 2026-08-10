'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, BarChart2, Bell, Briefcase } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Terminal', href: '/', icon: BarChart2 },
    { label: 'Portfolio', href: '/portfolio', icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080c10]/95 backdrop-blur border-b border-green-500/20 font-mono">
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
            <TrendingUp className="w-4.5 h-4.5 text-black" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white">
              StockPulse<span className="text-green-400">.AI</span>
            </span>
            <span className="block text-[10px] text-slate-500 font-mono tracking-wider">
              AI-Powered Market Intelligence Terminal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  active ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'text-slate-400 hover:text-green-400 hover:bg-slate-900'
                }`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="ml-2 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>SIMULATED LIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
