'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, History, Sparkles, Award } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Resume Builder', href: '/', icon: FileText },
    { label: 'Saved Versions', href: '/history', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090d16]/90 border-b border-indigo-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-amber-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#0b0f17] rounded-[10px] flex items-center justify-center">
                <FileText className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>

            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                SmartResume<span className="text-amber-400">.AI</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-mono tracking-wider">
                30 Days 30 AI Projects • Day 03
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
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-sm'
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
              className="ml-2 hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Resume</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
