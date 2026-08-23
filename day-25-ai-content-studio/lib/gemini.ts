import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  TwitterThread,
  LinkedInPost,
  LinkedInCarousel,
  HookVariant,
  EngagementRadar,
  VoiceProfile,
  LinkedInTone,
} from '@/types';

function getGenAI(): GoogleGenerativeAI | null {
  const key = process.env.GEMINI_API_KEY || '';
  if (!key) return null;
  return new GoogleGenerativeAI(key);
}

export async function generateTwitterThreadWithGemini(
  topic: string,
  voiceProfile?: VoiceProfile | null
): Promise<TwitterThread> {
  const genAI = getGenAI();

  const voiceInstruction = voiceProfile
    ? `Voice Guidelines: Tone is "${voiceProfile.tone}". Average sentence length ~${voiceProfile.avgSentenceLength} words. Emoji density is ${voiceProfile.emojiDensity}. Signature keywords: ${voiceProfile.signatureKeywords.join(', ')}.`
    : 'Voice Guidelines: Authentic, technical, build-in-public software engineer/founder. Punchy, high-signal, zero fluff.';

  if (!genAI) {
    return {
      id: 'thread_' + Date.now(),
      topic,
      tweets: [
        {
          number: 1,
          type: 'hook',
          text: `Most developers spend 40 hours building features that could be shipped in 4.\n\nHere is the exact architecture breakdown I used to ship a production AI app in 48 hours 🧵👇`,
          characterCount: 184,
        },
        {
          number: 2,
          type: 'content',
          text: `1/ The Stack Strategy:\n\n• Frontend: Next.js 16 App Router + Turbopack\n• AI Engine: Gemini 1.5 Flash (1M context)\n• Styling: Tailwind CSS\n• State: LocalStorage with typed schemas\n\nNo bloated backend servers. Zero cold-start latency.`,
          characterCount: 242,
        },
        {
          number: 3,
          type: 'content',
          text: `2/ The Biggest Bottleneck:\n\nPrompt drift. When extracting JSON schemas, LLMs love adding conversational markdown wrapping.\n\nFix: Set responseMimeType to 'application/json' in generationConfig. 100% reliable schema parsing.`,
          characterCount: 226,
        },
        {
          number: 4,
          type: 'content',
          text: `3/ Real-Time Performance:\n\nTurbopack compilation in Next.js 16 is under 800ms on hot-reload.\n\nPairing edge serverless routes with client-side optimistic UI makes the entire app feel instantaneous.`,
          characterCount: 206,
        },
        {
          number: 5,
          type: 'content',
          text: `4/ The 3 Golden Rules We Learned:\n\n1. Cache heavy AI evaluations on-device\n2. Always provide fallback offline heuristics\n3. Keep your UI feedback loops under 100ms\n\nUsers don't care about your architecture—they care about speed.`,
          characterCount: 239,
        },
        {
          number: 6,
          type: 'engagement',
          text: `5/ Quick question for fellow builders:\n\nAre you using streaming server actions or REST endpoints for your AI apps in 2026? Drop your setup below 👇`,
          characterCount: 153,
        },
        {
          number: 7,
          type: 'cta',
          text: `If you found this breakdown valuable:\n\n1. Follow @abdulnabi for daily full-stack AI engineering breakdowns\n2. Retweet the first tweet to share with fellow developers 🚀`,
          characterCount: 174,
        },
      ],
      hooks: [
        {
          style: 'Contrarian Debate',
          text: 'Stop over-engineering your AI SaaS stack. 95% of apps do not need microservices or Kafka.',
          predictedCTR: '8.4%',
          formulaExplanation: 'Challenges industry consensus with extreme clarity.',
        },
        {
          style: 'Bold Numbers / Metrics',
          text: 'From 0 to 10,000 active requests in 48 hours with $0 in cloud bills. Here is the blueprint:',
          predictedCTR: '9.2%',
          formulaExplanation: 'Highlights concrete data points and instant ROI.',
        },
      ],
      hashtags: ['#buildinpublic', '#nextjs', '#ai', '#webdev'],
      engagementRadar: {
        score: 95,
        grade: 'VIRAL',
        hookStrength: 96,
        readability: 94,
        emotionalResonance: 92,
        formattingSpacing: 98,
        predictedImpressions: '42,000 - 68,000',
        bookmarkRatio: '14.8% (Top 2%)',
        retweetVelocity: '3.4x Avg',
        readabilityGrade: 'Grade 6.1 (Optimal Viral)',
        tips: [
          'Opening hook creates strong curiosity loop',
          'Numbered list format improves mobile readability',
          'Ending CTA has high conversion for bookmarks & follows',
        ],
      },
      postingTime: 'Tuesday 8:30 AM EST (Peak Tech Engagement)',
      createdAt: new Date().toISOString(),
    };
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  const prompt = `
You are a World-Class Viral Twitter Ghostwriter.
TOPIC: ${topic}
${voiceInstruction}

Generate an 8-10 tweet viral thread.
Schema:
{
  "tweets": [
    {
      "number": 1,
      "text": "Tweet copy (strictly under 280 chars)",
      "type": "hook" | "content" | "engagement" | "cta",
      "characterCount": 180
    }
  ],
  "hooks": [
    {
      "style": "Contrarian" | "Bold Metric" | "Personal Story" | "Step-by-Step" | "Question",
      "text": "Alternative hook opening line",
      "predictedCTR": "9.4%",
      "formulaExplanation": "Why this hook converts"
    }
  ],
  "hashtags": ["#buildinpublic", "#ai"],
  "engagementRadar": {
    "score": 94,
    "grade": "VIRAL",
    "hookStrength": 95,
    "readability": 92,
    "emotionalResonance": 90,
    "formattingSpacing": 96,
    "predictedImpressions": "35,000 - 60,000",
    "bookmarkRatio": "13.5% (Top 4%)",
    "retweetVelocity": "3.1x Avg",
    "readabilityGrade": "Grade 6.2 (High Retention)",
    "tips": ["Tip 1", "Tip 2"]
  },
  "postingTime": "Tuesday 8:30 AM EST"
}
`;

  try {
    const res = await model.generateContent(prompt);
    const parsed = JSON.parse(res.response.text());
    return {
      id: 'thread_' + Date.now(),
      topic,
      ...parsed,
      createdAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error('Thread generation failed:', e);
    throw e;
  }
}

export async function generateLinkedInPostWithGemini(
  topic: string,
  format: 'story' | 'framework' | 'contrarian' | 'case_study' = 'story',
  voiceProfile?: VoiceProfile | null,
  tone: LinkedInTone = 'storyteller_founder'
): Promise<LinkedInPost> {
  const genAI = getGenAI();

  const toneInstructionMap: Record<LinkedInTone, string> = {
    executive: 'Tone: Strategic, high-level C-Suite thought leadership, ROI and business impact.',
    technical_architect: 'Tone: Deep engineering rigor, system architecture trade-offs, and benchmarks.',
    storyteller_founder: 'Tone: Vulnerable build-in-public founder story with raw lessons and takeaways.',
    data_driven: 'Tone: Analytical, statistical proof points, percentages, and metrics-first framing.',
    contrarian: 'Tone: Bold industry critique challenging conventional wisdom with constructive alternatives.',
  };

  const selectedToneDesc = toneInstructionMap[tone] || toneInstructionMap.storyteller_founder;

  if (!genAI) {
    const defaultFullText = `Most developers believe building an AI application takes a 5-person team and 3 months of runway.\n\n48 hours ago, I decided to test that assumption.\n\nHere is what I learned shipping a full-stack AI platform solo:\n\n1. Architectural Simplicity Wins\nInstead of spinning up Redis queues and multi-region Kubernetes clusters, I used Next.js 16 with client-side reactive state. Build speed went 5x.\n\n2. The Token Efficiency Rule\n90% of prompt latency is caused by returning unneeded markdown prose. Constraining generation to structured JSON dropped response latency from 3.2s to 420ms.\n\n3. User Feedback Loops Matter More Than Model Size\nFast models (Gemini 1.5 Flash) with instant UI micro-interactions beat slow giant models every single time.\n\nKey Takeaway:\nStop waiting for the "perfect architecture." Ship the simple version today, get real user data tomorrow.\n\n---\n\nWhat is your biggest bottleneck when shipping AI products in 2026? Let's discuss in the comments 👇\n\n#BuildingInPublic #ArtificialIntelligence #SoftwareEngineering #Nextjs #Founder`;

    return {
      id: 'post_' + Date.now(),
      topic,
      format,
      tone,
      hookLine: 'Most developers believe building an AI application takes a 5-person team.',
      body: defaultFullText,
      closingQuestion: "What is your biggest bottleneck when shipping AI products in 2026? Let's discuss in the comments 👇",
      hashtags: ['#BuildingInPublic', '#ArtificialIntelligence', '#SoftwareEngineering', '#Nextjs'],
      fullText: defaultFullText,
      engagementRadar: {
        score: 96,
        grade: 'VIRAL',
        hookStrength: 97,
        readability: 95,
        emotionalResonance: 93,
        formattingSpacing: 98,
        predictedImpressions: '48,000 - 80,000',
        bookmarkRatio: '16.2% (Top 1%)',
        retweetVelocity: '4.1x Avg',
        readabilityGrade: 'Grade 6.0 (High Retention)',
        tips: [
          'High "See More" click propensity in opening 2 lines',
          'Bulleted whitespace prevents wall-of-text fatigue',
          'Closing open-ended question triggers algorithm reply boosts',
        ],
      },
      postingTime: 'Wednesday 9:00 AM EST (Peak LinkedIn Professional Window)',
      createdAt: new Date().toISOString(),
    };
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.65,
    },
  });

  const prompt = `
You are a Top 1% LinkedIn Authority Ghostwriter.
TOPIC: ${topic}
FORMAT: ${format}
TONE: ${selectedToneDesc}

Write a high-converting LinkedIn post.
Ensure the first 2 lines stop the scroll before the "...see more" fold.

Schema:
{
  "hookLine": "Opening 1-2 line scroll-stopping hook",
  "fullText": "Complete formatted post with bulleted takeaways and whitespace",
  "closingQuestion": "Closing debate question",
  "hashtags": ["#buildinpublic", "#ai"],
  "engagementRadar": {
    "score": 95,
    "grade": "VIRAL",
    "hookStrength": 96,
    "readability": 94,
    "emotionalResonance": 92,
    "formattingSpacing": 98,
    "predictedImpressions": "45,000 - 75,000",
    "bookmarkRatio": "15.4% (Top 2%)",
    "retweetVelocity": "3.8x Avg",
    "readabilityGrade": "Grade 6.3 (High Retention)",
    "tips": ["Tip 1", "Tip 2"]
  },
  "postingTime": "Wednesday 9:00 AM EST"
}
`;

  try {
    const res = await model.generateContent(prompt);
    const parsed = JSON.parse(res.response.text());
    return {
      id: 'post_' + Date.now(),
      topic,
      format,
      tone,
      ...parsed,
      createdAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error('LinkedIn generation failed:', e);
    throw e;
  }
}

export async function generateCarouselWithGemini(
  topic: string,
  voiceProfile?: VoiceProfile | null
): Promise<LinkedInCarousel> {
  const genAI = getGenAI();

  if (!genAI) {
    return {
      id: 'carousel_' + Date.now(),
      topic,
      theme: 'midnight_obsidian',
      totalSlides: 6,
      slides: [
        {
          slideNumber: 1,
          layoutType: 'hook',
          title: 'How to Build & Ship an AI App in 48 Hours',
          subtitle: 'The Zero-Bloat Full Stack Architecture Guide',
          bulletPoints: ['No heavy servers', 'Instant deployment', 'Production-ready in 2 days'],
          visualCue: '⚡',
          accentColor: '#10b981',
        },
        {
          slideNumber: 2,
          layoutType: 'big_stat',
          title: 'The Hidden Bottleneck',
          statNumber: '78%',
          statLabel: 'of developer time is lost to over-engineering cloud DBs and auth before shipping.',
          bulletPoints: ['Keep state local until user scale demands it', 'Validate demand in hours, not weeks'],
          visualCue: '🛑',
          accentColor: '#f43f5e',
        },
        {
          slideNumber: 3,
          layoutType: 'framework',
          title: 'Step 1: The Modern Speed Stack',
          bulletPoints: [
            'Next.js 16 + Turbopack for sub-second hot reloads',
            'Tailwind CSS v4 for zero-runtime utility styling',
            'Gemini 1.5 Flash for high-speed structured JSON',
          ],
          visualCue: '🚀',
          accentColor: '#06b6d4',
        },
        {
          slideNumber: 4,
          layoutType: 'checklist',
          title: 'Step 2: Prompt Optimization',
          bulletPoints: [
            'Constrain output format to strict JSON schema',
            'Eliminate conversational filler tokens',
            'Enforce fallback heuristics for zero offline downtime',
          ],
          visualCue: '🧠',
          accentColor: '#a855f7',
        },
        {
          slideNumber: 5,
          layoutType: 'framework',
          title: 'Step 3: Rapid User Distribution',
          bulletPoints: [
            'Post the build log directly on X & LinkedIn',
            'Share open-source repo for developer credibility',
            'Capture early feedback in first 4 hours',
          ],
          visualCue: '📈',
          accentColor: '#3b82f6',
        },
        {
          slideNumber: 6,
          layoutType: 'cta',
          title: 'Summary & Next Steps',
          subtitle: 'Save this deck for your next sprint!',
          bulletPoints: [
            'Follow @abdulnabi for daily developer guides',
            'Repost to help fellow builders ship faster 🚀',
          ],
          visualCue: '✨',
          accentColor: '#10b981',
        },
      ],
      captionText: 'Swipe through for the exact 48-hour AI application blueprint ➡️ #buildinpublic #ai',
      hashtags: ['#ai', '#webdev', '#nextjs', '#founders'],
      engagementRadar: {
        score: 97,
        grade: 'VIRAL',
        hookStrength: 98,
        readability: 96,
        emotionalResonance: 94,
        formattingSpacing: 99,
        predictedImpressions: '52,000 - 88,000',
        bookmarkRatio: '18.4% (Top 1%)',
        retweetVelocity: '4.5x Avg',
        readabilityGrade: 'Grade 5.8 (Ultra High Retention)',
        tips: [
          'Visual slide format maximizes swipe completion rate',
          'High save/bookmark rate on LinkedIn document posts',
        ],
      },
      createdAt: new Date().toISOString(),
    };
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.65,
    },
  });

  const prompt = `
You are a LinkedIn Carousel & Slide Deck Designer.
TOPIC: ${topic}

Generate a 6-slide high-retention visual carousel.
Schema:
{
  "totalSlides": 6,
  "slides": [
    {
      "slideNumber": 1,
      "layoutType": "hook" | "big_stat" | "framework" | "checklist" | "cta",
      "title": "Slide Title",
      "subtitle": "Optional Subtitle",
      "statNumber": "74%",
      "statLabel": "Statistic context if big_stat",
      "bulletPoints": ["Point 1", "Point 2"],
      "visualCue": "🚀",
      "accentColor": "#10b981"
    }
  ],
  "captionText": "Accompanying LinkedIn post caption",
  "hashtags": ["#buildinpublic", "#ai"],
  "engagementRadar": {
    "score": 96,
    "grade": "VIRAL",
    "hookStrength": 97,
    "readability": 95,
    "emotionalResonance": 93,
    "formattingSpacing": 98,
    "predictedImpressions": "50,000 - 85,000",
    "bookmarkRatio": "17.1% (Top 1%)",
    "retweetVelocity": "4.2x Avg",
    "readabilityGrade": "Grade 5.9 (Ultra High Retention)",
    "tips": ["Slide progression drives 90%+ swipe completion"]
  }
}
`;

  try {
    const res = await model.generateContent(prompt);
    const parsed = JSON.parse(res.response.text());
    return {
      id: 'carousel_' + Date.now(),
      topic,
      theme: 'midnight_obsidian',
      ...parsed,
      createdAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error('Carousel generation failed:', e);
    throw e;
  }
}

