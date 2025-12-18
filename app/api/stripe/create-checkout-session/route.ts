/*import {
  CREATED_STRIPE_CHECKOUT_SESSION,
  PAYMENT_SESSION_CREATION_ERROR,
} from '@/server/constants/track';
import { getRequestOrigin } from '@/server/utils/get-request-origin';
import stripe from '@/server/utils/stripe';
import reportDiscord from '@/utils/reportDiscord';
import systemLog from '@/utils/systemLog';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, response: NextResponse) {
  const origin = getRequestOrigin(request);
  const userId = request.nextUrl.searchParams.get('user_id');
  //const priceId =
  //  process.env[
  //    request.nextUrl.searchParams.get('price_plan') || 'PRICE_PLAN_1'
  //  ];
  try {
    systemLog.track(CREATED_STRIPE_CHECKOUT_SESSION, {
      userId: userId as string,
    });
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      tax_id_collection: {
        enabled: true,
      },
      line_items: [
        {
          price: process.env.PRICE_SUBSCRIPTION,
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
    systemLog.track(PAYMENT_SESSION_CREATION_ERROR, {
      err: (err as Error)?.message || 'Unknown error',
    });
    reportDiscord({
      error: err as Error,
      isError: true,
      currentUser: { userId },
    });
    console.log('ERROR', err);
  }
}
*/

import { NextResponse } from 'next/server';

export async function GET(request: unknown, response: NextResponse) {
  return NextResponse.json({ message: 'Endpoint disabled' }, { status: 410 });
}
