'use client';

import { useState } from 'react';
import { VoiceProfile } from '@/types';
import {
  Mic,
  X,
  Loader2,
  Sparkles,
  CheckCircle2,
  Sliders,
  Type,
  Smile,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  activeVoice: VoiceProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveVoice: (voice: VoiceProfile) => void;
}

export default function VoiceCalibrator({
  activeVoice,
  isOpen,
  onClose,
  onSaveVoice,
}: Props) {
  const [samplesText, setSamplesText] = useState(
    activeVoice?.rawSamples?.join('\n\n---\n\n') ||
      `Shipped our new analytics dashboard today.\n\n3 key lessons:\n1. Keep schemas minimal\n2. Stream everything\n3. Talk to users daily.\n\nWhat are you building this weekend?`
  );
  const [isLoading, setIsLoading] = useState(false);
  const [calibratedProfile, setCalibratedProfile] = useState<VoiceProfile | null>(activeVoice);

  if (!isOpen) return null;

  const handleCalibrate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!samplesText.trim()) return;

    setIsLoading(true);
    try {
      const posts = samplesText
        .split('\n\n---\n\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samplePosts: posts }),
      });

      const data = await res.json();
      if (res.ok && data.voiceProfile) {
        setCalibratedProfile(data.voiceProfile);
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#38bdf8'],
        });
      }
    } catch (e) {
      console.error('Calibration failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (calibratedProfile) {
      onSaveVoice(calibratedProfile);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d1117] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                AI Voice Style Calibrator
              </h3>
              <p className="text-xs text-slate-400">
                Train the AI to match your exact writing cadence &amp; tone
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Textarea */}
        <form onSubmit={handleCalibrate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 font-bold uppercase">
              Paste 1–3 of your past posts / tweets (separate with ---):
            </label>
            <textarea
              rows={6}
              value={samplesText}
              onChange={(e) => setSamplesText(e.target.value)}
              placeholder="Paste sample posts here..."
              className="w-full p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 leading-relaxed font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !samplesText.trim()}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 shadow-md"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Analyze &amp; Calibrate Persona</span>
          </button>
        </form>

        {/* Calibrated Persona Preview */}
        {calibratedProfile && (
          <div className="p-4 rounded-2xl bg-[#161b22] border border-emerald-500/30 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-xs font-outfit">
                Persona: {calibratedProfile.name}
              </h4>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">
                {calibratedProfile.emojiDensity} emojis
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans">
              <strong>Tone:</strong> {calibratedProfile.tone}
            </p>

            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-slate-500">Keywords:</span>
              {calibratedProfile.signatureKeywords.map((k) => (
                <span
                  key={k}
                  className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-cyan-300"
                >
                  #{k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={!calibratedProfile}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold text-xs transition-all disabled:opacity-40 cursor-pointer shadow-md"
          >
            Save &amp; Apply Voice
          </button>
        </div>
      </div>
    </div>
  );
}
