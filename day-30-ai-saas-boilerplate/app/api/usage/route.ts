import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiEngine: 'Google Gemini 1.5 Flash',
    billingGateway: 'Stripe v2024-06-20',
    authProvider: 'Clerk / OAuth2',
    database: 'Supabase PostgreSQL RLS',
  });
}
