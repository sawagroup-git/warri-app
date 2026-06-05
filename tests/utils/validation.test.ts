import { isValidPhone, isValidEmail, isValidPassword, formatPhoneNumber } from '@utils/validation';

describe('Validation Utils', () => {
  describe('isValidPhone', () => {
    it('should validate valid phone numbers', () => {
      expect(isValidPhone('+22501234567')).toBe(true);
      expect(isValidPhone('22501234567')).toBe(true);
      expect(isValidPhone('01234567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abc')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should validate valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.email@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate strong passwords', () => {
      expect(isValidPassword('SecurePass123')).toBe(true);
      expect(isValidPassword('MyPassword@123')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isValidPassword('weak')).toBe(false);
      expect(isValidPassword('12345678')).toBe(false);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format phone numbers correctly', () => {
      expect(formatPhoneNumber('+22501234567')).toBe('22501234567');
      expect(formatPhoneNumber('01234567')).toBe('22501234567');
    });
  });
});
