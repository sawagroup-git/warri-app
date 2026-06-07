import { transactionRepository, KoriPayTransactRepo } from '../repositories/KoriPayTransactRepo';
import { cinetPayService, CinetPayService } from './CinetPayService';
import { twilioService, TwilioService } from './TwilioService';
import { logger } from './LoggingService';
import { Transaction, PaymentRequest, AppError } from '../../src/types';
import { v4 as uuidv4 } from 'uuid';

export class TransactionService {
  constructor(
    private transRepo: KoriPayTransactRepo = transactionRepository,
    private paymentService: CinetPayService = cinetPayService,
    private smsService: TwilioService = twilioService
  ) {}

  async sendMoney(userId: string, data: PaymentRequest) {
    const reference = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const fee = this.calculateFee(data.amount, data.provider);

    const transaction = await this.transRepo.create({
      senderId: userId,
      recipientPhone: data.recipientPhone,
      amount: data.amount,
      fee,
      provider: data.provider,
      status: 'pending',
      reference,
      description: data.description,
    });

    try {
      // Logic for provider-specific payment initiation
      // For now, using CinetPay as an example
      const cinetPayData = {
        amount: data.amount + fee,
        currency: 'XOF',
        transaction_id: reference,
        description: data.description || 'Money transfer via Wari App',
        customer_phone_number: data.recipientPhone, // Simplified for example
        notify_url: `${process.env.API_URL}/api/transactions/callback`,
      };

      const result = await this.paymentService.initiatePayment(cinetPayData);

      await this.transRepo.updateStatus(transaction.id, 'processing');

      return {
        transaction,
        paymentUrl: result.payment_url,
      };
    } catch (error: any) {
      logger.error('Payment initiation failed', error);
      await this.transRepo.updateStatus(transaction.id, 'failed');
      throw new AppError('TRANS_001', 500, 'Failed to initiate payment: ' + error.message);
    }
  }

  async getHistory(userId: string, options: any) {
    return this.transRepo.findByUserId(userId, options);
  }

  async getTransactionDetails(id: string) {
    return this.transRepo.findById(id);
  }

  async getDashboardAnalytics(userId: string) {
    const basicStats = await this.transRepo.getAnalytics(userId);
    const retention = await this.transRepo.getRetentionStats();
    const successRates = await this.transRepo.getProviderSuccessRates();
    const peakTimes = await this.transRepo.getPeakTransactionTimes();

    return {
      ...basicStats,
      kpis: {
        retentionRate: retention.multiTransactorCount,
        providerSuccessRates: successRates,
        peakTimes: peakTimes,
      }
    };
  }

  private calculateFee(amount: number, provider: string): number {
    const rates: Record<string, number> = {
      orange_money: 0.015,
      mtn_money: 0.018,
      moov_money: 0.017,
      wave: 0.012,
    };
    const rate = rates[provider] || 0.02;
    return Math.ceil(amount * rate);
  }
}

export const transactionService = new TransactionService();
