# Day 07 — AI Logo Generator

| Field | Details |
|---|---|
| **Day** | 07 |
| **Category** | AI / Creative Tools |
| **Difficulty** | Advanced |
| **Estimated Build Time** | 8–10 hours |

---

## 📌 Project Overview

The AI Logo Generator is a full brand identity system powered by generative AI. A user inputs their company name, industry vertical, style preference (minimalist, bold, playful, or corporate), and a color mood description. Within 60 seconds, the system generates 4 logo variations using the Replicate SDXL API with custom-tuned prompts for logo design, extracts dominant colors, suggests complementary typography pairings from Google Fonts, and outputs a downloadable brand guidelines PDF — everything a startup needs to launch with a professional visual identity.

The architecture combines the image generation capabilities of Stable Diffusion XL (via Replicate's hosted API) with deterministic SVG manipulation in Node.js to vectorize and clean up raster logo outputs. Generated logos are processed through a custom color extraction pipeline that identifies the 3–5 dominant brand colors and generates a full color palette with hex codes, RGB values, and accessibility contrast ratios. Typography pairings are selected algorithmically based on industry and style using a curated pairing database.

The final brand kit — logos in PNG, SVG, and PDF formats, color swatches, font recommendations, and usage guidelines — is packaged into a professionally designed PDF using Puppeteer. This project demonstrates the intersection of AI creativity, graphic design principles, and engineering automation that defines modern no-code brand tools.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| **AI Logo Generation** | Generates 4 logo variations via Replicate SDXL with design-optimized prompts |
| **Style Preference System** | Choose from Minimalist, Bold, Playful, Corporate, or Tech aesthetic modes |
| **Color Palette Generator** | Extracts dominant colors from logos and generates a full brand palette with hex/RGB values |
| **Accessibility Checker** | Validates color contrast ratios against WCAG 2.1 AA/AAA standards |
| **Typography Pairing Engine** | Recommends 2 Google Fonts (heading + body) matched to industry and style |
| **SVG Logo Export** | Converts raster PNG to scalable SVG using vectorization for print-quality output |
| **Logo Variation Generator** | Creates horizontal, stacked, icon-only, and dark/light mode variants |
| **Brand Guidelines PDF** | Generates a complete brand book with logo usage rules, color swatches, and fonts |
| **Real-Time Preview** | Live preview of logo on mock business card, letterhead, and app icon contexts |
| **Brand Asset Download** | ZIP download containing all logo formats, color files, and guidelines PDF |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Image Generation:** Replicate API (SDXL — `stability-ai/sdxl`)
- **SVG Vectorization:** `potrace` + `jimp` (Node.js raster-to-vector pipeline)
- **Color Extraction:** `node-vibrant` (dominant color extraction from images)
- **Color Contrast:** `chroma-js` (WCAG contrast ratio calculation)
- **Typography:** Google Fonts API (font discovery and pairing)
- **PDF Generation:** Puppeteer (brand guidelines book rendering)
- **ZIP Packaging:** `archiver` npm package
- **Storage:** Supabase Storage (generated asset hosting)
- **State Management:** Zustand
- **Polling:** SWR with polling (Replicate async job status)
- **Deployment:** Vercel + Railway (Puppeteer rendering service)

---

## 🔧 Key Functions

### `generateLogoVariations(brandConfig: BrandConfig): Promise<GenerationJob>`
Constructs a highly engineered SDXL prompt from the `BrandConfig` object (company name, industry, style, color mood). Submits 4 generation requests to the Replicate API with different seed values and negative prompts to ensure variety. Returns a `GenerationJob` with a `jobId` for polling. Each generation uses style-specific LoRA adaptations and `CFG scale: 7.5`, `steps: 40`.

### `extractBrandColors(imageUrl: string): Promise<BrandPalette>`
Downloads the generated logo image and passes it through `node-vibrant`'s palette extractor to identify 5 color swatches: Vibrant, LightVibrant, DarkVibrant, Muted, and DarkMuted. Maps each to a `ColorSwatch` object with `hex`, `rgb`, `hsl`, `name` (generated via GPT-4o-mini), and `contrastOnWhite` / `contrastOnBlack` WCAG ratios. Returns a complete `BrandPalette`.

### `vectorizeLogo(pngBuffer: Buffer): Promise<string>`
Processes the raster PNG through `jimp` for pre-processing (threshold, desaturation, edge enhancement) then pipes through `potrace` to generate a clean SVG path string. Applies post-processing to remove artifacts and optimize path complexity using `svgo`. Returns the optimized SVG string ready for download or embedding.

### `recommendTypography(industry: string, style: StylePreference): Promise<TypographyPairing>`
Queries a curated pairing lookup table (JSON database of 200+ tested pairings) filtered by industry and style keyword. Falls back to a GPT-4o-mini call for industries not in the lookup. Fetches both fonts from Google Fonts API and returns a `TypographyPairing` with `heading` (font name, weight, CSS import) and `body` (font name, weight, CSS import) plus a `pairingRationale` string.

### `generateBrandGuidelines(brand: BrandAssets): Promise<Buffer>`
Orchestrates the Puppeteer rendering pipeline for the brand guidelines PDF. Injects the complete `BrandAssets` (logos, colors, typography, company name) into a professionally designed HTML template with sections: Brand Story, Logo Usage (do's and don'ts), Color System, Typography, and Icon Grid. Renders at A4 with bleed marks and exports as a PDF buffer.

---

## 📁 File Structure

```
ai-logo-generator/
├── app/
│   ├── page.tsx                    # Brand input form
│   ├── generate/page.tsx           # Generation progress + results
│   ├── brand-kit/[id]/page.tsx     # Full brand kit viewer
│   └── api/
│       ├── generate/route.ts       # POST: Submit Replicate jobs
│       ├── status/[jobId]/route.ts # GET: Poll job status
│       ├── colors/route.ts         # POST: Color extraction
│       ├── typography/route.ts     # GET: Font recommendations
│       ├── vectorize/route.ts      # POST: SVG conversion
│       ├── guidelines/route.ts     # POST: PDF generation
│       └── download/route.ts       # GET: ZIP package
├── components/
│   ├── form/
│   │   ├── BrandConfigForm.tsx     # Main input form
│   │   ├── StyleSelector.tsx       # Grid of style options
│   │   └── ColorMoodPicker.tsx     # Mood keyword selector
│   ├── results/
│   │   ├── LogoGrid.tsx            # 4-variation logo gallery
│   │   ├── ColorPaletteDisplay.tsx # Swatches with hex codes
│   │   ├── TypographyPreview.tsx   # Font rendering preview
│   │   └── MockupPreviewer.tsx     # Business card / app icon mockup
│   ├── generation/
│   │   ├── GenerationProgress.tsx  # Animated loading state
│   │   └── JobPoller.tsx           # SWR polling component
│   └── ui/
├── lib/
│   ├── replicate.ts                # Replicate API client
│   ├── colorExtractor.ts           # node-vibrant wrapper
│   ├── vectorizer.ts               # potrace/svgo pipeline
│   ├── typography/
│   │   ├── pairings.json           # Curated pairing database
│   │   └── googleFonts.ts
│   ├── pdf/brandGuidelinesTemplate.html
│   └── zustand/brandStore.ts
├── types/brand.ts
├── public/mockups/                 # Mockup template images
└── package.json
```

---

## 💡 AI Prompt Used

```
SYSTEM:
You are a world-class logo designer AI creating prompts for Stable Diffusion XL. 
Generate SDXL image generation prompts that produce clean, professional logos. 
Logos must be: centered on white background, vector-style appearance, no text 
(text is added in post-processing), single concept, scalable design.

Negative prompt: "text, letters, watermark, blurry, photorealistic, complex background, 
gradient mesh, drop shadow, 3D render"

Style modifiers by preference:
- minimalist: "flat design, geometric shapes, single color, negative space"
- bold: "strong contrast, thick strokes, dynamic composition, impactful"
- playful: "rounded forms, bright colors, friendly, approachable, quirky details"
- tech: "circuit patterns, sharp angles, monochromatic, grid-based, precise"

USER:
Company: "NovaCare"
Industry: Healthcare / Digital Health
Style: Minimalist
Color mood: "trustworthy blue and clean white, calming"
Generate a logo prompt for a health-tech company that conveys innovation, trust, and care.
```

---

## 📤 Expected Output (Result)

**Generated SDXL Prompt:**
```json
{
  "positive_prompt": "minimalist healthcare logo, abstract cross symbol merged with digital pulse line, flat design, single blue color #2563EB on white background, geometric precision, clean negative space, vector-style, professional medical brand, scalable icon, centered composition",
  "negative_prompt": "text, letters, watermark, blurry, photorealistic, complex background, gradient mesh, 3D render, realistic hands, faces",
  "seed": 42891,
  "cfg_scale": 7.5,
  "steps": 40
}
```

**Brand Palette Output (JSON):**
```json
{
  "palette": {
    "primary": {"hex": "#2563EB", "rgb": [37, 99, 235], "name": "NovaCare Blue", "wcag_on_white": 4.8},
    "secondary": {"hex": "#0EA5E9", "rgb": [14, 165, 233], "name": "Digital Sky", "wcag_on_white": 3.2},
    "accent": {"hex": "#10B981", "rgb": [16, 185, 129], "name": "Health Green", "wcag_on_white": 3.7},
    "neutral": {"hex": "#1E293B", "rgb": [30, 41, 59], "name": "Deep Slate", "wcag_on_white": 14.1},
    "background": {"hex": "#F0F9FF", "rgb": [240, 249, 255], "name": "Cloud White", "wcag_on_white": 1.1}
  },
  "wcag_compliance": "AA Compliant (Primary on White)",
  "accessibility_notes": "Secondary blue (#0EA5E9) does not meet AA on white — use for decorative elements only"
}
```

**UI Status Display:**
```
🎨 Generating your brand identity for "NovaCare"...

  Step 1/5  ✅  Logo concepts generated  (4 variations)
  Step 2/5  ✅  Brand colors extracted   (5 color swatches)
  Step 3/5  ✅  Typography paired        (Montserrat + Inter)
  Step 4/5  ✅  SVG files vectorized     (4 formats ready)
  Step 5/5  ✅  Brand guidelines PDF created  (12 pages)

📦 Brand Kit Ready — Download ZIP (8.4 MB)
   ├── logos/  (PNG, SVG, ICO — 12 files)
   ├── colors/  (ASE swatch file, hex list)
   ├── fonts/  (Montserrat + Inter)
   └── NovaCare_Brand_Guidelines.pdf
```

---

## 🚀 Stretch Goals

- [ ] Add favicon and app icon generation (all required sizes: 16px to 1024px)
- [ ] Build an animation generator that creates logo reveal animations (CSS/Lottie)
- [ ] Implement brand voice generator: tagline + tone of voice guidelines
- [ ] Add a logo comparison tool to A/B test variations with a voting widget
- [ ] Integrate with Figma API to push brand assets directly into a Figma file
- [ ] Build a brand consistency checker — paste a URL and it audits brand color/font usage
- [ ] Support custom icon uploads to blend with generated elements
