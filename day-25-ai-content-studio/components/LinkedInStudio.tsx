'use client';

import { useState } from 'react';
import { LinkedInPost, LinkedInTone } from '@/types';
import {
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Sparkles,
  Eye,
  Edit3,
  Users,
  Briefcase,
} from 'lucide-react';
import { LinkedInIcon } from './PlatformIcons';
import confetti from 'canvas-confetti';

interface Props {
  post: LinkedInPost;
  onUpdatePost: (updated: LinkedInPost) => void;
  onSaveToSchedule: (post: LinkedInPost) => void;
  onOpenCollaboration?: () => void;
}

const TONE_OPTIONS: { id: LinkedInTone; label: string; desc: string }[] = [
  { id: 'storyteller_founder', label: '🚀 Founder Story', desc: 'Vulnerable build-in-public lessons' },
  { id: 'executive', label: '👔 Executive / C-Suite', desc: 'Strategic ROI & market vision' },
  { id: 'technical_architect', label: '📐 Technical Deep Dive', desc: 'Architecture trade-offs & scale' },
  { id: 'data_driven', label: '📊 Data & Metrics', desc: 'Numbers, percentages & statistics' },
  { id: 'contrarian', label: '⚡ Contrarian Leader', desc: 'Debate-starting counter-narrative' },
];

export default function LinkedInStudio({
  post,
  onUpdatePost,
  onSaveToSchedule,
  onOpenCollaboration,
}: Props) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFoldExpanded, setIsFoldExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTextChange = (text: string) => {
    onUpdatePost({ ...post, fullText: text });
  };

  const handleToneSelect = (tone: LinkedInTone) => {
    onUpdatePost({ ...post, tone });
  };

  const copyFullPost = () => {
    navigator.clipboard.writeText(post.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToLinkedInIntent = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      'https://github.com/abdulnabii/mini-projects'
    )}&summary=${encodeURIComponent(post.fullText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Studio Header & Global Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0d1117] border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase">
              LINKEDIN AUTHORITY STUDIO
            </span>
            <span className="text-xs text-slate-500 font-bold uppercase">
              Format: {post.format}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white font-outfit truncate max-w-xl">
            {post.topic}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isPreviewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPreviewMode ? 'Edit Mode' : 'Feed Simulator'}</span>
          </button>

          <button
            type="button"
            onClick={copyFullPost}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Post'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSaveToSchedule(post);
              confetti({
                particleCount: 25,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#0a66c2', '#10b981'],
              });
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Save to Queue</span>
          </button>
        </div>
      </div>

      {/* Tone Preset Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-blue-400" />
          <span>Professional Voice &amp; Authority Tone Preset:</span>
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {TONE_OPTIONS.map((t) => {
            const isSelected = (post.tone || 'storyteller_founder') === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleToneSelect(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-black shadow-md'
                    : 'bg-[#161b22] border border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={t.desc}
              >
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-6 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0a66c2]/10 border border-[#0a66c2]/30 flex items-center justify-center text-[#0a66c2]">
              <LinkedInIcon className="w-5 h-5 fill-[#0a66c2]" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm font-outfit">
                {isPreviewMode ? 'LinkedIn Feed Simulator' : 'Post Editor'}
              </h4>
              <span className="text-[10px] text-slate-500">
                {post.fullText.length} characters • ~{Math.ceil(post.fullText.split(/\s+/).length / 200)} min read
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={shareToLinkedInIntent}
            className="px-4 py-1.5 rounded-xl bg-[#0a66c2] hover:bg-[#084e96] text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <LinkedInIcon className="w-3.5 h-3.5 fill-white" />
            <span>Publish on LinkedIn</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* FEED SIMULATOR OR RAW EDITOR */}
        {isPreviewMode ? (
          <div className="max-w-xl mx-auto p-5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-4 font-sans text-xs text-slate-200 shadow-xl">
            {/* Mock User Header */}
            <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-black font-black text-xs font-mono">
                AN
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white text-sm">Abdul Nabi</div>
                <div className="text-[11px] text-slate-400">
                  Full Stack AI Software Engineer • Building in Public
                </div>
                <div className="text-[10px] text-slate-500">Just now • 🌐</div>
              </div>
            </div>

            {/* Post text with "see more" folding */}
            <div className="space-y-3 leading-relaxed whitespace-pre-wrap">
              {!isFoldExpanded ? (
                <>
                  <p className="font-semibold text-white text-sm">
                    {post.hookLine || post.fullText.split('\n')[0]}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsFoldExpanded(true)}
                    className="text-slate-400 hover:text-cyan-400 font-bold cursor-pointer"
                  >
                    ...see more
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <p>{post.fullText}</p>
                  <button
                    type="button"
                    onClick={() => setIsFoldExpanded(false)}
                    className="text-slate-400 hover:text-cyan-400 font-bold cursor-pointer pt-1"
                  >
                    show less
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              rows={12}
              value={post.fullText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Write your LinkedIn post here..."
              className="w-full p-4 rounded-2xl bg-[#161b22] border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 leading-relaxed font-sans"
            />
          </div>
        )}

        {/* Recommended Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Tags:</span>
            {post.hashtags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan-400 font-bold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
