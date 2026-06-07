import axios from 'axios';
import { logger } from './LoggingService';

export interface CinetPayPaymentData {
  amount: number;
  currency: string;
  transaction_id: string;
  description: string;
  customer_name: string;
  customer_surname: string;
  customer_phone_number: string;
  customer_email: string;
  customer_address: string;
  customer_city: string;
  customer_country: string;
  customer_state: string;
  customer_zip_code: string;
  notify_url: string;
  return_url: string;
}

export class CinetPayService {
  private readonly apiKey: string;
  private readonly siteId: string;
  private readonly baseUrl = 'https://api-checkout.cinetpay.com/v2/payment';

  constructor() {
    this.apiKey = process.env.CINETPAY_API_KEY || '';
    this.siteId = process.env.CINETPAY_SITE_ID || '';
  }

  async initiatePayment(data: Partial<CinetPayPaymentData>) {
    try {
      const payload = {
        apikey: this.apiKey,
        site_id: this.siteId,
        currency: 'XOF',
        ...data,
      };

      logger.info('Initiating CinetPay payment', { transactionId: data.transaction_id });

      const response = await axios.post(this.baseUrl, payload);

      if (response.data.code === '201') {
        return response.data.data;
      } else {
        throw new Error(`CinetPay error: ${response.data.message}`);
      }
    } catch (error: any) {
      logger.error('CinetPay payment initiation failed', error);
      throw error;
    }
  }

  async checkStatus(transactionId: string) {
    try {
      const payload = {
        apikey: this.apiKey,
        site_id: this.siteId,
        transaction_id: transactionId,
      };

      const response = await axios.post(`${this.baseUrl}/check`, payload);
      return response.data;
    } catch (error: any) {
      logger.error('CinetPay status check failed', error);
      throw error;
    }
  }
}

export const cinetPayService = new CinetPayService();
