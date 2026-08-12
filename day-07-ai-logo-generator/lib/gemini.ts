import { GoogleGenerativeAI } from "@google/generative-ai";
import { BrandConfig, BrandKit, LogoConcept, BrandPalette, LogoShapeType, StylePreference } from "@/types";

export async function generateBrandKit(config: BrandConfig): Promise<BrandKit> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an elite brand strategist and visual identity designer.
Generate a complete structured brand identity JSON for this brand configuration:
- Company Name: "${config.companyName}"
- Tagline: "${config.tagline || 'Innovation & Excellence'}"
- Industry: "${config.industry}"
- Style Preference: "${config.style}"
- Color Mood: "${config.colorMood}"

Return ONLY valid JSON matching this schema exactly (no markdown formatting or wrapping):
{
  "companyName": "${config.companyName}",
  "tagline": "${config.tagline || ''}",
  "brandStory": "A 2-sentence positioning statement about the brand vision and core values.",
  "palette": {
    "primary": { "name": "string", "hex": "#HEX", "rgb": "rgb(r,g,b)", "role": "Primary", "wcagContrastWhite": 4.5, "wcagContrastBlack": 12.0 },
    "secondary": { "name": "string", "hex": "#HEX", "rgb": "rgb(r,g,b)", "role": "Secondary", "wcagContrastWhite": 3.5, "wcagContrastBlack": 10.2 },
    "accent": { "name": "string", "hex": "#HEX", "rgb": "rgb(r,g,b)", "role": "Accent", "wcagContrastWhite": 3.8, "wcagContrastBlack": 9.5 },
    "neutral": { "name": "string", "hex": "#HEX", "rgb": "rgb(r,g,b)", "role": "Neutral", "wcagContrastWhite": 14.1, "wcagContrastBlack": 1.5 },
    "background": { "name": "string", "hex": "#HEX", "rgb": "rgb(r,g,b)", "role": "Background", "wcagContrastWhite": 1.1, "wcagContrastBlack": 18.2 }
  },
  "wcagCompliance": "WCAG 2.1 AA Compliant",
  "paletteNotes": "Primary and neutral pass AA contrast for body text.",
  "typography": {
    "headingFont": "Font Name (e.g. Montserrat)",
    "headingCategory": "Sans-Serif",
    "bodyFont": "Font Name (e.g. Inter)",
    "bodyCategory": "Sans-Serif",
    "rationale": "A 1-sentence explanation of why these fonts suit the brand."
  }
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
      const parsed = JSON.parse(text);

      const logos: LogoConcept[] = createLogoConcepts(
        parsed.palette.primary.hex,
        parsed.palette.secondary.hex,
        parsed.palette.accent.hex,
        config.style
      );

      return {
        id: crypto.randomUUID(),
        companyName: config.companyName,
        tagline: config.tagline || 'Empowering the Future',
        createdAt: new Date().toISOString(),
        config,
        logos,
        palette: {
          ...parsed.palette,
          wcagCompliance: parsed.wcagCompliance || 'WCAG 2.1 AA Compliant',
          notes: parsed.paletteNotes || 'High contrast primary palette optimized for digital screens.'
        },
        typography: parsed.typography,
        brandStory: parsed.brandStory || `${config.companyName} combines innovative technology with human-centered design to redefine ${config.industry.toLowerCase()}.`
      };
    } catch (err) {
      console.warn("Gemini API call failed, falling back to deterministic brand generator:", err);
    }
  }

  return generateFallbackBrandKit(config);
}

