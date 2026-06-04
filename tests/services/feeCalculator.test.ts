import { describe, it, expect, beforeEach } from '@jest/globals';
import { FeeCalculator } from '../../src/services/payment/feeCalculator';

describe('FeeCalculator', () => {
  let calculator: FeeCalculator;

  beforeEach(() => {
    calculator = new FeeCalculator();
  });

  describe('calculateFee', () => {
    it('should calculate Wave fee correctly (1.2%)', () => {
      const result = calculator.calculateFee('wave', 100000);
      expect(result.provider).toBe('Wave');
      expect(result.feeAmount).toBe(1200);
      expect(result.feePercentage).toBeCloseTo(1.2, 1);
      expect(result.totalAmount).toBe(101200);
    });

    it('should calculate Orange Money fee correctly (1.5%)', () => {
      const result = calculator.calculateFee('orange-money', 100000);
      expect(result.provider).toBe('Orange Money');
      expect(result.feeAmount).toBe(1500);
      expect(result.feePercentage).toBeCloseTo(1.5, 1);
    });

    it('should reject amount below minimum', () => {
      expect(() => {
        calculator.calculateFee('wave', 50);
      }).toThrow('Minimum transfer amount is 100 XOF');
    });

    it('should reject amount above maximum', () => {
      expect(() => {
        calculator.calculateFee('wave', 6000000);
      }).toThrow('Maximum transfer amount is 5,000,000 XOF');
    });

    it('should respect minimum fee', () => {
      const result = calculator.calculateFee('wave', 1000);
      expect(result.feeAmount).toBeGreaterThanOrEqual(20);
    });

    it('should respect maximum fee', () => {
      const result = calculator.calculateFee('wave', 5000000);
      expect(result.feeAmount).toBeLessThanOrEqual(5000);
    });
  });

  describe('getCheapestProvider', () => {
    it('should return cheapest provider', () => {
      const result = calculator.getCheapestProvider(100000);
      expect(result).not.toBeNull();
      expect(result?.provider).toBe('Wave');
    });

    it('should return null for unsupported amount', () => {
      const result = calculator.getCheapestProvider(10000000);
      expect(result).toBeNull();
    });
  });

  describe('getAvailableProviders', () => {
    it('should return all providers', () => {
      const providers = calculator.getAvailableProviders();
      expect(providers.length).toBe(4);
      expect(providers.some((p) => p.name === 'Wave')).toBe(true);
    });
  });
});
