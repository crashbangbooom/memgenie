'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Maxwidth from '@/components/Maxwidth';
import { Spinner } from '@/components/ui/spinner';

import { loginSchema, signupSchema } from '@/auth/authSchemas';
import { useAuth } from './auth-config/useAuth';

/* ------------------ TYPES ------------------ */
type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const searchParams = useSearchParams();
  const referralCodeId = searchParams.get('ref') || '';

  const {
    signin,
    loadingSignin,
    signup,
    loadingSignup,
    signinWithGoogle,
    loadingSigninWithGoogle,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  /* ------------------ FORMS ------------------ */
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      referralCode: '',
    },
  });

  /* ------------------ HANDLERS ------------------ */
  const onLogin = async (values: LoginValues) => {
    await signin(values);
  };

  const onSignup = async (values: SignupValues) => {
    await signup({
      ...values,
      referralCode: referralCodeId,
    });
  };

  /* ------------------ UI ------------------ */
  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        background: `radial-gradient(900px 520px at 20% 0%, rgba(34,197,94,.14), transparent 60%),
                     radial-gradient(900px 520px at 100% 0%, rgba(245,158,11,.12), transparent 55%),
                     linear-gradient(180deg, #0b1220, #070f1b 70%, #060c16)`,
        color: '#e8eefc',
      }}
    >
      <Maxwidth className="max-w-[470px] w-full">
        <Card
          className="p-6"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,.03), rgba(0,0,0,.14))',
            border: '1px solid rgba(255,255,255,.10)',
            borderRadius: '18px',
            boxShadow: '0 18px 60px rgba(0,0,0,.55)',
          }}
        >
          {/* Tabs */}
          <div
            className="flex gap-2 p-1 rounded-full mb-4"
            style={{
              border: '1px solid rgba(255,255,255,.10)',
              background: 'rgba(0,0,0,.2)',
            }}
          >
            <button
              className={`flex-1 py-2 rounded-full font-bold transition ${
                mode === 'login'
                  ? 'bg-[rgba(255,255,255,.06)] text-[#e8eefc]'
                  : 'text-[rgba(232,238,252,.75)]'
              }`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 rounded-full font-bold transition ${
                mode === 'signup'
                  ? 'bg-[rgba(255,255,255,.06)] text-[#e8eefc]'
                  : 'text-[rgba(232,238,252,.75)]'
              }`}
              onClick={() => setMode('signup')}
            >
              Sign up
            </button>
          </div>

          <h1 className="text-2xl font-bold text-[#e8eefc] mb-1">
            {mode === 'login' ? 'Login' : 'Create account'}
          </h1>
          <p className="text-sm text-[#9db0d0] mb-4">
            {mode === 'login'
              ? 'Welcome back. Sign in to continue.'
              : 'Create your account in seconds.'}
          </p>

          <CardContent className="p-0">
            {mode === 'login' ? (
              /* ================= LOGIN ================= */
              <Form {...loginForm} key="login-form">
                <form
                  onSubmit={loginForm.handleSubmit(onLogin)}
                  className="grid gap-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#e8eefc] text-[13px] font-bold">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="you@example.com"
                            className="placeholder:text-[#9db0d0] text-[#e8eefc]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#e8eefc] text-[13px] font-bold">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showLoginPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              className="placeholder:text-[#9db0d0] text-[#e8eefc] pr-10 "
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9db0d0] hover:text-[#9db0d0] hover:bg-[#9db0d0]/10 rounded-[14px]"
                              onClick={() => setShowLoginPassword((s) => !s)}
                            >
                              {showLoginPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loadingSignin}
                    className="bg-green-500 hover:bg-green-600 text-[#06210f] p-[12px] rounded-[14px] h-11 font-black"
                  >
                    {loadingSignin ? (
                      <>
                        <Spinner /> Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              /* ================= SIGNUP ================= */
              <Form {...signupForm} key="signup-form">
                <form
                  onSubmit={signupForm.handleSubmit(onSignup)}
                  className="grid gap-3"
                >
                    <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#e8eefc] text-[13px] font-bold">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John Doe"
                            className="placeholder:text-[#9db0d0] text-[#e8eefc]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#e8eefc] text-[13px] font-bold">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="you@example.com"
                            className="placeholder:text-[#9db0d0] text-[#e8eefc]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#e8eefc] text-[13px] font-bold">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              placeholder="*********"
                              className="placeholder:text-[#9db0d0] text-[#e8eefc] pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9db0d0] hover:text-[#9db0d0] hover:bg-[#9db0d0]/10 rounded-[14px]"
                              onClick={() => setShowPassword((s) => !s)}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password */}
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#e8eefc] text-[13px] font-bold">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="*********"
                              className=" pr-[42px]"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9db0d0] hover:text-[#9db0d0] hover:bg-[#9db0d0]/10 rounded-[14px]"
                              onClick={() => setShowConfirmPassword((s) => !s)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loadingSignup}
                    className="bg-green-500 hover:bg-green-600 text-[#06210f] p-[12px] rounded-[14px] h-11 font-black"
                  >
                    {loadingSignup ? (
                      <>
                        <Spinner /> Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </Form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-2 text-sm my-4 text-[rgba(157,176,208,.75)]">
              <span className="flex-1 h-px bg-[rgba(255,255,255,.1)]" />
              Or
              <span className="flex-1 h-px bg-[rgba(255,255,255,.1)]" />
            </div>

            {/* Google */}
            <Button
              variant="outline"
              onClick={signinWithGoogle}
              disabled={loadingSigninWithGoogle}
              className="w-full flex gap-2 bg-[#ffffff0f] text-[#e8eefcf2] hover:text-[#e8eefcf2] border border-[#ffffff1f] hover:bg-[#ffffff17] hover:border-[#ffffff2e] p-[12px] rounded-[14px] h-11 font-black"
            >
              {/* <Image src="/g.svg" width={18} height={18} alt="Google" /> */}
              <svg
                className="w-[18px] h-[18px]"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.87 32.659 29.26 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917Z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691 12.88 19.51C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691Z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.195 35.091 26.715 36 24 36c-5.237 0-9.834-3.318-11.268-7.946l-6.522 5.025C9.517 39.556 16.227 44 24 44Z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303c-.686 1.959-1.93 3.617-3.584 4.762l.003-.002 6.19 5.238C36.557 39.113 44 34 44 24c0-1.341-.138-2.651-.389-3.917Z"
                />
              </svg>
              {loadingSigninWithGoogle
                ? 'Please wait...'
                : 'Continue with Google'}
            </Button>
          </CardContent>
        </Card>
      </Maxwidth>
    </div>
  );
}

// auth/login/page.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { loginSchema } from '@/auth/authSchemas';
// import { Button } from '@/components/ui/button';
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import toast from 'react-hot-toast';
// import { Eye, EyeOff } from 'lucide-react';
// import { z } from 'zod';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { cn } from '@/lib/utils';
// import { Spinner } from '@/components/ui/spinner';
// import Link from 'next/link';
// import Maxwidth from '@/components/Maxwidth';
// import { useAuth } from './auth-config/useAuth';
// import Cookies from 'js-cookie';
// import Image from 'next/image';

// type LoginValues = z.infer<typeof loginSchema>;

// export default function Signin() {
//   const router = useRouter();
//   const {
//     signin,
//     loadingSignin,
//     signinWithGoogle,
//     loadingSigninWithGoogle,
//     signinWithFacebook,
//     loadingSigninWithFacebook,
//   } = useAuth();
//   const [showPassword, setShowPassword] = useState(false);

//   const form = useForm<LoginValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: '', password: '' },
//   });

//   useEffect(() => {
//     Cookies.remove('token');
//   }, []);

//   const onSubmit = async (values: LoginValues) => {
//     await signin(values);
//   };

//   return (
//     <div className="flex min-h-screen items-center  bg-gray-700">
//       <Maxwidth className="max-w-md py-8 ">
//         <Card className="bg-gray-800 border border-green-500">
//           <CardHeader>
//             <div className="rounded-full border-4 border-green-500 w-[100px] h-[100px] flex items-center justify-center mx-auto bg-green-500/20">
//               <Image
//                 src={'/logo.png'}
//                 width={100}
//                 height={100}
//                 alt="logo"
//                 className="rounded-full bg-gray-800 p-1"
//               />
//             </div>
//             <CardTitle className="text-green-500">
//               Login to your account
//             </CardTitle>
//             <CardDescription className="text-white">
//               Enter your email below to login to your account
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-4"
//               >
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-white">Email*</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="you@example.com"
//                           type="email"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <div className="flex items-center justify-between ">
//                         <FormLabel className="text-white">Password*</FormLabel>
//                         <Link
//                           href="/auth/forgot-password"
//                           className=" text-sm text-white underline-offset-4 hover:underline"
//                         >
//                           Forgot your password?
//                         </Link>
//                       </div>
//                       <FormControl>
//                         <div className="relative">
//                           <Input
//                             type={showPassword ? 'text' : 'password'}
//                             placeholder="••••••••"
//                             {...field}
//                             className="pr-10"
//                           />
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                             onClick={() => setShowPassword((s) => !s)}
//                           >
//                             {showPassword ? (
//                               <EyeOff className="text-gray-500 cursor-pointer w-4 h-4" />
//                             ) : (
//                               <Eye className="text-gray-500 cursor-pointer w-4 h-4" />
//                             )}
//                           </Button>
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <div className="flex flex-col gap-2">
//                   <Button
//                     type="submit"
//                     disabled={loadingSignin}
//                     className="w-full bg-green-500 text-white hover:bg-green-400"
//                   >
//                     {loadingSignin ? (
//                       <>
//                         <Spinner /> Signing in...
//                       </>
//                     ) : (
//                       'Sign in'
//                     )}
//                   </Button>
//                   <div className="flex items-center gap-2">
//                     <hr className="h-px w-full my-4 bg-gray-200 border-0 dark:bg-gray-700" />
//                     <span className="text-white whitespace-nowrap">
//                       Or continue with
//                     </span>
//                     <hr className="h-px w-full my-4 bg-gray-200 border-0 dark:bg-gray-700" />
//                   </div>
//                   <div className="flex gap-2 justify-between items-center">
//                     <Button
//                       variant="outline"
//                       type="button"
//                       className="w-full bg-yellow-500/30 text-yellow-500 hover:bg-yellow-500/30 border border-yellow-500 hover:text-yellow-600"
//                       onClick={signinWithGoogle}
//                       disabled={loadingSigninWithGoogle}
//                     >
//                       {loadingSigninWithGoogle ? (
//                         <>
//                           <Spinner /> Login with Google ...
//                         </>
//                       ) : (
//                         'Login with Google'
//                       )}{' '}
//                     </Button>

//                     {/* <Button
//                       variant="outline"
//                       type="button"
//                       className="w-full"
//                       onClick={signinWithFacebook}
//                       disabled={loadingSigninWithFacebook}
//                     >
//                      {loadingSigninWithFacebook ? <><Spinner /> Login with Facebook... </>  : "Login with Facebook"}
//                     </Button> */}
//                   </div>
//                   <div className="text-center text-white">
//                     Don&apos;t have an account?{' '}
//                     <Link
//                       href="/auth/signup"
//                       className="underline text-green-500 hover:text-green-600"
//                     >
//                       Sign up
//                     </Link>
//                   </div>
//                 </div>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       </Maxwidth>
//     </div>
//   );
// }
