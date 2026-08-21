'use client';

import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Wind, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type BreathPhase = 'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)';

export default function BreathingExerciseModal({ isOpen, onClose }: Props) {
  const [technique, setTechnique] = useState<'box' | '478' | 'coherent'>('box');
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('Inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  if (!isOpen) return null;

  // Pattern definition: [phaseName, durationInSeconds]
  const getPattern = (): [BreathPhase, number][] => {
    if (technique === '478') {
      return [
        ['Inhale', 4],
        ['Hold (Full)', 7],
        ['Exhale', 8],
      ];
    }
    if (technique === 'coherent') {
      return [
        ['Inhale', 5],
        ['Exhale', 5],
      ];
    }
    // Box Breathing (4-4-4-4)
    return [
      ['Inhale', 4],
      ['Hold (Full)', 4],
      ['Exhale', 4],
      ['Hold (Empty)', 4],
    ];
  };

  useEffect(() => {
    if (!isActive) return;

    const pattern = getPattern();
    let phaseIndex = pattern.findIndex((p) => p[0] === currentPhase);
    if (phaseIndex === -1) phaseIndex = 0;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Advance phase
        const nextIndex = (phaseIndex + 1) % pattern.length;
        if (nextIndex === 0) {
          setCompletedCycles((c) => c + 1);
        }
        setCurrentPhase(pattern[nextIndex][0]);
        return pattern[nextIndex][1];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentPhase, technique]);

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase('Inhale');
    setSecondsRemaining(getPattern()[0][1]);
    setCompletedCycles(0);
  };

  const handleTechniqueChange = (t: 'box' | '478' | 'coherent') => {
    setTechnique(t);
    setIsActive(false);
    setCurrentPhase('Inhale');
    if (t === '478') setSecondsRemaining(4);
    else if (t === 'coherent') setSecondsRemaining(5);
    else setSecondsRemaining(4);
  };

  const isExpanding = currentPhase === 'Inhale';
  const isContracting = currentPhase === 'Exhale';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-mono text-xs text-slate-300">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0b1220] border-2 border-teal-500/40 p-6 sm:p-8 space-y-6 shadow-2xl shadow-teal-500/20 text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">Somatic Breathwork Studio</h3>
              <p className="text-[11px] text-slate-400">Vagal nerve stimulation for nervous system down-regulation</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technique Selector */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'box', label: 'Box 4-4-4-4', desc: 'Navy SEAL Calm' },
            { id: '478', label: 'Relaxing 4-7-8', desc: 'Sleep & Anxiety' },
            { id: 'coherent', label: 'Resonance 5-5', desc: 'Heart Coherence' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTechniqueChange(t.id as any)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                technique === t.id
                  ? 'bg-teal-500/10 border-teal-400 text-white shadow-md shadow-teal-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="block font-bold text-xs font-outfit">{t.label}</span>
              <span className="text-[9px] text-slate-500">{t.desc}</span>
            </button>
          ))}
        </div>

        {/* Animated Breathing Orb Canvas */}
        <div className="py-8 flex flex-col items-center justify-center relative">
          <div
            className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl border-4 relative ${
              isExpanding
                ? 'scale-110 bg-gradient-to-br from-teal-500/30 via-emerald-500/20 to-indigo-500/30 border-teal-400 shadow-teal-500/40'
                : isContracting
                ? 'scale-75 bg-gradient-to-br from-indigo-500/20 via-slate-900 to-slate-950 border-indigo-500/40 shadow-indigo-500/20'
                : 'scale-100 bg-gradient-to-br from-teal-500/20 via-slate-900 to-teal-900/30 border-teal-500/30 shadow-teal-500/20'
            }`}
          >
            <span className="text-sm font-bold text-teal-300 font-outfit uppercase tracking-widest animate-pulse">
              {currentPhase}
            </span>
            <span className="text-5xl font-black text-white font-outfit mt-1">
              {secondsRemaining}
            </span>
            <span className="text-[9px] text-slate-400 mt-1">
              {completedCycles} Cycles Completed
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer font-outfit ${
              isActive
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 hover:bg-amber-400'
                : 'bg-gradient-to-r from-teal-400 to-emerald-400 text-black shadow-lg shadow-teal-500/30 hover:scale-105'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
            <span>{isActive ? 'Pause Session' : 'Begin Breathwork'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
