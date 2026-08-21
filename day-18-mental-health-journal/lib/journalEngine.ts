import { AIJournalAnalysis, MoodCategory, CopingTechnique } from '@/types';
import { EVIDENCE_BASED_TECHNIQUES } from './defaultEntries';

export function getMoodBadgeProps(mood: MoodCategory): { emoji: string; label: string; color: string; border: string; bg: string } {
  switch (mood) {
    case 'joyful':
      return { emoji: '✨', label: 'Joyful & Energized', color: 'text-amber-300', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
    case 'calm':
      return { emoji: '🌿', label: 'Calm & Grounded', color: 'text-emerald-300', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
    case 'anxious':
      return { emoji: '🌊', label: 'Anxious & Restless', color: 'text-sky-300', border: 'border-sky-500/30', bg: 'bg-sky-500/10' };
    case 'overwhelmed':
      return { emoji: '⚡', label: 'Overwhelmed & Tired', color: 'text-purple-300', border: 'border-purple-500/30', bg: 'bg-purple-500/10' };
    case 'down':
      return { emoji: '🌧️', label: 'Low & Melancholy', color: 'text-blue-300', border: 'border-blue-500/30', bg: 'bg-blue-500/10' };
    case 'frustrated':
      return { emoji: '🔥', label: 'Frustrated & Tense', color: 'text-rose-300', border: 'border-rose-500/30', bg: 'bg-rose-500/10' };
    case 'reflective':
    default:
      return { emoji: '🌙', label: 'Reflective & Thoughtful', color: 'text-indigo-300', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10' };
  }
}

export function generateClientFallbackAnalysis(
  text: string,
  selectedMood?: MoodCategory
): AIJournalAnalysis {
  const lower = text.toLowerCase();

  // Crisis detection
  const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'self harm', 'hurt myself'];
  const crisisFlag = crisisKeywords.some((k) => lower.includes(k));

  const isAnxious = lower.includes('anxious') || lower.includes('worry') || lower.includes('fear') || lower.includes('panic') || selectedMood === 'anxious';
  const isOverwhelmed = lower.includes('overwhelm') || lower.includes('burnout') || lower.includes('too much') || lower.includes('exhaust') || selectedMood === 'overwhelmed';
  const isGrateful = lower.includes('grateful') || lower.includes('happy') || lower.includes('peace') || lower.includes('calm') || selectedMood === 'calm' || selectedMood === 'joyful';

  let primaryEmotion = 'Thoughtful Reflection';
  let secondaryEmotions = ['Contemplative', 'Processing'];
  let sentimentScore = 0.2;
  let empathy =
    "Thank you for taking the time to put your thoughts into words. Journaling your inner world is an act of clarity and mindful presence.";
  let question = 'What is one gentle intention you would like to set for yourself for the remainder of today?';
  let patterns: any[] = [];
  let techniques: CopingTechnique[] = [EVIDENCE_BASED_TECHNIQUES[0], EVIDENCE_BASED_TECHNIQUES[1]];
  let affirmation = 'Showing up to reflect on your thoughts is a steady foundation for self-growth.';

  if (crisisFlag) {
    primaryEmotion = 'High Emotional Distress';
    sentimentScore = -0.9;
    empathy =
      "It sounds like you are going through immense pain right now. Please know that you are not alone, and there is compassionate, confidential support ready to help 24/7.";
    question = 'Can you reach out to a trusted person or support hotline right now?';
    affirmation = 'Your life matters, and support is available whenever you need it.';
  } else if (isAnxious) {
    primaryEmotion = 'Anticipatory Anxiety & Overthinking';
    secondaryEmotions = ['Apprehensive', 'Uncertain', 'Hyper-focused'];
    sentimentScore = -0.55;
    empathy =
      "It sounds like your mind has been running fast and carrying heavy expectations. When worry takes the wheel, it can feel exhausting, but you are safe in this present moment.";
    question = 'What is one concrete thing within your direct control right now, and what can you gently release?';
    patterns = [
      {
        name: 'Catastrophizing',
        description: 'Assuming the worst possible outcome will happen.',
        reframingThought: 'What is the most likely, realistic middle outcome rather than the worst-case scenario?',
      },
    ];
    techniques = [EVIDENCE_BASED_TECHNIQUES[0], EVIDENCE_BASED_TECHNIQUES[2]];
    affirmation = 'You have navigated stressful moments before, and you possess the inner tools to navigate this one step at a time.';
  } else if (isOverwhelmed) {
    primaryEmotion = 'Cognitive Fatigue & High Demands';
    secondaryEmotions = ['Overextended', 'Depleted', 'Pressured'];
    sentimentScore = -0.65;
    empathy =
      "Feeling inundated by competing demands is a natural signal that your mental battery needs preservation. Acknowledging this overload is the first step toward healthy boundaries.";
    question = 'What is one obligation you can postpone, delegate, or simply say no to this week?';
    patterns = [
      {
        name: 'All-or-Nothing Thinking',
        description: 'Believing everything must be completed flawlessly immediately.',
        reframingThought: 'Progress is incremental. Closing one small item with care is enough for today.',
      },
    ];
    techniques = [EVIDENCE_BASED_TECHNIQUES[3], EVIDENCE_BASED_TECHNIQUES[1]];
    affirmation = 'You do not have to carry everything all at once. Give yourself permission to pause and recharge.';
  } else if (isGrateful) {
    primaryEmotion = 'Gratitude & Inner Contentment';
    secondaryEmotions = ['Appreciative', 'Serene', 'Present'];
    sentimentScore = 0.85;
    empathy =
      "It is wonderful to read this expression of peace and gratitude. Savoring these moments builds emotional resilience for the days ahead.";
    question = 'What small detail in your day brought the most unexpected joy?';
    techniques = [EVIDENCE_BASED_TECHNIQUES[1]];
    affirmation = 'You are nurturing peace and presence in your daily life.';
  }

  return {
    primaryEmotion,
    secondaryEmotions,
    sentimentScore,
    empathyReflection: empathy,
    gentlePromptQuestion: question,
    detectedPatterns: patterns,
    suggestedTechniques: techniques,
    dailyAffirmation: affirmation,
    crisisFlag,
  };
}
