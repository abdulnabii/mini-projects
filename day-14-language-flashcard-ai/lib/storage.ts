import { Deck, Flashcard, GamificationState, LeaderboardUser } from '@/types';

const DECKS_KEY = 'lingopulse_decks_v1';
const GAMIFICATION_KEY = 'lingopulse_gamification_v1';

export const INITIAL_GAMIFICATION_STATE: GamificationState = {
  xp: 450,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  level: 3,
  cardsReviewedToday: 6,
  dailyGoal: 10,
  badges: [
    { id: 'b1', name: 'First Words', icon: '🌱', description: 'Reviewed your first 5 cards', unlocked: true },
    { id: 'b2', name: 'Streak Starter', icon: '🔥', description: 'Maintained a 3-day review streak', unlocked: true },
    { id: 'b3', name: 'Polyglot Novice', icon: '🌍', description: 'Studied cards in 2 different languages', unlocked: true },
    { id: 'b4', name: 'Memory Master', icon: '🧠', description: 'Achieved 5/5 Perfect recall on 10 cards', unlocked: false },
    { id: 'b5', name: 'Pronunciation Pro', icon: '🎙️', description: 'Scored 90%+ on voice pronunciation', unlocked: false },
  ],
};

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { id: 'u1', name: 'Sofia Rodriguez', avatar: '👩‍💻', xp: 1420, streak: 12, rank: 1 },
  { id: 'u2', name: 'Tariq Al-Mansoor', avatar: '👨‍🔬', xp: 1280, streak: 9, rank: 2 },
  { id: 'u3', name: 'You (Abdul Nabi)', avatar: '⚡', xp: 450, streak: 4, rank: 3, isCurrentUser: true },
  { id: 'u4', name: 'Elena Dubois', avatar: '🎨', xp: 390, streak: 3, rank: 4 },
  { id: 'u5', name: 'Klaus Schmidt', avatar: '🚀', xp: 310, streak: 2, rank: 5 },
];

