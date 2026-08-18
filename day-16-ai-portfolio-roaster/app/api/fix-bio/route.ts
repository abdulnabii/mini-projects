import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const {
      name,
      currentBio,
      targetRole = 'Senior Full-Stack Engineer',
      keySkills = ['TypeScript', 'Next.js', 'PostgreSQL'],
    }: {
      name: string;
      currentBio: string;
      targetRole?: string;
      keySkills?: string[];
    } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a FAANG Head of Talent and personal branding strategist.
Transform this developer's boring or generic portfolio bio into 3 high-converting, professional variations:

Developer Name: ${name}
Current Bio: "${currentBio}"
Target Role: ${targetRole}
Key Skills: ${keySkills.join(', ')}

Return ONLY valid JSON with this schema:
{
  "highImpactOption": {
    "tagline": "Bold, punchy hero headline (under 12 words)",
    "bio": "2 concise sentences emphasizing business ROI, architecture, and measurable outcomes.",
    "vibe": "FAANG Senior Engineer"
  },
  "storytellerOption": {
    "tagline": "Curious, product-minded headline",
    "bio": "2 sentences showing personal passion backed by concrete engineering craft.",
    "vibe": "Product-Minded Builder"
  },
  "minimalistOption": {
    "tagline": "Ultra-clean minimalist statement",
    "bio": "1 razor-sharp sentence of core technical specialization.",
    "vibe": "Minimalist High-Signal"
  },
  "linkedInSummary": "1 paragraph (3 sentences) optimized for LinkedIn search algorithms."
}`;

        const res = await model.generateContent(prompt);
        const text = res.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        return NextResponse.json(JSON.parse(text));
      } catch (err) {
        console.warn('Gemini fix-bio call failed, using fallback:', err);
      }
    }

    // High quality fallback
    return NextResponse.json({
      highImpactOption: {
        tagline: `Architecting Scalable Web Systems & Cloud APIs with ${keySkills[0] || 'TypeScript'}`,
        bio: `Full-Stack Engineer with a track record of building resilient web applications, optimizing database queries for sub-50ms latency, and delivering clean, maintainable codebases.`,
        vibe: 'FAANG Senior Engineer',
      },
      storytellerOption: {
        tagline: `Turning Complex Engineering Challenges into Elegant User Experiences`,
        bio: `Driven by performance and clean design. I build high-throughput full-stack products from concept to production deployment with modern cloud primitives.`,
        vibe: 'Product-Minded Builder',
      },
      minimalistOption: {
        tagline: `${targetRole} | Specialized in ${keySkills.slice(0, 3).join(', ')}`,
        bio: `Building fast, accessible, and scalable digital products with zero fluff.`,
        vibe: 'Minimalist High-Signal',
      },
      linkedInSummary: `${name} is a ${targetRole} experienced in ${keySkills.join(', ')}. Passionate about building robust systems, mentoring peers, and driving measurable product velocity.`,
    });
  } catch (err) {
    console.error('Error fixing bio:', err);
    return NextResponse.json({ error: 'Failed to rewrite bio' }, { status: 500 });
  }
}
