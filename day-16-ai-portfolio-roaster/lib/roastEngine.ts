import { RoastIntensity, RoastResult } from '@/types';

export function getScoreGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

export function generateClientFallbackRoast(
  name: string,
  urlOrBio: string,
  intensity: RoastIntensity
): RoastResult {
  const isSpicy = intensity === 'spicy';
  const isNuclear = intensity === 'nuclear';

  const designScore = isNuclear ? 34 : isSpicy ? 48 : 62;
  const projectScore = isNuclear ? 38 : isSpicy ? 54 : 68;
  const bioScore = isNuclear ? 25 : isSpicy ? 42 : 58;
  const uxScore = isNuclear ? 45 : isSpicy ? 58 : 72;
  const recruiterScore = isNuclear ? 32 : isSpicy ? 50 : 65;

  const overallScore = Math.round(
    (designScore + projectScore + bioScore + uxScore + recruiterScore) / 5
  );

  return {
    id: `roast_${Date.now()}`,
    developerName: name || 'Anonymous Developer',
    targetUrlOrTitle: urlOrBio,
    intensity,
    overallScore,
    overallVerdict: isNuclear
      ? 'Technically alive, aesthetically in a vegetative state, and commercially unemployable.'
      : isSpicy
      ? 'Looks like a YouTube tutorial clone graveyard wrapped in a 2019 Bootstrap template.'
      : 'Good foundational effort, but lacks unique architectural personality and clear proof of impact.',
    topRoastPunchline: isNuclear
      ? 'Your portfolio looks like someone asked ChatGPT to build a site using only deprecated npm packages and bad life choices.'
      : isSpicy
      ? 'A Todo app, a Weather widget, and a Calculator. The holy trinity of "I watched one 40-minute Udemy crash course."'
      : 'Your projects demonstrate basic coding syntax, but fail to show real users, backend scaling, or business ROI.',
    survivalBadge:
      overallScore < 40
        ? '💀 Barely Survived the Roast (Critical Life Support)'
        : overallScore < 70
        ? '🔥 Singed by the Roast (Major Refactoring Required)'
        : '🛡️ Portfolio Battle-Hardened (Recruiter Ready)',
    categories: {
      design: {
        score: designScore,
        grade: getScoreGrade(designScore),
        roast: isNuclear
          ? 'Your color palette looks like a clown exploded in a terminal. The typography hierarchy is so broken it violates the Geneva Conventions.'
          : 'Gradients so aggressive they distract from your code. Standard template vibes with generic unkerned sans-serif fonts.',
        actionableTip:
          'Stick to a curated 3-color palette: 1 dark neutral background, 1 clean slate card surface, and 1 high-contrast accent. Upgrade to Google Font Outfit or Inter.',
        keyIssues: ['Inconsistent padding', 'Low-contrast text', 'Aggressive drop shadows'],
      },
      projects: {
        score: projectScore,
        grade: getScoreGrade(projectScore),
        roast: isNuclear
          ? 'You have 4 unfinished repositories where the only commit message is "initial commit" and "fix bug please work".'
          : 'Tutorial projects masquerading as full-stack applications. Recruiters click away within 4 seconds of seeing a basic Todo list.',
        actionableTip:
          'Replace 3 beginner clones with ONE deep production-grade app that solves an actual user problem with live auth, database, and telemetry.',
        keyIssues: ['Generic tutorial clones', 'No live demo links', 'Missing technical architecture diagrams'],
      },
      aboutBio: {
        score: bioScore,
        grade: getScoreGrade(bioScore),
        roast: isNuclear
          ? '"Passionate developer who loves to code and drink coffee." Congratulations, you described every single human who bought a mechanical keyboard.'
          : 'Your bio reads like an AI-generated LinkedIn summary from 2021. Tell recruiters what specific systems you build, not that you "learn fast".',
        actionableTip:
          'Rewrite into a value-driven hook: "Full-Stack Engineer specialized in Next.js, Node.js & high-throughput APIs. Built systems handling 100k+ events."',
        keyIssues: ['Cliche buzzwords', 'Zero quantified achievements', 'Too informal / generic'],
      },
      uxAndSpeed: {
        score: uxScore,
        grade: getScoreGrade(uxScore),
        roast: isNuclear
          ? 'Your site takes 8 seconds to load 14 uncompressed PNG screenshots. Mobile responsiveness looks like a jigsaw puzzle in an earthquake.'
          : 'Navigation is clunky with redundant anchor links. Smooth scrolling feels laggy on standard mobile viewports.',
        actionableTip:
          'Compress all media to WebP/AVIF, verify Lighthouse performance > 95, and ensure sticky navbar works seamlessly on iPhone & Android.',
        keyIssues: ['Heavy uncompressed assets', 'Mobile layout overflow', 'Laggy scroll animations'],
      },
      recruiterAppeal: {
        score: recruiterScore,
        grade: getScoreGrade(recruiterScore),
        roast: isNuclear
          ? 'If a FAANG recruiter opens this tab, they will close it faster than an unskippable YouTube ad.'
          : 'Your contact button opens a default mailto: link that crashes half the desktop clients. No downloadable 1-page PDF resume in sight.',
        actionableTip:
          'Add a prominent "Download Resume (PDF)" button in the hero header, link verified GitHub/LinkedIn icons, and embed an instant contact form.',
        keyIssues: ['No direct resume download', 'Missing tech stack breakdown', 'Vague job title definition'],
      },
    },
    rewrittenHeroBio: {
      beforeBio:
        'I am a passionate and hardworking full stack developer looking for exciting opportunities. I love coding and solving complex problems.',
      afterBio:
        'Software Engineer specializing in scalable TypeScript, Next.js & distributed cloud backends. Architect of high-performance web apps with 99.9% uptime reliability.',
      improvedTagline: 'Building high-impact web products & resilient cloud architectures.',
      targetKeywords: ['Full-Stack Engineer', 'TypeScript', 'Next.js', 'PostgreSQL', 'API Design'],
    },
    actionRoadmap: [
      {
        priority: 1,
        title: 'Purge Generic Tutorial Clones',
        description: 'Delete Todo & Weather apps. Replace with 1 comprehensive full-stack app featuring real database and auth.',
        impact: 'CRITICAL',
      },
      {
        priority: 2,
        title: 'Revamp Hero Tagline & Bio',
        description: 'Eliminate "passionate coder" cliches. State your exact stack, specialty, and quantified career accomplishments.',
        impact: 'HIGH',
      },
      {
        priority: 3,
        title: 'Add Prominent Resume Download & GitHub Stats',
        description: 'Place a 1-click ATS PDF resume button right beside your primary CTA button.',
        impact: 'HIGH',
      },
      {
        priority: 4,
        title: 'Fix Mobile Breakpoints & Asset Compression',
        description: 'Convert oversized PNGs to WebP and ensure 0 horizontal scroll overflow on mobile.',
        impact: 'MEDIUM',
      },
    ],
    createdAt: new Date().toISOString(),
  };
}