export async function generateHookVariantsWithGemini(
  topic: string
): Promise<HookVariant[]> {
  const genAI = getGenAI();

  if (!genAI) {
    return [
      {
        style: 'Contrarian Debate',
        text: 'Stop over-engineering your AI SaaS stack. 95% of apps do not need microservices or Kafka.',
        predictedCTR: '8.4%',
        formulaExplanation: 'Challenges industry consensus with extreme clarity.',
      },
      {
        style: 'Bold Numbers / Metrics',
        text: 'From 0 to 10,000 active requests in 48 hours with $0 in cloud bills. Here is the blueprint:',
        predictedCTR: '9.2%',
        formulaExplanation: 'Highlights concrete data points and instant ROI.',
      },
      {
        style: 'Personal Founder Story',
        text: '48 hours ago, my production deployment crashed with 4,000 users live. Here is how we recovered in 8 minutes:',
        predictedCTR: '8.9%',
        formulaExplanation: 'High-stakes personal vulnerability creates intense hook retention.',
      },
      {
        style: 'Step-by-Step Blueprint',
        text: 'The 4-step framework I used to ship a production AI app in a single weekend (with zero backend servers):',
        predictedCTR: '7.8%',
        formulaExplanation: 'Signals high actionable value and structured takeaway.',
      },
      {
        style: 'Provocative Question',
        text: 'Why are 80% of software teams still writing boilerplate CRUD APIs by hand in 2026?',
        predictedCTR: '8.1%',
        formulaExplanation: 'Triggers defensive curiosity and comment engagement.',
      },
    ];
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  const prompt = `
Generate 5 viral hook variations for this topic: "${topic}".
Include predicted CTR and formula explanation.
Output valid JSON array of objects with keys: style, text, predictedCTR, formulaExplanation.
`;

  try {
    const res = await model.generateContent(prompt);
    return JSON.parse(res.response.text());
  } catch (e) {
    console.error('Hook variant generation failed:', e);
    throw e;
  }
}

export async function calibrateVoiceWithGemini(
  samples: string[]
): Promise<VoiceProfile> {
  const genAI = getGenAI();

  if (!genAI) {
    return {
      id: 'voice_' + Date.now(),
      name: 'Calibrated Founder Voice',
      tone: 'Punchy, transparent, technical, and build-in-public focused',
      avgSentenceLength: 12,
      emojiDensity: 'minimal',
      signatureKeywords: ['shipped', 'architecture', 'latency', 'breakdown', 'blueprint'],
      rawSamples: samples,
    };
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const prompt = `
Analyze these writing samples and calibrate a Voice Profile:
${samples.join('\n---\n')}

Return JSON:
{
  "name": "Calibrated Voice Name",
  "tone": "Description of tone",
  "avgSentenceLength": 12,
  "emojiDensity": "none" | "minimal" | "moderate" | "expressive",
  "signatureKeywords": ["keyword1", "keyword2"]
}
`;

  try {
    const res = await model.generateContent(prompt);
    const parsed = JSON.parse(res.response.text());
    return {
      id: 'voice_' + Date.now(),
      ...parsed,
      rawSamples: samples,
    };
  } catch (e) {
    console.error('Voice calibration failed:', e);
    throw e;
  }
}
