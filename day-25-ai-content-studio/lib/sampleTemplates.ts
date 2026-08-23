export interface StarterIdea {
  id: string;
  title: string;
  topic: string;
  category: 'Build in Public' | 'Tech Contrarian' | 'Career Advice' | 'System Architecture';
  suggestedPlatform: 'twitter' | 'linkedin' | 'carousel';
}

export const STARTER_IDEAS: StarterIdea[] = [
  {
    id: 'idea_1',
    title: '48-Hour AI Micro-SaaS Build',
    topic: 'How I built and shipped an AI symptom triage web app in 48 hours using Gemini API + Next.js 16 (and what broke along the way)',
    category: 'Build in Public',
    suggestedPlatform: 'twitter',
  },
  {
    id: 'idea_2',
    title: 'Senior Dev Architecture Rules',
    topic: '7 Architectural rules Senior Engineers follow that Junior Engineers usually ignore until production goes down',
    category: 'System Architecture',
    suggestedPlatform: 'carousel',
  },
  {
    id: 'idea_3',
    title: 'The Truth About Tech Hiring',
    topic: 'Why grinding 400 LeetCode problems is the worst way to land a high-paying Senior Developer job in 2026',
    category: 'Tech Contrarian',
    suggestedPlatform: 'linkedin',
  },
  {
    id: 'idea_4',
    title: 'Database Migration Story',
    topic: 'We migrated our multi-tenant SaaS from heavy AWS RDS to lightweight distributed edge SQLite replicas: Latency dropped by 74%',
    category: 'System Architecture',
    suggestedPlatform: 'linkedin',
  },
  {
    id: 'idea_5',
    title: 'Modern AI Developer Stack',
    topic: 'The 2026 Modern AI Engineer Tech Stack: Structured Outputs, Local Ollama, Vercel AI SDK, and Vector DBs',
    category: 'Build in Public',
    suggestedPlatform: 'carousel',
  },
];
