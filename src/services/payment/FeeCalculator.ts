/**
 * Payment service utilities and fee calculation
 */

export interface FeeCalculationResult {
  provider: string;
  amount: number;
  feePercentage: number;
  feeAmount: number;
  totalAmount: number;
  minFee: number;
  maxFee: number;
}

export interface ProviderInfo {
  id: string;
  name: string;
  feePercentage: number;
  minAmount: number;
  maxAmount: number;
  minFee: number;
  maxFee: number;
}

/**
 * Fee Calculator Service
 */
export class FeeCalculator {
  private providers: Map<string, ProviderInfo> = new Map([
    [
      'wave',
      {
        id: 'wave',
        name: 'Wave',
        feePercentage: 0.012,
        minAmount: 100,
        maxAmount: 5000000,
        minFee: 20,
        maxFee: 5000,
      },
    ],
    [
      'orange-money',
      {
        id: 'orange-money',
        name: 'Orange Money',
        feePercentage: 0.015,
        minAmount: 500,
        maxAmount: 5000000,
        minFee: 50,
        maxFee: 5000,
      },
    ],
    [
      'moov-money',
      {
        id: 'moov-money',
        name: 'Moov Money',
        feePercentage: 0.017,
        minAmount: 500,
        maxAmount: 5000000,
        minFee: 50,
        maxFee: 5000,
      },
    ],
    [
      'mtn-money',
      {
        id: 'mtn-money',
        name: 'MTN Money',
        feePercentage: 0.018,
        minAmount: 500,
        maxAmount: 5000000,
        minFee: 50,
        maxFee: 5000,
      },
    ],
  ]);

  /**
   * Calculate fee for given provider and amount
   */
  calculateFee(providerId: string, amount: number): FeeCalculationResult {
    const provider = this.providers.get(providerId);

    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    if (amount < provider.minAmount) {
      throw new Error(
        `Minimum transfer amount is ${provider.minAmount} XOF`
      );
    }

    if (amount > provider.maxAmount) {
      throw new Error(
        `Maximum transfer amount is ${provider.maxAmount} XOF`
      );
    }

    const feeAmount = Math.ceil(amount * provider.feePercentage);
    const constrainedFee = Math.max(
      provider.minFee,
      Math.min(feeAmount, provider.maxFee)
    );

    return {
      provider: provider.name,
      amount,
      feePercentage: provider.feePercentage * 100,
      feeAmount: constrainedFee,
      totalAmount: amount + constrainedFee,
      minFee: provider.minFee,
      maxFee: provider.maxFee,
    };
  }

  /**
   * Get cheapest provider for given amount
   */
  getCheapestProvider(amount: number): ProviderInfo | null {
    let cheapest: ProviderInfo | null = null;
    let lowestFee = Infinity;

    this.providers.forEach((provider) => {
      if (amount >= provider.minAmount && amount <= provider.maxAmount) {
        const fee = Math.ceil(amount * provider.feePercentage);
        if (fee < lowestFee) {
          lowestFee = fee;
          cheapest = provider;
        }
      }
    });

    return cheapest;
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): ProviderInfo[] {
    return Array.from(this.providers.values());
  }

  /**
   * Check if amount is valid for provider
   */
  isValidAmount(providerId: string, amount: number): boolean {
    const provider = this.providers.get(providerId);
    return (
      provider !== undefined &&
      amount >= provider.minAmount &&
      amount <= provider.maxAmount
    );
  }
}

export const feeCalculator = new FeeCalculator();