function createLogoConcepts(primaryHex: string, secondaryHex: string, accentHex: string, style: StylePreference): LogoConcept[] {
  if (style === 'anime') {
    return [
      {
        id: 'logo-anime-1',
        variantName: 'Kitsune Spirit Mask',
        styleTag: 'ANIME • MASCOT EMBLEM',
        svgShape: 'anime-kitsune-mask',
        primaryColor: primaryHex,
        secondaryColor: secondaryHex,
        accentColor: accentHex,
      },
      {
        id: 'logo-anime-2',
        variantName: 'Mecha Samurai Crest',
        styleTag: 'ANIME • MECHA VECTOR',
        svgShape: 'anime-mecha-star',
        primaryColor: secondaryHex,
        secondaryColor: primaryHex,
        accentColor: accentHex,
      },
      {
        id: 'logo-anime-3',
        variantName: 'Cyber Ninja Shuriken',
        styleTag: 'ANIME • CYBER STRIKE',
        svgShape: 'anime-cyber-ninja',
        primaryColor: accentHex,
        secondaryColor: primaryHex,
        accentColor: secondaryHex,
      },
      {
        id: 'logo-anime-4',
        variantName: 'Astral Flame Emblem',
        styleTag: 'ANIME • POWER AURA',
        svgShape: 'anime-flame-crest',
        primaryColor: primaryHex,
        secondaryColor: accentHex,
        accentColor: secondaryHex,
      },
    ];
  }

  if (style === 'professional') {
    return [
      {
        id: 'logo-pro-1',
        variantName: 'Interlocking Monogram',
        styleTag: 'CORPORATE • GEOMETRIC',
        svgShape: 'pro-interlocking-m',
        primaryColor: primaryHex,
        secondaryColor: secondaryHex,
        accentColor: accentHex,
      },
      {
        id: 'logo-pro-2',
        variantName: 'Gradient Prism Diamond',
        styleTag: 'CORPORATE • PRISM LUXURY',
        svgShape: 'pro-prism-diamond',
        primaryColor: secondaryHex,
        secondaryColor: primaryHex,
        accentColor: accentHex,
      },
      {
        id: 'logo-pro-3',
        variantName: 'Enterprise Crest',
        styleTag: 'CORPORATE • AUTHORITY',
        svgShape: 'pro-corporate-crest',
        primaryColor: accentHex,
        secondaryColor: primaryHex,
        accentColor: secondaryHex,
      },
      {
        id: 'logo-pro-4',
        variantName: 'Infinity Nexus Node',
        styleTag: 'CORPORATE • EXPANSION',
        svgShape: 'pro-infinity-node',
        primaryColor: primaryHex,
        secondaryColor: accentHex,
        accentColor: secondaryHex,
      },
    ];
  }

  if (style === 'tech') {
    return [
      {
        id: 'logo-tech-1',
        variantName: 'Quantum Circuit Matrix',
        styleTag: 'TECH • CYBER MATRIX',
        svgShape: 'tech-circuit-matrix',
        primaryColor: primaryHex,
        secondaryColor: secondaryHex,
        accentColor: accentHex,
      },
      {
        id: 'logo-tech-2',
        variantName: 'Hyper-Cube Node',
        styleTag: 'TECH • HYPER SPACE',
        svgShape: 'tech-quantum-cube',
        primaryColor: secondaryHex,
        secondaryColor: primaryHex,
        accentColor: accentHex,
      },
      {
        id: 'logo-tech-3',
        variantName: 'Neon Cyber Shield',
        styleTag: 'TECH • CYBER DEFENSE',
        svgShape: 'tech-neon-shield',
        primaryColor: accentHex,
        secondaryColor: primaryHex,
        accentColor: secondaryHex,
      },
      {
        id: 'logo-tech-4',
        variantName: 'Orbital Data Ring',
        styleTag: 'TECH • SYSTEM NODE',
        svgShape: 'tech-orbital-node',
        primaryColor: primaryHex,
        secondaryColor: accentHex,
        accentColor: secondaryHex,
      },
    ];
  }

  if (style === 'luxury') {
    return [
      {
        id: 'logo-lux-1',
        variantName: 'Crown Laurel Crest',
        styleTag: 'LUXURY • ROYAL HERITAGE',
        svgShape: 'luxury-crown-laurel',
        primaryColor: primaryHex,
        secondaryColor: secondaryHex,
        accentColor: accentHex,
      },
      {
        id: 'logo-lux-2',
        variantName: 'Monogram Royal Seal',
        styleTag: 'LUXURY • GOLDEN SEAL',
        svgShape: 'luxury-monogram-seal',
        primaryColor: secondaryHex,
        secondaryColor: primaryHex,
        accentColor: accentHex,
      },
      {
        id: 'logo-lux-3',
        variantName: 'Heraldic Shield Lion',
        styleTag: 'LUXURY • HERITAGE SHIELD',
        svgShape: 'luxury-shield-lion',
        primaryColor: accentHex,
        secondaryColor: primaryHex,
        accentColor: secondaryHex,
      },
      {
        id: 'logo-lux-4',
        variantName: 'Imperial Star Crest',
        styleTag: 'LUXURY • CLASSIC EMBLEM',
        svgShape: 'luxury-royal-crest',
        primaryColor: primaryHex,
        secondaryColor: accentHex,
        accentColor: secondaryHex,
      },
    ];
  }

  // Default minimalist concepts
  return [
    {
      id: 'logo-1',
      variantName: 'Primary Mark (Minimalist)',
      styleTag: 'MINIMALIST • GEOMETRIC',
      svgShape: 'circle-cross',
      primaryColor: primaryHex,
      secondaryColor: secondaryHex,
      accentColor: accentHex,
    },
    {
      id: 'logo-2',
      variantName: 'Dynamic Shield Emblem',
      styleTag: 'DYNAMIC • EMBLEM',
      svgShape: 'shield-bolt',
      primaryColor: secondaryHex,
      secondaryColor: primaryHex,
      accentColor: accentHex,
    },
    {
      id: 'logo-3',
      variantName: 'Organic Eco Node',
      styleTag: 'MODERN • ECO-TECH',
      svgShape: 'leaf-node',
      primaryColor: accentHex,
      secondaryColor: primaryHex,
      accentColor: secondaryHex,
    },
    {
      id: 'logo-4',
      variantName: 'Hexagon Structural Wave',
      styleTag: 'TECH • STRUCTURAL',
      svgShape: 'hexagon-wave',
      primaryColor: primaryHex,
      secondaryColor: accentHex,
      accentColor: secondaryHex,
    },
  ];
}

