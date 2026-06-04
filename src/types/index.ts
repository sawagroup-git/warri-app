/**
 * Core type definitions for Wari App
 */

export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  kycStatus: 'pending' | 'approved' | 'rejected';
  accountStatus: 'active' | 'suspended' | 'closed';
}

export interface Transaction {
  id: string;
  senderId: string;
  recipientPhone: string;
  amount: number;
  provider: string;
  fee: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference: string;
  notes?: string;
  createdAt: Date;
  completedAt?: Date;
  failureReason?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'transaction' | 'alert' | 'info';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: Record<string, any>;
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
}

export interface AccessibilitySettings {
  screenReaderEnabled: boolean;
  highContrastEnabled: boolean;
  voiceCommandsEnabled: boolean;
  textSizeMultiplier: number;
  darkModeEnabled: boolean;
}

export interface AppSettings {
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  offlineSyncEnabled: boolean;
  autoLockTimeout: number; // seconds
  accessibility: AccessibilitySettings;
}

export interface FeeStructure {
  provider: string;
  amount: number;
  feeAmount: number;
  feePercentage: number;
  totalAmount: number;
  netAmount: number;
}
