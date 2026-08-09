'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, History, Cpu, ShieldCheck, GitBranch } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Code Inspector', href: '/', icon: Terminal },
    { label: 'Review Logs', href: '/history', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090d16]/90 border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Terminal Dots */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-1.5 mr-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-purple-600 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
                <Terminal className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>

            <div>
              <span className="text-lg font-bold font-mono tracking-tight text-white flex items-center gap-1.5">
                <span className="text-emerald-400">&gt;_</span> CodeReview<span className="text-purple-400">.AI</span>
              </span>
              <span className="block text-[10px] text-zinc-400 font-mono tracking-wider">
                aiwithab.site • Day 02 IDE
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 mr-2">
              <GitBranch className="w-3.5 h-3.5 text-purple-400" />
              <span>branch: main</span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <Link
              href="/"
              className="ml-2 hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600 text-zinc-950 px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Cpu className="w-4 h-4 text-zinc-950" />
              <span>Inspect Code</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
