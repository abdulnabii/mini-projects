import { PronunciationScore, SupportedLanguage } from '@/types';

export function getLanguageCode(lang: SupportedLanguage): string {
  switch (lang) {
    case 'spanish':
      return 'es-ES';
    case 'french':
      return 'fr-FR';
    case 'german':
      return 'de-DE';
    case 'arabic':
      return 'ar-SA';
    case 'urdu':
      return 'ur-PK';
    default:
      return 'en-US';
  }
}

export function playAudioPronunciation(text: string, language: SupportedLanguage): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getLanguageCode(language);
  utterance.rate = 0.9; // Slightly slower for language learners

  window.speechSynthesis.speak(utterance);
}

// Levenshtein distance for pronunciation comparison
export function evaluatePronunciationAccuracy(
  spoken: string,
  target: string,
  lang: SupportedLanguage
): PronunciationScore {
  const normSpoken = spoken.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
  const normTarget = target.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');

  if (!normSpoken) {
    return {
      score: 0,
      feedback: 'No speech detected. Please speak clearly into your microphone.',
      phonemeAccuracy: 0,
      syllableMatch: false,
      transcribedText: '',
    };
  }

  const distance = levenshteinDistance(normSpoken, normTarget);
  const maxLength = Math.max(normSpoken.length, normTarget.length);
  const similarity = maxLength === 0 ? 1 : Math.max(0, 1 - distance / maxLength);
  const score = Math.round(similarity * 100);

  let feedback = '';
  if (score >= 90) {
    feedback = '🌟 Outstanding native-level pronunciation!';
  } else if (score >= 70) {
    feedback = '👍 Great accent clarity! Close to native cadence.';
  } else if (score >= 50) {
    feedback = '🎯 Decent effort. Pay attention to vowel length and stress.';
  } else {
    feedback = '🔄 Needs practice. Listen to the native audio and try again.';
  }

  return {
    score,
    feedback,
    phonemeAccuracy: score,
    syllableMatch: Math.abs(normSpoken.length - normTarget.length) <= 2,
    transcribedText: spoken,
  };
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
