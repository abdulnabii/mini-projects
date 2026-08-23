import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  TwitterThread,
  LinkedInPost,
  LinkedInCarousel,
  HookVariant,
  VoiceProfile,
  EngagementRadar,
} from '@/types';

function getGenAI(): GoogleGenerativeAI | null {
  const key = process.env.GEMINI_API_KEY || '';
  if (!key) return null;
  return new GoogleGenerativeAI(key);
}

export async function generateTwitterThreadWithGemini(
  topic: string,
  voiceProfile?: VoiceProfile
): Promise<TwitterThread> {
  const genAI = getGenAI();

  const voiceInstruction = voiceProfile
    ? `Write matching this calibrated voice profile: Tone: ${voiceProfile.tone}, Emoji Density: ${voiceProfile.emojiDensity}, Signature Keywords: ${voiceProfile.signatureKeywords.join(', ')}.`
    : `Write in a sharp, authentic "Build in Public" developer voice. Concrete numbers, zero corporate fluff, conversational and engaging.`;

  if (!genAI) {
    // Offline / fallback mock thread
    return {
      id: 'thread_' + Date.now(),
      topic,
      tweets: [
        {
          number: 1,
          text: `I built and shipped a full-stack AI application in 48 hours.\n\nNo huge team. No venture capital. Just Next.js 16 + Gemini API.\n\nHere is the exact architecture and the 5 lessons that saved me 20 hours: 🧵👇`,
          type: 'hook',
          characterCount: 198,
        },
        {
          number: 2,
          text: `1/ The biggest bottleneck isn't the AI model.\n\nIt's state synchronization between streaming server components and client UI.\n\nHere's how I handled zero-flicker streaming:`,
          type: 'content',
          characterCount: 172,
        },
        {
          number: 3,
          text: `2/ Prompt Engineering Rule #1:\n\nAlways ask the LLM for structured JSON with strict schema validation rather than free-form text.\n\nThis eliminated 99% of UI parsing errors.`,
          type: 'content',
          characterCount: 174,
        },
        {
          number: 4,
          text: `3/ Edge Caching Matters.\n\nUsing stale-while-revalidate on static generated routes cut database query latency from 340ms to 18ms.`,
          type: 'content',
          characterCount: 135,
        },
        {
          number: 5,
          text: `4/ What's the #1 tool in your modern developer stack right now?\n\nDrop your stack below — curious what everyone is building with! 👇`,
          type: 'engagement',
          characterCount: 142,
        },
        {
          number: 6,
          text: `If you found this breakdown useful:\n\n1. Follow @abdulnabii for daily engineering breakdowns\n2. Retweet the 1st tweet to share with other builders\n\nKeep shipping! 🚀 #BuildInPublic #WebDev`,
          type: 'cta',
          characterCount: 194,
        },
      ],
      hooks: [
        {
          style: 'Contrarian Take',
          text: 'Most developers over-engineer AI apps with 10 tools when 1 API call + Next.js is all you need.',
          predictedCTR: '5.8%',
          formulaExplanation: 'Challenges industry complexity and offers simple clarity.',
        },
        {
          style: 'Bold Statistic',
          text: '78% of AI wrappers fail because of poor latency, not bad models. Here is how I hit 18ms responses.',
          predictedCTR: '4.9%',
          formulaExplanation: 'Hard metric triggers instant curiosity.',
        },
      ],
      hashtags: ['#BuildInPublic', '#NextJS', '#AI', '#WebDev'],
      engagementRadar: {
        score: 88,
        grade: 'VIRAL',
        hookStrength: 92,
        readability: 95,
        emotionalResonance: 84,
        formattingSpacing: 90,
        tips: [
          'Strong curiosity gap in Tweet 1',
          'Clean 1-sentence spacing prevents reader fatigue',
          'Clear engagement question placed before final CTA',
        ],
      },
      postingTime: 'Tuesday 9:00 AM EST (Peak Tech Twitter Window)',
      createdAt: new Date().toISOString(),
    };
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });

  const prompt = `
You are a world-class viral tech ghostwriter and content strategist for developers and tech founders on Twitter/X.
${voiceInstruction}

TOPIC: "${topic}"

Generate a high-converting 6-to-10 tweet Twitter Thread in valid JSON matching this schema:
{
  "tweets": [
    {
      "number": 1,
      "text": "Hook tweet text. Max 240 chars. Create high curiosity or a bold claim with 🧵 or 👇",
      "type": "hook"
    },
    {
      "number": 2,
      "text": "Body tweet text with clean double spacing and 1 idea per tweet",
      "type": "content"
    },
    {
      "number": 5,
      "text": "Engagement question asking readers their thoughts or experience",
      "type": "engagement"
    },
    {
      "number": 6,
      "text": "Call to action tweet with follow recommendation and 2-3 hashtags",
      "type": "cta"
    }
  ],
  "hooks": [
    {
      "style": "Contrarian Take",
      "text": "Hook text...",
      "predictedCTR": "5.4%",
      "formulaExplanation": "Why this hook works"
    },
    {
      "style": "Shocking Metric",
      "text": "Hook text...",
      "predictedCTR": "4.8%",
      "formulaExplanation": "Why this hook works"
    }
  ],
  "hashtags": ["#Tag1", "#Tag2"],
  "engagementRadar": {
    "score": 88,
    "grade": "VIRAL",
    "hookStrength": 90,
    "readability": 92,
    "emotionalResonance": 85,
    "formattingSpacing": 94,
    "tips": ["Tip 1", "Tip 2"]
  },
  "postingTime": "Tuesday 9:00 AM EST (Peak Tech Engagement)"
}
`;

  try {
    const res = await model.generateContent(prompt);
    const parsed = JSON.parse(res.response.text());

    const tweets = (parsed.tweets || []).map((tw: any, idx: number) => ({
      number: idx + 1,
      text: tw.text || '',
      type: tw.type || 'content',
      characterCount: (tw.text || '').length,
    }));

    return {
      id: 'thread_' + Date.now(),
      topic,
      tweets,
      hooks: parsed.hooks || [],
      hashtags: parsed.hashtags || ['#BuildInPublic', '#Tech'],
      engagementRadar: parsed.engagementRadar || {
        score: 85,
        grade: 'VIRAL',
        hookStrength: 88,
        readability: 90,
        emotionalResonance: 82,
        formattingSpacing: 90,
        tips: ['Great rhythm and spacing'],
      },
      postingTime: parsed.postingTime || 'Tuesday 9:00 AM EST',
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Gemini Twitter thread generation failed:', error);
    throw error;
  }
}

