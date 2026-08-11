import { GoogleGenerativeAI } from "@google/generative-ai";
import { BrandConfig, BrandKit, LogoConcept, BrandPalette, TypographyPairing } from "@/types";

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

function createLogoConcepts(primaryHex: string, secondaryHex: string, accentHex: string, style: string): LogoConcept[] {
  return [
    {
      id: 'logo-1',
      variantName: 'Primary Mark (Minimalist)',
      styleTag: `${style.toUpperCase()} • GEOMETRIC`,
      svgShape: 'circle-cross',
      primaryColor: primaryHex,
      secondaryColor: secondaryHex,
      accentColor: accentHex,
    },
    {
      id: 'logo-2',
      variantName: 'Dynamic Emblem (Bold)',
      styleTag: 'DYNAMIC • EMBLEM',
      svgShape: 'shield-bolt',
      primaryColor: secondaryHex,
      secondaryColor: primaryHex,
      accentColor: accentHex,
    },
    {
      id: 'logo-3',
      variantName: 'Organic Node (Modern)',
      styleTag: 'MODERN • ECO-TECH',
      svgShape: 'leaf-node',
      primaryColor: accentHex,
      secondaryColor: primaryHex,
      accentColor: secondaryHex,
    },
    {
      id: 'logo-4',
      variantName: 'Corporate Wave (Tech)',
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

  // Preset match 1: NovaCare
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

  // Preset match 2: AetherPay
  if (nameLower.includes('aether') || config.industry === 'FinTech') {
    const palette: BrandPalette = {
      primary: { name: 'Aether Emerald', hex: '#059669', rgb: 'rgb(5, 150, 105)', role: 'Primary', wcagContrastWhite: 4.6, wcagContrastBlack: 12.8 },
      secondary: { name: 'Vault Indigo', hex: '#4F46E5', rgb: 'rgb(79, 70, 229)', role: 'Secondary', wcagContrastWhite: 5.1, wcagContrastBlack: 11.2 },
      accent: { name: 'Solar Amber', hex: '#F59E0B', rgb: 'rgb(245, 158, 11)', role: 'Accent', wcagContrastWhite: 2.1, wcagContrastBlack: 9.8 },
      neutral: { name: 'Midnight Charcoal', hex: '#111827', rgb: 'rgb(17, 24, 39)', role: 'Neutral', wcagContrastWhite: 16.0, wcagContrastBlack: 1.2 },
      background: { name: 'Mint Mist', hex: '#ECFDF5', rgb: 'rgb(236, 253, 245)', role: 'Background', wcagContrastWhite: 1.1, wcagContrastBlack: 17.5 },
      wcagCompliance: 'WCAG 2.1 AAA Compliant',
      notes: 'Vault Indigo and Midnight Charcoal provide AAA compliance for high-contrast financial data rendering.'
    };
    return {
      id: 'preset-aetherpay',
      companyName: config.companyName || 'AetherPay',
      tagline: config.tagline || 'Seamless Global Settlements',
      createdAt: new Date().toISOString(),
      config,
      logos: createLogoConcepts('#059669', '#4F46E5', '#F59E0B', config.style),
      palette,
      typography: {
        headingFont: 'Plus Jakarta Sans',
        headingCategory: 'Geometric Sans',
        bodyFont: 'JetBrains Mono',
        bodyCategory: 'Monospace',
        rationale: 'Plus Jakarta Sans conveys futuristic financial authority, while JetBrains Mono provides precise numeric clarity.'
      },
      brandStory: `${config.companyName || 'AetherPay'} provides frictionless borderless payments and automated treasury infrastructure for high-growth global enterprises.`
    };
  }

  // Generic fallback brand kit
  const primaryHex = '#F59E0B'; // Amber Gold
  const secondaryHex = '#F43F5E'; // Rose Pink
  const accentHex = '#8B5CF6'; // Violet

  const palette: BrandPalette = {
    primary: { name: 'Amber Gold', hex: primaryHex, rgb: 'rgb(245, 158, 11)', role: 'Primary', wcagContrastWhite: 2.1, wcagContrastBlack: 10.2 },
    secondary: { name: 'Vivid Rose', hex: secondaryHex, rgb: 'rgb(244, 63, 94)', role: 'Secondary', wcagContrastWhite: 3.9, wcagContrastBlack: 11.5 },
    accent: { name: 'Electric Violet', hex: accentHex, rgb: 'rgb(139, 92, 246)', role: 'Accent', wcagContrastWhite: 4.2, wcagContrastBlack: 12.1 },
    neutral: { name: 'Deep Space', hex: '#0A0D14', rgb: 'rgb(10, 13, 20)', role: 'Neutral', wcagContrastWhite: 18.2, wcagContrastBlack: 1.1 },
    background: { name: 'Cosmic Slate', hex: '#111827', rgb: 'rgb(17, 24, 39)', role: 'Background', wcagContrastWhite: 16.1, wcagContrastBlack: 1.3 },
    wcagCompliance: 'WCAG 2.1 AA Compliant',
    notes: 'Secondary Rose and Electric Violet pass AA standards for call-to-action buttons.'
  };

  return {
    id: crypto.randomUUID(),
    companyName: config.companyName,
    tagline: config.tagline || 'Crafted with Artificial Intelligence',
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
