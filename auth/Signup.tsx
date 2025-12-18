// auth/Signup.tsx
'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signupSchema } from '@/auth/authSchemas';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { Eye, EyeOff } from 'lucide-react';
import Maxwidth from '@/components/Maxwidth';
import { useMutation } from 'urql';
import { SIGNUP } from './auth-config/graphqlAuth';
import { AUTH_PROVIDER } from './auth-config/authProvider';
import { useAuth } from './auth-config/useAuth';

type SignupValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const router = useRouter();
  const referralCodeId = useSearchParams().get('ref');
  const { signup, loadingSignup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignupValues) => {
    await signup({
      ...values,
      referralCode: referralCodeId || null,
    });
  };

  return (
    <div className="flex min-h-svh   items-center justify-center bg-yellow-500">
      <Maxwidth className="max-w-md py-8">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-green-400">Create an account</CardTitle>
            <CardDescription className="text-white">
              Enter your information below to create your account
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">User Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email*</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Phone*</FormLabel>
                      <FormControl>
                        <Input placeholder="03001234567" {...field} />
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
                      <FormLabel className="text-white">Password*</FormLabel>
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Confirm Password*
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword((s) => !s)}
                          >
                            {showConfirmPassword ? (
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
                    disabled={loadingSignup}
                    className="w-full bg-green-500 text-white hover:bg-green-400"
                  >
                    {loadingSignup ? (
                      <>
                        <Spinner /> Create Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                  <div className="flex items-center gap-2">
                    <hr className="h-px w-full my-4 bg-gray-200 border-0 dark:bg-gray-700" />
                    <span className="text-muted-foreground whitespace-nowrap">
                      Or continue with
                    </span>
                    <hr className="h-px w-full my-4 bg-gray-200 border-0 dark:bg-gray-700" />
                  </div>
                  <div className="flex gap-2 justify-between items-center">
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full bg-green-500 hover:bg-green-400 text-white hover:text-white"
                    >
                      Login with Google
                    </Button>
                    {/* <Button variant="outline" type="button" className="w-full">
                      Login with Facebook
                    </Button> */}
                  </div>
                  <div className="text-center text-white">
                    Already have an account?{' '}
                    <Link
                      href="/auth/signin"
                      className="underline text-green-500 hover:text-green-600"
                    >
                      Login
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
