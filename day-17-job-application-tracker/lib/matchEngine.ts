import { JobMatchResult, CoverLetterTone, InterviewQuestion } from '@/types';

export function calculateClientFallbackMatch(
  jobDescription: string,
  resumeText: string,
  candidateSkills: string[] = []
): JobMatchResult {
  const jdLower = jobDescription.toLowerCase();
  const resumeLower = (resumeText + ' ' + candidateSkills.join(' ')).toLowerCase();

  const commonKeywords = [
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'PostgreSQL',
    'Python',
    'SQL',
    'Tailwind CSS',
    'GraphQL',
    'REST APIs',
    'Docker',
    'Kubernetes',
    'AWS',
    'GCP',
    'Azure',
    'Redis',
    'Git',
    'CI/CD',
    'Microservices',
    'Performance Optimization',
    'Testing',
    'Jest',
    'Playwright',
    'Agile',
    'Scrum',
    'System Design',
    'Security',
    'WebSockets',
  ];

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  commonKeywords.forEach((kw) => {
    const isRequired = jdLower.includes(kw.toLowerCase());
    const hasSkill = resumeLower.includes(kw.toLowerCase());

    if (isRequired && hasSkill) {
      matchedSkills.push(kw);
    } else if (isRequired && !hasSkill) {
      missingSkills.push(kw);
    }
  });

  const totalRequired = matchedSkills.length + missingSkills.length;
  let matchScore = 75;
  if (totalRequired > 0) {
    matchScore = Math.min(96, Math.max(45, Math.round((matchedSkills.length / totalRequired) * 100)));
  }

  let verdict = 'Strong Candidate Fit — Good technical alignment with core stack';
  if (matchScore >= 90) {
    verdict = 'Exceptional Match — Standout profile matching high-priority requirements';
  } else if (matchScore < 70) {
    verdict = 'Moderate Fit — Align resume terminology with key required keywords';
  }

  const strengths = [
    `Demonstrated proficiency in ${matchedSkills.slice(0, 3).join(', ') || 'modern web development stacks'}`,
    'Strong track record shipping scalable, production-grade applications',
    'Clear alignment with role technical scope and engineering culture',
  ];

  const recommendations = missingSkills.length > 0
    ? [
        `Explicitly mention exposure to ${missingSkills.slice(0, 2).join(' or ')} in your project bullet points`,
        'Quantify past metrics (e.g. latency reductions, user growth, or test coverage %)',
        'Ensure GitHub or live deployment links are visible at the top of your resume',
      ]
    : [
        'Add live deployed production links for your top 2 featured projects',
        'Quantify engineering outcomes (e.g. "improved throughput by 35%")',
      ];

  const summary = `Full-Stack Software Engineer with proven experience building high-performance web systems using ${matchedSkills.slice(0, 4).join(', ') || 'React, TypeScript, and Node.js'}. Specialized in shipping clean, scalable applications with measurable business impact.`;

  return {
    matchScore,
    verdict,
    matchedSkills: matchedSkills.length > 0 ? matchedSkills : ['React', 'TypeScript', 'Node.js', 'REST APIs'],
    missingSkills: missingSkills.slice(0, 4),
    resumeStrengths: strengths,
    gapRecommendations: recommendations,
    tailoredSummary: summary,
  };
}

