import { GoogleGenerativeAI } from "@google/generative-ai";
import { GitHubProfileData, DeveloperPersona } from "@/types";

export async function generatePersonaWithGemini(
  profile: GitHubProfileData
): Promise<DeveloperPersona> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are a senior engineering talent analyst who writes insightful, witty, and clever developer personality profiles.
Analyze this GitHub developer data and write a structured persona.

Developer Data:
- Username: ${profile.username}
- Top Languages: ${profile.languages.map(l => `${l.language} (${l.percentage}%)`).join(', ')}
- Top Repos: ${profile.repos.map(r => `${r.name} (${r.stars} stars, ${r.primaryLanguage})`).join(', ')}
- Commits past year: ${profile.totalCommitsPastYear}
- Night owl coding ratio: ${profile.nightOwlPercentage}%

Return ONLY valid JSON matching this schema:
{
  "archetype": "Title (e.g. The Midnight Architect)",
  "summary": "2-3 sentences describing coding style and architectural instincts.",
  "traits": ["Trait 1", "Trait 2", "Trait 3", "Trait 4"],
  "funFact": "One humorous specific observation derived from the data.",
  "technicalStrength": "Core technical area of expertise."
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
      return JSON.parse(text);
    } catch (err) {
      console.warn("Gemini API call failed, using fallback persona:", err);
    }
  }

  return profile.persona;
}
