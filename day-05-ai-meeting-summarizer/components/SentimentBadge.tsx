'use client';

import { MeetingSentiment } from "@/types";
import { Smile, Meh, Frown, Sparkles } from "lucide-react";

export default function SentimentBadge({ sentiment }: { sentiment: MeetingSentiment }) {
  const getBadge = () => {
    switch (sentiment) {
      case 'positive':
        return {
          icon: <Smile className="w-3.5 h-3.5" />,
          label: 'Positive & Collaborative',
          style: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        };
      case 'tense':
        return {
          icon: <Frown className="w-3.5 h-3.5" />,
          label: 'Tense & Risk-Focused',
          style: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        };
      case 'mixed':
        return {
          icon: <Sparkles className="w-3.5 h-3.5" />,
          label: 'Mixed Dynamics',
          style: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        };
      default:
        return {
          icon: <Meh className="w-3.5 h-3.5" />,
          label: 'Neutral & Productive',
          style: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
        };
    }
  };

  const b = getBadge();

  return (
    <div className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 text-xs font-mono font-bold shadow-md ${b.style}`}>
      {b.icon}
      <span>{b.label}</span>
    </div>
  );
}
