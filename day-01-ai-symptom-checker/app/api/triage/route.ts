import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, generateMockTriage } from '@/lib/gemini';
import { PatientContext, ChatMessage } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, patientContext }: { messages: ChatMessage[]; patientContext?: PatientContext } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    const lastUserMessage = messages?.filter(m => m.sender === 'user').pop()?.content || '';

    // Fallback to clinical mock triage if no API key configured or demo mode requested
    if (!apiKey) {
      console.log('No GEMINI_API_KEY detected. Using intelligent clinical fallback engine.');
      const mockResult = generateMockTriage(lastUserMessage, patientContext);
      return NextResponse.json(mockResult);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const history = (messages || []).slice(0, -1).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Inject patient context if available
    let promptText = lastUserMessage;
    if (patientContext) {
      promptText = `Patient Details: Age ${patientContext.age || 'N/A'}, Gender ${patientContext.gender || 'N/A'}, Symptom Duration ${patientContext.duration || 'N/A'}, Self-rated Severity (1-10): ${patientContext.severity || 'N/A'}, Medical History: ${patientContext.preExistingConditions || 'None'}.\n\nPatient Query: ${lastUserMessage}`;
    }

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(promptText);

    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error in AI Symptom Checker API route:', error);
    // Graceful fallback to mock response on API failure
    const lastUserMessage = 'symptom evaluation';
    const mockFallback = generateMockTriage(lastUserMessage);
    return NextResponse.json({
      ...mockFallback,
      message: mockFallback.message + " (Note: Triage completed via fallback decision engine)."
    });
  }
}
