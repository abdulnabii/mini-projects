import { EmailConfig } from '@/types';

export const PRESET_DEMOS: { name: string; tag: string; config: EmailConfig }[] = [
  {
    name: 'Cold B2B Outreach',
    tag: 'Cold Outreach',
    config: {
      tone: 'Persuasive',
      purpose: 'Cold Outreach',
      senderName: 'Abdul Nabi',
      recipientName: 'Sarah Jenkins',
      recipientCompany: 'MedFlow Health',
      bullets: [
        'Built AI diagnostic tool deployed across 3 hospitals',
        'Reduces diagnostic triage misclassification by 34%',
        'Want to propose a 20-minute live demo call this week',
        'Can seamlessly integrate with MedFlow patient intake API',
      ],
    },
  },
  {
    name: 'Senior Frontend Job App',
    tag: 'Job Application',
    config: {
      tone: 'Formal',
      purpose: 'Job Application',
      senderName: 'Abdul Nabi',
      recipientName: 'Engineering Hiring Manager',
      recipientCompany: 'Vercel Labs',
      bullets: [
        'Applying for Senior Full-Stack / AI UI Engineer position',
        'Shipped 30 full-stack AI web apps using Next.js 14 & Tailwind',
        'Strong expertise in performance optimization & reactive state',
        'Attached portfolio & GitHub showing production deployments',
      ],
    },
  },
  {
    name: 'Client Proposal Follow-up',
    tag: 'Follow-up',
    config: {
      tone: 'Casual',
      purpose: 'Follow-up',
      senderName: 'Abdul Nabi',
      recipientName: 'David Ross',
      recipientCompany: 'Apex Capital',
      bullets: [
        'Following up on the AI dashboard scope & estimate sent last Tuesday',
        'Wanted to see if you had any questions on the architecture or timeline',
        'Available for a quick 10-minute touchpoint tomorrow if needed',
      ],
    },
  },
];
