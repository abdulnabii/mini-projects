import { GoogleGenerativeAI } from '@google/generative-ai';
import { CEFRLevel, Flashcard, SupportedLanguage } from '@/types';

export async function generateFlashcardsWithGemini(
  language: SupportedLanguage,
  topic: string,
  level: CEFRLevel,
  count: number = 4
): Promise<Flashcard[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are a professional linguist and language pedagogue specializing in contextual language flashcards.
Target Language: ${language}
Topic Domain: ${topic}
CEFR Proficiency Level: ${level}
Card Count: ${count}

Generate an array of exactly ${count} flashcard objects. Return ONLY a valid JSON array matching this exact schema (no markdown, no backticks):
[
  {
    "word": "target word or phrase in native script",
    "phonetic": "/IPA phonetic transcription/",
    "translation": "English meaning",
    "partOfSpeech": "noun (feminine) / verb / adjective / phrase",
    "exampleSentences": [
      { "target": "sentence in target language", "english": "English translation" },
      { "target": "second sentence in target language", "english": "second English translation" }
    ],
    "culturalNote": "1-2 sentences explaining real-world usage etiquette or cultural nuance.",
    "memoryHook": "A vivid mnemonic hook or etymological bridge (max 20 words)."
  }
]`;

      const res = await model.generateContent(prompt);
      const rawText = res.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
      const parsed: any[] = JSON.parse(rawText);

      const today = new Date().toISOString().split('T')[0];

      return parsed.map((item, idx) => ({
        id: `card_${language}_${Date.now()}_${idx}`,
        word: item.word || 'Palabra',
        phonetic: item.phonetic || '/paˈla.βɾa/',
        translation: item.translation || 'Word',
        partOfSpeech: item.partOfSpeech || 'noun',
        exampleSentences: item.exampleSentences || [],
        culturalNote: item.culturalNote || 'Commonly used in everyday conversation.',
        memoryHook: item.memoryHook || 'Remember through daily practice association.',
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: today,
      }));
    } catch (err) {
      console.warn('Gemini deck generation error, using curated fallback:', err);
    }
  }

  // Curated fallback cards if API key is not configured or network error
  return getFallbackCards(language, topic);
}

function getFallbackCards(language: SupportedLanguage, topic: string): Flashcard[] {
  const today = new Date().toISOString().split('T')[0];

  if (language === 'spanish') {
    return [
      {
        id: 'card_es_1',
        word: 'reunión',
        phonetic: '/re.uˈnjon/',
        translation: 'meeting',
        partOfSpeech: 'noun (feminine)',
        exampleSentences: [
          { target: 'Tenemos una reunión importante a las tres.', english: 'We have an important meeting at three o\'clock.' },
          { target: 'La reunión con el cliente fue muy productiva.', english: 'The meeting with the client was very productive.' },
        ],
        culturalNote: 'In Latin America, business meetings often open with 5 minutes of friendly personal conversation before diving into agenda items.',
        memoryHook: 'Think REUNION — when colleagues meet together again!',
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: today,
      },
      {
        id: 'card_es_2',
        word: 'presupuesto',
        phonetic: '/pɾe.suˈpwes.to/',
        translation: 'budget / cost quote',
        partOfSpeech: 'noun (masculine)',
        exampleSentences: [
          { target: '¿Cuál es el presupuesto para esta campaña?', english: 'What is the budget for this campaign?' },
          { target: 'Te enviaré el presupuesto detallado mañana.', english: 'I will send you the detailed quote tomorrow.' },
        ],
        culturalNote: 'In Spain and Latin America, "presupuesto" refers to both an enterprise budget and a vendor price estimate.',
        memoryHook: 'Pre-suppose your costs before starting a project.',
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: today,
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
        nextReviewDate: today,
      },
    ];
  } else if (language === 'arabic') {
    return [
      {
        id: 'card_ar_1',
        word: 'اجتماع',
        phonetic: '/id͡ʒ.tiˈmaːʕ/',
        translation: 'meeting / assembly',
        partOfSpeech: 'noun (masculine)',
        exampleSentences: [
          { target: 'لدينا اجتماع مع الفريق غداً.', english: 'We have a meeting with the team tomorrow.' },
          { target: 'كان الاجتماع مثمراً للغاية.', english: 'The meeting was extremely fruitful.' },
        ],
        culturalNote: 'Hospitality is central to Arab business meetings; sharing Arabic coffee or tea before discussing business is customary.',
        memoryHook: 'Root J-M-A means gathering together (like Friday prayer / Jumuah).',
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: today,
      },
      {
        id: 'card_ar_2',
        word: 'ميزانية',
        phonetic: '/miː.zaːˈnij.ja/',
        translation: 'budget / financial balance',
        partOfSpeech: 'noun (feminine)',
        exampleSentences: [
          { target: 'تمت الموافقة على الميزانية السنوية.', english: 'The annual budget has been approved.' },
          { target: 'يجب أن نلتزم بهذه الميزانية.', english: 'We must adhere to this budget.' },
        ],
        culturalNote: 'Derived from "Meezan" (scales of justice/balance), emphasizing equity and balance in finances.',
        memoryHook: 'Think MEEZAN (the scales of balance) balancing revenues and costs.',
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: today,
      },
    ];
  } else if (language === 'urdu') {
    return [
      {
        id: 'card_ur_1',
        word: 'ملاقات',
        phonetic: '/mʊ.laːˈqaːt̪/',
        translation: 'meeting / rendezvous',
        partOfSpeech: 'noun (feminine)',
        exampleSentences: [
          { target: 'کل ہماری ان سے اہم ملاقات ہے۔', english: 'Tomorrow we have an important meeting with them.' },
          { target: 'ملاقات کا وقت مقرر ہو گیا ہے۔', english: 'The meeting time has been scheduled.' },
        ],
        culturalNote: 'In Urdu culture, "Mulaqat" carries warmth and courtesy; greetings typically begin with respectful Adab or Salaam.',
        memoryHook: 'Remember "Mulaqat" as a formal connection or encounter.',
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: today,
      },
      {
        id: 'card_ur_2',
        word: 'ترقی',
        phonetic: '/t̪ə.rəq.qiː/',
        translation: 'progress / development / promotion',
        partOfSpeech: 'noun (feminine)',
        exampleSentences: [
          { target: 'سافٹ ویئر سیکھنے سے کیریئر میں ترقی ہوتی ہے۔', english: 'Learning software leads to career progress.' },
          { target: 'یہ منصوبہ ملک کی ترقی میں مددگار ہے۔', english: 'This project is helpful in national development.' },
        ],
        culturalNote: 'A deeply positive word celebrating advancement in education, career, and national prosperity.',
        memoryHook: 'Taraqqi = Taking steps upwards towards growth.',
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: today,
      },
    ];
  } else if (language === 'french') {
    return [
      {
        id: 'card_fr_1',
        word: 'réunion',
        phonetic: '/ʁe.y.njɔ̃/',
        translation: 'meeting',
        partOfSpeech: 'noun (feminine)',
        exampleSentences: [
          { target: 'Nous avons une réunion à dix heures.', english: 'We have a meeting at ten o\'clock.' },
          { target: 'La réunion s\'est très bien passée.', english: 'The meeting went very well.' },
        ],
        culturalNote: 'In French business culture, intellectual debate and thorough discussion are prized during meetings.',
        memoryHook: 'Like a French "reunion" of colleagues around the table.',
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: today,
      },
    ];
  } else {
    // German
    return [
      {
        id: 'card_de_1',
        word: 'Besprechung',
        phonetic: '/bəˈʃpʁɛçʊŋ/',
        translation: 'meeting / consultation',
        partOfSpeech: 'noun (feminine)',
        exampleSentences: [
          { target: 'Die Besprechung beginnt pünktlich um neun.', english: 'The meeting begins punctually at nine.' },
          { target: 'Wir haben die Ergebnisse in der Besprechung diskutiert.', english: 'We discussed the results in the meeting.' },
        ],
        culturalNote: 'Punctuality in German business culture is strict; arriving 5 minutes early is considered standard.',
        memoryHook: 'Sprechen = to speak -> Besprechung = a formal speaking session.',
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: today,
      },
    ];
  }
}
