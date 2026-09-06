import { Bot, GitPullRequest, Search, Activity, ShieldCheck, Sparkles } from 'lucide-react';

const FAQS = [
  {
    icon: Activity,
    q: 'How does GitMatch.AI calculate the Open Source Project Health Score?',
    a: 'GitMatch.AI computes a composite 0–100 health score evaluating five vital dimensions: maintenance recency (days since last commit), maintainer responsiveness (average PR review turnaround in days), issue resolution velocity, documentation completeness (README, CONTRIBUTING.md, and test suite), and community bus factor distribution.',
  },
  {
    icon: GitPullRequest,
    q: 'What is the "First PR Guide" generator and how is it customized to my skills?',
    a: 'The First PR Guide uses Google Gemini 1.5 Flash to analyze the target repository\'s architecture, conventions, and contributing guidelines against your selected tech stack (e.g., TypeScript, Python, Rust, Go). It generates a step-by-step onboarding roadmap covering local fork setup, environment installation, recommended starter issues, and a ready-to-use pull request markdown template.',
  },
  {
    icon: Search,
    q: 'Can I audit any GitHub repository that is not in the curated list?',
    a: 'Yes. The "Audit Any GitHub Repo" tab connects directly to GitHub REST API v3 and GraphQL API v4. You can paste any public repository URL or identifier (such as "facebook/react", "astral-sh/uv", or "shadcn/ui") to inspect real-time star velocity, open good-first-issues, license details, and maintainer turnaround in seconds.',
  },
  {
    icon: Sparkles,
    q: 'How does the AI Issue Solver & PR Drafter Studio assist contributors?',
    a: 'When you find an open issue labeled "good first issue", the AI Issue Solver analyzes the issue description and repository tech stack to generate an atomic solution plan, code implementation patch, unit test suite recommendations, and an explanatory PR body ready to submit to the upstream maintainers.',
  },
  {
    icon: Bot,
    q: 'How does the User Skill Auto-Detector work with GitHub profiles?',
    a: 'Entering your GitHub username prompts GitMatch.AI to inspect your public repositories, languages, and star activity. It auto-detects your primary developer stack (e.g. React, Next.js, TypeScript, Tailwind CSS) and immediately recalculates match-fit percentages across all discovery projects.',
  },
  {
    icon: ShieldCheck,
    q: 'What is the "Bus Factor" metric and why is it critical for choosing projects?',
    a: 'The Bus Factor measures the minimum number of core maintainers whose absence would cause a repository to stall. GitMatch.AI highlights projects with distributed maintainership and active core teams (Grade A+), ensuring first-time contributors receive timely code reviews, helpful mentorship, and merged PRs.',
  },
];

export default function AEOFAQSection() {
  return (
    <section className="space-y-6 font-mono" aria-label="Frequently Asked Questions about GitMatch.AI">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
          KNOWLEDGE HUB &amp; AEO DIRECTORY
        </span>
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          GitMatch.AI — Frequently Asked Questions &amp; Open Source Intelligence
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
