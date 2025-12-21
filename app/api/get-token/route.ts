import { createSupabaseServerClient } from '@/lib/session';
import prisma from '@/prisma/prisma';
import { sign } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = user.email as string;

  let prismaUser = await prisma.user.findUnique({ where: { email } });

  if (!prismaUser) {
    prismaUser = await prisma.user.create({
      data: {
        email,
        name: user.user_metadata.full_name || user.user_metadata.name || '',
        isEmailVerified: true,
      },
    });

    const referrer = user.user_metadata.referralCode as string | undefined;
    if (referrer) {
      const referrerUser = await prisma.user.findUnique({
        where: { id: referrer },
      });
      if (referrerUser) {
        await prisma.user.update({
          where: { id: referrer },
          data: {
            referrals: {
              push: prismaUser.id,
            },
            pendingReferralCount: referrerUser.pendingReferralCount + 1,
          },
        });
      }
    }
  }

  const token = sign({ id: prismaUser.id }, process.env.JWT_SECRET as string);

  const userWithToken = {
    details: prismaUser,
    token,
  };

  return NextResponse.json({ user: userWithToken });
}
