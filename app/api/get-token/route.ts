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
        name: user.user_metadata.full_name,
        isEmailVerified: true,
      },
    });
  }

  const token = sign({ id: prismaUser.id }, process.env.JWT_SECRET as string);

  const userWithToken = {
    details: prismaUser,
    token,
  };

  return NextResponse.json({ user: userWithToken });
}
