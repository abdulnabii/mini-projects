'use client';

import { useState } from 'react';
import { BrandConfig, IndustryType, StylePreference } from '@/types';
import { Sparkles, Wand2, ArrowRight } from 'lucide-react';

interface Props {
  onSubmit: (config: BrandConfig) => void;
  isLoading: boolean;
}

const INDUSTRIES: IndustryType[] = [
  'Healthcare',
  'FinTech',
  'E-Commerce',
  'SaaS & Tech',
  'Food & Beverage',
  'Fitness & Wellness',
  'Education',
  'Creative & Media',
];

const STYLES: { id: StylePreference; label: string; desc: string }[] = [
  { id: 'minimalist', label: 'Minimalist', desc: 'Clean geometric lines & negative space' },
  { id: 'bold', label: 'Bold Emblem', desc: 'High contrast, strong impact symbols' },
  { id: 'playful', label: 'Playful & Friendly', desc: 'Rounded forms & vibrant energy' },
  { id: 'corporate', label: 'Corporate & Trust', desc: 'Authoritative structural elegance' },
  { id: 'tech', label: 'Tech & Futuristic', desc: 'Node circuits & sharp angular forms' },
];

const PRESETS: { name: string; tag: string; config: BrandConfig }[] = [
  {
    name: 'NovaCare',
    tag: 'Digital Health',
    config: {
      companyName: 'NovaCare',
      tagline: 'Next-Gen Patient Care',
      industry: 'Healthcare',
      style: 'minimalist',
      colorMood: 'Trustworthy medical blue, clean white & vital mint',
    },
  },
  {
    name: 'AetherPay',
    tag: 'FinTech',
    config: {
      companyName: 'AetherPay',
      tagline: 'Borderless Global Treasury',
      industry: 'FinTech',
      style: 'tech',
      colorMood: 'Emerald green, deep indigo & solar amber',
    },
  },
  {
    name: 'BloomBites',
    tag: 'Artisan Food',
    config: {
      companyName: 'BloomBites',
      tagline: 'Organic Culinary Goodness',
      industry: 'Food & Beverage',
      style: 'playful',
      colorMood: 'Warm coral, terracotta & fresh botanical leaf green',
    },
  },
];

export default function BrandInputForm({ onSubmit, isLoading }: Props) {
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [industry, setIndustry] = useState<IndustryType>('SaaS & Tech');
  const [style, setStyle] = useState<StylePreference>('minimalist');
  const [colorMood, setColorMood] = useState('Modern gradient with amber gold and rose accents');

  const handleApplyPreset = (presetConfig: BrandConfig) => {
    setCompanyName(presetConfig.companyName);
    setTagline(presetConfig.tagline || '');
    setIndustry(presetConfig.industry);
    setStyle(presetConfig.style);
    setColorMood(presetConfig.colorMood);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    onSubmit({
      companyName: companyName.trim(),
      tagline: tagline.trim() || undefined,
      industry,
      style,
      colorMood,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Preset Buttons */}
      <div className="space-y-2 text-center">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Try a 1-Click Demo Brand Preset:
        </span>
        <div className="flex flex-wrap gap-2.5 justify-center">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p.config)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/20 bg-[#111827] text-xs font-mono text-slate-300 hover:text-white hover:border-amber-500/50 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{p.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
                {p.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-[#111827] border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. NovaCare or Lumina"
              className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 font-mono transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
              Tagline (Optional)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Next-Gen Intelligence"
              className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 font-mono transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
              Industry Vertical
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as IndustryType)}
              className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/60 font-mono transition-colors"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
              Color Mood Description
            </label>
            <input
              type="text"
              value={colorMood}
              onChange={(e) => setColorMood(e.target.value)}
              placeholder="e.g. Electric indigo with energetic solar yellow"
              className="w-full bg-[#0a0d14] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 font-mono transition-colors"
            />
          </div>
        </div>

        {/* Style Selection Grid */}
        <div className="space-y-3">
          <label className="block text-xs font-mono uppercase text-slate-300">
            Design Aesthetic Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  style === s.id
                    ? 'bg-amber-500/10 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-[#0a0d14] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="font-mono text-xs font-bold text-amber-400 mb-1">{s.label}</div>
                <div className="text-[10px] leading-tight text-slate-400">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={!companyName.trim() || isLoading}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-bold font-mono text-sm transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate Brand Identity Kit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
