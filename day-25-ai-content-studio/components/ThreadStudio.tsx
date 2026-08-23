'use client';

import { useState } from 'react';
import { TwitterThread, Tweet } from '@/types';
import {
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { TwitterIcon } from './PlatformIcons';
import confetti from 'canvas-confetti';

interface Props {
  thread: TwitterThread;
  onUpdateThread: (updated: TwitterThread) => void;
  onSaveToSchedule: (thread: TwitterThread) => void;
}

export default function ThreadStudio({
  thread,
  onUpdateThread,
  onSaveToSchedule,
}: Props) {
  const [activeTweetIndex, setActiveTweetIndex] = useState(0);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSingle, setCopiedSingle] = useState(false);

  const activeTweet = thread.tweets[activeTweetIndex] || thread.tweets[0];

  const handleTweetTextChange = (text: string) => {
    const updatedTweets = [...thread.tweets];
    updatedTweets[activeTweetIndex] = {
      ...updatedTweets[activeTweetIndex],
      text,
      characterCount: text.length,
    };
    onUpdateThread({ ...thread, tweets: updatedTweets });
  };

  const handleAddTweet = () => {
    const newTweet: Tweet = {
      number: thread.tweets.length + 1,
      text: '',
      type: 'content',
      characterCount: 0,
    };
    const updatedTweets = [...thread.tweets, newTweet];
    onUpdateThread({ ...thread, tweets: updatedTweets });
    setActiveTweetIndex(updatedTweets.length - 1);
  };

  const handleDeleteTweet = (idx: number) => {
    if (thread.tweets.length <= 1) return;
    const updatedTweets = thread.tweets
      .filter((_, i) => i !== idx)
      .map((t, i) => ({ ...t, number: i + 1 }));
    onUpdateThread({ ...thread, tweets: updatedTweets });
    setActiveTweetIndex(Math.max(0, idx - 1));
  };

  const copyFullThreadMarkdown = () => {
    const formatted = thread.tweets
      .map((t) => `🧵 Tweet ${t.number}/${thread.tweets.length}\n${t.text}`)
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copyCurrentTweet = () => {
    if (!activeTweet) return;
    navigator.clipboard.writeText(activeTweet.text);
    setCopiedSingle(true);
    setTimeout(() => setCopiedSingle(false), 2000);
  };

  const openOnXWebIntent = () => {
    if (!activeTweet) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(activeTweet.text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Studio Header & Global Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0d1117] border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase">
              TWITTER / X THREAD STUDIO
            </span>
            <span className="text-xs text-slate-500">{thread.tweets.length} Tweets Total</span>
          </div>
          <h3 className="text-lg font-bold text-white font-outfit truncate max-w-xl">
            {thread.topic}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={copyFullThreadMarkdown}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Thread Copied!' : 'Copy Full Thread'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSaveToSchedule(thread);
              confetti({
                particleCount: 25,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#10b981', '#06b6d4'],
              });
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Save to Queue</span>
          </button>
        </div>
      </div>

      {/* Tweet Carousel / Navigator Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {thread.tweets.map((tw, idx) => {
          const isSelected = activeTweetIndex === idx;
          const isOverLimit = tw.characterCount > 280;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTweetIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500 text-black font-black shadow-md'
                  : 'bg-[#0d1117] border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>#{tw.number}</span>
              <span className={`text-[10px] ${isOverLimit ? 'text-rose-500 font-bold' : isSelected ? 'text-black/70' : 'text-slate-500'}`}>
                {tw.characterCount}/280
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleAddTweet}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-slate-800 text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          title="Add another tweet"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline text-[10px]">Add Tweet</span>
        </button>
      </div>

      {/* Main Active Tweet Card Editor */}
      {activeTweet && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-6 shadow-2xl">
          {/* Card Meta Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <TwitterIcon className="w-5 h-5 fill-cyan-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm font-outfit">
                  Tweet #{activeTweet.number} of {thread.tweets.length}
                </h4>
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                  Role: {activeTweet.type === 'hook' ? '🌟 Opening Hook' : activeTweet.type === 'engagement' ? '💬 Discussion Driver' : activeTweet.type === 'cta' ? '🚀 Follow / Share CTA' : '📝 Value Content'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-xl border text-xs font-bold ${
                  activeTweet.characterCount > 280
                    ? 'text-rose-400 border-rose-500/40 bg-rose-500/10'
                    : 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                }`}
              >
                {activeTweet.characterCount} / 280 chars
              </span>

              {thread.tweets.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteTweet(activeTweetIndex)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Delete this tweet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Tweet Textarea */}
          <div className="space-y-2">
            <textarea
              rows={6}
              value={activeTweet.text}
              onChange={(e) => handleTweetTextChange(e.target.value)}
              placeholder="Write your tweet here..."
              className="w-full p-4 rounded-2xl bg-[#161b22] border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 leading-relaxed font-sans"
            />
          </div>

          {/* Per-Tweet Action Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
            {/* Prev / Next Tweet navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={activeTweetIndex === 0}
                onClick={() => setActiveTweetIndex((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Tweet</span>
              </button>

              <button
                type="button"
                disabled={activeTweetIndex === thread.tweets.length - 1}
                onClick={() =>
                  setActiveTweetIndex((prev) => Math.min(thread.tweets.length - 1, prev + 1))
                }
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <span>Next Tweet</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Copy / Post on X Web Intent */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyCurrentTweet}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSingle ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSingle ? 'Copied' : 'Copy Tweet'}</span>
              </button>

              <button
                type="button"
                onClick={openOnXWebIntent}
                className="px-4 py-1.5 rounded-xl bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <TwitterIcon className="w-3.5 h-3.5 fill-white" />
                <span>Post on X</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
