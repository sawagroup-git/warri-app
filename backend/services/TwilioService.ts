import { Twilio } from 'twilio';
import { logger } from './LoggingService';

export class TwilioService {
  private client: Twilio;
  private from: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    const authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.from = process.env.TWILIO_PHONE_NUMBER || '';

    this.client = new Twilio(accountSid, authToken);
  }

  async sendSMS(to: string, message: string): Promise<any> {
    try {
      logger.info(`Sending SMS to ${to}`);
      const response = await this.client.messages.create({
        body: message,
        to,
        from: this.from,
      });
      return response;
    } catch (error: any) {
      logger.error('Twilio SMS sending failed', error);
      throw error;
    }
  }

  async sendVerificationCode(to: string, code: string): Promise<any> {
    const message = `Your Wari App verification code is: ${code}. Valid for 10 minutes.`;
    return this.sendSMS(to, message);
  }
}

export const twilioService = new TwilioService();
