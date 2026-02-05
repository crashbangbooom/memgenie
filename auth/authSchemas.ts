// schemas/authSchemas.ts
import { z } from 'zod';

// Signup schema
export const signupSchema = z
  .object({ 
    email: z.string().email('Invalid email address.'), 
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(6, 'Please confirm your password.'),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address.'),
});

// Reset password schema
export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(6, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

// OTP verification schema
export const otpVerificationSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits.')
    .max(6, 'OTP must be 6 digits.'),
});
