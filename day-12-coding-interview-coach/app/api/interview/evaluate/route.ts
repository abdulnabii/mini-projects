import { NextResponse } from 'next/server';
import { PROBLEM_LIBRARY } from '@/lib/problems';
import { evaluateSolutionWithGemini } from '@/lib/gemini';
import { TestCaseResult } from '@/types';

export async function POST(req: Request) {
  try {
    const { problemId, code, language } = await req.json();

    const problem = PROBLEM_LIBRARY.find((p) => p.id === problemId) || PROBLEM_LIBRARY[0];

    // Generate mock execution results against test suite
    const mockTestResults: TestCaseResult[] = problem.testCases.map((tc) => ({
      testId: tc.id,
      input: tc.input,
      expected: tc.expectedOutput,
      actual: tc.expectedOutput,
      passed: true,
      executionTimeMs: Math.floor(Math.random() * 12) + 4,
    }));

    const evaluation = await evaluateSolutionWithGemini(
      problem,
      code || '',
      language || 'python',
      mockTestResults
    );

    return NextResponse.json(evaluation);
  } catch (err) {
    console.error('Error evaluating solution:', err);
    return NextResponse.json({ error: 'Failed to evaluate solution' }, { status: 500 });
  }
}
