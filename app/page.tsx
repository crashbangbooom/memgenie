// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/auth-config/useAuth';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export default function Home() {
  const router = useRouter();
  const { logout, loadingLogout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   const token = Cookies.get('token');
  //   if (!token || token === 'undefined') {
  //     fetch('/api/get-token').then((data) => {
  //       data.json().then((d) => {
  //         if (!d.user?.token) return;
  //         Cookies.set('token', d.user.token);
  //         window.location.reload();
  //       });
  //     });
  //   }
  // }, []);

  useEffect(() => {
    const token = Cookies.get('token');

    // Already logged in
    if (token && token !== 'undefined') {
      setIsLoggedIn(true);

      if (!sessionStorage.getItem('login-toast')) {
        toast.success('Logged in successfully 🚀');
        sessionStorage.setItem('login-toast', 'true');
      }
      return;
    }

    // Try to get token from backend
    fetch('/api/get-token')
      .then((res) => res.json())
      .then((d) => {
        if (!d.user?.token) return;

        Cookies.set('token', d.user.token);
        setIsLoggedIn(true);

        if (!sessionStorage.getItem('login-toast')) {
          toast.success('Logged in successfully 🚀');
          sessionStorage.setItem('login-toast', 'true');
        }
      })
      .catch(() => {
        // silent fail
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-neutral-900 dark:to-neutral-800 transition-colors duration-300">
      {/* Logo + Heading */}
      <div className="flex flex-col items-center text-center space-y-4 mb-10">
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          width={120}
          height={30}
          className="dark:invert"
          priority
        />

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
          Welcome to Your Next.js Starter
        </h1>

        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Build your next project faster — optional auth included and ready to
          use.
        </p>

        {isLoggedIn && (
          <p className="mt-2 text-green-600 dark:text-green-400 font-medium">
            ✅ You are logged in. Use extension now.
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-6 justify-center">
        {!isLoggedIn ? (
          <>
            <Button size="lg" onClick={() => router.push('/auth/signin')}>
              Login
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/auth/signup')}
            >
              Sign Up
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
              onClick={() => {
                Cookies.remove('token');
                sessionStorage.removeItem('login-toast');
                logout();
                setIsLoggedIn(false);
                toast.success('Logged out successfully');
              }}
            >
              Logout
            </Button>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-500 dark:text-gray-400 text-center">
        Built with ❤️ using{' '}
        <a
          href="https://nextjs.org"
          className="text-blue-600 dark:text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js
        </a>{' '}
        and{' '}
        <a
          href="https://ui.shadcn.com/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          ShadCN UI
        </a>
      </footer>
    </main>
  );
}
