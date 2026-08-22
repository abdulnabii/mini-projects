import { GoogleGenerativeAI } from '@google/generative-ai';
import { ContributionGuide, OpenSourceProject, TechSkill } from '@/types';

export async function generateFirstPrGuideWithGemini(
  project: OpenSourceProject,
  userSkills: TechSkill[],
  apiKey?: string
): Promise<ContributionGuide> {
  const key = apiKey || process.env.GEMINI_API_KEY || '';

  if (!key) {
    return (
      project.defaultGuide || {
        setupSteps: [
          `Fork https://github.com/${project.fullName} on GitHub`,
          `git clone https://github.com/YOUR_USER/${project.repo}.git`,
          `cd ${project.repo} && npm install (or pnpm/cargo/pip as appropriate)`,
          `Create a feature branch: git checkout -b feat/my-first-pr`,
        ],
        recommendedFirstIssue:
          'Search for open issues with the label "good first issue", documentation typos, or test coverage expansion.',
        codingConventions: [
          'Run linter before committing (`npm run lint` or `cargo clippy`)',
          'Follow existing codebase naming conventions and formatters',
          'Keep PR scope focused to a single atomic fix',
        ],
        prTemplate: `## What Does This PR Do?\n\nCloses #[issue-number]\n\n### Changes\n- [Describe your implementation]\n\n### Testing\n- [ ] Automated tests pass\n- [ ] Manually tested`,
        estimatedTime: '1 - 3 hours for first contribution',
      }
    );
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const prompt = `
You are a Staff Developer Advocate guiding a developer to make their first Pull Request to this open-source repository.

REPOSITORY:
- Name: ${project.fullName}
- Description: ${project.description}
- Language: ${project.language}
- Topics: ${project.topics.join(', ')}

USER'S SKILL STACK:
${userSkills.join(', ')}

Generate a personalized first-PR contribution roadmap in valid JSON:
{
  "setupSteps": [
    "git clone command and setup instructions tailored to this language/framework",
    "install command",
    "local dev server start command"
  ],
  "recommendedFirstIssue": "Specific recommendation of what type of issue they should target based on their skills (${userSkills.join(', ')})",
  "codingConventions": [
    "3 specific conventions or linter rules to follow in this stack"
  ],
  "prTemplate": "Markdown template for their PR description with clear checklist",
  "estimatedTime": "Estimated time (e.g. 1-2 hours)"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());
    return {
      setupSteps: parsed.setupSteps || [],
      recommendedFirstIssue: parsed.recommendedFirstIssue || 'Look for issues labeled "good first issue".',
      codingConventions: parsed.codingConventions || [],
      prTemplate: parsed.prTemplate || '## PR Description',
      estimatedTime: parsed.estimatedTime || '1 - 2 hours',
    };
  } catch (error) {
    console.warn('Gemini guide generation failed, falling back to default:', error);
    return (
      project.defaultGuide || {
        setupSteps: [
          `git clone https://github.com/YOUR_USER/${project.repo}.git`,
          `cd ${project.repo} && npm install`,
          `git checkout -b fix/issue-resolution`,
        ],
        recommendedFirstIssue: 'Documentation improvements and good first issues.',
        codingConventions: ['Strict typing', 'Run tests before opening PR'],
        prTemplate: '## Summary\n\nCloses #[issue]',
        estimatedTime: '1 - 2 hours',
      }
    );
  }
}
