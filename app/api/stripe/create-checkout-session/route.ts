import { getRequestOrigin } from '@/server/utils/get-request-origin';
import stripe from '@/server/utils/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, response: NextResponse) {
  const origin = getRequestOrigin(request);
  const userId = request.nextUrl.searchParams.get('user_id');
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      tax_id_collection: {
        enabled: true,
      },
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID as string,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        planPrice: request.nextUrl.searchParams.get('price_plan'),
      },
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/`,
    });

    const response = NextResponse.redirect(session.url as string, {
      status: 302,
    });
    return response;
  } catch (err) {
    console.log('ERROR', err);
  }
}
