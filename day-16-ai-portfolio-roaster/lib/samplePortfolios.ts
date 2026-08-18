import { SamplePortfolioPreset } from '@/types';

export const SAMPLE_PORTFOLIOS: SamplePortfolioPreset[] = [
  {
    id: 'junior-bootcamp',
    archetype: '🐣 The Bootcamp Graduate Starter Pack',
    title: 'Alex Rivera — Full Stack Enthusiast',
    developerName: 'Alex Rivera',
    portfolioUrl: 'https://alex-rivera-portfolio.dev',
    bioSnippet:
      'I am an aspiring, passionate software engineer who loves coding 24/7! Fast learner, team player, and always hungry for new tech challenges.',
    projectsList: [
      'Todo List App (React, LocalStorage)',
      'Weather App with OpenWeatherMap API',
      'Basic Calculator (HTML, CSS, JS)',
      'Netflix Clone (Frontend only, YouTube tutorial)',
    ],
    stackTags: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Git'],
    avatar: '👨‍💻',
  },
  {
    id: 'threejs-designer',
    archetype: '🎨 The Over-Engineered 3D Shader Artist',
    title: 'Julian Vance — Creative Technologist & Interaction Polymath',
    developerName: 'Julian Vance',
    portfolioUrl: 'https://julianvance.design',
    bioSnippet:
      'Crafting ethereal digital dimensions where spatial physics merge with sensory typography. 15-second WebGL pre-loader required. Please enable hardware acceleration.',
    projectsList: [
      'Interactive Floating Glass Orb (500,000 vertices, 12 FPS on mobile)',
      'Custom Smooth-Scroll Inertia Library (Breaks browser native back button)',
      'Minimalist Portfolio V9 (Dark mode only, no contact email)',
    ],
    stackTags: ['Three.js', 'GLSL Shaders', 'GSAP', 'Next.js', 'Figma'],
    avatar: '🕶️',
  },
  {
    id: 'backend-guru',
    archetype: '👴 The 1999 Plain-Text Systems Guru',
    title: 'David K. — Principal Distributed Systems Architect',
    developerName: 'David K.',
    portfolioUrl: 'https://users.cs.stanford.edu/~davidk',
    bioSnippet:
      'Plain HTML 1.0. No CSS. If you need javascript to read text, you are doing it wrong. C, Assembly, and distributed consensus algorithms only.',
    projectsList: [
      'Lock-Free Concurrent B-Tree in C99',
      'Raft Consensus Protocol Implementation in Go',
      '42 PDF Research Papers on Cache Invalidation (1998-2024)',
    ],
    stackTags: ['C', 'Go', 'Linux Kernel', 'POSIX', 'Assembly'],
    avatar: '☕',
  },
  {
    id: 'web3-hustler',
    archetype: '🦄 The Web3 AI Crypto Evangelist',
    title: 'Tyler Moon — Blockchain & AI Disruptor',
    developerName: 'Tyler Moon',
    portfolioUrl: 'https://moondev.eth.limo',
    bioSnippet:
      'Web3 Builder | AI Agent Maximalist | Ex-Founder | Building the autonomous decentralized financial neural mesh. DMs open on Telegram only.',
    projectsList: [
      'Decentralized Yield Farming Protocol (Audited by my roommate)',
      'AI NFT Minting Bot on Solana (Deprecated)',
      'Token Launchpad Landing Page (8 Hackathon winner badges, 0 active users)',
    ],
    stackTags: ['Solidity', 'Rust', 'Ethers.js', 'Hardhat', 'Web3.js'],
    avatar: '🚀',
  },
];
