export type IndustryType =
  | 'Healthcare'
  | 'FinTech'
  | 'E-Commerce'
  | 'SaaS & Tech'
  | 'Food & Beverage'
  | 'Fitness & Wellness'
  | 'Education'
  | 'Creative & Media';

export type StylePreference =
  | 'minimalist'
  | 'bold'
  | 'playful'
  | 'corporate'
  | 'tech';

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

export interface LogoConcept {
  id: string;
  variantName: string;
  styleTag: string;
  svgShape: 'circle-cross' | 'shield-bolt' | 'leaf-node' | 'hexagon-wave' | 'abstract-loop' | 'cube-core';
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
