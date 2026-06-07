import { userRepository, UserRepository } from '../repositories/UserRepository';
import { cinetPayService, CinetPayService } from './CinetPayService';
import { logger } from './LoggingService';
import { AppError } from '../../src/types';

export class TopUpService {
  constructor(
    private userRepo: UserRepository = userRepository,
    private paymentService: CinetPayService = cinetPayService
  ) {}

  async initiateTopUp(userId: string, amount: number) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError('TOPUP_001', 404, 'User not found');

    const reference = `TOPUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const cinetPayData = {
      amount: amount,
      currency: 'XOF',
      transaction_id: reference,
      description: 'Account top-up via Wari App',
      customer_name: user.firstName,
      customer_surname: user.lastName,
      customer_phone_number: user.phone,
      notify_url: `${process.env.API_URL}/api/topup/callback`,
      metadata: JSON.stringify({ userId }),
    };

    const result = await this.paymentService.initiatePayment(cinetPayData);

    return {
      reference,
      paymentUrl: result.payment_url,
    };
  }

  async handleCallback(data: any) {
    // In a real app, verify the signature and status from CinetPay
    const { transaction_id, status, amount, metadata } = data;

    if (status === 'ACCEPTED') {
      const userId = metadata ? JSON.parse(metadata).userId : null;
      if (userId) {
        await this.userRepo.incrementBalance(userId, Number(amount));
        logger.info(`Top-up successful for transaction ${transaction_id}`, { userId, amount });
      } else {
        logger.error('Top-up callback missing userId in metadata', { transaction_id });
      }
    }
  }
}

export const topUpService = new TopUpService();
