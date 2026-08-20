import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const {
      companyName,
      roleTitle,
      type = 'thank-you',
      interviewerName = 'Hiring Team',
    }: {
      companyName: string;
      roleTitle: string;
      type?: 'thank-you' | 'check-in' | 'competing-offer';
      interviewerName?: string;
    } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a Career Strategist and Professional Communication Coach.
Write a concise, high-converting professional follow-up email for:
Company: ${companyName}
Role: ${roleTitle}
Interviewer/Contact: ${interviewerName}
Email Intent: ${
          type === 'thank-you'
            ? 'Post-interview thank you email expressing enthusiasm and referencing key conversation topics'
            : type === 'competing-offer'
            ? 'Polite notification that candidate has received a competing offer with a deadline, requesting status update'
            : 'Polite status check-in 5-7 days after last interview round'
        }

Return ONLY valid JSON matching this schema:
{
  "subject": "Clear concise subject line",
  "body": "Complete email body formatted with professional spacing"
}`;

        const res = await model.generateContent(prompt);
        const text = res.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(text);

        return NextResponse.json(parsed);
      } catch (err) {
        console.warn('Gemini follow-up generation failed, using fallback engine:', err);
      }
    }

    // Dynamic fallback
    if (type === 'thank-you') {
      return NextResponse.json({
        subject: `Thank you — ${roleTitle} Interview — Candidate Name`,
        body: `Hi ${interviewerName},

Thank you so much for taking the time to speak with me today about the ${roleTitle} opportunity at ${companyName}. I really enjoyed our conversation regarding your technical roadmap and team culture.

Our discussion reinforced my enthusiasm for the role. I am confident that my background in building scalable web architectures and shipping high-performance user interfaces will allow me to hit the ground running.

Please let me know if there are any additional work samples or references I can provide. Looking forward to the next steps!

Best regards,
Candidate`,
      });
    }

    if (type === 'competing-offer') {
      return NextResponse.json({
        subject: `Timeline Update — ${roleTitle} Application — Candidate Name`,
        body: `Hi ${interviewerName},

I hope you're having a great week! I am writing to provide a quick update regarding my job search timeline.

I recently received another offer with a decision deadline early next week. However, ${companyName} remains my top choice due to your team's mission and technical vision for the ${roleTitle} role.

Could you let me know if you have an updated timeline on the next steps so we can align our schedules? I would love the opportunity to move forward with ${companyName}.

Thank you so much for your time and guidance!

Warmly,
Candidate`,
      });
    }

    return NextResponse.json({
      subject: `Following up on ${roleTitle} application — Candidate Name`,
      body: `Hi ${interviewerName},

I hope you're having a productive week! 

I'm following up on my interview for the ${roleTitle} position at ${companyName}. I remain very excited about the opportunity and wanted to check in to see if there are any updates regarding the hiring timeline.

Please let me know if there is any further information I can share to assist with the process.

Thanks again for your time and consideration!

Best regards,
Candidate`,
    });
  } catch (err) {
    console.error('Follow-up API error:', err);
    return NextResponse.json({ error: 'Failed to generate follow-up email' }, { status: 500 });
  }
}
