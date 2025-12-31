// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/auth-config/useAuth';
import { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { AppContext } from '@/utils/context';

export default function Home() {
  const router = useRouter();
  const { logout, loadingLogout } = useAuth();
  const {
    context: { user },
  } = useContext(AppContext);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token || token === 'undefined') {
      fetch('/api/get-token').then((data) => {
        data.json().then((d) => {
          if (!d.user?.token) return;
          Cookies.set('token', d.user.token);
        });
        window.location.href = 'https://memgenie.net';
      });
    } else {
      window.location.href = 'https://memgenie.net';
    }
  }, []);

  return null;

  /*
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-neutral-900 dark:to-neutral-800 transition-colors duration-300">
      
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
          Learn Smarter Vocabulary <br />
          with <span className="text-primary">MemGenie Assistant</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          MemGenie helps you understand, remember, and use words naturally —
          powered by intelligent explanations, examples, and daily practice.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {!user?.id ? (
            <>
              <Button
                size="lg"
                className="px-8 text-lg"
                onClick={() => router.push('/auth/signup')}
              >
                Get Started Free
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-8 text-lg"
                onClick={() => router.push('/auth/signin')}
              >
                Login
              </Button>
            </>
          ) : (
            <>
              <Button
                size="lg"
                className="px-8 text-lg"
                onClick={() => router.push('/extension')}
              >
                🚀 Use Extension Now
              </Button>

              <Button
                size="lg"
                variant="outline"
                disabled={loadingLogout}
                onClick={logout}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="border-t border-gray-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Smart Word Meanings
            </h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Context-based explanations instead of boring dictionary
              definitions.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Memory-Based Learning
            </h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Designed to help your brain retain words for the long term.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Browser Extension
            </h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Learn words instantly while browsing — no interruptions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );*/
}
