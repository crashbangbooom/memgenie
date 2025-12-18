import prisma from '@/prisma/prisma';
import stripe from '@/server/utils/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('Stripe webhook invoked');
  const sig = req.headers.get('stripe-signature') as string;
  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_ACCOUNT_WEBHOOK_SECRET as string
    );
    if (event.type === 'checkout.session.completed') {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata;
      const { userId, planPrice } = metadata as any;
      const subscription = await stripe.subscriptions.retrieve(
        event?.data?.object?.subscription as string
      );
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionEndDate: new Date(
            subscription?.items.data[0].current_period_end * 1000
          ),
        },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      {
        message: 'Webhook verification error',
      },
      {
        status: 400,
      }
    );
  }
}
