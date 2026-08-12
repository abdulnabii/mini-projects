'use client';

import { LogoConcept } from '@/types';
import { Download, Sparkles, Check, Moon, Sun, Layers, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
  logos: LogoConcept[];
  companyName: string;
  tagline: string;
}

type CardBgTheme = 'dark' | 'light' | 'gold' | 'cyber';

export default function LogoGallery({ logos, companyName, tagline }: Props) {
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [downloadingPngId, setDownloadingPngId] = useState<string | null>(null);
  const [bgThemes, setBgThemes] = useState<Record<string, CardBgTheme>>({});

  const toggleBgTheme = (logoId: string, theme: CardBgTheme) => {
    setBgThemes((prev) => ({ ...prev, [logoId]: theme }));
  };

  const handleDownloadSvg = (logo: LogoConcept) => {
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

  const handleDownloadPng = (logo: LogoConcept) => {
    setDownloadingPngId(logo.id);
    const svgElement = document.getElementById(`svg-${logo.id}`) as SVGElement | null;
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (ctx) {
        // Draw dark background card canvas
        ctx.fillStyle = '#0a0d14';
        ctx.fillRect(0, 0, 1200, 1200);
        ctx.drawImage(img, 200, 200, 800, 800);

        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${companyName.toLowerCase().replace(/\s+/g, '-')}-${logo.id}-2K.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      setDownloadingPngId(null);
    };

    img.src = url;
  };

  const renderSvgMark = (logo: LogoConcept) => {
    const p = logo.primaryColor;
    const s = logo.secondaryColor;
    const a = logo.accentColor;

    switch (logo.svgShape) {
      // ==========================================
      // 🎌 ANIME / MASCOT HIGH-DETAIL EMBLEMS
      // ==========================================
      case 'anime-kitsune-mask':
        return (
          <g>
            <defs>
              <linearGradient id={`grad-kit-p-${logo.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={p} />
                <stop offset="100%" stopColor={s} />
              </linearGradient>
              <linearGradient id={`grad-kit-a-${logo.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={a} />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
              <filter id={`glow-${logo.id}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Sun Aura Background */}
            <circle cx="50" cy="50" r="44" fill={p} opacity="0.12" />
            <circle cx="50" cy="50" r="38" fill="none" stroke={a} strokeWidth="1.5" strokeDasharray="6 3" />
            {/* Flame Ears */}
            <path d="M 22 42 L 32 8 C 38 20 42 28 44 34 Z" fill={`url(#grad-kit-p-${logo.id})`} />
            <path d="M 78 42 L 68 8 C 62 20 58 28 56 34 Z" fill={`url(#grad-kit-p-${logo.id})`} />
            <path d="M 25 38 L 32 16 L 39 32 Z" fill={a} />
            <path d="M 75 38 L 68 16 L 61 32 Z" fill={a} />
            {/* Mask Outline */}
            <path
              d="M 24 36 C 24 66 38 88 50 92 C 62 88 76 66 76 36 C 76 32 64 34 50 34 C 36 34 24 32 24 36 Z"
              fill="#0d1118"
              stroke={`url(#grad-kit-p-${logo.id})`}
              strokeWidth="3.5"
              filter={`url(#glow-${logo.id})`}
            />
            {/* Red Anime Eye Slits */}
            <path d="M 28 48 C 35 42 43 46 45 49 C 41 54 34 54 28 48 Z" fill={p} />
            <path d="M 72 48 C 65 42 57 46 55 49 C 59 54 66 54 72 48 Z" fill={p} />
            <circle cx="37" cy="48" r="2.5" fill="#FFFFFF" />
            <circle cx="63" cy="48" r="2.5" fill="#FFFFFF" />
            {/* Forehead Sun Jewel */}
            <circle cx="50" cy="40" r="5" fill={a} />
            <path d="M 50 24 L 50 32 M 42 28 L 58 28" stroke={a} strokeWidth="2.5" strokeLinecap="round" />
            {/* Whisker Markings */}
            <path d="M 26 60 Q 34 62 40 60 M 24 68 Q 33 70 38 67" stroke={p} strokeWidth="3" strokeLinecap="round" />
            <path d="M 74 60 Q 66 62 60 60 M 76 68 Q 67 70 62 67" stroke={p} strokeWidth="3" strokeLinecap="round" />
            {/* Snout Details */}
            <polygon points="47,72 53,72 50,77" fill={a} />
          </g>
        );

      case 'anime-mecha-star':
        return (
          <g>
            <defs>
              <linearGradient id={`grad-mech-${logo.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={p} />
                <stop offset="50%" stopColor={s} />
                <stop offset="100%" stopColor={a} />
              </linearGradient>
            </defs>
            {/* Cyber Wing Armor */}
            <polygon points="50,6 66,28 94,28 72,50 82,82 50,62 18,82 28,50 6,28 34,28" fill={`url(#grad-mech-${logo.id})`} />
            <polygon points="50,14 62,32 84,32 67,48 74,72 50,56 26,72 33,48 16,32 38,32" fill="#0a0d14" stroke={a} strokeWidth="2" />
            {/* Mecha Core Star */}
            <polygon points="50,22 57,36 72,36 60,46 65,60 50,50 35,60 40,46 28,36 43,36" fill={a} />
            <circle cx="50" cy="46" r="6" fill="#FFFFFF" />
            {/* Laser Line Details */}
            <line x1="50" y1="6" x2="50" y2="22" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="18" y1="82" x2="33" y2="60" stroke={p} strokeWidth="2" />
            <line x1="82" y1="82" x2="67" y2="60" stroke={p} strokeWidth="2" />
          </g>
        );

      case 'anime-cyber-ninja':
        return (
          <g>
            {/* Energy Ring */}
            <circle cx="50" cy="50" r="40" fill="none" stroke={s} strokeWidth="3" strokeDasharray="8 4" />
            <circle cx="50" cy="50" r="44" fill="none" stroke={a} strokeWidth="1.5" opacity="0.6" />
            {/* 4-Point Shuriken Blades */}
            <path d="M 50 8 L 62 38 L 92 50 L 62 62 L 50 92 L 38 62 L 8 50 L 38 38 Z" fill={p} stroke={a} strokeWidth="1.5" />
            <path d="M 50 18 L 57 42 L 82 50 L 57 58 L 50 82 L 43 58 L 18 50 L 43 42 Z" fill={a} />
            <polygon points="50,30 54,44 68,50 54,56 50,70 46,56 32,50 46,44" fill="#0a0d14" />
            <circle cx="50" cy="50" r="8" fill={p} />
            <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
          </g>
        );

      case 'anime-flame-crest':
        return (
          <g>
            <defs>
              <linearGradient id={`grad-flame-${logo.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={p} />
                <stop offset="50%" stopColor={s} />
                <stop offset="100%" stopColor={a} />
              </linearGradient>
            </defs>
            {/* Multi-Layer Power Flames */}
            <path d="M 50 6 C 68 24 88 36 88 64 C 88 84 72 94 50 94 C 28 94 12 84 12 64 C 12 36 32 24 50 6 Z" fill={`url(#grad-flame-${logo.id})`} />
            <path d="M 50 20 C 62 34 76 44 76 64 C 76 76 65 84 50 84 C 35 84 24 76 24 64 C 24 44 38 34 50 20 Z" fill="#0a0d14" />
            <path d="M 50 32 C 58 42 66 50 66 64 C 66 72 59 78 50 78 C 41 78 34 72 34 64 C 34 50 42 42 50 32 Z" fill={a} />
            <circle cx="50" cy="64" r="6" fill="#FFFFFF" />
          </g>
        );

      // ==========================================
      // 💼 CORPORATE / PROFESSIONAL AGENCY CRESTS
      // ==========================================
      case 'pro-interlocking-m':
        return (
          <g>
            <defs>
              <linearGradient id={`grad-p1-${logo.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={p} />
                <stop offset="100%" stopColor={s} />
              </linearGradient>
              <linearGradient id={`grad-p2-${logo.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={s} />
                <stop offset="100%" stopColor={a} />
              </linearGradient>
            </defs>
            {/* 3D Interlocking Ribbon Monogram */}
            <path d="M 14 80 L 14 20 L 40 58 L 64 20 L 64 80 L 48 80 L 48 42 L 34 62 L 20 42 L 20 80 Z" fill={`url(#grad-p1-${logo.id})`} />
            <path d="M 36 80 L 36 20 L 60 58 L 86 20 L 86 80 L 70 80 L 70 42 L 56 62 L 42 42 L 42 80 Z" fill={`url(#grad-p2-${logo.id})`} opacity="0.9" />
          </g>
        );

      case 'pro-prism-diamond':
        return (
          <g>
            <defs>
              <linearGradient id={`dia1-${logo.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={p} />
                <stop offset="100%" stopColor={a} />
              </linearGradient>
            </defs>
            {/* 6-Facet Polished Prism Diamond */}
            <polygon points="50,8 84,30 50,92 16,30" fill={`url(#dia1-${logo.id})`} />
            <polygon points="50,8 84,30 50,52" fill={s} opacity="0.9" />
            <polygon points="50,8 16,30 50,52" fill={a} opacity="0.75" />
            <polygon points="50,52 84,30 50,92" fill={p} opacity="0.85" />
            <polygon points="50,52 16,30 50,92" fill="#FFFFFF" opacity="0.25" />
            <circle cx="50" cy="30" r="3" fill="#FFFFFF" />
          </g>
        );

      case 'pro-corporate-crest':
        return (
          <g>
            <path d="M 50 10 L 84 24 V 52 C 84 74 68 86 50 92 C 32 86 16 74 16 52 V 24 Z" fill={p} />
            <path d="M 50 16 L 78 28 V 50 C 78 68 64 78 50 84 C 36 78 22 68 22 50 V 28 Z" fill="#0d1118" />
            {/* Architectural Pillars */}
            <path d="M 32 34 H 42 V 68 H 32 Z M 45 34 H 55 V 68 H 45 Z M 58 34 H 68 V 68 H 58 Z" fill={a} />
            <path d="M 28 30 H 72 V 34 H 28 Z M 26 70 H 74 V 74 H 26 Z" fill={s} />
          </g>
        );

      case 'pro-infinity-node':
        return (
          <g>
            <path
              d="M 30 50 C 15 32 15 68 30 50 C 45 32 55 68 70 50 C 85 32 85 68 70 50 C 55 32 45 68 30 50 Z"
              fill="none"
              stroke={p}
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 30 50 C 15 32 15 68 30 50 C 45 32 55 68 70 50 C 85 32 85 68 70 50 C 55 32 45 68 30 50 Z"
              fill="none"
              stroke={a}
              strokeWidth="4"
              strokeDasharray="14 7"
            />
          </g>
        );

      // ==========================================
      // ⚡ TECH / CYBERPUNK FUTURISTIC MARKS
      // ==========================================
      case 'tech-circuit-matrix':
        return (
          <g>
            <polygon points="50,8 88,30 88,70 50,92 12,70 12,30" fill="none" stroke={p} strokeWidth="5" />
            <circle cx="50" cy="50" r="16" fill={s} />
            <path d="M 50 8 L 50 34 M 50 66 L 50 92 M 12 30 L 34 43 M 88 30 L 66 43 M 12 70 L 34 57 M 88 70 L 66 57" stroke={a} strokeWidth="3.5" />
            <circle cx="50" cy="8" r="5" fill={a} />
            <circle cx="50" cy="92" r="5" fill={a} />
            <circle cx="12" cy="30" r="5" fill={a} />
            <circle cx="88" cy="30" r="5" fill={a} />
          </g>
        );

      case 'tech-quantum-cube':
        return (
          <g>
            <polygon points="50,10 88,32 88,68 50,90 12,68 12,32" fill="none" stroke={p} strokeWidth="4" />
            <line x1="50" y1="10" x2="50" y2="90" stroke={s} strokeWidth="3" />
            <line x1="12" y1="32" x2="50" y2="50" stroke={s} strokeWidth="3" />
            <line x1="88" y1="32" x2="50" y2="50" stroke={s} strokeWidth="3" />
            <circle cx="50" cy="50" r="10" fill={a} />
            <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
          </g>
        );

      case 'tech-neon-shield':
        return (
          <g>
            <polygon points="50,8 90,26 90,62 50,92 10,62 10,26" fill={p} opacity="0.15" />
            <polygon points="50,8 90,26 90,62 50,92 10,62 10,26" fill="none" stroke={p} strokeWidth="4" />
            <polygon points="50,20 78,34 78,56 50,78 22,56 22,34" fill="none" stroke={a} strokeWidth="3" />
            <circle cx="50" cy="46" r="8" fill={s} />
          </g>
        );

      case 'tech-orbital-node':
        return (
          <g>
            <circle cx="50" cy="50" r="38" fill="none" stroke={p} strokeWidth="3" strokeDasharray="18 6" />
            <ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke={s} strokeWidth="3" transform="rotate(45 50 50)" />
            <ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke={a} strokeWidth="3" transform="rotate(-45 50 50)" />
            <circle cx="50" cy="50" r="12" fill={p} />
            <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
          </g>
        );

      // ==========================================
      // 🏛️ LUXURY / VINTAGE ROYAL EMBLEMS
      // ==========================================
      case 'luxury-crown-laurel':
        return (
          <g>
            <defs>
              <linearGradient id={`gold-${logo.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            {/* 24k Gold Crown */}
            <path d="M 20 54 L 28 26 L 42 42 L 50 16 L 58 42 L 72 26 L 80 54 Z" fill={`url(#gold-${logo.id})`} stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="28" cy="24" r="3.5" fill="#FFFFFF" />
            <circle cx="50" cy="14" r="4.5" fill="#FFFFFF" />
            <circle cx="72" cy="24" r="3.5" fill="#FFFFFF" />
            <rect x="20" y="54" width="60" height="8" rx="2" fill={s} />
            {/* Imperial Laurel Wreath */}
            <path d="M 16 50 C 16 78 34 88 50 88 C 66 88 84 78 84 50" fill="none" stroke={`url(#gold-${logo.id})`} strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="88" r="4" fill={a} />
          </g>
        );

      case 'luxury-monogram-seal':
        return (
          <g>
            <circle cx="50" cy="50" r="44" fill={p} opacity="0.15" />
            <circle cx="50" cy="50" r="40" fill="none" stroke={p} strokeWidth="4" />
            <circle cx="50" cy="50" r="34" fill="none" stroke={a} strokeWidth="2" strokeDasharray="5 3" />
            <path d="M 30 34 L 50 20 L 70 34 V 66 L 50 80 L 30 66 Z" fill={s} opacity="0.9" />
            <circle cx="50" cy="50" r="9" fill={a} />
            <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
          </g>
        );

      case 'luxury-shield-lion':
        return (
          <g>
            <path d="M 50 10 L 84 24 V 52 C 84 74 68 86 50 92 C 32 86 16 74 16 52 V 24 Z" fill={p} />
            <path d="M 50 16 L 78 28 V 50 C 78 68 64 78 50 84 C 36 78 22 68 22 50 V 28 Z" fill={s} />
            <polygon points="50,28 57,40 72,40 60,48 64,62 50,54 36,62 40,48 28,40 43,40" fill={a} />
          </g>
        );

      case 'luxury-royal-crest':
        return (
          <g>
            <polygon points="50,8 62,22 82,18 82,36 96,50 82,64 82,82 62,78 50,92 38,78 18,82 18,64 4,50 18,36 18,18 38,22" fill={p} />
            <circle cx="50" cy="50" r="26" fill={s} />
            <circle cx="50" cy="50" r="20" fill="none" stroke={a} strokeWidth="3" />
            <circle cx="50" cy="50" r="7" fill={a} />
          </g>
        );

      // --- DEFAULT MINIMALIST STYLES ---
      case 'circle-cross':
      default:
        return (
          <g>
            <circle cx="50" cy="50" r="42" fill={p} opacity="0.15" />
            <circle cx="50" cy="50" r="34" fill="none" stroke={p} strokeWidth="6" />
            <path d="M50 22 V78 M22 50 H78" stroke={a} strokeWidth="7" strokeLinecap="round" />
            <circle cx="50" cy="50" r="9" fill={s} />
          </g>
        );
    }
  };

  const getThemeBgStyle = (theme: CardBgTheme) => {
    switch (theme) {
      case 'light':
        return 'bg-white border-slate-300 text-slate-900';
      case 'gold':
        return 'bg-gradient-to-br from-amber-950 via-[#1a140a] to-[#0a0804] border-amber-500/40 text-amber-100';
      case 'cyber':
        return 'bg-gradient-to-br from-slate-950 via-[#070e17] to-[#091522] border-cyan-500/40 text-cyan-100';
      case 'dark':
      default:
        return 'bg-[#0a0d14] border-slate-800 text-white';
    }
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2 font-outfit">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Agency-Grade Vector Logo Suite
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Rendered in scalable 2K multi-stop vectors with theme studio preview &amp; 1-click PNG/SVG download.
          </p>
        </div>
        <span className="text-xs text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
          4 High-Res Logo Marks
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {logos.map((logo) => {
          const currentTheme = bgThemes[logo.id] || 'dark';

          return (
            <div
              key={logo.id}
              className="bg-[#111827] border border-amber-500/20 rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-between gap-6 group hover:border-amber-500/50 transition-all hover:shadow-2xl hover:shadow-amber-500/10"
            >
              {/* Card Header & Theme Controls */}
              <div className="w-full flex items-center justify-between text-xs">
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-bold">
                  {logo.styleTag}
                </span>

                <div className="flex items-center gap-1 bg-[#0a0d14] p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => toggleBgTheme(logo.id, 'dark')}
                    title="Dark Theme"
                    className={`p-1.5 rounded-lg transition-all ${currentTheme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBgTheme(logo.id, 'light')}
                    title="Light Theme"
                    className={`p-1.5 rounded-lg transition-all ${currentTheme === 'light' ? 'bg-amber-400 text-black font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBgTheme(logo.id, 'gold')}
                    title="Luxury Gold Theme"
                    className={`p-1.5 rounded-lg transition-all ${currentTheme === 'gold' ? 'bg-amber-500 text-black font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBgTheme(logo.id, 'cyber')}
                    title="Cyber Theme"
                    className={`p-1.5 rounded-lg transition-all ${currentTheme === 'cyber' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Logo Rendering Preview Canvas */}
              <div
                className={`w-full rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center gap-6 border transition-all duration-300 shadow-xl ${getThemeBgStyle(
                  currentTheme
                )}`}
              >
                <svg
                  id={`svg-${logo.id}`}
                  viewBox="0 0 100 100"
                  className="w-32 h-32 sm:w-36 sm:h-36 drop-shadow-2xl transition-transform group-hover:scale-105"
                >
                  {renderSvgMark(logo)}
                </svg>
                <div className="text-center space-y-1">
                  <span
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-outfit block ${
                      currentTheme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {companyName}
                  </span>
                  {tagline && (
                    <span
                      className={`text-xs font-mono block tracking-widest uppercase ${
                        currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {tagline}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions: Download SVG & 2K PNG */}
              <div className="w-full flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleDownloadSvg(logo)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all"
                >
                  {downloadedId === logo.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">SVG Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Vector SVG</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownloadPng(logo)}
                  disabled={downloadingPngId === logo.id}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/50 text-xs font-bold transition-all disabled:opacity-50"
                >
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>{downloadingPngId === logo.id ? 'Exporting...' : 'Export 2K PNG'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
