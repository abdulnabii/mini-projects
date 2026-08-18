import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { question, predictedClass, confidence, modelType, anatomicalRegion } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Missing question' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are MedVision AI, an educational clinical teaching assistant in medical computer vision.
Context:
- Modality: ${modelType === 'xray' ? 'Chest Radiography (DenseNet-121)' : 'Dermatology Dermoscopy (EfficientNet-B0)'}
- Predicted Finding: ${predictedClass} (${(confidence * 100).toFixed(1)}% confidence)
- GradCAM Highlighted Region: ${anatomicalRegion || 'Primary focal region'}

User Question: "${question}"

Provide a concise, educational, scientifically accurate response in 2-4 sentences suitable for medical students and radiology residents:`;

        const res = await model.generateContent(prompt);
        return NextResponse.json({ answer: res.response.text().trim() });
      } catch (err) {
        console.warn('Gemini API call failed for radiology chat:', err);
      }
    }

    return NextResponse.json({
      answer: `In this ${modelType === 'xray' ? 'chest radiograph' : 'dermoscopy scan'}, the neural network computed peak gradient activation in the ${anatomicalRegion || 'focal lesion area'}. This corresponds to visual features such as increased radiopacity/consolidation or pigment network irregularities characteristic of ${predictedClass}.`,
    });
  } catch (err) {
    console.error('Error answering radiology question:', err);
    return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 });
  }
}
