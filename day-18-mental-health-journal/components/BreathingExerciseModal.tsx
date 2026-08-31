'use client';

import { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Wind, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type BreathPhase = 'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)';

interface PhaseStep {
  name: BreathPhase;
  duration: number;
}

export default function BreathingExerciseModal({ isOpen, onClose }: Props) {
  const [technique, setTechnique] = useState<'box' | '478' | 'coherent'>('box');
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Pattern definition based on technique
  const getSteps = (): PhaseStep[] => {
    if (technique === '478') {
      return [
        { name: 'Inhale', duration: 4 },
        { name: 'Hold (Full)', duration: 7 },
        { name: 'Exhale', duration: 8 },
      ];
    }
    if (technique === 'coherent') {
      return [
        { name: 'Inhale', duration: 5 },
        { name: 'Exhale', duration: 5 },
      ];
    }
    // Box Breathing (4-4-4-4)
    return [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold (Full)', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold (Empty)', duration: 4 },
    ];
  };

  const steps = getSteps();
  const currentStep = steps[phaseIndex % steps.length] || steps[0];

  useEffect(() => {
    if (!isActive || !isOpen) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Time's up for current phase -> advance to next phase
        setPhaseIndex((currIdx) => {
          const nextIdx = (currIdx + 1) % steps.length;
          if (nextIdx === 0) {
            setCompletedCycles((c) => c + 1);
          }
          return nextIdx;
        });

        // Set duration of the NEXT step
        const nextStep = steps[((phaseIndex + 1) % steps.length)];
        return nextStep ? nextStep.duration : 4;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isOpen, phaseIndex, steps]);

  if (!isOpen) return null;

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsRemaining(steps[0].duration);
    setCompletedCycles(0);
  };

  const handleTechniqueChange = (t: 'box' | '478' | 'coherent') => {
    setTechnique(t);
    setIsActive(false);
    setPhaseIndex(0);
    if (t === '478') setSecondsRemaining(4);
    else if (t === 'coherent') setSecondsRemaining(5);
    else setSecondsRemaining(4);
  };

  const isExpanding = currentStep.name === 'Inhale';
  const isContracting = currentStep.name === 'Exhale';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-mono text-xs text-slate-300">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#090d16] border-2 border-teal-500/40 p-6 sm:p-8 space-y-6 shadow-2xl shadow-teal-500/20 text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">Somatic Breathwork Studio</h3>
              <p className="text-[11px] text-slate-400 font-sans">Vagal nerve stimulation for nervous system down-regulation</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#04080e] border border-white/[0.08] text-slate-400 hover:text-white cursor-pointer"
          >
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
                  ? 'bg-teal-500/15 border-teal-400 text-white shadow-md shadow-teal-500/20'
                  : 'bg-[#04080e] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
            >
              <span className="block font-bold text-xs font-outfit">{t.label}</span>
              <span className="text-[9px] text-slate-500 font-sans">{t.desc}</span>
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
              {currentStep.name}
            </span>
            <span className="text-5xl font-black text-white font-outfit mt-1">
              {secondsRemaining}
            </span>
            <span className="text-[9px] text-slate-400 mt-1 font-mono">
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
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/30 hover:bg-amber-300'
                : 'bg-gradient-to-r from-teal-400 to-emerald-400 text-black shadow-lg shadow-teal-500/30 hover:scale-105'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
            <span>{isActive ? 'Pause Session' : 'Begin Breathwork'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-3 rounded-2xl bg-[#04080e] border border-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