export async function generateLinkedInPostWithGemini(
  topic: string,
  format: 'story' | 'framework' | 'contrarian' | 'case_study' = 'story',
  voiceProfile?: VoiceProfile
): Promise<LinkedInPost> {
  const genAI = getGenAI();

  if (!genAI) {
    return {
      id: 'li_' + Date.now(),
      topic,
      format,
      hookLine: 'Most engineering teams waste 40% of their sprints building features nobody uses.',
      body: `Here is the framework we used to fix it:\n\n1. The 1-Page PRD Rule:\nIf you can't explain the business impact and user problem in 1 page, the feature isn't ready for code.\n\n2. Rapid Throwaway Prototypes:\nSpend 4 hours validating with mock data before touching production database schemas.\n\n3. Continuous Feedback Loops:\nDeploy behind feature flags to 5 beta users on Day 2, not Day 30.\n\nThe result?\nEngineering velocity increased by 2.4x and rework dropped to near zero.`,
      closingQuestion: 'How does your team decide when a feature is truly ready to build?',
      hashtags: ['#SoftwareEngineering', '#ProductManagement', '#Leadership', '#TechTrends'],
      fullText: `Most engineering teams waste 40% of their sprints building features nobody uses.\n\nHere is the framework we used to fix it:\n\n1. The 1-Page PRD Rule:\nIf you can't explain the business impact and user problem in 1 page, the feature isn't ready for code.\n\n2. Rapid Throwaway Prototypes:\nSpend 4 hours validating with mock data before touching production database schemas.\n\n3. Continuous Feedback Loops:\nDeploy behind feature flags to 5 beta users on Day 2, not Day 30.\n\nThe result?\nEngineering velocity increased by 2.4x and rework dropped to near zero.\n\nHow does your team decide when a feature is truly ready to build?\n\n#SoftwareEngineering #ProductManagement #Leadership #TechTrends`,
      engagementRadar: {
        score: 91,
        grade: 'VIRAL',
        hookStrength: 94,
        readability: 96,
        emotionalResonance: 88,
        formattingSpacing: 92,
        tips: [
          'Hook line creates high curiosity before "see more" cutoff',
          'Numbered points make skimming easy for executive readers',
          'Open question at the bottom drives comment section algorithm boost',
        ],
      },
      postingTime: 'Wednesday 8:30 AM EST (Peak LinkedIn Professional Window)',
      createdAt: new Date().toISOString(),
    };
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });

  const prompt = `
You are a premier LinkedIn thought leadership ghostwriter for tech executives, senior engineers, and startup founders.

TOPIC: "${topic}"
FORMAT STYLE: "${format}"

Generate an algorithm-optimized LinkedIn post in valid JSON matching this schema:
{
  "hookLine": "1-2 sentence powerful hook that forces user to click '...see more' (Max 140 chars)",
  "body": "The body of the post with formatted single/double line spacing, bullet points, and high value",
  "closingQuestion": "A thoughtful engagement question that prompts developers/executives to comment",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3"],
  "engagementRadar": {
    "score": 90,
    "grade": "VIRAL",
    "hookStrength": 92,
    "readability": 94,
    "emotionalResonance": 86,
    "formattingSpacing": 92,
    "tips": ["Tip 1", "Tip 2"]
  },
  "postingTime": "Wednesday 8:30 AM EST"
}
`;

  try {
    const res = await model.generateContent(prompt);
    const parsed = JSON.parse(res.response.text());

    const fullText = `${parsed.hookLine}\n\n${parsed.body}\n\n${parsed.closingQuestion}\n\n${(
      parsed.hashtags || []
    ).join(' ')}`;

    return {
      id: 'li_' + Date.now(),
      topic,
      format,
      hookLine: parsed.hookLine || '',
      body: parsed.body || '',
      closingQuestion: parsed.closingQuestion || '',
      hashtags: parsed.hashtags || [],
      fullText,
      engagementRadar: parsed.engagementRadar || {
        score: 88,
        grade: 'VIRAL',
        hookStrength: 90,
        readability: 92,
        emotionalResonance: 85,
        formattingSpacing: 90,
        tips: ['Strong scroll-stopping hook'],
      },
      postingTime: parsed.postingTime || 'Wednesday 8:30 AM EST',
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Gemini LinkedIn generation failed:', error);
    throw error;
  }
}

