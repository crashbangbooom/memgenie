// middleware.ts

// import { type NextRequest } from 'next/server';
// import { updateSession } from './lib/supabase/middleware';

// export async function middleware(request: NextRequest) {
//   return await updateSession(request);
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// };

// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Optional: Add specific IPs to block individually
const blockedIPs: string[] = [
  // '203.0.113.5',
  // '198.51.100.7'
];

export function middleware(req: NextRequest) {
  // Get client IP from x-forwarded-for header (first one is real IP)
  const xForwardedFor = req.headers.get('x-forwarded-for');
  const ip = xForwardedFor ? xForwardedFor.split(',')[0].trim() : 'Unknown';

  // Log IP in Vercel logs
  console.log('Incoming request from IP:', ip);

  // Block specific IPs if needed
  if (blockedIPs.includes(ip)) {
    return new NextResponse('Access denied', { status: 403 });
  }

  // Block everything else temporarily
  return new NextResponse('Site temporarily unavailable', { status: 503 });
}
