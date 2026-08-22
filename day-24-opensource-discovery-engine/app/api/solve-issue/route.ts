import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { repoName, issueTitle, issueBody, language } = body;

    if (!issueTitle) {
      return NextResponse.json({ error: 'Issue title is required' }, { status: 400 });
    }

    const key = process.env.GEMINI_API_KEY || '';
    if (!key) {
      return NextResponse.json({
        solution: {
          rootCause: `Issue "${issueTitle}" involves unexpected behavior or missing edge-case handling in the ${language || 'TypeScript'} codebase.`,
          filesToModify: [
            `src/components/${(issueTitle.split(' ')[0] || 'core').toLowerCase()}.tsx`,
            `tests/${(issueTitle.split(' ')[0] || 'core').toLowerCase()}.test.ts`,
          ],
          fixStrategy: `1. Locate the component handler responsible for this state.\n2. Add guard check for edge cases.\n3. Validate lifecycle cleanup.\n4. Run existing test suite to ensure zero regressions.`,
          codeSnippet: `// Proposed fix logic:\nif (!targetElement || isDestroyed) {\n  return fallbackState;\n}`,
          unitTestSnippet: `it('should resolve ${issueTitle} without throwing', () => {\n  expect(handledAction()).toBeDefined();\n});`,
          prTitle: `fix: resolve ${issueTitle.toLowerCase().replace(/[^a-z0-9 ]/g, '')}`,
          gitCommitCommand: `git commit -m "fix: resolve ${issueTitle.toLowerCase().slice(0, 40)}"`,
          prDescriptionMarkdown: `## Description\n\nCloses #[issue]\n\n### Root Cause\nAddressed edge-case handling for ${issueTitle}.\n\n### Validation\n- [x] Tested locally\n- [x] Added unit test coverage`,
        },
      });
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
You are a Principal Open Source Engineer. An open-source contributor wants to solve this issue and open a high-quality Pull Request.

REPOSITORY: ${repoName || 'Open Source Project'}
LANGUAGE / STACK: ${language || 'TypeScript'}
ISSUE TITLE: "${issueTitle}"
ISSUE DETAILS: "${issueBody || 'No additional details provided'}"

Generate a thorough, practical, developer-ready issue resolution plan in valid JSON matching this schema:
{
  "rootCause": "Clear 2-sentence explanation of why this bug or missing feature occurs",
  "filesToModify": ["filepath1", "filepath2"],
  "fixStrategy": "Numbered step-by-step breakdown of how to write the fix",
  "codeSnippet": "TypeScript / code patch illustrating the key change",
  "unitTestSnippet": "Jest / Vitest / pytest unit test snippet to verify the fix",
  "prTitle": "Conventional commit style PR title (e.g. fix(core): ... or feat(docs): ...)",
  "gitCommitCommand": "git commit command string",
  "prDescriptionMarkdown": "Full GitHub PR description ready to paste into GitHub PR editor"
}
`;

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    return NextResponse.json({ solution: parsed });
  } catch (error: any) {
    console.error('Solve Issue API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze issue' }, { status: 500 });
  }
}
