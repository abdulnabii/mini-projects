'use client';

import { BrandKit } from '@/types';
import { Layout, Smartphone, CreditCard, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

interface Props {
  kit: BrandKit;
}

type MockupTab = 'business-card' | 'app-icon' | 'website-header' | 'merch';

export default function MockupPreviewer({ kit }: Props) {
  const [activeTab, setActiveTab] = useState<MockupTab>('business-card');

  const selectedLogo = kit.logos[0];

  return (
    <div className="bg-[#111827] border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
            <Layout className="w-5 h-5 text-amber-400" />
            Real-Time Brand Mockup Previews
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            See how your logo and brand palette look on physical &amp; digital touchpoints.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[#0a0d14] rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveTab('business-card')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'business-card'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Business Card</span>
          </button>
          <button
            onClick={() => setActiveTab('app-icon')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'app-icon'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>App Icon</span>
          </button>
          <button
            onClick={() => setActiveTab('website-header')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'website-header'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Website Header</span>
          </button>
          <button
            onClick={() => setActiveTab('merch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'merch'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Merchandise</span>
          </button>
        </div>
      </div>

      {/* Mockup Display Container */}
      <div className="w-full min-h-[300px] bg-[#0a0d14] rounded-2xl p-6 sm:p-12 flex items-center justify-center border border-slate-800">
        {activeTab === 'business-card' && (
          <div className="w-full max-w-md h-56 rounded-2xl p-6 shadow-2xl flex flex-col justify-between border border-white/10 relative overflow-hidden transition-all hover:scale-105"
            style={{ backgroundColor: kit.palette.neutral.hex }}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xl font-bold text-white font-outfit block">{kit.companyName}</span>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">{kit.tagline}</span>
              </div>
              <div className="w-12 h-12 rounded-xl p-2 flex items-center justify-center" style={{ backgroundColor: kit.palette.primary.hex }}>
                <span className="text-white font-bold font-mono text-lg">{kit.companyName[0]}</span>
              </div>
            </div>
            <div className="space-y-0.5 text-[11px] font-mono text-slate-300">
              <span className="block font-bold text-white">Alex Morgan • Founder &amp; CEO</span>
              <span className="block">alex@{kit.companyName.toLowerCase().replace(/\s+/g, '')}.com</span>
              <span className="block">+1 (555) 019-2834 • www.{kit.companyName.toLowerCase().replace(/\s+/g, '')}.io</span>
            </div>
          </div>
        )}

        {activeTab === 'app-icon' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-3xl p-5 shadow-2xl flex items-center justify-center border border-white/20 transition-all hover:scale-110"
              style={{ backgroundColor: kit.palette.primary.hex }}>
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur">
                <span className="text-3xl font-extrabold text-white font-outfit">{kit.companyName[0]}</span>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-300 font-bold">{kit.companyName} iOS App Icon</span>
          </div>
        )}

        {activeTab === 'website-header' && (
          <div className="w-full max-w-xl bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="h-7 bg-slate-950 px-3 flex items-center gap-1.5 border-b border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="ml-2 text-[10px] font-mono text-slate-500">https://{kit.companyName.toLowerCase().replace(/\s+/g, '')}.io</span>
            </div>
            <div className="p-4 flex items-center justify-between border-b border-slate-800" style={{ backgroundColor: kit.palette.background.hex }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs font-mono" style={{ backgroundColor: kit.palette.primary.hex }}>
                  {kit.companyName[0]}
                </div>
                <span className="font-bold font-outfit text-slate-900 text-sm">{kit.companyName}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-700">
                <span>Products</span>
                <span>Pricing</span>
                <span className="px-3 py-1 rounded-lg text-white font-bold" style={{ backgroundColor: kit.palette.primary.hex }}>
                  Get Started
                </span>
              </div>
            </div>
            <div className="p-8 text-center space-y-2 bg-slate-900 text-slate-300 font-mono text-xs">
              <span className="text-amber-400 font-bold block">{kit.tagline}</span>
              <p className="text-slate-400 max-w-md mx-auto">{kit.brandStory}</p>
            </div>
          </div>
        )}

        {activeTab === 'merch' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-64 h-64 bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col items-center justify-center gap-3 relative shadow-2xl">
              <div className="w-32 h-32 rounded-2xl flex flex-col items-center justify-center p-4 border border-white/10 shadow-lg"
                style={{ backgroundColor: kit.palette.neutral.hex }}>
                <span className="text-4xl font-extrabold text-amber-400 font-outfit mb-1">{kit.companyName[0]}</span>
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">{kit.companyName}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Eco-Cotton Tote &amp; Canvas Bag</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
