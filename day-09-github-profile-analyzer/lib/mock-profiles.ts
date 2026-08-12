import { GitHubProfileData } from '@/types';
import { calculateImpactScores } from './impact-score';

export const PRESET_PROFILES: Record<string, GitHubProfileData> = {
  abdulnabii: {
    username: 'abdulnabii',
    name: 'Abdul Nabi',
    avatarUrl: 'https://avatars.githubusercontent.com/u/10248492?v=4',
    bio: 'AI/ML Systems Engineer & Full-Stack Architect. Building 30 AI Projects in 30 Days.',
    company: 'Antigravity AI Labs',
    location: 'San Francisco, CA / Remote',
    publicRepos: 42,
    followers: 1280,
    following: 194,
    totalCommitsPastYear: 1840,
    currentStreakDays: 45,
    longestStreakDays: 127,
    nightOwlPercentage: 74,
    uniqueCollaborators: 38,
    languages: [
      { language: 'TypeScript', percentage: 42, color: '#3178c6', bytes: 420000 },
      { language: 'Python', percentage: 28, color: '#3572A5', bytes: 280000 },
      { language: 'Go', percentage: 14, color: '#00ADD8', bytes: 140000 },
      { language: 'CSS / Tailwind', percentage: 10, color: '#563d7c', bytes: 100000 },
      { language: 'Shell', percentage: 6, color: '#89e051', bytes: 60000 },
    ],
    repos: calculateImpactScores([
      {
        name: 'mini-projects',
        description: '30 Full-Stack AI Web Applications Built Sequentially in 30 Days.',
        stars: 482,
        forks: 94,
        openIssues: 3,
        primaryLanguage: 'TypeScript',
        hasReadme: true,
        starGrowthRate: 14.2,
        url: 'https://github.com/abdulnabii/mini-projects',
        updatedAt: '2026-08-11',
      },
      {
        name: 'medical-diagnosis-ai',
        description: 'Deep Learning Medical Image Classification & Triage Pipeline.',
        stars: 340,
        forks: 62,
        openIssues: 5,
        primaryLanguage: 'Python',
        hasReadme: true,
        starGrowthRate: 8.5,
        url: 'https://github.com/abdulnabii/medical-diagnosis-ai',
        updatedAt: '2026-08-04',
      },
      {
        name: 'stock-pulse-engine',
        description: 'Real-Time Financial Sentiment Terminal & Market Data Simulator.',
        stars: 215,
        forks: 38,
        openIssues: 1,
        primaryLanguage: 'TypeScript',
        hasReadme: true,
        starGrowthRate: 6.1,
        url: 'https://github.com/abdulnabii/stock-pulse-engine',
        updatedAt: '2026-08-10',
      },
      {
        name: 'fastapi-ai-boilerplate',
        description: 'Production-ready FastAPI + LangChain microservices setup.',
        stars: 180,
        forks: 29,
        openIssues: 2,
        primaryLanguage: 'Python',
        hasReadme: true,
        starGrowthRate: 3.4,
        url: 'https://github.com/abdulnabii/fastapi-ai-boilerplate',
        updatedAt: '2026-07-28',
      },
    ]),
    contributions: generateMockHeatmap(1840),
    persona: {
      archetype: 'The Midnight AI Architect',
      summary: 'You are a TypeScript-first polyglot who moonlights in Python when deep learning models get serious. Your commit history reads like a precision product roadmap — verb-led, atomic, and disturbingly organized for someone who codes past midnight.',
      traits: ['Systems Thinker', 'AI/ML Specialist', 'Night Owl (74%)', 'Clean Committer', 'Serial Builder'],
      funFact: '74% of your commits land between 10pm and 2am — your best architectural breakthroughs happen when the rest of the tech world is fast asleep.',
      technicalStrength: 'Full-stack AI systems engineering with deep specialization in Next.js 14, Python ML pipelines, and real-time SVG analytics.',
    },
  },
  torvalds: {
    username: 'torvalds',
    name: 'Linus Torvalds',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1024025?v=4',
    bio: 'Creator of Linux Kernel & Git Version Control System.',
    company: 'Linux Foundation',
    location: 'Portland, OR',
    publicRepos: 8,
    followers: 215000,
    following: 0,
    totalCommitsPastYear: 3200,
    currentStreakDays: 84,
    longestStreakDays: 365,
    nightOwlPercentage: 35,
    uniqueCollaborators: 420,
    languages: [
      { language: 'C', percentage: 88, color: '#555555', bytes: 8800000 },
      { language: 'Assembly', percentage: 6, color: '#6E4C13', bytes: 600000 },
      { language: 'Makefile', percentage: 4, color: '#427819', bytes: 400000 },
      { language: 'Shell', percentage: 2, color: '#89e051', bytes: 200000 },
    ],
    repos: calculateImpactScores([
      {
        name: 'linux',
        description: 'Linux kernel source tree',
        stars: 178000,
        forks: 54000,
        openIssues: 290,
        primaryLanguage: 'C',
        hasReadme: true,
        starGrowthRate: 120.5,
        url: 'https://github.com/torvalds/linux',
        updatedAt: '2026-08-11',
      },
      {
        name: 'pesconvert',
        description: 'Embroidery file converter for Brother PES files',
        stars: 940,
        forks: 120,
        openIssues: 4,
        primaryLanguage: 'C',
        hasReadme: true,
        starGrowthRate: 1.2,
        url: 'https://github.com/torvalds/pesconvert',
        updatedAt: '2026-05-14',
      },
    ]),
    contributions: generateMockHeatmap(3200),
    persona: {
      archetype: 'The Kernel Titan',
      summary: 'You write bare-metal C that powers 90% of the world’s cloud servers and top 500 supercomputers. Zero patience for bad memory allocation or fluff.',
      traits: ['Systems Master', 'Pioneer', 'C Purist', 'No-Nonsense Reviewer'],
      funFact: 'Created Git in 10 days because existing version control tools annoyed you.',
      technicalStrength: 'Low-level systems kernel architecture, memory management, and distributed version control.',
    },
  },
  gaearon: {
    username: 'gaearon',
    name: 'Dan Abramov',
    avatarUrl: 'https://avatars.githubusercontent.com/u/810438?v=4',
    bio: 'Co-creator of Redux, Create React App, and React core team contributor.',
    company: 'Software Explorer',
    location: 'London, UK',
    publicRepos: 260,
    followers: 82000,
    following: 12,
    totalCommitsPastYear: 940,
    currentStreakDays: 12,
    longestStreakDays: 98,
    nightOwlPercentage: 58,
    uniqueCollaborators: 95,
    languages: [
      { language: 'JavaScript', percentage: 55, color: '#f1e05a', bytes: 550000 },
      { language: 'TypeScript', percentage: 35, color: '#3178c6', bytes: 350000 },
      { language: 'HTML/CSS', percentage: 10, color: '#e34c26', bytes: 100000 },
    ],
    repos: calculateImpactScores([
      {
        name: 'redux',
        description: 'Predictable state container for JavaScript apps',
        stars: 60500,
        forks: 15400,
        openIssues: 12,
        primaryLanguage: 'TypeScript',
        hasReadme: true,
        starGrowthRate: 18.0,
        url: 'https://github.com/gaearon/redux',
        updatedAt: '2026-07-20',
      },
      {
        name: 'overreacted.io',
        description: 'Personal blog about software engineering concepts',
        stars: 6200,
        forks: 820,
        openIssues: 5,
        primaryLanguage: 'JavaScript',
        hasReadme: true,
        starGrowthRate: 5.4,
        url: 'https://github.com/gaearon/overreacted.io',
        updatedAt: '2026-06-18',
      },
    ]),
    contributions: generateMockHeatmap(940),
    persona: {
      archetype: 'The Frontend Educator',
      summary: 'You demystify complex UI mental models through elegant code abstractions and legendary deep-dive blog posts.',
      traits: ['UI Innovator', 'Thoughtful Educator', 'State Management Pioneer'],
      funFact: 'Rewrote frontend state management paradigms with Redux while preparing for a conference talk.',
      technicalStrength: 'React internals, reactive UI state machines, and empathetic technical writing.',
    },
  },
};

