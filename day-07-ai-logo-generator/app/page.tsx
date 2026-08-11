'use client';

import { useState } from 'react';
import { BrandConfig, BrandKit } from '@/types';
import BrandInputForm from '@/components/BrandInputForm';
import LogoGallery from '@/components/LogoGallery';
import ColorPaletteView from '@/components/ColorPaletteView';
import TypographyPreview from '@/components/TypographyPreview';
import MockupPreviewer from '@/components/MockupPreviewer';
import { saveBrandKit } from '@/lib/storage';
import { Sparkles, Download, ArrowLeft, CheckCircle2, Loader2, FileText } from 'lucide-react';

export default function BrandStudioPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'logos' | 'colors' | 'typography' | 'mockups'>('logos');
  const [downloadingZip, setDownloadingZip] = useState(false);

  const handleGenerate = async (config: BrandConfig) => {
    setIsLoading(true);
    setError('');
    setBrandKit(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error('Failed to generate brand identity');

      const data: BrandKit = await res.json();
      setBrandKit(data);
      saveBrandKit(data);
    } catch (err: unknown) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong during generation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadZip = () => {
    if (!brandKit) return;
    setDownloadingZip(true);

    setTimeout(() => {
      const brandDataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(brandKit, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", brandDataStr);
      downloadAnchor.setAttribute("download", `${brandKit.companyName.toLowerCase().replace(/\s+/g, '-')}-brand-kit.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setDownloadingZip(false);
    }, 1500);
  };

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-10">
      {/* Header Section */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generative AI Brand System</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit">
          Craft Your Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">Brand Identity</span> in Seconds
        </h1>
        <p className="text-slate-400 text-sm sm:text-base font-mono">
          Vector logo concepts, WCAG compliant color palettes, Google Font pairings, and real-time product mockups.
        </p>
      </div>

      {/* Input Form */}
      {!brandKit && (
        <BrandInputForm onSubmit={handleGenerate} isLoading={isLoading} />
      )}

      {/* Loading Progress State */}
      {isLoading && (
        <div className="max-w-2xl mx-auto bg-[#111827] border border-amber-500/20 rounded-3xl p-8 text-center space-y-6 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-2 font-mono">
            <h3 className="text-lg font-bold text-white">Synthesizing Brand System...</h3>
            <p className="text-xs text-slate-400">Generating vector marks, extracting color harmonies, and validating contrast ratios.</p>
          </div>
          <div className="space-y-2 text-left max-w-md mx-auto text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2 text-amber-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Analyzing industry aesthetic guidelines</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Drafting 4 scalable vector logo marks</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Checking WCAG 2.1 AA/AAA contrast ratios</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-center font-mono text-xs">
          {error}
        </div>
      )}

      {/* Generated Results View */}
      {brandKit && (
        <div className="space-y-8">
          {/* Top Bar Navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111827] border border-amber-500/20 rounded-2xl p-4">
            <button
              onClick={() => setBrandKit(null)}
              className="flex items-center gap-2 text-xs font-mono text-amber-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Generate Another Brand</span>
            </button>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-1 bg-[#0a0d14] p-1 rounded-xl border border-slate-800 font-mono text-xs">
              <button
                onClick={() => setActiveTab('logos')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'logos'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Logos (4)
              </button>
              <button
                onClick={() => setActiveTab('colors')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'colors'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Palette
              </button>
              <button
                onClick={() => setActiveTab('typography')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'typography'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Typography
              </button>
              <button
                onClick={() => setActiveTab('mockups')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'mockups'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Mockups
              </button>
            </div>

            {/* Download Full Kit Button */}
            <button
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-bold font-mono text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {downloadingZip ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Packaging Kit...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Brand Package</span>
                </>
              )}
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === 'logos' && (
            <LogoGallery
              logos={brandKit.logos}
              companyName={brandKit.companyName}
              tagline={brandKit.tagline}
            />
          )}

          {activeTab === 'colors' && (
            <ColorPaletteView palette={brandKit.palette} />
          )}

          {activeTab === 'typography' && (
            <TypographyPreview
              typography={brandKit.typography}
              companyName={brandKit.companyName}
            />
          )}

          {activeTab === 'mockups' && (
            <MockupPreviewer kit={brandKit} />
          )}
        </div>
      )}
    </div>
  );
}
