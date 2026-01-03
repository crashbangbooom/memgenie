// app/auth/callback/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

export default function OAuthCallback() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      // console.log(data, 'userdata');
      if (error || !data.session) {
        toast.error('OAuth login failed');
        router.push('/auth/signin');
        return;
      }

      toast.success('Logged in successfully!');
      router.push('/');
    };

    handleSession();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-700">
      <div className="backdrop-blur-xl bg-gray-900 shadow-xl rounded-lg px-8 py-6 flex flex-col items-center space-y-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-500 border-t-black"></div>

        <p className="text-sm text-white font-medium">
          Logging you in… hang tight.
        </p>
      </div>
    </div>
  );
}