export async function generateCarouselWithGemini(
  topic: string,
  voiceProfile?: VoiceProfile
): Promise<LinkedInCarousel> {
  const genAI = getGenAI();

  if (!genAI) {
    return {
      id: 'car_' + Date.now(),
      topic,
      totalSlides: 6,
      slides: [
        {
          slideNumber: 1,
          title: '7 Architecture Rules Every Senior Developer Follows',
          subtitle: 'Swipe to avoid production disasters ➡️',
          bulletPoints: ['Tested in high-scale systems', 'Zero fluff, pure actionable rules'],
          visualCue: '⚡ Title Card',
          accentColor: '#10b981',
        },
        {
          slideNumber: 2,
          title: 'Rule 01: Decouple Reads From Writes',
          subtitle: 'CQRS Principle',
          bulletPoints: [
            'Separate heavy analytics queries from fast OLTP database transactions.',
            'Prevents database lockups during traffic spikes.',
          ],
          visualCue: '📊 Architecture Diagram',
          accentColor: '#06b6d4',
        },
        {
          slideNumber: 3,
          title: 'Rule 02: Design for Failure First',
          subtitle: 'Resilience Patterns',
          bulletPoints: [
            'Every external API call must have a timeout & circuit breaker.',
            'Degrade gracefully: Return cached fallback data instead of 500 errors.',
          ],
          visualCue: '🛡️ Shield Pattern',
          accentColor: '#8b5cf6',
        },
        {
          slideNumber: 4,
          title: 'Rule 03: Make Idempotency Mandatory',
          subtitle: 'Data Consistency',
          bulletPoints: [
            'Never assume a webhook or payment request is sent only once.',
            'Use unique idempotency keys on every mutating transaction.',
          ],
          visualCue: '🔑 Key Validator',
          accentColor: '#f59e0b',
        },
        {
          slideNumber: 5,
          title: 'Rule 04: Log Context, Not Just Errors',
          subtitle: 'Observability',
          bulletPoints: [
            'Include correlationId, userId, and input payload size in every log.',
            'Makes debugging distributed microservices 10x faster.',
          ],
          visualCue: '🔍 Trace Telemetry',
          accentColor: '#ec4899',
        },
        {
          slideNumber: 6,
          title: 'Summary & Next Steps',
          subtitle: 'Save this post for your next system design review 🔖',
          bulletPoints: [
            'Follow @abdulnabii for weekly system architecture breakdowns.',
            'Which rule do you see violated most often? Comment below! 👇',
          ],
          visualCue: '🚀 Final CTA Slide',
          accentColor: '#10b981',
        },
      ],
      captionText: `System design isn't about knowing 50 different databases.\n\nIt's about following consistent architectural principles that prevent outages.\n\nSwipe through the carousel to see the 7 rules our team uses in production. ➡️\n\n#SystemDesign #SoftwareEngineering #Architecture #WebDev`,
      hashtags: ['#SystemDesign', '#SoftwareEngineering', '#Architecture', '#WebDev'],
      engagementRadar: {
        score: 93,
        grade: 'VIRAL',
        hookStrength: 95,
        readability: 96,
        emotionalResonance: 90,
        formattingSpacing: 94,
        tips: [
          'High visual retention with 6 punchy, swipeable slides',
          'Bold contrasting accent colors on each concept',
          'Clear save & bookmark prompt on final slide',
        ],
      },
      createdAt: new Date().toISOString(),
    };
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });

  const prompt = `
You are a world-class LinkedIn Carousel Designer and visual educator.

TOPIC: "${topic}"

Generate a 6-to-8 slide LinkedIn PDF Carousel in valid JSON matching this schema:
{
  "slides": [
    {
      "slideNumber": 1,
      "title": "Eye-catching Title for Slide 1",
      "subtitle": "Swipe indicator or short premise",
      "bulletPoints": ["Key takeaway 1", "Key takeaway 2"],
      "visualCue": "Icon or visual note",
      "accentColor": "#10b981"
    }
  ],
  "captionText": "Accompanying LinkedIn post text explaining why to swipe",
  "hashtags": ["#Tag1", "#Tag2"],
  "engagementRadar": {
    "score": 92,
    "grade": "VIRAL",
    "hookStrength": 94,
    "readability": 96,
    "emotionalResonance": 88,
    "formattingSpacing": 94,
    "tips": ["Tip 1", "Tip 2"]
  }
}
`;

  try {
    const res = await model.generateContent(prompt);
    const parsed = JSON.parse(res.response.text());

    return {
      id: 'car_' + Date.now(),
      topic,
      totalSlides: parsed.slides?.length || 6,
      slides: parsed.slides || [],
      captionText: parsed.captionText || '',
      hashtags: parsed.hashtags || [],
      engagementRadar: parsed.engagementRadar || {
        score: 90,
        grade: 'VIRAL',
        hookStrength: 92,
        readability: 94,
        emotionalResonance: 88,
        formattingSpacing: 92,
        tips: ['High swipe retention'],
      },
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Gemini carousel generation failed:', error);
    throw error;
  }
}

