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

  const L = (companyName.trim().charAt(0) || 'A').toUpperCase();
  const tg = (tagline || 'THE FUTURE IS NOW').toUpperCase();

  const toggleBgTheme = (logoId: string, theme: CardBgTheme) => {
    setBgThemes((prev) => ({ ...prev, [logoId]: theme }));
  };

  const handleDownloadSvg = (logo: LogoConcept) => {
    setDownloadedId(logo.id);
    setTimeout(() => setDownloadedId(null), 2000);
    const svgEl = document.getElementById(`svg-${logo.id}`);
    if (!svgEl) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svgEl)], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${companyName.toLowerCase().replace(/\s+/g, '-')}-${logo.id}.svg`;
    a.click();
  };

  const handleDownloadPng = (logo: LogoConcept) => {
    setDownloadingPngId(logo.id);
    const svgEl = document.getElementById(`svg-${logo.id}`) as SVGElement | null;
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    canvas.width = 1600; canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svgData], { type: 'image/svg+xml' }));
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#0a0d14'; ctx.fillRect(0, 0, 1600, 1600);
        ctx.drawImage(img, 100, 100, 1400, 1400);
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `${companyName.toLowerCase().replace(/\s+/g, '-')}-${logo.id}-2K.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
      setDownloadingPngId(null);
    };
    img.src = url;
  };

  // ─── DESIGN 0: SHIELD / HERALDIC CREST ───────────────────────────────────
  const renderDesign0 = (p: string, s: string, a: string, id: string) => (
    <g>
      <defs>
        <linearGradient id={`g0a-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p} /><stop offset="100%" stopColor={s} />
        </linearGradient>
        <linearGradient id={`g0b-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={a} /><stop offset="100%" stopColor={p} />
        </linearGradient>
        <filter id={`glow0-${id}`}><feGaussianBlur stdDeviation="2.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
      </defs>

      {/* Outer glow ring */}
      <ellipse cx="50" cy="46" rx="38" ry="40" fill="none" stroke={p} strokeWidth="0.8" opacity="0.3" />

      {/* Shield body */}
      <path d="M 50 8 L 82 20 L 82 50 C 82 68 66 78 50 84 C 34 78 18 68 18 50 L 18 20 Z"
        fill="#0d1118" stroke={`url(#g0a-${id})`} strokeWidth="2.5" />

      {/* Shield inner inset */}
      <path d="M 50 14 L 76 24 L 76 50 C 76 65 62 74 50 79 C 38 74 24 65 24 50 L 24 24 Z"
        fill="none" stroke={a} strokeWidth="1" opacity="0.5" />

      {/* Top crown spikes */}
      <path d="M 32 20 L 36 10 L 40 18" fill={p} opacity="0.9" />
      <path d="M 50 14 L 50 5 L 54 14" fill={a} opacity="0.9" />
      <path d="M 68 20 L 64 10 L 60 18" fill={p} opacity="0.9" />
      <circle cx="36" cy="10" r="2" fill={a} />
      <circle cx="50" cy="5" r="2.5" fill="#FFFFFF" />
      <circle cx="64" cy="10" r="2" fill={a} />

      {/* Center letter monogram */}
      <text x="50" y="58" textAnchor="middle" fill={`url(#g0b-${id})`}
        fontSize="36" fontWeight="900" fontFamily="var(--font-outfit), sans-serif"
        filter={`url(#glow0-${id})`}>{L}</text>

      {/* Horizontal rule below letter */}
      <line x1="32" y1="64" x2="68" y2="64" stroke={a} strokeWidth="1.5" opacity="0.7" />

      {/* Brand name */}
      <text x="50" y="91" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800"
        letterSpacing="1.5" fontFamily="var(--font-outfit), sans-serif">{companyName}</text>
      <text x="50" y="98" textAnchor="middle" fill={a} fontSize="6" fontWeight="700"
        letterSpacing="2.5" fontFamily="var(--font-mono), monospace">{tg.slice(0, 22)}</text>
    </g>
  );

  // ─── DESIGN 1: HEXAGONAL PRISM BADGE ─────────────────────────────────────
  const renderDesign1 = (p: string, s: string, a: string, id: string) => (
    <g>
      <defs>
        <linearGradient id={`g1a-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p} /><stop offset="100%" stopColor={s} />
        </linearGradient>
        <linearGradient id={`g1b-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={s} /><stop offset="100%" stopColor={a} />
        </linearGradient>
      </defs>

      {/* Outer hex */}
      <polygon points="50,4 84,22 84,58 50,76 16,58 16,22"
        fill={`url(#g1a-${id})`} opacity="0.9" />
      {/* Middle hex */}
      <polygon points="50,10 78,26 78,54 50,70 22,54 22,26"
        fill="#080b11" stroke={a} strokeWidth="1.2" />
      {/* Inner hex */}
      <polygon points="50,17 72,29 72,51 50,63 28,51 28,29"
        fill="none" stroke={p} strokeWidth="0.8" opacity="0.5" />

      {/* 3D facet top */}
      <polygon points="50,4 84,22 78,26 50,10 22,26 16,22"
        fill={a} opacity="0.25" />
      {/* 3D facet right */}
      <polygon points="84,22 84,58 78,54 78,26"
        fill="#FFFFFF" opacity="0.06" />

      {/* Connector lines */}
      <line x1="50" y1="4" x2="50" y2="10" stroke="#FFFFFF" strokeWidth="2" />
      <line x1="84" y1="22" x2="78" y2="26" stroke="#FFFFFF" strokeWidth="2" />
      <line x1="16" y1="58" x2="22" y2="54" stroke="#FFFFFF" strokeWidth="2" />

      {/* Center monogram */}
      <text x="50" y="50" textAnchor="middle" fill={a}
        fontSize="30" fontWeight="900" fontFamily="var(--font-outfit), sans-serif">{L}</text>

      {/* Brand footer */}
      <text x="50" y="84" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="800"
        letterSpacing="1.5" fontFamily="var(--font-outfit), sans-serif">{companyName}</text>
      <text x="50" y="92" textAnchor="middle" fill={a} fontSize="6" fontWeight="700"
        letterSpacing="2.5" fontFamily="var(--font-mono), monospace">{tg.slice(0, 22)}</text>
    </g>
  );

  // ─── DESIGN 2: CIRCULAR SEAL / STAMP ─────────────────────────────────────
  const renderDesign2 = (p: string, s: string, a: string, id: string) => (
    <g>
      <defs>
        <linearGradient id={`g2a-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p} /><stop offset="100%" stopColor={s} />
        </linearGradient>
        <linearGradient id={`g2b-${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={a} /><stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <filter id={`glow2-${id}`}><feGaussianBlur stdDeviation="3" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter>
      </defs>

      {/* Outer dashed orbit ring */}
      <circle cx="50" cy="46" r="40" fill="none" stroke={p} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.8" />
      {/* Solid ring */}
      <circle cx="50" cy="46" r="34" fill="none" stroke={`url(#g2a-${id})`} strokeWidth="3.5" />
      {/* Inner fill circle */}
      <circle cx="50" cy="46" r="27" fill="#080b11" />
      {/* Innermost accent ring */}
      <circle cx="50" cy="46" r="20" fill="none" stroke={a} strokeWidth="1" opacity="0.5" />

      {/* 8 compass tick marks */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const r = 34, angle = (deg - 90) * Math.PI / 180;
        const x1 = 50 + (r - 5) * Math.cos(angle), y1 = 46 + (r - 5) * Math.sin(angle);
        const x2 = 50 + r * Math.cos(angle), y2 = 46 + r * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={a} strokeWidth={i % 2 === 0 ? "2.5" : "1.5"} />;
      })}

      {/* Center monogram */}
      <text x="50" y="55" textAnchor="middle" fill={`url(#g2b-${id})`}
        fontSize="28" fontWeight="900" fontFamily="var(--font-outfit), sans-serif"
        filter={`url(#glow2-${id})`}>{L}</text>

      {/* Arched company name along top of circle */}
      <path id={`arc2-${id}`} d="M 16,46 A 34,34 0 0,1 84,46" fill="none" />
      <text fontSize="7" fontWeight="800" letterSpacing="3.5"
        fontFamily="var(--font-mono), monospace" fill={a}>
        <textPath href={`#arc2-${id}`} startOffset="10%">{companyName.toUpperCase()}</textPath>
      </text>

      {/* Bottom brand tagline straight */}
      <text x="50" y="91" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700"
        letterSpacing="2" fontFamily="var(--font-outfit), sans-serif">{companyName}</text>
      <text x="50" y="98" textAnchor="middle" fill={a} fontSize="5.5" fontWeight="700"
        letterSpacing="2" fontFamily="var(--font-mono), monospace">{tg.slice(0, 22)}</text>
    </g>
  );

  // ─── DESIGN 3: WORDMARK + GEOMETRIC STACKING ──────────────────────────────
  const renderDesign3 = (p: string, s: string, a: string, id: string) => (
    <g>
      <defs>
        <linearGradient id={`g3a-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={p} /><stop offset="50%" stopColor={s} /><stop offset="100%" stopColor={a} />
        </linearGradient>
        <linearGradient id={`g3b-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={a} /><stop offset="100%" stopColor={p} />
        </linearGradient>
        <clipPath id={`clip3-${id}`}>
          <rect x="10" y="25" width="40" height="52" rx="4" />
        </clipPath>
      </defs>

      {/* Left: Tall Monogram Block */}
      <rect x="8" y="20" width="42" height="58" rx="5" fill={`url(#g3a-${id})`} />
      <rect x="12" y="24" width="34" height="50" rx="3" fill="#080b11" />

      {/* Decorative bracket lines on left block */}
      <path d="M 14 26 L 14 32 M 14 68 L 14 74" stroke={p} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 44 26 L 44 32 M 44 68 L 44 74" stroke={p} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="14" y1="26" x2="20" y2="26" stroke={p} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="26" x2="44" y2="26" stroke={p} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="14" y1="74" x2="20" y2="74" stroke={p} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="74" x2="44" y2="74" stroke={p} strokeWidth="2.5" strokeLinecap="round" />

      {/* Large letter in left block */}
      <text x="29" y="58" textAnchor="middle" fill={`url(#g3b-${id})`}
        fontSize="38" fontWeight="900" fontFamily="var(--font-outfit), sans-serif">{L}</text>

      {/* Vertical divider */}
      <line x1="56" y1="24" x2="56" y2="74" stroke="#334155" strokeWidth="1.5" />

      {/* Right: Stacked wordmark */}
      <text x="60" y="42" fill="#FFFFFF" fontSize="15" fontWeight="800"
        fontFamily="var(--font-outfit), sans-serif" dominantBaseline="auto">{companyName.length > 8 ? companyName.slice(0,8) : companyName}</text>
      {companyName.length > 8 && (
        <text x="60" y="56" fill="#FFFFFF" fontSize="15" fontWeight="800"
          fontFamily="var(--font-outfit), sans-serif">{companyName.slice(8, 16)}</text>
      )}

      {/* Accent underline stripe */}
      <rect x="60" y="60" width="28" height="3" rx="1.5" fill={`url(#g3a-${id})`} />

      {/* Tagline below stripe */}
      <text x="60" y="71" fill={a} fontSize="6.5" fontWeight="700"
        letterSpacing="1.5" fontFamily="var(--font-mono), monospace">{tg.slice(0, 14)}</text>

      {/* Bottom rule full width */}
      <line x1="8" y1="82" x2="92" y2="82" stroke={p} strokeWidth="1" opacity="0.4" />
      <text x="50" y="92" textAnchor="middle" fill="#64748B" fontSize="5.5" fontWeight="700"
        letterSpacing="2.5" fontFamily="var(--font-mono), monospace">
        {tg.slice(0,22)}
      </text>
    </g>
  );

  const DESIGNS = [renderDesign0, renderDesign1, renderDesign2, renderDesign3];

  const getThemeBg = (theme: CardBgTheme) => {
    switch (theme) {
      case 'light': return 'bg-slate-100 border-slate-300';
      case 'gold': return 'bg-gradient-to-br from-amber-950 via-[#1c1409] to-[#0a0703] border-amber-500/40';
      case 'cyber': return 'bg-gradient-to-br from-slate-950 via-[#06101c] to-[#08182b] border-cyan-500/40';
      default: return 'bg-[#090c13] border-slate-800';
    }
  };

  const DESIGN_LABELS = ['Shield Crest', 'Hex Prism Badge', 'Circular Seal', 'Wordmark Block'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2 font-outfit">
            <Sparkles className="w-6 h-6 text-amber-400" />
            4 Structurally Distinct Logo Designs
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Each card is a different <strong className="text-amber-400">SVG architecture</strong> — shield, hex prism, circular seal &amp; wordmark block — not just color swaps.
          </p>
        </div>
        <span className="text-xs text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
          Initial &quot;{L}&quot; Monogram Suite
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {logos.map((logo, idx) => {
          const currentTheme = bgThemes[logo.id] || 'dark';
          const renderFn = DESIGNS[idx % 4];
          const designLabel = DESIGN_LABELS[idx % 4];

          return (
            <div
              key={logo.id}
              className="bg-[#111827] border border-amber-500/20 rounded-3xl p-6 flex flex-col items-center gap-5 group hover:border-amber-500/50 transition-all hover:shadow-2xl hover:shadow-amber-500/10"
            >
              {/* Card Header */}
              <div className="w-full flex items-center justify-between text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-amber-400 font-bold w-fit">
                    {logo.styleTag}
                  </span>
                  <span className="text-slate-500 font-mono pl-1 text-[10px]">#{idx + 1} · {designLabel}</span>
                </div>

                {/* Theme switcher */}
                <div className="flex items-center gap-1 bg-[#0a0d14] p-1 rounded-xl border border-slate-800">
                  {(['dark', 'light', 'gold', 'cyber'] as CardBgTheme[]).map((theme, ti) => (
                    <button
                      key={theme}
                      onClick={() => toggleBgTheme(logo.id, theme)}
                      title={theme.charAt(0).toUpperCase() + theme.slice(1)}
                      className={`p-1.5 rounded-lg transition-all ${currentTheme === theme ? 'bg-amber-500 text-black font-bold' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {ti === 0 && <Moon className="w-3.5 h-3.5" />}
                      {ti === 1 && <Sun className="w-3.5 h-3.5" />}
                      {ti === 2 && <Sparkles className="w-3.5 h-3.5" />}
                      {ti === 3 && <Layers className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* SVG Canvas */}
              <div className={`w-full min-h-[280px] rounded-2xl p-6 flex items-center justify-center border transition-all duration-300 shadow-xl ${getThemeBg(currentTheme)}`}>
                <svg
                  id={`svg-${logo.id}`}
                  viewBox="0 0 100 100"
                  className="w-full max-w-[280px] h-auto drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
                >
                  {renderFn(logo.primaryColor, logo.secondaryColor, logo.accentColor, logo.id)}
                </svg>
              </div>

              {/* Color palette preview dots */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-white/20 shadow-lg" style={{ backgroundColor: logo.primaryColor }} title="Primary" />
                <div className="w-5 h-5 rounded-full border-2 border-white/20 shadow-lg" style={{ backgroundColor: logo.secondaryColor }} title="Secondary" />
                <div className="w-5 h-5 rounded-full border-2 border-white/20 shadow-lg" style={{ backgroundColor: logo.accentColor }} title="Accent" />
                <span className="text-[10px] text-slate-500 font-mono ml-1">{logo.variantName}</span>
              </div>

              {/* Download buttons */}
              <div className="w-full flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleDownloadSvg(logo)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all"
                >
                  {downloadedId === logo.id ? (
                    <><Check className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400">Downloaded!</span></>
                  ) : (
                    <><Download className="w-4 h-4" /><span>Download SVG</span></>
                  )}
                </button>
                <button
                  onClick={() => handleDownloadPng(logo)}
                  disabled={downloadingPngId === logo.id}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/50 text-xs font-bold transition-all disabled:opacity-50"
                >
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>{downloadingPngId === logo.id ? 'Exporting…' : 'Export 2K PNG'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
