// User Types
export interface User {
  id: string;
  phone: string;
  email?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  passwordHash?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  accountStatus?: 'active' | 'suspended' | 'blocked' | 'approved';
  balance?: number;
  referralCode?: string;
  referredById?: string;
  biometricTemplate?: string | null;
  otpCode?: string | null;
  otpExpiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  stats?: DashboardStats | null;
}

export interface AppSettings {
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  autoLockTimeout: number;
  offlineSyncEnabled: boolean;
  accessibility: {
    screenReaderEnabled: boolean;
    highContrastEnabled: boolean;
    darkModeEnabled: boolean;
  };
}

// Transaction Types
export interface Transaction {
  id: string;
  senderId: string;
  recipientPhone: string;
  recipientName?: string;
  amount: number;
  currency: 'XOF' | 'USD' | 'EUR';
  fee: number;
  provider: MobileMoneyProvider;
  status: TransactionStatus;
  reference: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

// Mobile Money Provider Types
export type MobileMoneyProvider = 'orange_money' | 'mtn_money' | 'moov_money' | 'wave';

export interface Provider {
  id: MobileMoneyProvider;
  name: string;
  fee: number;
  minAmount: number;
  maxAmount: number;
  logo?: string;
}

// Payment Types
export interface PaymentRequest {
  recipientPhone: string;
  amount: number;
  provider: MobileMoneyProvider;
  description?: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: TransactionStatus;
  reference: string;
  amount: number;
  fee: number;
  totalAmount: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'transaction' | 'alert' | 'info';
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  firstName: string;
  lastName: string;
  email?: string;
  password: string;
}

export interface BiometricAuthPayload {
  phone: string;
  biometricData: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalSent: number;
  totalReceived: number;
  totalTransactions: number;
  thisMonthSent: number;
  thisMonthReceived: number;
  recentTransactions: Transaction[];
}

// Error Types
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