export async function generateHookVariantsWithGemini(topic: string): Promise<HookVariant[]> {
  const genAI = getGenAI();

  if (!genAI) {
    return [
      {
        style: '1. Contrarian Hot Take',
        text: 'Stop building complex microservices for early startups. A monolith will get you to $1M ARR 3x faster.',
        predictedCTR: '6.2%',
        formulaExplanation: 'Directly challenges common dogma to trigger emotional debate.',
      },
      {
        style: '2. Shocking Data & Statistic',
        text: '83% of developer burnout is caused by ambiguous PR reviews, not bad managers. Here is the fix:',
        predictedCTR: '5.7%',
        formulaExplanation: 'Hard metric provides instant credibility and urgency.',
      },
      {
        style: '3. Vulnerable Founder Story',
        text: 'I lost $14,000 in AWS cloud credits in 1 night due to a single infinite recursive loop. Here is what I learned:',
        predictedCTR: '6.8%',
        formulaExplanation: 'High empathy storytelling creates strong human connection.',
      },
      {
        style: '4. Provocative Question',
        text: 'If your tech stack disappeared tomorrow, which framework would you rewrite your entire product in?',
        predictedCTR: '4.9%',
        formulaExplanation: 'Low friction prompt invites instant comment participation.',
      },
      {
        style: '5. Step-by-Step Blueprint',
        text: 'The exact 5-step checklist I used to scale our API from 1,000 to 1,000,000 daily requests (Save this):',
        predictedCTR: '5.4%',
        formulaExplanation: 'Clear value proposition with immediate bookmark utility.',
      },
    ];
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });

  const prompt = `
Generate 5 distinct viral opening hook styles for TOPIC: "${topic}".
1. Contrarian Hot Take
2. Shocking Data & Statistic
3. Vulnerable Story
4. Provocative Question
5. Step-by-Step Blueprint

Return valid JSON:
{
  "hooks": [
    {
      "style": "Hook Style Name",
      "text": "Hook copy text (max 180 chars)",
      "predictedCTR": "5.8%",
      "formulaExplanation": "Why this formula drives high click-through"
    }
  ]
}
`;

  try {
    const res = await model.generateContent(prompt);
    const parsed = JSON.parse(res.response.text());
    return parsed.hooks || [];
  } catch (error) {
    console.error('Gemini hook generation failed:', error);
    throw error;
  }
}

