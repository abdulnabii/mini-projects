export type IndustryType =
  | 'Healthcare'
  | 'FinTech'
  | 'E-Commerce'
  | 'SaaS & Tech'
  | 'Food & Beverage'
  | 'Fitness & Wellness'
  | 'Education'
  | 'Creative & Media'
  | 'Gaming & Entertainment';

export type StylePreference =
  | 'anime'
  | 'professional'
  | 'tech'
  | 'luxury'
  | 'minimalist'
  | 'bold';

export interface BrandConfig {
  companyName: string;
  tagline?: string;
  industry: IndustryType;
  style: StylePreference;
  colorMood: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  rgb: string;
  role: 'Primary' | 'Secondary' | 'Accent' | 'Neutral' | 'Background';
  wcagContrastWhite: number;
  wcagContrastBlack: number;
}

export interface BrandPalette {
  primary: ColorSwatch;
  secondary: ColorSwatch;
  accent: ColorSwatch;
  neutral: ColorSwatch;
  background: ColorSwatch;
  wcagCompliance: string;
  notes: string;
}

export interface TypographyPairing {
  headingFont: string;
  headingCategory: string;
  bodyFont: string;
  bodyCategory: string;
  rationale: string;
}

export type LogoShapeType =
  // Anime / Mascot
  | 'anime-kitsune-mask'
  | 'anime-mecha-star'
  | 'anime-cyber-ninja'
  | 'anime-flame-crest'
  // Corporate / Professional
  | 'pro-interlocking-m'
  | 'pro-prism-diamond'
  | 'pro-corporate-crest'
  | 'pro-infinity-node'
  // Tech / Cyberpunk
  | 'tech-circuit-matrix'
  | 'tech-quantum-cube'
  | 'tech-neon-shield'
  | 'tech-orbital-node'
  // Luxury / Vintage
  | 'luxury-crown-laurel'
  | 'luxury-monogram-seal'
  | 'luxury-shield-lion'
  | 'luxury-royal-crest'
  // Minimalist / Base
  | 'circle-cross'
  | 'shield-bolt'
  | 'leaf-node'
  | 'hexagon-wave';

export interface LogoConcept {
  id: string;
  variantName: string;
  styleTag: string;
  svgShape: LogoShapeType;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface BrandKit {
  id: string;
  companyName: string;
  tagline: string;
  createdAt: string;
  config: BrandConfig;
  logos: LogoConcept[];
  palette: BrandPalette;
  typography: TypographyPairing;
  brandStory: string;
}
