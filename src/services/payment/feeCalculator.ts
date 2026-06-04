/**
 * Fee structures for different providers in Côte d'Ivoire
 * All fees are sub-2% as per requirement
 */

export interface ProviderFeeStructure {
  name: string;
  basePercentage: number;
  minFee: number; // XOF
  maxFee: number; // XOF
  maxTransferAmount: number; // XOF
  minTransferAmount: number; // XOF
}

export interface FeeCalculationResult {
  provider: string;
  amount: number;
  feeAmount: number;
  feePercentage: number;
  totalAmount: number;
  netAmount: number;
}

const PROVIDERS: Record<string, ProviderFeeStructure> = {
  'orange-money': {
    name: 'Orange Money',
    basePercentage: 0.015, // 1.5%
    minFee: 25,
    maxFee: 5000,
    maxTransferAmount: 5000000,
    minTransferAmount: 100,
  },
  'mtn-money': {
    name: 'MTN Money',
    basePercentage: 0.018, // 1.8%
    minFee: 25,
    maxFee: 5000,
    maxTransferAmount: 5000000,
    minTransferAmount: 100,
  },
  'moov-money': {
    name: 'Moov Money',
    basePercentage: 0.017, // 1.7%
    minFee: 25,
    maxFee: 5000,
    maxTransferAmount: 5000000,
    minTransferAmount: 100,
  },
  'wave': {
    name: 'Wave',
    basePercentage: 0.012, // 1.2%
    minFee: 20,
    maxFee: 5000,
    maxTransferAmount: 5000000,
    minTransferAmount: 100,
  },
};

export class FeeCalculator {
  /**
   * Calculate fee for a transfer
   */
  calculateFee(providerId: string, amount: number): FeeCalculationResult {
    const provider = PROVIDERS[providerId];
    if (!provider) {
      throw new Error(`Unknown provider: ${providerId}`);
    }

    if (amount < provider.minTransferAmount) {
      throw new Error(
        `Minimum transfer amount is ${provider.minTransferAmount} XOF`
      );
    }

    if (amount > provider.maxTransferAmount) {
      throw new Error(
        `Maximum transfer amount is ${provider.maxTransferAmount} XOF`
      );
    }

    // Calculate fee as percentage, but respect min/max
    let feeAmount = Math.ceil(amount * provider.basePercentage);
    feeAmount = Math.max(provider.minFee, Math.min(provider.maxFee, feeAmount));

    return {
      provider: provider.name,
      amount,
      feeAmount,
      feePercentage: (feeAmount / amount) * 100,
      totalAmount: amount + feeAmount,
      netAmount: amount,
    };
  }

  /**
   * Get all available providers
   */
  getAvailableProviders(): ProviderFeeStructure[] {
    return Object.values(PROVIDERS);
  }

  /**
   * Get provider details
   */
  getProvider(providerId: string): ProviderFeeStructure | null {
    return PROVIDERS[providerId] || null;
  }

  /**
   * Get cheapest provider for amount
   */
  getCheapestProvider(amount: number): FeeCalculationResult | null {
    let cheapest: FeeCalculationResult | null = null;

    for (const providerId of Object.keys(PROVIDERS)) {
      try {
        const result = this.calculateFee(providerId, amount);
        if (!cheapest || result.feeAmount < cheapest.feeAmount) {
          cheapest = result;
        }
      } catch (error) {
        // Provider doesn't support this amount
        continue;
      }
    }

    return cheapest;
  }
}

export default new FeeCalculator();