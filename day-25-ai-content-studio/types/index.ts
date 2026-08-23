export type Platform = 'twitter' | 'linkedin' | 'carousel';

export type ContentStyle =
  | 'educational'
  | 'storytelling'
  | 'provocative'
  | 'framework'
  | 'case_study';

export interface Tweet {
  number: number;
  text: string;
  type: 'hook' | 'content' | 'engagement' | 'cta';
  characterCount: number;
}

export interface HookVariant {
  style: string;
  text: string;
  predictedCTR: string;
  formulaExplanation: string;
}

export interface EngagementRadar {
  score: number; // 0 - 100
  grade: 'VIRAL' | 'HIGH' | 'MODERATE' | 'LOW';
  hookStrength: number; // 0 - 100
  readability: number; // 0 - 100
  emotionalResonance: number; // 0 - 100
  formattingSpacing: number; // 0 - 100
  tips: string[];
}

export interface TwitterThread {
  id: string;
  topic: string;
  tweets: Tweet[];
  hooks: HookVariant[];
  hashtags: string[];
  engagementRadar: EngagementRadar;
  postingTime: string;
  createdAt: string;
}

export interface LinkedInPost {
  id: string;
  topic: string;
  format: 'story' | 'framework' | 'contrarian' | 'case_study';
  hookLine: string;
  body: string;
  closingQuestion: string;
  hashtags: string[];
  fullText: string;
  engagementRadar: EngagementRadar;
  postingTime: string;
  createdAt: string;
}

export interface CarouselSlide {
  slideNumber: number;
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  visualCue: string;
  accentColor: string;
}

export interface LinkedInCarousel {
  id: string;
  topic: string;
  totalSlides: number;
  slides: CarouselSlide[];
  captionText: string;
  hashtags: string[];
  engagementRadar: EngagementRadar;
  createdAt: string;
}

export interface VoiceProfile {
  id: string;
  name: string;
  tone: string;
  avgSentenceLength: number;
  emojiDensity: 'none' | 'minimal' | 'moderate' | 'expressive';
  signatureKeywords: string[];
  rawSamples: string[];
}

export interface ScheduledDraft {
  id: string;
  platform: Platform;
  title: string;
  contentSummary: string;
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'published';
  fullData: any;
  createdAt: string;
}
