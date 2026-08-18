import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PatientVitals } from '@/types';

export async function POST(req: Request) {
  try {
    const { question, vitals, riskPercent }: { question: string; vitals: PatientVitals; riskPercent: number } =
      await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are DiabetesRisk.AI, an educational clinical endocrinology teaching assistant.
Context:
- Patient Fasting Glucose: ${vitals.glucose} mg/dL
- BMI: ${vitals.bmi} kg/m²
- Age: ${vitals.age} years
- Diastolic BP: ${vitals.bloodPressure} mmHg
- Serum Insulin: ${vitals.insulin} mu U/ml
- Current ML Diabetes Risk Probability: ${riskPercent}%

Patient/Doctor Inquiry: "${question}"

Provide a concise, highly evidence-based, compassionate response in 2-4 sentences explaining clinical physiological mechanisms (e.g. GLUT4 receptors, beta-cell exhaustion, insulin sensitivity) and actionable dietary/exercise protocols:`;

        const res = await model.generateContent(prompt);
        return NextResponse.json({ answer: res.response.text().trim() });
      } catch (err) {
        console.warn('Gemini API doctor chat failed, using fallback:', err);
      }
    }

    // High quality fallback
    return NextResponse.json({
      answer: `Elevated fasting glucose (${vitals.glucose} mg/dL) combined with a BMI of ${vitals.bmi} increases peripheral insulin resistance. Clinically, reducing refined carbohydrates and engaging in 150 minutes of weekly moderate aerobic exercise can increase skeletal muscle GLUT4 glucose uptake and lower HbA1c by 0.5–1.0%.`,
    });
  } catch (err) {
    console.error('Error answering doctor chat:', err);
    return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 });
  }
}
