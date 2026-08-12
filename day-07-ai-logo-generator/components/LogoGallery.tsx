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
    const p = logo.primaryColor;
    const s = logo.secondaryColor;
    const a = logo.accentColor;

    switch (logo.svgShape) {
      // --- ANIME / MASCOT STYLES ---
      case 'anime-kitsune-mask':
        return (
          <g>
            <defs>
              <linearGradient id={`grad-kitsune-${logo.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={p} />
                <stop offset="100%" stopColor={s} />
              </linearGradient>
            </defs>
            {/* Background Aura */}
            <circle cx="50" cy="50" r="42" fill={`url(#grad-kitsune-${logo.id})`} opacity="0.15" />
            {/* Ears */}
            <polygon points="22,40 32,12 44,32" fill={p} />
            <polygon points="78,40 68,12 56,32" fill={p} />
            <polygon points="26,38 33,18 40,32" fill={a} />
            <polygon points="74,38 67,18 60,32" fill={a} />
            {/* Mask Base */}
            <path d="M 24 38 C 24 68 38 88 50 90 C 62 88 76 68 76 38 Z" fill={`url(#grad-kitsune-${logo.id})`} stroke={a} strokeWidth="2" />
            {/* Eye Slits */}
            <path d="M 30 46 C 36 42 42 46 44 48 C 40 52 34 52 30 46 Z" fill={a} />
            <path d="M 70 46 C 64 42 58 46 56 48 C 60 52 66 52 70 46 Z" fill={a} />
            {/* Forehead Markings */}
            <circle cx="50" cy="32" r="5" fill={a} />
            <path d="M 50 20 L 50 26 M 44 23 L 56 23" stroke={a} strokeWidth="2" strokeLinecap="round" />
            {/* Whisker Marks */}
            <path d="M 28 58 L 38 60 M 26 66 L 36 66" stroke={a} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 72 58 L 62 60 M 74 66 L 64 66" stroke={a} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      case 'anime-mecha-star':
        return (
          <g>
            {/* Cyber Wing Plates */}
            <polygon points="50,8 65,30 92,30 72,50 80,78 50,60 20,78 28,50 8,30 35,30" fill={p} opacity="0.9" />
            <polygon points="50,16 61,33 80,33 65,48 71,68 50,54 29,68 35,48 20,33 39,33" fill={s} />
            {/* Inner Power Core Star */}
            <polygon points="50,25 56,38 70,38 59,48 63,62 50,52 37,62 41,48 30,38 44,38" fill={a} />
            <circle cx="50" cy="45" r="5" fill="#FFFFFF" />
          </g>
        );

      case 'anime-cyber-ninja':
        return (
          <g>
            <circle cx="50" cy="50" r="38" fill="none" stroke={s} strokeWidth="3" strokeDasharray="6 4" />
            {/* 4-Blade Shuriken */}
            <path d="M 50 10 L 60 40 L 90 50 L 60 60 L 50 90 L 40 60 L 10 50 L 40 40 Z" fill={p} />
            <path d="M 50 20 L 56 42 L 78 50 L 56 58 L 50 80 L 44 58 L 22 50 L 44 42 Z" fill={a} />
            <circle cx="50" cy="50" r="10" fill={s} />
            <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
          </g>
        );

      case 'anime-flame-crest':
        return (
          <g>
            {/* Multi-Layer Power Flames */}
            <path d="M 50 8 C 65 25 85 35 85 62 C 85 80 70 92 50 92 C 30 92 15 80 15 62 C 15 35 35 25 50 8 Z" fill={p} />
            <path d="M 50 22 C 60 35 74 42 74 62 C 74 74 63 82 50 82 C 37 82 26 74 26 62 C 26 42 40 35 50 22 Z" fill={s} />
            <path d="M 50 38 C 56 46 64 52 64 64 C 64 71 58 76 50 76 C 42 76 36 71 36 64 C 36 52 44 46 50 38 Z" fill={a} />
            <circle cx="50" cy="62" r="5" fill="#FFFFFF" />
          </g>
        );

      // --- CORPORATE / PROFESSIONAL STYLES ---
      case 'pro-interlocking-m':
        return (
          <g>
            <defs>
              <linearGradient id={`grad-pro1-${logo.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={p} />
                <stop offset="100%" stopColor={s} />
              </linearGradient>
            </defs>
            {/* 3D Interlocking Monogram Ribbon */}
            <path d="M 18 78 L 18 22 L 40 55 L 60 22 L 60 78 L 46 78 L 46 45 L 34 64 L 22 45 L 22 78 Z" fill={`url(#grad-pro1-${logo.id})`} />
            <path d="M 40 78 L 40 22 L 62 55 L 82 22 L 82 78 L 68 78 L 68 45 L 56 64 L 44 45 L 44 78 Z" fill={a} opacity="0.9" />
          </g>
        );

      case 'pro-prism-diamond':
        return (
          <g>
            {/* Faceted Prism Diamond */}
            <polygon points="50,10 82,32 50,90 18,32" fill={p} opacity="0.9" />
            <polygon points="50,10 82,32 50,54" fill={s} />
            <polygon points="50,10 18,32 50,54" fill={a} opacity="0.8" />
            <polygon points="50,54 82,32 50,90" fill={p} />
            <polygon points="50,54 18,32 50,90" fill={s} opacity="0.7" />
          </g>
        );

      case 'pro-corporate-crest':
        return (
          <g>
            <path d="M 50 12 L 82 26 V 52 C 82 72 68 84 50 90 C 32 84 18 72 18 52 V 26 Z" fill={p} />
            <path d="M 50 18 L 76 30 V 50 C 76 67 64 77 50 82 C 36 77 24 67 24 50 V 30 Z" fill="#0a0d14" />
            <path d="M 32 38 L 44 38 L 50 64 L 56 38 L 68 38 L 50 74 Z" fill={a} />
          </g>
        );

      case 'pro-infinity-node':
        return (
          <g>
            <path
              d="M 30 50 C 15 35 15 65 30 50 C 45 35 55 65 70 50 C 85 35 85 65 70 50 C 55 35 45 65 30 50 Z"
              fill="none"
              stroke={p}
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 30 50 C 15 35 15 65 30 50 C 45 35 55 65 70 50 C 85 35 85 65 70 50 C 55 35 45 65 30 50 Z"
              fill="none"
              stroke={a}
              strokeWidth="4"
              strokeDasharray="12 8"
            />
          </g>
        );

      // --- TECH / CYBERPUNK STYLES ---
      case 'tech-circuit-matrix':
        return (
          <g>
            <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke={p} strokeWidth="5" />
            <circle cx="50" cy="50" r="14" fill={s} />
            <path d="M 50 10 L 50 36 M 50 64 L 50 90 M 15 30 L 36 42 M 85 30 L 64 42 M 15 70 L 36 58 M 85 70 L 64 58" stroke={a} strokeWidth="3" />
            <circle cx="50" cy="10" r="4" fill={a} />
            <circle cx="50" cy="90" r="4" fill={a} />
            <circle cx="15" cy="30" r="4" fill={a} />
            <circle cx="85" cy="30" r="4" fill={a} />
          </g>
        );

      case 'tech-quantum-cube':
        return (
          <g>
            {/* 3D Isometric Wireframe Cube */}
            <polygon points="50,12 85,32 85,68 50,88 15,68 15,32" fill="none" stroke={p} strokeWidth="4" />
            <line x1="50" y1="12" x2="50" y2="88" stroke={s} strokeWidth="3" />
            <line x1="15" y1="32" x2="50" y2="50" stroke={s} strokeWidth="3" />
            <line x1="85" y1="32" x2="50" y2="50" stroke={s} strokeWidth="3" />
            <circle cx="50" cy="50" r="8" fill={a} />
          </g>
        );

      case 'tech-neon-shield':
        return (
          <g>
            <polygon points="50,10 88,28 88,60 50,90 12,60 12,28" fill={p} opacity="0.2" />
            <polygon points="50,10 88,28 88,60 50,90 12,60 12,28" fill="none" stroke={p} strokeWidth="4" />
            <polygon points="50,22 76,36 76,56 50,78 24,56 24,36" fill="none" stroke={a} strokeWidth="3" />
            <circle cx="50" cy="48" r="7" fill={s} />
          </g>
        );

      case 'tech-orbital-node':
        return (
          <g>
            <circle cx="50" cy="50" r="36" fill="none" stroke={p} strokeWidth="3" strokeDasharray="16 8" />
            <ellipse cx="50" cy="50" rx="36" ry="14" fill="none" stroke={s} strokeWidth="3" transform="rotate(45 50 50)" />
            <ellipse cx="50" cy="50" rx="36" ry="14" fill="none" stroke={a} strokeWidth="3" transform="rotate(-45 50 50)" />
            <circle cx="50" cy="50" r="10" fill={p} />
            <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
          </g>
        );

      // --- LUXURY / VINTAGE STYLES ---
      case 'luxury-crown-laurel':
        return (
          <g>
            {/* Golden Crown */}
            <path d="M 22 55 L 30 30 L 42 44 L 50 20 L 58 44 L 70 30 L 78 55 Z" fill={p} stroke={a} strokeWidth="2" />
            <circle cx="30" cy="28" r="3" fill={a} />
            <circle cx="50" cy="18" r="4" fill={a} />
            <circle cx="70" cy="28" r="3" fill={a} />
            {/* Laurel Leaf Wreath */}
            <path d="M 18 55 C 18 78 35 88 50 88 C 65 88 82 78 82 55" fill="none" stroke={s} strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="88" r="4" fill={a} />
          </g>
        );

      case 'luxury-monogram-seal':
        return (
          <g>
            <circle cx="50" cy="50" r="42" fill={p} opacity="0.15" />
            <circle cx="50" cy="50" r="38" fill="none" stroke={p} strokeWidth="4" />
            <circle cx="50" cy="50" r="32" fill="none" stroke={a} strokeWidth="2" strokeDasharray="4 3" />
            <path d="M 32 35 L 50 22 L 68 35 V 65 L 50 78 L 32 65 Z" fill={s} opacity="0.9" />
            <circle cx="50" cy="50" r="8" fill={a} />
          </g>
        );

      case 'luxury-shield-lion':
        return (
          <g>
            <path d="M 50 12 L 82 26 V 52 C 82 72 68 84 50 90 C 32 84 18 72 18 52 V 26 Z" fill={p} />
            <path d="M 50 18 L 76 30 V 50 C 76 67 64 77 50 82 C 36 77 24 67 24 50 V 30 Z" fill={s} />
            {/* Stylized Crown / Crest Emblem */}
            <polygon points="50,30 56,42 70,42 59,50 63,64 50,56 37,64 41,50 30,42 44,42" fill={a} />
          </g>
        );

      case 'luxury-royal-crest':
        return (
          <g>
            <polygon points="50,10 62,24 80,20 80,38 94,50 80,62 80,80 62,76 50,90 38,76 20,80 20,62 6,50 20,38 20,20 38,24" fill={p} />
            <circle cx="50" cy="50" r="24" fill={s} />
            <circle cx="50" cy="50" r="18" fill="none" stroke={a} strokeWidth="3" />
            <circle cx="50" cy="50" r="6" fill={a} />
          </g>
        );

      // --- DEFAULT / MINIMALIST STYLES ---
      case 'circle-cross':
      default:
        return (
          <g>
            <circle cx="50" cy="50" r="40" fill={p} opacity="0.15" />
            <circle cx="50" cy="50" r="32" fill="none" stroke={p} strokeWidth="6" />
            <path d="M50 25 V75 M25 50 H75" stroke={a} strokeWidth="7" strokeLinecap="round" />
            <circle cx="50" cy="50" r="8" fill={s} />
          </g>
        );
    }
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2 font-outfit">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Professional Vector Logo Concepts
        </h3>
        <span className="text-xs text-slate-400">4 Scalable High-Res Vector Marks</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {logos.map((logo) => (
          <div
            key={logo.id}
            className="bg-[#111827] border border-amber-500/20 rounded-3xl p-6 flex flex-col items-center justify-between gap-6 group hover:border-amber-500/50 transition-all hover:shadow-xl hover:shadow-amber-500/10"
          >
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-bold">
                {logo.styleTag}
              </span>
              <span>{logo.variantName}</span>
            </div>

            {/* Logo Rendering Preview */}
            <div className="w-full bg-[#0a0d14] rounded-2xl p-8 flex flex-col items-center justify-center gap-5 border border-slate-800/80">
              <svg
                id={`svg-${logo.id}`}
                viewBox="0 0 100 100"
                className="w-28 h-28 drop-shadow-xl transition-transform group-hover:scale-105"
              >
                {renderSvgMark(logo)}
              </svg>
              <div className="text-center space-y-0.5">
                <span className="text-2xl font-bold text-white tracking-tight font-outfit block">
                  {companyName}
                </span>
                {tagline && (
                  <span className="text-xs text-slate-400 block tracking-wider uppercase">
                    {tagline}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="w-full flex gap-3">
              <button
                onClick={() => handleDownload(logo)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all"
              >
                {downloadedId === logo.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">SVG Downloaded</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Scalable SVG</span>
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
