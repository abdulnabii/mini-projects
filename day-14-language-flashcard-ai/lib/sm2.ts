import { Flashcard } from '@/types';

export function calculateSM2Review(
  card: Flashcard,
  qualityScore: number // 0 to 5
): Flashcard {
  const q = Math.max(0, Math.min(5, qualityScore));
  let repetitions = card.repetitions || 0;
  let interval = card.interval || 1;
  let easeFactor = card.easeFactor || 2.5;

  if (q < 3) {
    // Incorrect recall: restart repetition sequence
    repetitions = 0;
    interval = 1;
  } else {
    // Correct recall
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update Ease Factor (SM-2 formula)
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const today = new Date();
  const nextDate = new Date();
  nextDate.setDate(today.getDate() + interval);

  const nextReviewDate = nextDate.toISOString().split('T')[0];
  const lastReviewedDate = today.toISOString().split('T')[0];

  return {
    ...card,
    repetitions,
    interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReviewDate,
    lastReviewedDate,
    lastQualityScore: q,
  };
}

export function getQualityDescriptor(q: number): { label: string; color: string; description: string } {
  switch (q) {
    case 0:
      return { label: '0 — Blackout', color: 'bg-rose-600', description: 'Complete blackout, zero recall' };
    case 1:
      return { label: '1 — Incorrect', color: 'bg-rose-500', description: 'Wrong response, remembered upon seeing' };
    case 2:
      return { label: '2 — Hard', color: 'bg-amber-600', description: 'Incorrect, but seemed familiar' };
    case 3:
      return { label: '3 — Pass', color: 'bg-amber-500', description: 'Recalled with serious effort' };
    case 4:
      return { label: '4 — Good', color: 'bg-teal-500', description: 'Recalled after brief hesitation' };
    case 5:
      return { label: '5 — Perfect', color: 'bg-emerald-500', description: 'Instant, flawless recollection' };
    default:
      return { label: `${q}`, color: 'bg-slate-700', description: 'Reviewed' };
  }
}
