import { GoogleGenerativeAI } from '@google/generative-ai';
import { EvaluationReport, Hint, Problem, ProgrammingLanguage, TestCaseResult } from '@/types';

export async function generateInterviewerGreeting(
  problem: Problem,
  language: ProgrammingLanguage
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are Alex, a Staff Software Engineer conducting a technical coding interview at Google/Meta.
Your tone is professional, encouraging, and direct.

Present this coding interview problem to the candidate:
- Problem Title: "${problem.title}"
- Difficulty: "${problem.difficulty}"
- Category: "${problem.category}"
- Language: "${language}"

Problem Description:
${problem.description}

Constraints:
${problem.constraints.join('\n')}

Greeting guidelines:
1. Welcome the candidate warmly ("Welcome! Let's get started. Today's problem is...").
2. Present the problem clearly with 1 clean example.
3. Ask the candidate to talk through their high-level approach before typing any code.
Keep it concise (3-4 short paragraphs maximum). Do NOT reveal the solution.`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.warn('Gemini API greeting error, using fallback:', err);
    }
  }

  return `Welcome to your technical interview session! My name is Alex, and I'll be your interviewer today.\n\nToday we'll be tackling **${problem.title}** (${problem.difficulty} difficulty in ${problem.category}).\n\nTake a moment to read through the problem description and constraints on the left. Before you dive into writing code in ${language.toUpperCase()}, please talk me through your initial high-level approach or ask any clarifying questions!`;
}

export async function respondAsInterviewer(
  problem: Problem,
  chatHistory: { sender: string; text: string }[],
  candidateMessage: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: `You are Alex, a Staff Software Engineer conducting a technical coding interview.
You are rigorous, direct, and supportive.
Guidelines:
1. If candidate proposes a valid approach, give a neutral positive signal ("That sounds like a solid O(N) strategy. Go ahead and implement it!").
2. If candidate's approach has flaws or bad complexity, ask a probing question ("What would be the time complexity if we have 1M elements? Can we do better than O(N^2)?").
3. Keep responses under 3-4 sentences so the candidate stays focused on coding.`,
      });

      const historyFormatted = chatHistory
        .map((m) => `${m.sender.toUpperCase()}: ${m.text}`)
        .join('\n');

      const prompt = `Problem: ${problem.title} (${problem.difficulty})\nConversation History:\n${historyFormatted}\n\nCandidate Message: "${candidateMessage}"\n\nProvide your response as the interviewer Alex:`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.warn('Gemini API interviewer chat error:', err);
    }
  }

  return `That sounds like a reasonable direction! Pay close attention to edge cases and time complexity. Feel free to start implementing your solution in the code editor when ready.`;
}

export async function generateProgressiveHint(
  problem: Problem,
  currentCode: string,
  hintsGivenCount: number
): Promise<Hint> {
  const tier = (Math.min(hintsGivenCount + 1, 3)) as 1 | 2 | 3;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are an AI Interviewer providing a progressive hint for problem "${problem.title}".
Current Hint Tier requested: Tier ${tier} out of 3.
- Tier 1 = Nudge (Conceptual direction, 5pt penalty)
- Tier 2 = Guidance (Algorithmic strategy, 10pt penalty)
- Tier 3 = Pseudocode Blueprint (Concrete pseudocode scaffold, 15pt penalty)

Candidate's current code snippet:
"""
${currentCode}
"""

Return ONLY a valid JSON object matching this schema (no markdown wrapping):
{
  "tier": ${tier},
  "title": "Tier ${tier} Hint Title",
  "content": "Detailed hint explanation...",
  "penaltyPoints": ${tier === 1 ? 5 : tier === 2 ? 10 : 15}
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
      return JSON.parse(text);
    } catch (err) {
      console.warn('Gemini hint generation error:', err);
    }
  }

  // Fallback hints
  if (tier === 1) {
    return {
      tier: 1,
      title: 'Tier 1: Conceptual Direction (Nudge)',
      content: `Consider the sorted nature of the input array. How can we leverage two pointers starting at opposite ends to reduce time complexity?`,
      penaltyPoints: 5,
    };
  } else if (tier === 2) {
    return {
      tier: 2,
      title: 'Tier 2: Algorithmic Strategy (Guidance)',
      content: `Maintain \`left = 0\` and \`right = len - 1\`. If \`sum < target\`, increment \`left\` to increase total. If \`sum > target\`, decrement \`right\` to decrease total.`,
      penaltyPoints: 10,
    };
  } else {
    return {
      tier: 3,
      title: 'Tier 3: Pseudocode Blueprint',
      content: `\`\`\`python\nleft, right = 0, len(nums) - 1\nwhile left < right:\n    sum = nums[left] + nums[right]\n    if sum == target: return [left+1, right+1]\n    elif sum < target: left += 1\n    else: right -= 1\n\`\`\``,
      penaltyPoints: 15,
    };
  }
}

export async function evaluateSolutionWithGemini(
  problem: Problem,
  code: string,
  language: ProgrammingLanguage,
  testResults: TestCaseResult[]
): Promise<EvaluationReport> {
  const passedCount = testResults.filter((t) => t.passed).length;
  const totalCount = testResults.length;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are a Senior Staff Engineer evaluating a technical interview submission.
Problem: "${problem.title}" (${problem.difficulty})
Language: "${language}"

Candidate Code:
"""
${code}
"""

Test Case Suite Results: ${passedCount} / ${totalCount} passed.

Return ONLY a valid JSON object matching this exact schema:
{
  "overallScore": 84,
  "correctnessScore": 88,
  "codeQualityScore": 85,
  "communicationScore": 80,
  "timeComplexity": "O(N)",
  "spaceComplexity": "O(1)",
  "strengths": [
    "Used optimal two-pointer approach",
    "Clean variable naming and bounds checking"
  ],
  "improvements": [
    "Add explicit type annotations",
    "Handle potential empty array boundary case explicitly"
  ],
  "optimalSolution": "Optimal code string...",
  "optimalExplanation": "Two-pointer is optimal because sorted order guarantees monotonic sum changes.",
  "roadmapTopics": [
    "Binary Search Variant",
    "Sliding Window Patterns",
    "Edge Case Defensive Coding"
  ]
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
      const parsed = JSON.parse(text);

      return {
        ...parsed,
        passedTestsCount: passedCount,
        totalTestsCount: totalCount,
        testResults,
      };
    } catch (err) {
      console.warn('Gemini solution evaluation error:', err);
    }
  }

  // Fallback evaluation
  return {
    overallScore: Math.min(Math.round((passedCount / Math.max(totalCount, 1)) * 80 + 15), 100),
    correctnessScore: Math.round((passedCount / Math.max(totalCount, 1)) * 100),
    codeQualityScore: 85,
    communicationScore: 80,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    passedTestsCount: passedCount,
    totalTestsCount: totalCount,
    testResults,
    strengths: [
      'Leveraged sorted array structure effectively',
      'Clean control flow and minimal extra space usage',
    ],
    improvements: [
      'Consider edge cases where target is negative',
      'Add comments explaining the pointer movement logic',
    ],
    optimalSolution: problem.starterCode[language] || code,
    optimalExplanation: 'Two-pointer approach traverses array in single O(N) pass using O(1) memory.',
    roadmapTopics: ['Binary Search', 'Sliding Window', 'Two Pointers'],
  };
}
