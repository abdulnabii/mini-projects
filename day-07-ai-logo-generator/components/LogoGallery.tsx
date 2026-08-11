'use client';

import { LogoConcept } from '@/types';
import { Download, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
  logos: LogoConcept[];
  companyName: string;
  tagline: string;
}

export default function LogoGallery({ logos, companyName, tagline }: Props) {
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleDownload = (logo: LogoConcept) => {
    setDownloadedId(logo.id);
    setTimeout(() => setDownloadedId(null), 2000);

    // Create SVG Blob for download
    const svgElement = document.getElementById(`svg-${logo.id}`);
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${companyName.toLowerCase().replace(/\s+/g, '-')}-${logo.id}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderSvgMark = (logo: LogoConcept) => {
    switch (logo.svgShape) {
      case 'circle-cross':
        return (
          <g>
            <circle cx="50" cy="50" r="40" fill={logo.primaryColor} opacity="0.15" />
            <circle cx="50" cy="50" r="32" fill="none" stroke={logo.primaryColor} strokeWidth="6" />
            <path d="M50 25 V75 M25 50 H75" stroke={logo.accentColor} strokeWidth="7" strokeLinecap="round" />
            <circle cx="50" cy="50" r="8" fill={logo.secondaryColor} />
          </g>
        );
      case 'shield-bolt':
        return (
          <g>
            <path d="M50 12 L82 26 V52 C82 70 68 84 50 90 C32 84 18 70 18 52 V26 Z" fill={logo.primaryColor} />
            <path d="M54 26 L36 50 H52 L46 74 L66 48 H50 Z" fill={logo.accentColor} />
          </g>
        );
      case 'leaf-node':
        return (
          <g>
            <path d="M50 15 C75 15 85 40 85 65 C85 75 75 85 65 85 C40 85 15 75 15 50 C15 25 35 15 50 15 Z" fill={logo.primaryColor} opacity="0.85" />
            <path d="M50 25 C65 25 75 40 75 60 C50 60 30 45 30 30 C30 25 40 25 50 25 Z" fill={logo.secondaryColor} />
            <circle cx="65" cy="40" r="6" fill={logo.accentColor} />
          </g>
        );
      case 'hexagon-wave':
      default:
        return (
          <g>
            <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke={logo.primaryColor} strokeWidth="6" strokeLinejoin="round" />
            <path d="M25 50 Q 37.5 35, 50 50 T 75 50" fill="none" stroke={logo.secondaryColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M25 60 Q 37.5 45, 50 60 T 75 60" fill="none" stroke={logo.accentColor} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          </g>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Generated Vector Logo Concepts
        </h3>
        <span className="text-xs font-mono text-slate-400">4 Scalable Marks</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {logos.map((logo) => (
          <div
            key={logo.id}
            className="bg-[#111827] border border-amber-500/20 rounded-3xl p-6 flex flex-col items-center justify-between gap-6 group hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10"
          >
            <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-bold">
                {logo.styleTag}
              </span>
              <span>{logo.variantName}</span>
            </div>

            {/* Logo Rendering Preview */}
            <div className="w-full bg-[#0a0d14] rounded-2xl p-8 flex flex-col items-center justify-center gap-4 border border-slate-800/80">
              <svg
                id={`svg-${logo.id}`}
                viewBox="0 0 100 100"
                className="w-24 h-24 drop-shadow-lg transition-transform group-hover:scale-105"
              >
                {renderSvgMark(logo)}
              </svg>
              <div className="text-center space-y-0.5">
                <span className="text-2xl font-bold text-white tracking-tight font-outfit block">
                  {companyName}
                </span>
                {tagline && (
                  <span className="text-xs font-mono text-slate-400 block tracking-wider uppercase">
                    {tagline}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex gap-3">
              <button
                onClick={() => handleDownload(logo)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-mono font-bold transition-all"
              >
                {downloadedId === logo.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">SVG Downloaded</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download SVG</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
