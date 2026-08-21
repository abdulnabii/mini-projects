import { JournalEntry, CopingTechnique } from '@/types';

export const EVIDENCE_BASED_TECHNIQUES: CopingTechnique[] = [
  {
    id: 'box-breathing',
    title: 'Box Breathing (Navy SEAL 4-4-4-4)',
    category: 'Breathing',
    description: 'Regulates the autonomic nervous system and lowers acute physiological cortisol spikes.',
    durationMinutes: 3,
    steps: [
      'Slowly inhale through your nose for 4 seconds.',
      'Hold the breath gently at the top for 4 seconds.',
      'Exhale smoothly through your mouth for 4 seconds.',
      'Hold empty lungs with calm stillness for 4 seconds.',
      'Repeat for 4 to 6 cycles.',
    ],
    icon: '🫁',
  },
  {
    id: '54321-grounding',
    title: '5-4-3-2-1 Sensory Grounding',
    category: 'Grounding',
    description: 'Anchors your mind in physical reality when racing thoughts or worry spirals take over.',
    durationMinutes: 4,
    steps: [
      'Acknowledge 5 things you can see around you.',
      'Acknowledge 4 things you can physically feel (feet on floor, clothes on skin).',
      'Acknowledge 3 distinct sounds you can hear in your environment.',
      'Acknowledge 2 things you can smell right now.',
      'Acknowledge 1 thing you can taste (or take a mindful sip of water).',
    ],
    icon: '🌿',
  },
  {
    id: 'cbt-reframing',
    title: 'Cognitive Reframing & Thought Decatastrophizing',
    category: 'CBT Reframing',
    description: 'Separates automatic anxious assumptions from objective, balanced evidence.',
    durationMinutes: 5,
    steps: [
      'Identify the automatic worst-case thought: "What if I fail completely?"',
      'Ask: "What is the concrete evidence for and against this outcome?"',
      'Identify the most likely realistic scenario rather than the extreme catastrophic one.',
      'Draft a balanced statement: "This is challenging, but I have handled tough problems before."',
    ],
    icon: '🧠',
  },
  {
    id: 'task-chunking',
    title: 'Micro-Task Chunking (15-Min Sprint)',
    category: 'Mindfulness',
    description: 'Dissolves executive paralysis by shrinking overwhelming workloads into bite-sized momentum.',
    durationMinutes: 15,
    steps: [
      'Write down the single largest task currently causing dread.',
      'Extract just ONE tiny 5-minute initial action step.',
      'Set a timer for 15 minutes and work with gentle focus.',
      'Give yourself permission to stop after 15 minutes, or continue if momentum is unlocked.',
    ],
    icon: '⏱️',
  },
];

export const DEFAULT_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry_1',
    title: 'Dealing with Imposter Syndrome Before the Architecture Review',
    content:
      "I have a big system architecture presentation tomorrow with the principal staff engineers. All day my mind kept whispering that I don't belong here, that they're going to pick apart every single flaw in my microservices design and realize I'm out of my depth. I spent 3 extra hours re-checking diagrams that were already finished. Feeling that familiar knot in my chest and shallow breathing.",
    moodTag: 'anxious',
    date: '2026-08-20',
    timestamp: '2026-08-20T19:30:00Z',
    wordCount: 78,
    isFavorite: true,
    analysis: {
      primaryEmotion: 'Performance Anxiety & Self-Doubt',
      secondaryEmotions: ['Overwhelmed', 'Hyper-Vigilant', 'Perfectionistic'],
      sentimentScore: -0.65,
      empathyReflection:
        "It is completely understandable to feel that knot in your chest before a high-visibility presentation. Caring deeply about doing great work can sometimes morph into imposter fear, but your thorough preparation is a reflection of your dedication, not your inadequacy.",
      gentlePromptQuestion:
        'If a close friend or junior teammate showed you this exact architecture proposal, what genuine strengths would you point out to them?',
      detectedPatterns: [
        {
          name: 'Catastrophizing & Mind Reading',
          description: 'Anticipating that others will negatively judge every detail without concrete evidence.',
          reframingThought:
            'The review is a collaborative design discussion, not a courtroom trial. Questions are opportunities to refine the system together.',
        },
      ],
      suggestedTechniques: [EVIDENCE_BASED_TECHNIQUES[0], EVIDENCE_BASED_TECHNIQUES[2]],
      dailyAffirmation:
        'You were hired and trusted with this project because of your proven engineering capability. You are ready.',
      crisisFlag: false,
    },
  },
  {
    id: 'entry_2',
    title: 'Post-Launch Exhale & Quiet Gratitude',
    content:
      'Finally pushed the production release today. Everything ran smoothly without a single P0 regression. Took a 30-minute walk outside in the afternoon breeze without my phone. It felt so good to just hear the birds and breathe without checking Slack notifications every 2 minutes. Grateful for a supportive team that covered my blind spots.',
    moodTag: 'calm',
    date: '2026-08-19',
    timestamp: '2026-08-19T18:15:00Z',
    wordCount: 65,
    isFavorite: true,
    analysis: {
      primaryEmotion: 'Peace & Serenity',
      secondaryEmotions: ['Grateful', 'Relieved', 'Grounded'],
      sentimentScore: 0.85,
      empathyReflection:
        "What a wonderful moment of stillness after intense effort. Disconnecting and savoring the quiet breeze is one of the most rejuvenating mental wellness practices. Celebrate this win.",
      gentlePromptQuestion:
        'How can you protect this sense of phone-free boundary during upcoming work sprints?',
      detectedPatterns: [],
      suggestedTechniques: [EVIDENCE_BASED_TECHNIQUES[1]],
      dailyAffirmation:
        'You deserve periods of calm rest just as much as you deserve celebration for your accomplishments.',
      crisisFlag: false,
    },
  },
  {
    id: 'entry_3',
    title: 'Workplace Burnout & End-of-Sprint Exhaustion',
    content:
      'I feel completely drained. It seems like the sprint backlog never shrinks no matter how many tickets I close. Every time I finish a task, 3 more appear. I noticed myself getting easily frustrated in standup this morning. I love building software, but right now even opening VS Code feels like dragging weights.',
    moodTag: 'overwhelmed',
    date: '2026-08-17',
    timestamp: '2026-08-17T21:00:00Z',
    wordCount: 68,
    isFavorite: false,
    analysis: {
      primaryEmotion: 'Cognitive Fatigue & Burnout',
      secondaryEmotions: ['Frustrated', 'Overextended', 'Depleted'],
      sentimentScore: -0.72,
      empathyReflection:
        "Your exhaustion is valid and it is your body's signal that your energy reserve is on empty. Feeling drained does not mean your passion is gone; it simply means your system needs replenishment and realistic boundaries.",
      gentlePromptQuestion:
        'What is one non-urgent responsibility or meeting you can decline or delegate this week to protect your mental space?',
      detectedPatterns: [
        {
          name: 'All-or-Nothing Thinking',
          description: 'Feeling that because the backlog is infinite, progress is meaningless.',
          reframingThought:
            'A backlog is a wishlist, not a mandate. Sustainable velocity beats temporary heroics.',
        },
      ],
      suggestedTechniques: [EVIDENCE_BASED_TECHNIQUES[3], EVIDENCE_BASED_TECHNIQUES[0]],
      dailyAffirmation:
        'Resting is not quitting. Taking care of your mental battery is what makes your long-term creativity possible.',
      crisisFlag: false,
    },
  },
];
