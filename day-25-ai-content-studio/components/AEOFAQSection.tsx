import { Sparkles, Mic, Layers, Repeat, TrendingUp, Calendar } from 'lucide-react';

const FAQS = [
  {
    icon: Mic,
    q: 'How does ThreadGenius.AI calibrate to my authentic writing voice?',
    a: 'ThreadGenius.AI analyzes sample past tweets, LinkedIn posts, or personal writing snippets using Google Gemini 1.5 Pro. It measures sentence length distribution, vocabulary complexity, emoji density, rhetorical question frequency, and pacing to construct a personalized Voice Profile that ensures all generated content sounds genuinely like you.',
  },
  {
    icon: TrendingUp,
    q: 'How is the Predicted Viral Engagement Score (0–100) calculated?',
    a: 'The engagement algorithm evaluates copy against proven viral social media mechanics: hook strength (curiosity gaps, bold contrarian assertions), whitespace readability, emotional valence, character pacing, and call-to-action friction. Scores above 80 indicate high probability of algorithmic amplification.',
  },
  {
    icon: Layers,
    q: 'What formats does the LinkedIn Carousel Creator generate?',
    a: 'The Carousel Studio transforms high-density technical or founder concepts into structured 5–10 slide visual carousels. Each slide features an actionable headline, 2–3 scannable bullet takeaways, and visual layout cues formatted for maximum dwell time on professional feeds.',
  },
  {
    icon: Sparkles,
    q: 'How does the 5-Way Hook Variant Generator optimize click-through rates?',
    a: 'Hooks determine 80% of a post\'s success. ThreadGenius.AI synthesizes five distinct hook psychological frameworks for every topic: Contrarian / Counter-Intuitive, Bold Quantitative Statistic, Personal Vulnerable Story, Provocative Question, and Numbered Framework — each paired with an estimated CTR rating.',
  },
  {
    icon: Repeat,
    q: 'Can I repurpose long-form engineering blogs or release notes into social posts?',
    a: 'Yes. The Repurposer Studio accepts raw markdown, product changelogs, or technical articles and atomizes them simultaneously into a high-engagement Twitter/X thread, a LinkedIn thought-leadership post, and an educational carousel outline in a single generation pass.',
  },
  {
    icon: Calendar,
    q: 'How does the Drafts & Scheduling Queue assist content workflows?',
    a: 'Generated drafts can be saved locally, assigned target publication times based on peak developer activity hours (e.g. Tuesday 9 AM EST), categorized by platform, and organized for multi-member review with built-in export to Markdown and clipboard copy.',
  },
];

export default function AEOFAQSection() {
  return (
    <section className="space-y-6 font-mono" aria-label="Frequently Asked Questions about ThreadGenius.AI">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
          KNOWLEDGE HUB &amp; AEO DIRECTORY
        </span>
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          ThreadGenius.AI — Frequently Asked Questions &amp; Content Engineering
        </h2>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FAQS.map(({ icon: Icon, q, a }) => (
          <div
            key={q}
            className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-2.5 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white leading-snug font-outfit">{q}</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pl-11 font-sans">{a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
