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
  intensity: RoastIntensity,
  projectsText?: string,
  githubData?: any
): RoastResult {
  const isSpicy = intensity === 'spicy';
  const isNuclear = intensity === 'nuclear';

  const devName = name || (githubData?.name ? githubData.name : 'Developer');
  const bio = (urlOrBio || (githubData?.bio ? githubData.bio : '')).toLowerCase();
  const projects = (projectsText || (githubData?.formattedProjectsText ? githubData.formattedProjectsText : '')).toLowerCase();
  const repoCount = githubData?.publicRepos ?? (projects.split('\n').filter(Boolean).length || 3);
  const followerCount = githubData?.followers ?? 12;

  // Detect specific traits from real inputs
  const hasAi = bio.includes('ai') || bio.includes('gpt') || bio.includes('llm') || projects.includes('ai') || projects.includes('gemini');
  const hasFullstack = bio.includes('full stack') || bio.includes('fullstack') || bio.includes('mern') || bio.includes('next');
  const hasWeb3 = bio.includes('web3') || bio.includes('crypto') || bio.includes('solidity') || projects.includes('token');
  const hasJunior = bio.includes('passionate') || bio.includes('aspiring') || bio.includes('learner') || bio.includes('junior') || projects.includes('todo');
  const hasSenior = bio.includes('architect') || bio.includes('principal') || bio.includes('lead') || bio.includes('distributed') || repoCount > 20;

  // Dynamic scores based on detected profile
  let designScore = isNuclear ? 42 : isSpicy ? 58 : 72;
  let projectScore = isNuclear ? 45 : isSpicy ? 62 : 75;
  let bioScore = isNuclear ? 35 : isSpicy ? 50 : 65;
  let uxScore = isNuclear ? 48 : isSpicy ? 64 : 76;
  let recruiterScore = isNuclear ? 40 : isSpicy ? 55 : 70;

  if (hasSenior || repoCount > 15) {
    projectScore += 15;
    recruiterScore += 12;
  }
  if (hasJunior) {
    bioScore -= 12;
    projectScore -= 10;
  }

  const overallScore = Math.min(
    95,
    Math.max(20, Math.round((designScore + projectScore + bioScore + uxScore + recruiterScore) / 5))
  );

  // Truly dynamic roast generation based on real data
  let overallVerdict = '';
  let topRoastPunchline = '';
  let designRoast = '';
  let projectRoast = '';
  let bioRoast = '';
  let uxRoast = '';
  let recruiterRoast = '';

  if (githubData) {
    overallVerdict = `High commit volume with ${githubData.publicRepos} public repositories, but needs sharper production branding and live deployed showcase links.`;
    topRoastPunchline = `You have ${githubData.publicRepos} repositories on GitHub, but half of them look like side quests you abandoned at 2 AM after writing the README.`;
    projectRoast = `Analyzed ${githubData.topRepos?.length || 5} active repositories (${githubData.topRepos?.map((r: any) => r.name).slice(0, 3).join(', ') || 'repos'}). Good coding persistence, but add live demo badges and test suites so recruiters don't have to clone your code locally.`;
  } else if (hasAi) {
    overallVerdict = 'Heavy on modern AI buzzwords and LLM wrappers, but needs deeper backend telemetry and production resilience.';
    topRoastPunchline = 'Calling OpenAI and Gemini APIs through 15 lines of fetch code does not make you an AI Research Scientist.';
    projectRoast = 'Your AI projects rely heavily on API wrappers. Build custom vector embeddings, local offline models, or fine-tuned weights to stand out from the crowd.';
  } else if (hasSenior) {
    overallVerdict = 'Technically formidable with solid engineering depth, but your presentation aesthetics look stuck in a vintage Unix terminal.';
    topRoastPunchline = 'You can architect a distributed consensus cluster in your sleep, but asking you to pick a modern CSS font palette is like asking a cat to swim.';
    projectRoast = 'Great low-level depth and technical complexity. Present your architecture diagrams in high-res SVGs so non-technical hiring managers can appreciate your scale.';
  } else if (hasWeb3) {
    overallVerdict = 'Decentralized ambition with 0 centralized revenue. Lots of tokens, not enough unit tests.';
    topRoastPunchline = 'Your smart contracts were audited by your Discord group chat and your roadmap has been in "Phase 1: Concept" for 18 months.';
    projectRoast = 'Replace hackathon mockups with audited, gas-optimized contracts that actually have live mainnet transaction volume.';
  } else if (hasJunior) {
    overallVerdict = 'Early-career portfolio showing great enthusiasm, but needs to replace beginner tutorial projects with real client problem solving.';
    topRoastPunchline = 'Every recruiter has seen the "Passionate coder who drinks coffee" bio 10,000 times this week. Give them specific metrics.';
    projectRoast = 'Upgrade your projects by adding user authentication, database persistence (PostgreSQL/Supabase), and automated CI/CD deployment.';
  } else {
    overallVerdict = `Clean developer presence for ${devName}, but lacks a definitive signature project that forces recruiters to book an interview.`;
    topRoastPunchline = `Your portfolio is the definition of "safe." It won't get you fired, but it won't make a hiring manager drop their coffee in excitement either.`;
    projectRoast = `Your projects showcase syntax fluency, but lack quantifiable business impact (e.g. "reduced load times by 40%" or "served 5,000 active users").`;
  }

  // Design roast
  designRoast = isNuclear
    ? `The color palette and spacing on ${devName}'s profile lack visual hierarchy. The contrast ratios need an immediate overhaul.`
    : `Standard developer aesthetic. Clean structure, but needs curated typography (Outfit/Inter) and refined card padding to feel state-of-the-art.`;

  // Bio roast
  bioRoast = isNuclear
    ? `Your bio is filled with passive buzzwords. Tell recruiters what specific systems and business value you ship in the first 5 words.`
    : `Your bio describes your interest in coding rather than your engineering output. State your exact stack, specialty, and quantified career scope.`;

  // UX roast
  uxRoast = `Ensure all project links open directly to live deployed URLs (Vercel/Railway) rather than just raw GitHub repository trees.`;

  // Recruiter roast
  recruiterRoast = `Add a prominent 1-click "Download PDF Resume" button in the hero header and place your verified GitHub & LinkedIn handles front and center.`;

  return {
    id: `roast_${Date.now()}`,
    developerName: devName,
    targetUrlOrTitle: urlOrBio || (githubData ? `github.com/${githubData.username}` : devName),
    intensity,
    overallScore,
    overallVerdict,
    topRoastPunchline,
    survivalBadge:
      overallScore < 45
        ? '💀 Barely Survived the Roast'
        : overallScore < 75
        ? '🔥 Singed by the Roast (Refactor Mode)'
        : '🏆 S-Tier Portfolio Battle-Hardened',
    categories: {
      design: {
        score: designScore,
        grade: getScoreGrade(designScore),
        roast: designRoast,
        actionableTip:
          'Use a high-contrast dark palette with 1 vibrant brand accent (e.g. emerald or orange). Upgrade typography to Google Font Outfit.',
        keyIssues: ['Visual contrast tuning', 'Whitespace consistency', 'Mobile padding alignment'],
      },
      projects: {
        score: projectScore,
        grade: getScoreGrade(projectScore),
        roast: projectRoast,
        actionableTip:
          'Ensure every featured project has: 1) A live deployed URL, 2) A clear architecture summary, 3) Real database/auth integration.',
        keyIssues: ['Missing live deployed demos', 'Needs architecture diagrams', 'Quantify user/performance impact'],
      },
      aboutBio: {
        score: bioScore,
        grade: getScoreGrade(bioScore),
        roast: bioRoast,
        actionableTip:
          'Rewrite into a value-driven hook: "[Role] specialized in [Tech Stack]. Built systems delivering [Specific Outcome/Metric]."',
        keyIssues: ['Eliminate generic buzzwords', 'Lead with core specialty', 'Add quantified achievements'],
      },
      uxAndSpeed: {
        score: uxScore,
        grade: getScoreGrade(uxScore),
        roast: uxRoast,
        actionableTip:
          'Verify sub-1.5s page load speed, optimize media to WebP format, and ensure zero horizontal scroll on mobile devices.',
        keyIssues: ['Mobile viewport optimization', 'Fast asset delivery', 'Direct demo navigation'],
      },
      recruiterAppeal: {
        score: recruiterScore,
        grade: getScoreGrade(recruiterScore),
        roast: recruiterRoast,
        actionableTip:
          'Include a 1-click ATS Resume PDF download button, clear role title, and contact methods in the first viewport fold.',
        keyIssues: ['Prominent resume CTA', 'Clean tech stack list', 'Instant contact accessibility'],
      },
    },
    rewrittenHeroBio: {
      beforeBio: bio ? bio.slice(0, 100) : 'Software developer building web apps',
      afterBio: `${devName} is a Full-Stack Engineer specialized in modern web architectures, scalable cloud backends, and high-performance user interfaces.`,
      improvedTagline: 'Engineering high-impact web products & resilient cloud architectures.',
      targetKeywords: ['Full-Stack Engineer', 'TypeScript', 'Next.js', 'PostgreSQL', 'Cloud Architecture'],
    },
    actionRoadmap: [
      {
        priority: 1,
        title: 'Add Live Production Links to All Projects',
        description: 'Never force recruiters to clone a repository to see your UI. Embed live interactive deployment links for every repo.',
        impact: 'CRITICAL',
      },
      {
        priority: 2,
        title: 'Sharpen Hero Bio Hook',
        description: 'Replace generic "passionate developer" descriptions with your exact technical stack and production accomplishments.',
        impact: 'HIGH',
      },
      {
        priority: 3,
        title: 'Place 1-Click ATS Resume Download in Hero',
        description: 'Add a direct PDF resume download button right beside your primary contact button.',
        impact: 'HIGH',
      },
      {
        priority: 4,
        title: 'Enhance Readme & Architecture Documentation',
        description: 'Add system architecture diagrams and tech stack badges to your top GitHub repositories.',
        impact: 'MEDIUM',
      },
    ],
    createdAt: new Date().toISOString(),
  };
}
