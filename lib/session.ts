import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore
            .getAll()
            .map(({ name, value }) => ({ name, value }));
        },
        setAll(_cookiesToSet) {
          // next/headers cookies are read-only in server routes (App Router)
          // If you need to write cookies, use middleware or edge functions
        },
      },
    }
  );
};