export function generateClientFallbackCoverLetter(
  company: string,
  role: string,
  candidateName: string,
  jobDescription: string,
  tone: CoverLetterTone = 'executive'
): string {
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (tone === 'enthusiastic') {
    return `${date}

Hiring Team at ${company}
Re: Application for ${role}

Dear ${company} Team,

I am thrilled to apply for the ${role} position at ${company}. Having followed your product advancements and engineering culture, I have been deeply inspired by how your team approaches developer experience and high-scale reliability.

Throughout my engineering journey, I have specialized in building high-performance web applications using modern TypeScript, Next.js, and scalable cloud backends. When reviewing the requirements for ${role}, I was immediately energized by the opportunity to apply my background in distributed systems, clean component architectures, and user-centric design to accelerate ${company}'s roadmap.

I would welcome the opportunity to discuss how my technical passion and execution velocity can add immediate value to ${company}. Thank you for your time and consideration!

Warm regards,
${candidateName}
${candidateName.toLowerCase().replace(/\s+/g, '')}@example.com`;
  }

  if (tone === 'metric') {
    return `${date}

Hiring Leadership at ${company}
Subject: Impact-Driven Application for ${role}

Dear ${company} Hiring Team,

I am writing to express my strong interest in the ${role} role at ${company}. Over the past 4+ years, my engineering focus has centered on measurable business outcomes, system performance optimization, and shipping reliable production architectures.

Key highlights of my recent technical impact include:
• Architected scalable full-stack web applications serving 100k+ active users with 99.9% uptime.
• Reduced client-side bundle size and P99 latency by over 40% through modern Next.js and caching strategies.
• Implemented automated CI/CD and integration test pipelines, accelerating feature deployment velocity by 2x.

I am confident that my metric-driven approach to software engineering and passion for high-reliability systems align directly with ${company}'s ambitious goals for ${role}.

Best regards,
${candidateName}`;
  }

  return `${date}

Hiring Team at ${company}
Application for ${role}

Dear Hiring Team,

I am writing to express my enthusiastic interest in the ${role} position at ${company}. With a strong foundation in modern full-stack development, TypeScript, and cloud-native architectures, I am excited about the opportunity to contribute to your engineering organization.

In my recent work, I have architected and deployed resilient web applications featuring low-latency API layers, modular frontend architectures, and automated testing suites. My approach to engineering balances rapid iteration with robust architectural principles, ensuring high performance and long-term maintainability.

The challenges outlined in the ${role} description closely mirror my technical strengths and career focus. I look forward to the possibility of discussing how my technical background and problem-solving mindset can support ${company}'s continued growth.

Sincerely,
${candidateName}`;
}

export function generateClientFallbackInterviewPrep(
  company: string,
  role: string,
  jobDescription: string
): InterviewQuestion[] {
  return [
    {
      id: 'q1',
      type: 'Technical',
      question: `How would you optimize React / Next.js application performance when rendering large dynamic data sets at ${company}?`,
      whyTheyAsk: 'Evaluates practical understanding of client vs. server rendering, memoization, virtualization, and web vitals.',
      starOutline: {
        situation: 'Encountered high memory usage and frame drops when rendering large tables with 10k+ rows.',
        task: 'Achieve 60 FPS smooth scrolling and sub-100ms interaction latency.',
        action: 'Implemented window virtualization (TanStack Virtual), memoized row components, and deferred non-critical filters with useDeferredValue.',
        result: 'Reduced memory footprint by 65% and boosted Lighthouse Performance score from 62 to 98.',
      },
    },
    {
      id: 'q2',
      type: 'System Design',
      question: `Design an idempotent, high-throughput API gateway with distributed rate limiting for ${company}.`,
      whyTheyAsk: 'Tests distributed systems fundamentals, Redis token bucket algorithms, and fault tolerance.',
      starOutline: {
        situation: 'Downstream microservices were facing cascading failures during sudden viral traffic surges.',
        task: 'Implement a resilient distributed rate limiter with zero single points of failure.',
        action: 'Architected a sliding-window counter algorithm using Redis cluster with atomic Lua scripts and fallback local in-memory buffers.',
        result: 'Protected upstream databases from 50k RPS spikes while maintaining 99.99% gateway availability.',
      },
    },
    {
      id: 'q3',
      type: 'Behavioral',
      question: 'Tell me about a time you had a technical disagreement with a team member. How did you resolve it?',
      whyTheyAsk: 'Assesses communication skills, empathy, bias for action, and data-driven decision making.',
      starOutline: {
        situation: 'Disagreement on choosing between GraphQL vs. REST for a new public developer API.',
        task: 'Align the engineering team without delaying the sprint release deadline.',
        action: 'Created a side-by-side benchmark prototype measuring payload latency, caching simplicity, and SDK generation ergonomics.',
        result: 'Team consensus achieved within 48 hours, resulting in on-time delivery with zero regression issues.',
      },
    },
    {
      id: 'q4',
      type: 'Company Specific',
      question: `Why do you want to join ${company} specifically, and what impact do you hope to make in your first 90 days?`,
      whyTheyAsk: `Probes candidate motivation, research depth into ${company}'s product vision, and proactive onboarding mindset.`,
      starOutline: {
        situation: `Following ${company}'s engineering updates and mission.`,
        task: 'Deliver meaningful engineering contributions in the first 90 days.',
        action: 'First 30 days: Deep-dive codebase and fix top backlog bug. 60 days: Ship first feature with 100% test coverage. 90 days: Lead architectural sprint enhancement.',
        result: 'Rapid onboarding with immediate peer trust and production value delivered.',
      },
    },
  ];
}
