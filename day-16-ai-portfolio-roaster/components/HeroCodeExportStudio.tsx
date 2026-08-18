'use client';

import { useState } from 'react';
import { RoastResult } from '@/types';
import { Code, Copy, Check, Terminal, FileCode } from 'lucide-react';

interface Props {
  roast: RoastResult;
}

export default function HeroCodeExportStudio({ roast }: Props) {
  const [activeTab, setActiveTab] = useState<'react' | 'html' | 'readme'>('react');
  const [copied, setCopied] = useState(false);

  const devName = roast.developerName;
  const bio = roast.rewrittenHeroBio.afterBio;
  const tagline = roast.rewrittenHeroBio.improvedTagline;
  const keywords = roast.rewrittenHeroBio.targetKeywords;

  const reactCode = `// components/HeroSection.tsx
import React from 'react';
import { Download, ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 px-6 max-w-5xl mx-auto text-center space-y-6">
      {/* Target Specialty Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
        <Sparkles className="w-3.5 h-3.5" />
        <span>${tagline}</span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
        ${devName}
      </h1>

      <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
        ${bio}
      </p>

      {/* Tech Keywords */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        ${keywords.map((k) => `<span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-teal-300 text-xs font-mono font-semibold">#${k}</span>`).join('\n        ')}
      </div>

      {/* High-Converting CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <a
          href="/resume.pdf"
          download
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Resume (PDF)</span>
        </a>

        <a
          href="#projects"
          className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold text-sm transition-all flex items-center gap-2"
        >
          <span>View Production Work</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </a>
      </div>
    </section>
  );
}`;

  const htmlCode = `<!-- Ready-to-paste Hero HTML -->
<header style="max-width: 800px; margin: 40px auto; text-align: center; font-family: system-ui, sans-serif; color: #fff;">
  <span style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #10b981; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: bold;">
    ✨ ${tagline}
  </span>
  <h1 style="font-size: 42px; margin: 16px 0 8px 0; font-weight: 900;">${devName}</h1>
  <p style="font-size: 16px; color: #cbd5e1; line-height: 1.6; max-width: 650px; margin: 0 auto 20px auto;">
    ${bio}
  </p>
  <div style="display: flex; gap: 12px; justify-content: center;">
    <a href="/resume.pdf" style="background: #10b981; color: #000; padding: 10px 20px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">
      📄 Download Resume (PDF)
    </a>
    <a href="#projects" style="background: #1e293b; color: #fff; padding: 10px 20px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px;">
      🚀 Explore Featured Work
    </a>
  </div>
</header>`;

  const readmeCode = `### Hi there, I'm ${devName} 👋

> **${tagline}**

${bio}

---

#### 🛠️ Core Tech Stack & Specialization
${keywords.map((k) => `- \`${k}\``).join('\n')}

---
📫 **Get in Touch**: [Download My Resume](https://day-16-ai-portfolio-roaster.vercel.app) • [Portfolio Website](${roast.targetUrlOrTitle})`;

  const getCurrentCode = () => {
    if (activeTab === 'react') return reactCode;
    if (activeTab === 'html') return htmlCode;
    return readmeCode;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1420] border border-slate-800 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">Ready-to-Paste Clean Hero Code Studio</h3>
            <p className="text-xs text-slate-400">Export your refactored hero in Next.js, HTML/CSS, or GitHub README Markdown</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('react')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'react' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              React / Next.js
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'html' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('readme')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === 'readme' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              GitHub README
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-300 font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-200/90 font-mono overflow-x-auto max-h-72 leading-relaxed">
        {getCurrentCode()}
      </pre>
    </div>
  );
}
