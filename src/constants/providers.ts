/**
 * Mobile Money Provider Constants for Côte d'Ivoire
 */

export const PROVIDERS = {
  ORANGE_MONEY: {
    id: 'orange-money',
    name: 'Orange Money',
    code: 'OM',
    icon: '🟠',
    color: '#FF6600',
    phonePrefix: '07|05',
    apiEndpoint: 'https://api.orangemoney.ci',
    supportedCountries: ['CI', 'BF', 'ML', 'SN'],
  },
  MTN_MONEY: {
    id: 'mtn-money',
    name: 'MTN Money',
    code: 'MM',
    icon: '🟡',
    color: '#FFCC00',
    phonePrefix: '05',
    apiEndpoint: 'https://api.mtnglobal.com',
    supportedCountries: ['CI', 'BF', 'ML'],
  },
  MOOV_MONEY: {
    id: 'moov-money',
    name: 'Moov Money',
    code: 'MV',
    icon: '🔴',
    color: '#E60012',
    phonePrefix: '07',
    apiEndpoint: 'https://api.moovmoney.com',
    supportedCountries: ['CI', 'BF', 'TG'],
  },
  WAVE: {
    id: 'wave',
    name: 'Wave',
    code: 'WV',
    icon: '🌊',
    color: '#00A3D1',
    phonePrefix: '07|05|06',
    apiEndpoint: 'https://api.wave.com',
    supportedCountries: ['CI', 'SN', 'ML', 'BF', 'TG', 'BJ', 'GW', 'GM'],
  },
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export const KYC_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  CLOSED: 'closed',
} as const;

export const NOTIFICATION_TYPES = {
  TRANSACTION: 'transaction',
  ALERT: 'alert',
  INFO: 'info',
} as const;
