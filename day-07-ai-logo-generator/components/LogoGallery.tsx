'use client';

import { LogoConcept } from '@/types';
import { Download, Sparkles, Check, Moon, Sun, Layers, Image as ImageIcon, LayoutGrid } from 'lucide-react';
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

  const initial = (companyName.trim().charAt(0) || 'K').toUpperCase();

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
    canvas.width = 1600;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#0a0d14';
        ctx.fillRect(0, 0, 1600, 1600);
        ctx.drawImage(img, 200, 200, 1200, 1200);

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

  const renderAgencyLogoMark = (logo: LogoConcept, index: number) => {
    const p = logo.primaryColor;
    const s = logo.secondaryColor;
    const a = logo.accentColor;
    const id = logo.id;

    // Determine layout mode based on index (0: Stacked Badge, 1: Monogram Lockup, 2: Horizontal Pro, 3: Seal Crest)
    const layoutMode = index % 4;

    switch (logo.svgShape) {
      // =========================================================
      // 🎌 ANIME / MASCOT HIGH-FIDELITY INITIAL MONOGRAM EMBLEMS
      // =========================================================
      case 'anime-kitsune-mask':
      case 'anime-mecha-star':
      case 'anime-cyber-ninja':
      case 'anime-flame-crest':
        return (
          <g>
            <defs>
              <linearGradient id={`anim-grad1-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={p} />
                <stop offset="50%" stopColor={s} />
                <stop offset="100%" stopColor={a} />
              </linearGradient>
              <linearGradient id={`anim-grad2-${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={a} />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
              <filter id={`anim-glow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {layoutMode === 2 ? (
              /* HORIZONTAL ANIME LOCKUP */
              <g>
                <circle cx="35" cy="50" r="28" fill={`url(#anim-grad1-${id})`} opacity="0.2" />
                <polygon points="35,18 42,34 58,34 46,44 50,60 35,50 20,60 24,44 12,34 28,34" fill={`url(#anim-grad1-${id})`} />
                <circle cx="35" cy="50" r="16" fill="#0d1118" stroke={a} strokeWidth="2.5" />
                <text x="35" y="56" textAnchor="middle" fill={a} fontSize="20" fontWeight="900" fontFamily="var(--font-outfit), sans-serif">
                  {initial}
                </text>
                <text x="75" y="46" fill="#FFFFFF" fontSize="18" fontWeight="800" fontFamily="var(--font-outfit), sans-serif">
                  {companyName}
                </text>
                <text x="75" y="60" fill={a} fontSize="8" fontWeight="700" letterSpacing="3" fontFamily="var(--font-mono), monospace">
                  {(tagline || 'ANIME GAMING UNIVERSE').toUpperCase()}
                </text>
              </g>
            ) : (
              /* STACKED ANIME EMBLEM LOCKUP */
              <g>
                {/* Sun Disk Background */}
                <circle cx="50" cy="38" r="32" fill={`url(#anim-grad1-${id})`} opacity="0.18" />
                <circle cx="50" cy="38" r="28" fill="none" stroke={a} strokeWidth="2" strokeDasharray="8 4" filter={`url(#anim-glow-${id})`} />

                {/* Fox Ears / Mecha Horns */}
                <path d="M 24 30 L 34 8 L 44 26 Z" fill={p} />
                <path d="M 76 30 L 66 8 L 56 26 Z" fill={p} />
                <path d="M 27 28 L 34 14 L 40 25 Z" fill={a} />
                <path d="M 73 28 L 66 14 L 60 25 Z" fill={a} />

                {/* Main Crest Mask Container */}
                <path
                  d="M 26 28 C 26 54 38 70 50 72 C 62 70 74 54 74 28 C 74 24 62 26 50 26 C 38 26 26 24 26 28 Z"
                  fill="#0d1118"
                  stroke={`url(#grad1-${id})`}
                  strokeWidth="3.5"
                />

                {/* Initial Letter Monogram */}
                <text
                  x="50"
                  y="53"
                  textAnchor="middle"
                  fill={`url(#anim-grad2-${id})`}
                  fontSize="28"
                  fontWeight="900"
                  fontFamily="var(--font-outfit), sans-serif"
                  filter={`url(#anim-glow-${id})`}
                >
                  {initial}
                </text>

                {/* Forehead Orb & Whiskers */}
                <circle cx="50" cy="32" r="3.5" fill={a} />
                <path d="M 30 48 Q 37 50 42 48 M 28 54 Q 36 56 40 53" stroke={p} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 70 48 Q 63 50 58 48 M 72 54 Q 64 56 60 53" stroke={p} strokeWidth="2.5" strokeLinecap="round" />

                {/* Integrated Typography */}
                <text x="50" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800" fontFamily="var(--font-outfit), sans-serif">
                  {companyName}
                </text>
                <text x="50" y="92" textAnchor="middle" fill={a} fontSize="7" fontWeight="700" letterSpacing="2.5" fontFamily="var(--font-mono), monospace">
                  {(tagline || 'ANIME GAMING STUDIO').toUpperCase()}
                </text>
              </g>
            )}
          </g>
        );

      // =========================================================
      // 💼 CORPORATE / PROFESSIONAL 3D MONOGRAMS
      // =========================================================
      case 'pro-interlocking-m':
      case 'pro-prism-diamond':
      case 'pro-corporate-crest':
      case 'pro-infinity-node':
        return (
          <g>
            <defs>
              <linearGradient id={`pro-grad1-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={p} />
                <stop offset="100%" stopColor={s} />
              </linearGradient>
              <linearGradient id={`pro-grad2-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={s} />
                <stop offset="100%" stopColor={a} />
              </linearGradient>
            </defs>

            {layoutMode === 2 ? (
              /* HORIZONTAL CORPORATE EXECUTIVE LOCKUP */
              <g>
                <polygon points="12,22 42,22 52,50 42,78 12,78" fill={`url(#pro-grad1-${id})`} />
                <polygon points="26,30 48,30 58,50 48,70 26,70" fill="#0d1118" />
                <text x="35" y="58" textAnchor="middle" fill={`url(#pro-grad2-${id})`} fontSize="24" fontWeight="900" fontFamily="var(--font-outfit), sans-serif">
                  {initial}
                </text>
                {/* Vertical Divider */}
                <line x1="62" y1="24" x2="62" y2="76" stroke="#334155" strokeWidth="2" />
                <text x="70" y="46" fill="#FFFFFF" fontSize="16" fontWeight="800" fontFamily="var(--font-outfit), sans-serif">
                  {companyName}
                </text>
                <text x="70" y="60" fill={a} fontSize="7.5" fontWeight="700" letterSpacing="2.5" fontFamily="var(--font-mono), monospace">
                  {(tagline || 'ENTERPRISE SOLUTIONS').toUpperCase()}
                </text>
              </g>
            ) : (
              /* STACKED CORPORATE PRISM EMBLEM */
              <g>
                <polygon points="50,6 82,24 82,58 50,76 18,58 18,24" fill={`url(#pro-grad1-${id})`} opacity="0.9" />
                <polygon points="50,14 74,28 74,54 50,68 26,54 26,28" fill="#0d1118" stroke={a} strokeWidth="1.5" />

                <text x="50" y="49" textAnchor="middle" fill={`url(#pro-grad2-${id})`} fontSize="28" fontWeight="900" fontFamily="var(--font-outfit), sans-serif">
                  {initial}
                </text>

                {/* Facet Lines */}
                <line x1="50" y1="6" x2="50" y2="14" stroke="#FFFFFF" strokeWidth="2" />
                <line x1="18" y1="58" x2="26" y2="54" stroke="#FFFFFF" strokeWidth="2" />
                <line x1="82" y1="58" x2="74" y2="54" stroke="#FFFFFF" strokeWidth="2" />

                {/* Integrated Typography */}
                <text x="50" y="84" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800" fontFamily="var(--font-outfit), sans-serif">
                  {companyName}
                </text>
                <text x="50" y="93" textAnchor="middle" fill={a} fontSize="7" fontWeight="700" letterSpacing="2" fontFamily="var(--font-mono), monospace">
                  {(tagline || 'GLOBAL BRAND IDENTITY').toUpperCase()}
                </text>
              </g>
            )}
          </g>
        );

      // =========================================================
      // ⚡ TECH / CYBERPUNK FUTURISTIC HUD MARKS
      // =========================================================
      case 'tech-circuit-matrix':
      case 'tech-quantum-cube':
      case 'tech-neon-shield':
      case 'tech-orbital-node':
        return (
          <g>
            <defs>
              <linearGradient id={`tech-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={p} />
                <stop offset="100%" stopColor={a} />
              </linearGradient>
              <filter id={`tech-glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Cyber Ring */}
            <circle cx="50" cy="38" r="32" fill="none" stroke={p} strokeWidth="3" strokeDasharray="14 6" />
            <polygon points="50,6 84,25 84,62 50,81 16,62 16,25" fill="none" stroke={a} strokeWidth="1.5" opacity="0.6" />

            {/* Glowing Monogram Center */}
            <circle cx="50" cy="38" r="22" fill="#060911" stroke={`url(#tech-grad-${id})`} strokeWidth="3" filter={`url(#tech-glow-${id})`} />

            <text x="50" y="47" textAnchor="middle" fill={a} fontSize="26" fontWeight="900" fontFamily="var(--font-outfit), sans-serif">
              {initial}
            </text>

            {/* Circuit Nodes */}
            <circle cx="50" cy="6" r="3.5" fill={a} />
            <circle cx="84" cy="25" r="3.5" fill={a} />
            <circle cx="16" cy="25" r="3.5" fill={a} />

            {/* Integrated Typography */}
            <text x="50" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800" fontFamily="var(--font-outfit), sans-serif">
              {companyName}
            </text>
            <text x="50" y="95" textAnchor="middle" fill={a} fontSize="7" fontWeight="700" letterSpacing="3" fontFamily="var(--font-mono), monospace">
              {(tagline || 'QUANTUM AI SYSTEMS').toUpperCase()}
            </text>
          </g>
        );

      // =========================================================
      // 🏛️ LUXURY / VINTAGE GOLDEN ROYAL SEALS
      // =========================================================
      case 'luxury-crown-laurel':
      case 'luxury-monogram-seal':
      case 'luxury-shield-lion':
      case 'luxury-royal-crest':
      default:
        return (
          <g>
            <defs>
              <linearGradient id={`gold-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>

            {/* 24k Gold Crown */}
            <path d="M 28 22 L 34 8 L 44 18 L 50 4 L 56 18 L 66 8 L 72 22 Z" fill={`url(#gold-grad-${id})`} />
            <circle cx="34" cy="6" r="2.5" fill="#FFFFFF" />
            <circle cx="50" cy="2" r="3.5" fill="#FFFFFF" />
            <circle cx="66" cy="6" r="2.5" fill="#FFFFFF" />

            {/* Imperial Laurel Leaf Wreath */}
            <path d="M 20 44 C 20 68 34 76 50 76 C 66 76 80 68 80 44" fill="none" stroke={`url(#gold-grad-${id})`} strokeWidth="3.5" strokeLinecap="round" />

            {/* Royal Monogram Shield */}
            <path d="M 32 24 L 50 14 L 68 24 V 52 C 68 64 58 72 50 75 C 42 72 32 64 32 52 Z" fill="#0d1118" stroke={`url(#gold-grad-${id})`} strokeWidth="2.5" />

            <text x="50" y="52" textAnchor="middle" fill={`url(#gold-grad-${id})`} fontSize="26" fontWeight="900" fontFamily="var(--font-outfit), sans-serif">
              {initial}
            </text>

            {/* Integrated Typography */}
            <text x="50" y="85" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800" letterSpacing="1" fontFamily="var(--font-outfit), sans-serif">
              {companyName}
            </text>
            <text x="50" y="93" textAnchor="middle" fill="#F59E0B" fontSize="6.5" fontWeight="700" letterSpacing="2.5" fontFamily="var(--font-mono), monospace">
              {(tagline || 'HAUTE COUTURE LUXURY').toUpperCase()}
            </text>
          </g>
        );
    }
  };

  const getThemeBgStyle = (theme: CardBgTheme) => {
    switch (theme) {
      case 'light':
        return 'bg-slate-100 border-slate-300 text-slate-900';
      case 'gold':
        return 'bg-gradient-to-br from-amber-950 via-[#1c1409] to-[#0a0703] border-amber-500/40 text-amber-100';
      case 'cyber':
        return 'bg-gradient-to-br from-slate-950 via-[#06101c] to-[#08182b] border-cyan-500/40 text-cyan-100';
      case 'dark':
      default:
        return 'bg-[#090c13] border-slate-800 text-white';
    }
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2 font-outfit">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Agency-Grade Monogram &amp; Emblem Suite
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Custom sculpted monogram initial <strong className="text-amber-400 font-bold">&quot;{initial}&quot;</strong> with integrated agency typography &amp; 2K PNG export.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            Initial &quot;{initial}&quot; Monogram Lockups
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {logos.map((logo, idx) => {
          const currentTheme = bgThemes[logo.id] || 'dark';

          return (
            <div
              key={logo.id}
              className="bg-[#111827] border border-amber-500/20 rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-between gap-6 group hover:border-amber-500/50 transition-all hover:shadow-2xl hover:shadow-amber-500/10"
            >
              {/* Card Header Controls */}
              <div className="w-full flex items-center justify-between text-xs">
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-bold">
                  {logo.styleTag}
                </span>

                <div className="flex items-center gap-1 bg-[#0a0d14] p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => toggleBgTheme(logo.id, 'dark')}
                    title="Dark Studio"
                    className={`p-1.5 rounded-lg transition-all ${currentTheme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBgTheme(logo.id, 'light')}
                    title="Light Minimalist Studio"
                    className={`p-1.5 rounded-lg transition-all ${currentTheme === 'light' ? 'bg-amber-400 text-black font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBgTheme(logo.id, 'gold')}
                    title="Luxury Gold Studio"
                    className={`p-1.5 rounded-lg transition-all ${currentTheme === 'gold' ? 'bg-amber-500 text-black font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleBgTheme(logo.id, 'cyber')}
                    title="Cyberpunk Neon Studio"
                    className={`p-1.5 rounded-lg transition-all ${currentTheme === 'cyber' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Logo Presentation Studio Canvas */}
              <div
                className={`w-full min-h-[280px] rounded-2xl p-6 sm:p-8 flex items-center justify-center border transition-all duration-300 shadow-xl ${getThemeBgStyle(
                  currentTheme
                )}`}
              >
                <svg
                  id={`svg-${logo.id}`}
                  viewBox="0 0 100 100"
                  className="w-full max-w-[280px] h-auto drop-shadow-2xl transition-transform group-hover:scale-105"
                >
                  {renderAgencyLogoMark(logo, idx)}
                </svg>
              </div>

              {/* Actions: SVG & 2K PNG Download */}
              <div className="w-full flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleDownloadSvg(logo)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all"
                >
                  {downloadedId === logo.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Vector SVG Downloaded</span>
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
