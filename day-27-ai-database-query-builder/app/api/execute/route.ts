import { NextRequest, NextResponse } from 'next/server';
import { executeMockQuery } from '@/lib/queryExecutor';
import { DatabaseDialect } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, dialect, schemaName } = body;

    const result = executeMockQuery(
      query || '',
      (dialect as DatabaseDialect) || 'postgres',
      schemaName || 'E-Commerce'
    );

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Execute query API error:', error);
    return NextResponse.json({ error: error.message || 'Execution error' }, { status: 500 });
  }
}
