'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, History, Stethoscope, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Clinical Diagnostic', href: '/', icon: Stethoscope },
    { label: 'Risk Logs', href: '/history', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#061019]/90 border-b border-teal-500/20 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-cyan-500 p-0.5 shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#061019] rounded-[10px] flex items-center justify-center">
                <Activity className="w-4.5 h-4.5 text-teal-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>

            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                DiabetesRisk<span className="text-teal-400">.AI</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-mono tracking-wider">
                Clinical Risk Diagnostic Calculator
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <Link
              href="/"
              className="ml-2 hidden sm:flex items-center gap-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Assess Vitals</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