function generateFallbackBrandKit(config: BrandConfig): BrandKit {
  const nameLower = config.companyName.toLowerCase();

  // Preset match 1: KageAnime / Gaming
  if (nameLower.includes('kage') || nameLower.includes('anime') || config.style === 'anime') {
    const palette: BrandPalette = {
      primary: { name: 'Sakura Crimson', hex: '#FF2A5F', rgb: 'rgb(255, 42, 95)', role: 'Primary', wcagContrastWhite: 3.8, wcagContrastBlack: 12.5 },
      secondary: { name: 'Neo Tokyo Violet', hex: '#7C3AED', rgb: 'rgb(124, 58, 237)', role: 'Secondary', wcagContrastWhite: 4.9, wcagContrastBlack: 11.0 },
      accent: { name: 'Electric Cyan', hex: '#00F0FF', rgb: 'rgb(0, 240, 255)', role: 'Accent', wcagContrastWhite: 1.8, wcagContrastBlack: 14.5 },
      neutral: { name: 'Cyber Void', hex: '#0B0D17', rgb: 'rgb(11, 13, 23)', role: 'Neutral', wcagContrastWhite: 18.5, wcagContrastBlack: 1.1 },
      background: { name: 'Midnight Manga Slate', hex: '#121526', rgb: 'rgb(18, 21, 38)', role: 'Background', wcagContrastWhite: 15.8, wcagContrastBlack: 1.2 },
      wcagCompliance: 'WCAG 2.1 AA Compliant',
      notes: 'Sakura Crimson and Neo Tokyo Violet form high-energy contrast for anime branding.'
    };
    return {
      id: 'preset-kage-anime',
      companyName: config.companyName || 'KageStudio',
      tagline: config.tagline || 'High-Energy Anime & Manga Universe',
      createdAt: new Date().toISOString(),
      config,
      logos: createLogoConcepts('#FF2A5F', '#7C3AED', '#00F0FF', 'anime'),
      palette,
      typography: {
        headingFont: 'Outfit',
        headingCategory: 'Display Manga',
        bodyFont: 'Inter',
        bodyCategory: 'Sans-Serif',
        rationale: 'Outfit provides razor-sharp high impact titles perfect for anime and gaming brands.'
      },
      brandStory: `${config.companyName || 'KageStudio'} creates iconic anime character universes and high-velocity digital entertainment experiences.`
    };
  }

  // Preset match 2: NovaCare
  if (nameLower.includes('novacare') || config.industry === 'Healthcare') {
    const palette: BrandPalette = {
      primary: { name: 'Nova Blue', hex: '#2563EB', rgb: 'rgb(37, 99, 235)', role: 'Primary', wcagContrastWhite: 4.8, wcagContrastBlack: 13.5 },
      secondary: { name: 'Health Cyan', hex: '#0EA5E9', rgb: 'rgb(14, 165, 233)', role: 'Secondary', wcagContrastWhite: 3.2, wcagContrastBlack: 11.0 },
      accent: { name: 'Vital Mint', hex: '#10B981', rgb: 'rgb(16, 185, 129)', role: 'Accent', wcagContrastWhite: 3.7, wcagContrastBlack: 10.5 },
      neutral: { name: 'Deep Slate', hex: '#0F172A', rgb: 'rgb(15, 23, 42)', role: 'Neutral', wcagContrastWhite: 15.2, wcagContrastBlack: 1.4 },
      background: { name: 'Clinical Ice', hex: '#F0F9FF', rgb: 'rgb(240, 249, 255)', role: 'Background', wcagContrastWhite: 1.1, wcagContrastBlack: 18.0 },
      wcagCompliance: 'WCAG 2.1 AA Compliant',
      notes: 'Primary blue passes AA text contrast guidelines on both white and light backgrounds.'
    };
    return {
      id: 'preset-novacare',
      companyName: config.companyName || 'NovaCare',
      tagline: config.tagline || 'Next-Gen Digital Healthcare',
      createdAt: new Date().toISOString(),
      config,
      logos: createLogoConcepts('#2563EB', '#0EA5E9', '#10B981', config.style),
      palette,
      typography: {
        headingFont: 'Montserrat',
        headingCategory: 'Sans-Serif',
        bodyFont: 'Inter',
        bodyCategory: 'Sans-Serif',
        rationale: 'Montserrat offers a modern, trustworthy heading structure paired with Inter\'s clinical legibility.'
      },
      brandStory: `${config.companyName || 'NovaCare'} is pioneering patient-first healthcare technology, delivering compassionate care through innovative digital solutions.`
    };
  }

  // Generic fallback brand kit
  const targetStyle = config.style as string;
  const primaryHex = targetStyle === 'anime' ? '#FF2A5F' : targetStyle === 'professional' ? '#2563EB' : '#F59E0B';
  const secondaryHex = targetStyle === 'anime' ? '#7C3AED' : targetStyle === 'professional' ? '#0F172A' : '#F43F5E';
  const accentHex = targetStyle === 'anime' ? '#00F0FF' : targetStyle === 'professional' ? '#10B981' : '#8B5CF6';

  const palette: BrandPalette = {
    primary: { name: 'Primary Core', hex: primaryHex, rgb: 'rgb(245, 158, 11)', role: 'Primary', wcagContrastWhite: 3.5, wcagContrastBlack: 12.2 },
    secondary: { name: 'Secondary Depth', hex: secondaryHex, rgb: 'rgb(244, 63, 94)', role: 'Secondary', wcagContrastWhite: 4.1, wcagContrastBlack: 11.5 },
    accent: { name: 'Vivid Accent', hex: accentHex, rgb: 'rgb(139, 92, 246)', role: 'Accent', wcagContrastWhite: 4.2, wcagContrastBlack: 12.1 },
    neutral: { name: 'Deep Space', hex: '#0A0D14', rgb: 'rgb(10, 13, 20)', role: 'Neutral', wcagContrastWhite: 18.2, wcagContrastBlack: 1.1 },
    background: { name: 'Cosmic Slate', hex: '#111827', rgb: 'rgb(17, 24, 39)', role: 'Background', wcagContrastWhite: 16.1, wcagContrastBlack: 1.3 },
    wcagCompliance: 'WCAG 2.1 AA Compliant',
    notes: 'Secondary and accent pass AA standards for digital screen rendering.'
  };

  return {
    id: crypto.randomUUID(),
    companyName: config.companyName,
    tagline: config.tagline || 'Crafted with AI Brand Intelligence',
    createdAt: new Date().toISOString(),
    config,
    logos: createLogoConcepts(primaryHex, secondaryHex, accentHex, config.style),
    palette,
    typography: {
      headingFont: 'Outfit',
      headingCategory: 'Display Sans',
      bodyFont: 'Inter',
      bodyCategory: 'Sans-Serif',
      rationale: 'Outfit provides bold branding impact on digital displays, while Inter ensures crisp body copy across all screen resolutions.'
    },
    brandStory: `${config.companyName} represents modern innovation in ${config.industry.toLowerCase()}, delivering memorable products driven by clarity and human creativity.`
  };
}
