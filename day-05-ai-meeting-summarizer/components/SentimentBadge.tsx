import { MeetingSentiment } from "@/types";
import { cn } from "@/lib/utils";

export default function SentimentBadge({ sentiment }: { sentiment: MeetingSentiment }) {
  const styles = {
    positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    tense: "bg-red-500/10 text-red-400 border-red-500/20",
    mixed: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  };

  return (
    <span className={cn("px-3 py-1 text-xs font-medium rounded-full border capitalize", styles[sentiment] || styles.neutral)}>
      Sentiment: {sentiment}
    </span>
  );
}