export async function calibrateVoiceWithGemini(samplePosts: string[]): Promise<VoiceProfile> {
  const genAI = getGenAI();

  if (!genAI) {
    return {
      id: 'voice_' + Date.now(),
      name: 'Authentic Builder',
      tone: 'Direct, technical, empathetic, builder-centric',
      avgSentenceLength: 12,
      emojiDensity: 'minimal',
      signatureKeywords: ['shipped', 'architecture', 'latency', 'lesson', 'builder'],
      rawSamples: samplePosts,
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
Analyze the writing style of these sample posts written by a developer/creator:
${JSON.stringify(samplePosts)}

Return a calibrated voice profile in valid JSON:
{
  "name": "Persona Name (e.g. Pragmatic Architect, High-Energy Founder)",
  "tone": "Descriptive tone keywords",
  "avgSentenceLength": 12,
  "emojiDensity": "none" | "minimal" | "moderate" | "expressive",
  "signatureKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
}
`;

  try {
    const res = await model.generateContent(prompt);
    const parsed = JSON.parse(res.response.text());
    return {
      id: 'voice_' + Date.now(),
      name: parsed.name || 'Custom Voice',
      tone: parsed.tone || 'Conversational Tech',
      avgSentenceLength: parsed.avgSentenceLength || 14,
      emojiDensity: parsed.emojiDensity || 'minimal',
      signatureKeywords: parsed.signatureKeywords || [],
      rawSamples: samplePosts,
    };
  } catch (error) {
    console.error('Gemini voice calibration failed:', error);
    throw error;
  }
}
