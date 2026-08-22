import { NextRequest, NextResponse } from 'next/server';
import { parseVoiceCommandWithGemini, parseVoiceCommandHeuristically } from '@/lib/gemini';
import { Device } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, currentDevices } = body;

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const devices: Device[] = currentDevices || [];

    try {
      const result = await parseVoiceCommandWithGemini(transcript, devices);
      return NextResponse.json(result);
    } catch (geminiError) {
      console.warn('Gemini API parse failed, using intelligent heuristic state machine:', geminiError);
      const fallbackResult = parseVoiceCommandHeuristically(transcript, devices);
      return NextResponse.json(fallbackResult);
    }
  } catch (error: any) {
    console.error('Command API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