export const INITIAL_DEMO_DECKS: Deck[] = [
  {
    id: 'deck_spanish_business',
    title: 'Spanish: Tech & Business Negotiations',
    language: 'spanish',
    topic: 'Business & Technology',
    level: 'B1',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: 'card_es_1',
        word: 'reunión',
        phonetic: '/re.uˈnjon/',
        translation: 'meeting',
        partOfSpeech: 'noun (feminine)',
        exampleSentences: [
          { target: 'Tenemos una reunión a las tres.', english: 'We have a meeting at three o\'clock.' },
          { target: 'La reunión fue muy productiva.', english: 'The meeting was very productive.' },
        ],
        culturalNote: 'In Latin America, business meetings often open with 5 minutes of friendly personal conversation before diving into agenda items.',
        memoryHook: 'Think REUNION — when colleagues meet together again!',
        repetitions: 1,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString().split('T')[0],
      },
      {
        id: 'card_es_2',
        word: 'presupuesto',
        phonetic: '/pɾe.suˈpwes.to/',
        translation: 'budget / cost quote',
        partOfSpeech: 'noun (masculine)',
        exampleSentences: [
          { target: '¿Cuál es el presupuesto del proyecto?', english: 'What is the project budget?' },
          { target: 'Te envío el presupuesto mañana.', english: 'I\'ll send you the quote tomorrow.' },
        ],
        culturalNote: 'In Spain and Latin America, "presupuesto" refers to both an organizational budget and a vendor price estimate.',
        memoryHook: 'Pre-suppose your costs before starting a project.',
        repetitions: 2,
        interval: 6,
        easeFactor: 2.6,
        nextReviewDate: new Date().toISOString().split('T')[0],
      },
      {
        id: 'card_es_3',
        word: 'desarrollar',
        phonetic: '/de.sa.roˈʝaɾ/',
        translation: 'to develop / build',
        partOfSpeech: 'verb',
        exampleSentences: [
          { target: 'Vamos a desarrollar una nueva aplicación web.', english: 'We are going to develop a new web application.' },
          { target: 'El equipo desarrolla soluciones de software.', english: 'The team develops software solutions.' },
        ],
        culturalNote: 'Widely used in technology and personal growth contexts throughout the Hispanic world.',
        memoryHook: 'Roll up your sleeves to DEVELOP something great.',
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString().split('T')[0],
      },
    ],
  },
  {
    id: 'deck_arabic_travel',
    title: 'Arabic: Everyday Travel & Hospitality (RTL)',
    language: 'arabic',
    topic: 'Travel & Hospitality',
    level: 'A2',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: 'card_ar_1',
        word: 'أهلاً وسهلاً',
        phonetic: '/ʔah.lan wa sah.lan/',
        translation: 'Welcome (Warmest Greetings)',
        partOfSpeech: 'greeting phrase',
        exampleSentences: [
          { target: 'أهلاً وسهلاً بكم في منزلنا.', english: 'Welcome to our home.' },
          { target: 'أهلاً وسهلاً بكم في دبي.', english: 'Welcome to Dubai.' },
        ],
        culturalNote: 'Literally means "May you find ease among family" — the quintessential Arab hospitality greeting.',
        memoryHook: 'Ahlan = family, Sahlan = ease/smooth ground.',
        repetitions: 1,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString().split('T')[0],
      },
      {
        id: 'card_ar_2',
        word: 'مطار',
        phonetic: '/maˈtˤaːr/',
        translation: 'airport',
        partOfSpeech: 'noun (masculine)',
        exampleSentences: [
          { target: 'أنا ذاهب إلى المطار الآن.', english: 'I am going to the airport now.' },
          { target: 'المطار الدولي حديث جداً.', english: 'The international airport is very modern.' },
        ],
        culturalNote: 'Derived from the root T-Y-R (flight/birds).',
        memoryHook: 'Where planes FLY (Tayr) -> Matar (Airport).',
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString().split('T')[0],
      },
    ],
  },
  {
    id: 'deck_urdu_daily',
    title: 'Urdu: Daily Life & Greetings (RTL)',
    language: 'urdu',
    topic: 'Daily Conversation',
    level: 'A1',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: 'card_ur_1',
        word: 'خوش آمدید',
        phonetic: '/xʊʃ aːm.d̪iːd̪/',
        translation: 'Welcome / Glad you came',
        partOfSpeech: 'phrase',
        exampleSentences: [
          { target: 'ہم آپ کو دل سے خوش آمدید کہتے ہیں۔', english: 'We welcome you from our heart.' },
          { target: 'پاکستان میں خوش آمدید۔', english: 'Welcome to Pakistan.' },
        ],
        culturalNote: 'Combines Persian "Khush" (happy/pleasant) and "Aamad" (arrival) — reflecting refined Urdu etiquette.',
        memoryHook: 'Khush (happy) + Aamad (arrival) = Happy arrival!',
        repetitions: 2,
        interval: 6,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString().split('T')[0],
      },
    ],
  },
];

export function getStoredDecks(): Deck[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_DECKS;
  try {
    const raw = localStorage.getItem(DECKS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_DEMO_DECKS;
  } catch (e) {
    return INITIAL_DEMO_DECKS;
  }
}

export function saveDecksToStorage(decks: Deck[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
  } catch (e) {
    console.error('Failed to save decks:', e);
  }
}

export function getStoredGamification(): GamificationState {
  if (typeof window === 'undefined') return INITIAL_GAMIFICATION_STATE;
  try {
    const raw = localStorage.getItem(GAMIFICATION_KEY);
    return raw ? JSON.parse(raw) : INITIAL_GAMIFICATION_STATE;
  } catch (e) {
    return INITIAL_GAMIFICATION_STATE;
  }
}

export function saveGamificationToStorage(state: GamificationState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save gamification:', e);
  }
}
