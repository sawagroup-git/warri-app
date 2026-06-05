import { PHONE_REGEX, EMAIL_REGEX, PASSWORD_REGEX } from '@constants/validation';

/**
 * Validate phone number
 */
export const isValidPhone = (phone: string): boolean => {
  return PHONE_REGEX.test(phone);
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
};

/**
 * Validate amount
 */
export const isValidAmount = (amount: number, min: number = 100, max: number = 5000000): boolean => {
  return amount >= min && amount <= max && amount > 0;
};

/**
 * Format phone number to standard format
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/\D/g, '');
  
  // Ensure it starts with country code
  if (!cleaned.startsWith('225')) {
    // Assume Côte d'Ivoire if no country code
    return `225${cleaned.slice(-8)}`;
  }
  
  return cleaned;
};

/**
 * Mask phone number for display
 */
export const maskPhoneNumber = (phone: string): string => {
  const formatted = formatPhoneNumber(phone);
  const last4 = formatted.slice(-4);
  return `+${formatted.slice(0, 3)} ****${last4}`;
};

/**
 * Validate transaction reference
 */
export const isValidReference = (reference: string): boolean => {
  // Reference format: WARI-YYYYMMDD-XXXXXX (18 chars)
  return /^WARI-\d{8}-[A-Z0-9]{6}$/.test(reference);
};
