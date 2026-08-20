import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const {
      companyName,
      roleTitle,
      initialOffer,
      targetCompensation,
      strategy = 'polite',
    }: {
      companyName: string;
      roleTitle: string;
      initialOffer: string;
      targetCompensation: string;
      strategy?: 'polite' | 'leverage' | 'equity';
    } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const strategyInstruction =
          strategy === 'leverage'
            ? 'Candidate has competing offers or strong market leverage. Confident, respectful, asking for matching/exceeding market rate.'
            : strategy === 'equity'
            ? 'Focus on negotiating higher stock options / RSUs, signing bonus, or remote stipend if base salary is inflexible.'
            : 'Polite, enthusiastic, expressing gratitude for the offer while professionally proposing a counter-number justified by experience.';

        const prompt = `You are an Executive Compensation & Salary Negotiation Coach for senior tech professionals.
Write a high-converting salary negotiation counter-offer email and verbal phone script for:
Company: ${companyName}
Role: ${roleTitle}
Initial Offer: ${initialOffer || '$150,000'}
Target Desired Compensation: ${targetCompensation || '$185,000'}
Strategy Angle: ${strategyInstruction}

Return ONLY valid JSON matching this exact schema (no markdown wrap, no backticks, no other text):
{
  "emailSubject": "Subject line for negotiation email",
  "emailBody": "Complete professional counter-offer email ready to send",
  "phoneTalkingPoints": [
    "Talking point 1 for phone call with recruiter",
    "Talking point 2 addressing pushback",
    "Talking point 3 reiterating excitement"
  ],
  "leverageTips": [
    "Strategic tip 1",
    "Strategic tip 2"
  ]
}`;

        const res = await model.generateContent(prompt);
        const text = res.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(text);

        return NextResponse.json(parsed);
      } catch (err) {
        console.warn('Gemini salary negotiation failed, using fallback engine:', err);
      }
    }

    // High quality dynamic fallback
    const fallback = {
      emailSubject: `Offer Discussion — ${roleTitle} — Thank You & Counter Proposal`,
      emailBody: `Dear ${companyName} Recruiting Team,

Thank you so much for extending the offer for the ${roleTitle} role. I am genuinely thrilled about the opportunity to join ${companyName} and contribute to your team's upcoming initiatives.

After reviewing the initial compensation details (${initialOffer || 'initial package'}), and taking into account my technical background in high-scale systems and current market data for this tier of role, I would like to propose a base compensation of ${targetCompensation || 'an adjusted rate'}.

I am confident that my experience delivering high-performance architectures will allow me to create immediate value. If we can reach agreement on this figure, I would be delighted to accept the offer immediately.

Thank you again for your time and flexibility. I look forward to your thoughts!

Best regards,
Candidate`,
      phoneTalkingPoints: [
        `Express genuine enthusiasm: "I love the team and vision at ${companyName} and see this as my top choice."`,
        `State the counter clearly: "Based on my background in production architectures, I am targeting ${targetCompensation || 'the upper band'} to close out my search."`,
        `Ask about trade-offs: "If base salary has a hard band, can we explore equity grants or a sign-on bonus to bridge the gap?"`,
      ],
      leverageTips: [
        'Never negotiate before receiving the official offer letter in writing.',
        'Focus on the value you deliver to the company, not personal financial obligations.',
        'Frame the counter-offer as the final step needed for you to sign immediately.',
      ],
    };

    return NextResponse.json(fallback);
  } catch (err) {
    console.error('Salary negotiator API error:', err);
    return NextResponse.json({ error: 'Failed to generate negotiation script' }, { status: 500 });
  }
}
