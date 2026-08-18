import { EmailConfig } from '@/types';

export const PRESET_DEMOS: { name: string; tag: string; config: EmailConfig }[] = [
  {
    name: 'B2B SaaS Cold Outreach',
    tag: 'Cold Outreach',
    config: {
      tone: 'Persuasive',
      purpose: 'Cold Outreach',
      senderName: 'Abdul Nabi',
      recipientName: 'Sarah Jenkins',
      recipientCompany: 'MedFlow Health',
      bullets: [
        'Built AI diagnostic triage tool deployed across 3 healthcare hospital networks',
        'Reduces clinical intake processing delays by 34% with zero workflow disruptions',
        'Want to propose a 15-minute live interactive demo this Thursday or Friday',
        'Can seamlessly connect with MedFlow HL7 & FHIR patient intake APIs',
      ],
    },
  },
  {
    name: 'AI Engineering Job Pitch',
    tag: 'Job Application',
    config: {
      tone: 'Formal Executive',
      purpose: 'Job Application',
      senderName: 'Abdul Nabi',
      recipientName: 'Alex Rivera',
      recipientCompany: 'Vercel Labs',
      bullets: [
        'Applying for Senior AI Full-Stack / Frontend Systems Engineer position',
        'Built and deployed 30 full-stack AI applications with Next.js Turbopack & Gemini 1.5',
        'Specialized in low-latency real-time WebSockets, streaming LLM completions & UI/UX',
        'Live monorepo portfolio linked with 100% verified production builds',
      ],
    },
  },
  {
    name: 'Investor Seed Pitch',
    tag: 'Investor Pitch',
    config: {
      tone: 'Direct & Punchy',
      purpose: 'Investor Pitch',
      senderName: 'Abdul Nabi',
      recipientName: 'Marc Sterling',
      recipientCompany: 'Horizon Ventures',
      bullets: [
        'Building autonomous AI workflows platform for modern engineering teams',
        'Hit $24k MRR in 60 days post-launch with 42% MoM organic customer growth',
        'Raising $1.2M seed round led by top dev-tool operators',
        'Would love to share our 8-page investment memo & metrics deck',
      ],
    },
  },
  {
    name: 'Enterprise Contract Follow-Up',
    tag: 'Follow-up',
    config: {
      tone: 'Warm & Casual',
      purpose: 'Follow-up',
      senderName: 'Abdul Nabi',
      recipientName: 'David Vance',
      recipientCompany: 'Apex Global',
      bullets: [
        'Following up on the enterprise SOC2 security proposal sent last Tuesday',
        'Our legal team approved the custom master service agreement terms',
        'Can schedule a 10-minute touchpoint tomorrow to finalize rollout dates',
      ],
    },
  },
];
