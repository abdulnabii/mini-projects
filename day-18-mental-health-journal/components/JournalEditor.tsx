'use client';

import { useState, useEffect, useRef } from 'react';
import { MoodCategory } from '@/types';
import { getMoodBadgeProps } from '@/lib/journalEngine';
import { Sparkles, Mic, MicOff, BookOpen, PenTool, Lightbulb, Compass, Lock, Check } from 'lucide-react';

interface Props {
  onAnalyzeAndSave: (title: string, content: string, mood: MoodCategory) => void;
  isLoading: boolean;
}

const GUIDED_PROMPTS = [
  {
    label: '🌙 Evening Brain Dump',
    prompt:
      'What was the heaviest thought on your mind today, and what is one small thing that went well despite the stress?',
  },
  {
    label: '🛡️ Imposter Syndrome Release',
    prompt:
      'Write down a recent fear that you are "not good enough". What would you tell a friend who felt the exact same way?',
  },
  {
    label: '🔋 Workplace Burnout Check-In',
    prompt:
      'Describe where in your body you feel tension right now. What is one work boundary you need to reclaim this week?',
  },
  {
    label: '🌿 Daily Micro-Gratitude',
    prompt:
      'Name 3 small, simple moments from today that brought a quiet smile (a warm coffee, a kind message, fresh air).',
  },
];

const MOODS: MoodCategory[] = ['calm', 'joyful', 'reflective', 'anxious', 'overwhelmed', 'down', 'frustrated'];

export default function JournalEditor({ onAnalyzeAndSave, isLoading }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodCategory>('calm');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Web Speech Voice Dictation
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setContent((prev) => prev + ' ' + transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleApplyPrompt = (promptText: string) => {
    setContent((prev) => (prev ? `${prev}\n\n${promptText}\n` : `${promptText}\n`));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAnalyzeAndSave(title.trim(), content.trim(), selectedMood);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1220] border border-emerald-500/30 space-y-6 font-mono text-xs text-slate-300 shadow-2xl shadow-emerald-500/10">
      {/* 1. Guided Prompts Row */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
          Guided Reflection Prompts (Click to insert):
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {GUIDED_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPrompt(p.prompt)}
              className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group flex flex-col justify-between gap-2 shadow-sm cursor-pointer"
            >
              <span className="font-bold text-white text-xs font-outfit group-hover:text-emerald-300 transition-colors">
                {p.label}
              </span>
              <p className="text-[10px] text-slate-400 line-clamp-2 font-sans leading-relaxed">{p.prompt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Writing Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title & Mood Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-bold text-slate-200">Entry Subject / Reflection Theme</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Navigating mid-week overwhelm, finding quiet joy..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-200">How Are You Feeling?</label>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {MOODS.map((m) => {
                const badge = getMoodBadgeProps(m);
                const isSelected = selectedMood === m;

                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMood(m)}
                    className={`px-2.5 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                      isSelected
                        ? `${badge.bg} ${badge.border} ${badge.color} shadow-md`
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'
                    }`}
                    title={badge.label}
                  >
                    <span>{badge.emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Textarea with Voice Dictation */}
        <div className="relative space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-emerald-400" />
              Write Freely (Private, encrypted client-side)
            </label>

            {/* Voice Dictation Button */}
            {typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && (
              <button
                type="button"
                onClick={toggleRecording}
                className={`px-3 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                <span>{isRecording ? 'Listening...' : 'Voice Dictate'}</span>
              </button>
            )}
          </div>

          <textarea
            rows={7}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Pour out your thoughts, worries, gratitude, or stream-of-consciousness here. There are no wrong words..."
            className="w-full p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-sans placeholder-slate-600 focus:outline-none focus:border-emerald-500 leading-relaxed shadow-inner"
          />

          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              End-to-End Client Privacy Protected
            </span>
            <span>
              <strong className="text-slate-300">{wordCount}</strong> words • ~{Math.max(1, Math.round(wordCount / 180))} min read
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500 hover:from-emerald-300 hover:to-indigo-400 text-black font-black text-sm tracking-wide font-outfit transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>
              {isLoading ? 'MINDFULLY REFLECTING WITH GEMINI AI...' : 'REFLECT & SAVE ENTRY WITH AI'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
