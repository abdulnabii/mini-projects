'use client';

import { useState, useEffect } from 'react';
import {
  Platform,
  TwitterThread,
  LinkedInPost,
  LinkedInCarousel,
  HookVariant,
  VoiceProfile,
  ScheduledDraft,
} from '@/types';
import { STARTER_IDEAS, StarterIdea } from '@/lib/sampleTemplates';
import {
  getActiveVoiceProfile,
  saveVoiceProfile,
  saveDraft,
} from '@/lib/storage';
import ThreadStudio from '@/components/ThreadStudio';
import LinkedInStudio from '@/components/LinkedInStudio';
import CarouselStudio from '@/components/CarouselStudio';
import HookGenerator from '@/components/HookGenerator';
import EngagementRadar from '@/components/EngagementRadar';
import VoiceCalibrator from '@/components/VoiceCalibrator';
import { TwitterIcon, LinkedInIcon } from '@/components/PlatformIcons';
import {
  Sparkles,
  Layers,
  Mic,
  Loader2,
  Zap,
  TrendingUp,
  Flame,
  ArrowRight,
  Send,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContentStudioPage() {
  const [platform, setPlatform] = useState<Platform>('twitter');
  const [topicInput, setTopicInput] = useState(
    'How I built and shipped an AI symptom triage web app in 48 hours using Gemini API + Next.js 16 (and what broke along the way)'
  );
  const [linkedInFormat, setLinkedInFormat] = useState<
    'story' | 'framework' | 'contrarian' | 'case_study'
  >('story');

  const [isLoading, setIsLoading] = useState(false);
  const [activeVoice, setActiveVoice] = useState<VoiceProfile | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Generated Content State
  const [generatedThread, setGeneratedThread] = useState<TwitterThread | null>(null);
  const [generatedLinkedIn, setGeneratedLinkedIn] = useState<LinkedInPost | null>(null);
  const [generatedCarousel, setGeneratedCarousel] = useState<LinkedInCarousel | null>(null);
  const [hookVariants, setHookVariants] = useState<HookVariant[]>([]);

  // Load voice profile on mount
  useEffect(() => {
    const v = getActiveVoiceProfile();
    if (v) setActiveVoice(v);
  }, []);

  const handleGenerate = async (targetPlatform: Platform = platform) => {
    if (!topicInput.trim()) return;

    setIsLoading(true);
    try {
      if (targetPlatform === 'twitter') {
        const res = await fetch('/api/thread', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topicInput, voiceProfile: activeVoice }),
        });
        const data = await res.json();
        if (data.thread) {
          setGeneratedThread(data.thread);
          setHookVariants(data.thread.hooks || []);
        }
      } else if (targetPlatform === 'linkedin') {
        const res = await fetch('/api/linkedin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: topicInput,
            format: linkedInFormat,
            voiceProfile: activeVoice,
          }),
        });
        const data = await res.json();
        if (data.post) {
          setGeneratedLinkedIn(data.post);
        }
        // Fetch hook variants alongside
        const hooksRes = await fetch('/api/hooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topicInput }),
        });
        const hooksData = await hooksRes.json();
        if (hooksData.hooks) setHookVariants(hooksData.hooks);
      } else if (targetPlatform === 'carousel') {
        const res = await fetch('/api/carousel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topicInput, voiceProfile: activeVoice }),
        });
        const data = await res.json();
        if (data.carousel) {
          setGeneratedCarousel(data.carousel);
        }
      }

      confetti({
        particleCount: 30,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6'],
      });
    } catch (e) {
      console.error('Generation failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyStarterIdea = (idea: StarterIdea) => {
    setTopicInput(idea.topic);
    setPlatform(idea.suggestedPlatform);
  };

  const handleSaveToSchedule = (contentData: any) => {
    const newDraft: ScheduledDraft = {
      id: 'draft_' + Date.now(),
      platform,
      title: topicInput.slice(0, 60),
      contentSummary:
        platform === 'twitter'
          ? `${(contentData as TwitterThread).tweets.length} Tweets`
          : platform === 'linkedin'
          ? `${(contentData as LinkedInPost).fullText.length} chars`
          : `${(contentData as LinkedInCarousel).slides.length} Slides`,
      status: 'scheduled',
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      fullData: contentData,
      createdAt: new Date().toISOString(),
    };
    saveDraft(newDraft);
  };

  const activeRadar =
    platform === 'twitter'
      ? generatedThread?.engagementRadar
      : platform === 'linkedin'
      ? generatedLinkedIn?.engagementRadar
      : generatedCarousel?.engagementRadar;

  const activePostingTime =
    platform === 'twitter'
      ? generatedThread?.postingTime
      : platform === 'linkedin'
      ? generatedLinkedIn?.postingTime
      : 'Wednesday 9:00 AM EST';

  return (
    <div className="space-y-10 font-mono w-full min-w-0">
      {/* Centered Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI VIRAL SOCIAL MEDIA CONTENT STUDIO &amp; AUDIENCE ACCELERATOR</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit">
          Turn Raw Ideas Into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
            High-Converting Content
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-2xl mx-auto leading-relaxed">
          Generate 10-tweet viral threads, LinkedIn authority frameworks, and multi-slide carousels calibrated to your authentic developer voice.
        </p>
      </div>

      {/* 4 Quick Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-5xl mx-auto font-mono text-left">
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-cyan-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1.5">
            <TwitterIcon className="w-3.5 h-3.5 fill-cyan-400" /> Twitter / X Threads
          </span>
          <div className="text-lg font-black text-white">8–12 Tweet Engine</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-blue-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-blue-400 font-bold uppercase flex items-center gap-1.5">
            <LinkedInIcon className="w-3.5 h-3.5 fill-blue-400" /> LinkedIn Authority
          </span>
          <div className="text-lg font-black text-blue-300">See-More Fold Sim</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-purple-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Slide Carousels
          </span>
          <div className="text-lg font-black text-purple-300">Swipeable PDF Decks</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-emerald-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Viral Radar
          </span>
          <div className="text-lg font-black text-emerald-300">0–100 Score Gauge</div>
        </div>
      </div>

      {/* Main Creation Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-emerald-500/30 shadow-2xl space-y-6">
        {/* Platform Selection Switcher & Voice Calibration Trigger */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#161b22] border border-slate-800">
            <button
              type="button"
              onClick={() => setPlatform('twitter')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                platform === 'twitter'
                  ? 'bg-cyan-500 text-black font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TwitterIcon className="w-3.5 h-3.5" />
              <span>Twitter / X Thread</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('linkedin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                platform === 'linkedin'
                  ? 'bg-[#0a66c2] text-white font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LinkedInIcon className="w-3.5 h-3.5" />
              <span>LinkedIn Post</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('carousel')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                platform === 'carousel'
                  ? 'bg-purple-500 text-black font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Visual Carousel</span>
            </button>
          </div>

          {/* Calibrate Voice Button */}
          <button
            type="button"
            onClick={() => setIsVoiceModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Voice: {activeVoice ? activeVoice.name : 'Default (Click to Calibrate)'}
            </span>
          </button>
        </div>

        {/* Topic Input Form */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Raw Topic, Feature Launch, or Engineering Concept:</span>
            </label>
            <span className="text-[10px] text-slate-500">{topicInput.length} chars</span>
          </div>

          <textarea
            rows={4}
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="e.g. How I built a full-stack AI app in 48 hours with Next.js 16 and Gemini 1.5, the 3 biggest bugs I encountered, and why streaming server components changed everything..."
            className="w-full p-4 rounded-2xl bg-[#161b22] border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 leading-relaxed font-sans"
          />

          {/* LinkedIn Format Selector */}
          {platform === 'linkedin' && (
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Format:</span>
              {(['story', 'framework', 'contrarian', 'case_study'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setLinkedInFormat(fmt)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                    linkedInFormat === fmt
                      ? 'bg-blue-500 text-white font-black'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {fmt.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}

          {/* 1-Click Starter Ideas */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" /> Starter Prompts:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {STARTER_IDEAS.map((idea) => (
                <button
                  key={idea.id}
                  type="button"
                  onClick={() => handleApplyStarterIdea(idea)}
                  className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white text-[11px] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{idea.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Trigger Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            Powered by Gemini 1.5 Flash + Algorithmic Viral Engine
          </span>

          <button
            type="button"
            disabled={isLoading || !topicInput.trim()}
            onClick={() => handleGenerate()}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 fill-black" />
            )}
            <span>Generate {platform === 'twitter' ? 'Twitter Thread' : platform === 'linkedin' ? 'LinkedIn Post' : 'Visual Carousel'}</span>
          </button>
        </div>
      </div>

      {/* Generated Content Output Section */}
      <div className="space-y-8">
        {platform === 'twitter' && generatedThread && (
          <ThreadStudio
            thread={generatedThread}
            onUpdateThread={(updated) => setGeneratedThread(updated)}
            onSaveToSchedule={handleSaveToSchedule}
          />
        )}

        {platform === 'linkedin' && generatedLinkedIn && (
          <LinkedInStudio
            post={generatedLinkedIn}
            onUpdatePost={(updated) => setGeneratedLinkedIn(updated)}
            onSaveToSchedule={handleSaveToSchedule}
          />
        )}

        {platform === 'carousel' && generatedCarousel && (
          <CarouselStudio
            carousel={generatedCarousel}
            onSaveToSchedule={handleSaveToSchedule}
          />
        )}

        {/* Hook Variations Matrix */}
        {hookVariants.length > 0 && (
          <HookGenerator
            hooks={hookVariants}
            onSelectHook={(hookText) => {
              if (platform === 'twitter' && generatedThread) {
                const updated = [...generatedThread.tweets];
                if (updated[0]) {
                  updated[0] = { ...updated[0], text: hookText, characterCount: hookText.length };
                  setGeneratedThread({ ...generatedThread, tweets: updated });
                }
              } else if (platform === 'linkedin' && generatedLinkedIn) {
                const lines = generatedLinkedIn.fullText.split('\n');
                lines[0] = hookText;
                setGeneratedLinkedIn({
                  ...generatedLinkedIn,
                  hookLine: hookText,
                  fullText: lines.join('\n'),
                });
              }
            }}
          />
        )}

        {/* Viral Engagement Radar */}
        {activeRadar && (
          <EngagementRadar radar={activeRadar} postingTime={activePostingTime} />
        )}
      </div>

      {/* Voice Calibration Modal */}
      <VoiceCalibrator
        activeVoice={activeVoice}
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSaveVoice={(voice) => {
          setActiveVoice(voice);
          saveVoiceProfile(voice);
        }}
      />
    </div>
  );
}
