// auth/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema } from '@/auth/authSchemas';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import Maxwidth from '@/components/Maxwidth';
import { useAuth } from './auth-config/useAuth';

type LoginValues = z.infer<typeof loginSchema>;

export default function Signin() {
  const router = useRouter();
  const { signin, loadingSignin, signinWithGoogle, loadingSigninWithGoogle,  signinWithFacebook, loadingSigninWithFacebook } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    await signin(values);
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-yellow-500">
      <Maxwidth className="max-w-md py-8 ">
        <Card className='bg-gray-800'>
          <CardHeader>
            <CardTitle className='text-green-500'>Login to your account</CardTitle>
            <CardDescription className='text-white'>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-white'>Email*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between ">
                        <FormLabel className='text-white'>Password*</FormLabel>
                        <Link
                          href="/auth/forgot-password"
                          className=" text-sm text-white underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword((s) => !s)}
                          >
                            {showPassword ? (
                              <EyeOff className="text-gray-500 cursor-pointer w-4 h-4" />
                            ) : (
                              <Eye className="text-gray-500 cursor-pointer w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    disabled={loadingSignin}
                    className="w-full bg-green-500 text-white hover:bg-green-400"
                  >
                    {loadingSignin ? (
                      <>
                        <Spinner /> Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                  <div className="flex items-center gap-2">
                    <hr className="h-px w-full my-4 bg-gray-200 border-0 dark:bg-gray-700" />
                    <span className="text-white whitespace-nowrap">
                      Or continue with
                    </span>
                    <hr className="h-px w-full my-4 bg-gray-200 border-0 dark:bg-gray-700" />
                  </div>
                  <div className="flex gap-2 justify-between items-center">
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full bg-green-500 text-white hover:bg-green-400 hover:text-white"
                      onClick={signinWithGoogle}
                      disabled={loadingSigninWithGoogle}
                      
                    >
                     {loadingSigninWithGoogle ? <><Spinner /> Login with Google ...</> : "Login with Google" }                    </Button>

                    {/* <Button
                      variant="outline"
                      type="button"
                      className="w-full"
                      onClick={signinWithFacebook}
                      disabled={loadingSigninWithFacebook}
                    >
                     {loadingSigninWithFacebook ? <><Spinner /> Login with Facebook... </>  : "Login with Facebook"}
                    </Button> */}
                  </div>
                  <div className="text-center text-white">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/auth/signup"
                      className="underline text-green-500 hover:text-green-600"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Maxwidth>
    </div>
  );
}
