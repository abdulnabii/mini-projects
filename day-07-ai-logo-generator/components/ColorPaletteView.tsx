'use client';

import { BrandPalette, ColorSwatch } from '@/types';
import { Palette, Copy, Check, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface Props {
  palette: BrandPalette;
}

export default function ColorPaletteView({ palette }: Props) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const swatches: ColorSwatch[] = [
    palette.primary,
    palette.secondary,
    palette.accent,
    palette.neutral,
    palette.background,
  ];

  return (
    <div className="bg-[#111827] border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" />
            Extracted Brand Color Palette
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">{palette.notes}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>{palette.wcagCompliance}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {swatches.map((swatch) => (
          <div
            key={swatch.role}
            className="bg-[#0a0d14] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4 group hover:border-amber-500/40 transition-all"
          >
            {/* Color Swatch Circle */}
            <div
              className="w-full h-24 rounded-xl shadow-lg relative overflow-hidden transition-transform group-hover:scale-105"
              style={{ backgroundColor: swatch.hex }}
            >
              <button
                onClick={() => handleCopy(swatch.hex)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 hover:bg-black/70 text-white text-xs backdrop-blur transition-all"
                title="Copy HEX Code"
              >
                {copiedHex === swatch.hex ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider block font-bold">
                {swatch.role}
              </span>
              <span className="text-sm font-bold text-white font-outfit block truncate">
                {swatch.name}
              </span>
              <span className="text-xs font-mono text-slate-300 block font-bold tabular-nums">
                {swatch.hex}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block truncate">
                {swatch.rgb}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 space-y-0.5">
              <div className="flex justify-between">
                <span>White Contrast:</span>
                <span className="font-bold text-white">{swatch.wcagContrastWhite.toFixed(1)}:1</span>
              </div>
              <div className="flex justify-between">
                <span>Black Contrast:</span>
                <span className="font-bold text-white">{swatch.wcagContrastBlack.toFixed(1)}:1</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
