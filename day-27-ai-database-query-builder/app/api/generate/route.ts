import { NextRequest, NextResponse } from 'next/server';
import { generateDatabaseQueryWithGemini } from '@/lib/gemini';
import { DatabaseSchema, DatabaseDialect } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, schema, dialect } = body;

    if (!question || !schema) {
      return NextResponse.json({ error: 'Question and schema are required' }, { status: 400 });
    }

    const selectedDialect: DatabaseDialect = dialect || 'postgres';
    const generated = await generateDatabaseQueryWithGemini(
      question,
      schema as DatabaseSchema,
      selectedDialect
    );

    return NextResponse.json({ generatedQuery: generated });
  } catch (error: any) {
    console.error('Generate query API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate query' }, { status: 500 });
  }
}
