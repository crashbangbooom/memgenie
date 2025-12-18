import { NextRequest } from 'next/server';

export const getRequestOrigin = (req: NextRequest) =>
  `${
    req.headers.get('x-forwarded-proto') === `https` ? `https` : `http`
  }://${req.headers.get('host')}`;