function generateMockHeatmap(totalCount: number) {
  const days: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    let count = 0;
    if (!isWeekend && Math.random() > 0.25) {
      count = Math.floor(Math.random() * 12) + 1;
    } else if (isWeekend && Math.random() > 0.6) {
      count = Math.floor(Math.random() * 6) + 1;
    }

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0 && count <= 3) level = 1;
    else if (count > 3 && count <= 6) level = 2;
    else if (count > 6 && count <= 10) level = 3;
    else if (count > 10) level = 4;

    days.push({ date: dateStr, count, level });
  }

  return days;
}

export function generateGenericProfile(username: string): GitHubProfileData {
  const cleanUser = username.trim().toLowerCase();
  if (PRESET_PROFILES[cleanUser]) {
    return PRESET_PROFILES[cleanUser];
  }

  // Synthesize realistic profile for any custom username
  const nameFormatted = cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1);
  return {
    username: cleanUser,
    name: nameFormatted,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUser}`,
    bio: `Full-Stack Software Engineer & Open Source Contributor interested in modern web systems.`,
    company: `${nameFormatted} Labs`,
    location: 'Global / Remote',
    publicRepos: 24,
    followers: 340,
    following: 120,
    totalCommitsPastYear: 1120,
    currentStreakDays: 18,
    longestStreakDays: 64,
    nightOwlPercentage: 62,
    uniqueCollaborators: 22,
    languages: [
      { language: 'TypeScript', percentage: 48, color: '#3178c6', bytes: 480000 },
      { language: 'JavaScript', percentage: 26, color: '#f1e05a', bytes: 260000 },
      { language: 'Python', percentage: 16, color: '#3572A5', bytes: 160000 },
      { language: 'CSS', percentage: 10, color: '#563d7c', bytes: 100000 },
    ],
    repos: calculateImpactScores([
      {
        name: `${cleanUser}-app-suite`,
        description: `Full-stack modern Next.js application suite with automated CI/CD workflows.`,
        stars: 128,
        forks: 24,
        openIssues: 2,
        primaryLanguage: 'TypeScript',
        hasReadme: true,
        starGrowthRate: 5.2,
        url: `https://github.com/${cleanUser}/${cleanUser}-app-suite`,
        updatedAt: new Date().toISOString().split('T')[0],
      },
      {
        name: `ai-helper-tools`,
        description: `Utility library for LLM integrations and prompt formatting.`,
        stars: 76,
        forks: 14,
        openIssues: 0,
        primaryLanguage: 'Python',
        hasReadme: true,
        starGrowthRate: 3.1,
        url: `https://github.com/${cleanUser}/ai-helper-tools`,
        updatedAt: '2026-08-01',
      },
    ]),
    contributions: generateMockHeatmap(1120),
    persona: {
      archetype: 'The Pragmatic Systems Builder',
      summary: `You combine high-velocity TypeScript development with a pragmatic focus on shipping functional products. Your portfolio reflects clean modular architecture and consistent commit discipline.`,
      traits: ['Full-Stack Developer', 'Pragmatic Builder', 'Clean Architecture', 'Consistent Contributor'],
      funFact: `62% of your coding activity takes place during evening hours — you do your best problem-solving with a quiet late-night workflow.`,
      technicalStrength: `Building end-to-end web applications with modern component libraries, TypeScript type safety, and REST/GraphQL APIs.`,
    },
  };
}
