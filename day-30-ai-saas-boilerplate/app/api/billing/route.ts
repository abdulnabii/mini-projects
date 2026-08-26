import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { action, orgId, targetPlan, billingCycle } = await req.json();

    if (action === 'CREATE_CHECKOUT_SESSION') {
      const sessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const checkoutUrl = `https://checkout.stripe.com/c/pay/${sessionId}`;

      return NextResponse.json({
        sessionId,
        checkoutUrl,
        plan: targetPlan,
        billingCycle,
        message: `Stripe Checkout session initialized for ${targetPlan.toUpperCase()} tier (${billingCycle}).`,
      });
    }

    if (action === 'CREATE_PORTAL_SESSION') {
      return NextResponse.json({
        portalUrl: 'https://billing.stripe.com/p/session/test_portal_session_xxx',
        message: 'Stripe Customer Portal session generated.',
      });
    }

    return NextResponse.json({ error: 'Unknown billing action' }, { status: 400 });
  } catch (error: any) {
    console.error('API /api/billing error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process billing request' },
      { status: 500 }
    );
  }
}
