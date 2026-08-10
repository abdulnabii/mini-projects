import { GoogleGenerativeAI } from "@google/generative-ai";
import { MeetingIntelligence } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function extractMeetingIntelligence(transcript: string): Promise<MeetingIntelligence> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
System: You are a precision meeting intelligence extraction engine. Extract structured data from meeting transcripts. Return ONLY valid JSON, without any markdown formatting or code blocks.

Schema:
{
  "attendees": [{ "name": "string", "role": "string | null" }],
  "decisions": [{ "decision": "string", "timestamp": "string | null", "decisionMaker": "string | null" }],
  "actionItems": [{ "id": "string", "task": "string", "assignee": "string | null", "deadline": "string | null", "priority": "HIGH | MEDIUM | LOW" }],
  "blockers": [{ "description": "string", "raisedBy": "string | null", "severity": "CRITICAL | MODERATE | MINOR" }],
  "executiveSummary": "string (3-5 sentences)",
  "meetingDuration": "string | null",
  "sentiment": "positive | neutral | tense | mixed"
}

User: Extract the intelligence from the following transcript:
${transcript}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw new Error("Failed to extract intelligence from transcript");
  }
}
