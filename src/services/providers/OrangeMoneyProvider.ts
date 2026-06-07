import axios, { AxiosInstance } from 'axios';
import { PaymentRequest, PaymentResponse } from '../../types/index';

interface OrangeMoneyConfig {
  apiKey: string;
  baseUrl: string;
}

class OrangeMoneyProvider {
  private api: AxiosInstance;
  private config: OrangeMoneyConfig;

  constructor(config: OrangeMoneyConfig) {
    this.config = config;
    this.api = axios.create({
      baseURL: config.baseUrl,
      timeout: 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMoney(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await this.api.post('/transfer', {
        recipient: request.recipientPhone,
        amount: request.amount,
        description: request.description,
        currency: 'XOF',
      });

      return {
        transactionId: response.data.transactionId,
        status: 'processing',
        reference: response.data.reference,
        amount: request.amount,
        fee: Math.ceil((request.amount * 1.5) / 100),
        totalAmount: request.amount + Math.ceil((request.amount * 1.5) / 100),
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Orange Money transfer failed');
    }
  }

  async checkStatus(transactionId: string): Promise<string> {
    try {
      const response = await this.api.get(`/transaction/${transactionId}`);
      return response.data.status;
    } catch (error: any) {
      throw new Error('Failed to check transaction status');
    }
  }
}

export default OrangeMoneyProvider;
