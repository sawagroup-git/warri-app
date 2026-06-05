import { z } from 'zod';

// Phone number validation (West African format)
export const PHONE_REGEX = /^(\+225|225)?[0-9]{8,10}$/;

// Email validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation (min 8 chars, uppercase, lowercase, number)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

// Zod Schemas
export const loginSchema = z.object({
  phone: z.string().regex(PHONE_REGEX, 'Invalid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  phone: z.string().regex(PHONE_REGEX, 'Invalid phone number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email').optional(),
  password: z.string().regex(PASSWORD_REGEX, 'Password must contain uppercase, lowercase, and numbers'),
});

export const paymentSchema = z.object({
  recipientPhone: z.string().regex(PHONE_REGEX, 'Invalid recipient phone number'),
  amount: z.number().min(100, 'Minimum amount is 100 XOF').max(5000000, 'Maximum amount is 5,000,000 XOF'),
  provider: z.enum(['orange_money', 'mtn_money', 'moov_money', 'wave']),
  description: z.string().optional(),
});

export const biometricAuthSchema = z.object({
  phone: z.string().regex(PHONE_REGEX, 'Invalid phone number'),
  biometricData: z.string().min(1, 'Biometric data is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type BiometricAuthInput = z.infer<typeof biometricAuthSchema>;
