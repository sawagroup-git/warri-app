import { Provider, MobileMoneyProvider } from '../types/index';

export const MOBILE_MONEY_PROVIDERS: Record<MobileMoneyProvider, Provider> = {
  orange_money: {
    id: 'orange_money',
    name: 'Orange Money',
    fee: 1.5,
    minAmount: 100,
    maxAmount: 5000000,
    logo: 'orange-money',
  },
  mtn_money: {
    id: 'mtn_money',
    name: 'MTN Money',
    fee: 1.8,
    minAmount: 100,
    maxAmount: 5000000,
    logo: 'mtn-money',
  },
  moov_money: {
    id: 'moov_money',
    name: 'Moov Money',
    fee: 1.7,
    minAmount: 100,
    maxAmount: 5000000,
    logo: 'moov-money',
  },
  wave: {
    id: 'wave',
    name: 'Wave',
    fee: 1.2,
    minAmount: 100,
    maxAmount: 5000000,
    logo: 'wave',
  },
};

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export const KYC_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export const NOTIFICATION_TYPES = {
  TRANSACTION: 'transaction',
  ALERT: 'alert',
  INFO: 'info',
} as const;
