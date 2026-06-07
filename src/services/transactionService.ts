import api from './api';
import { PaymentRequest, ApiResponse } from '../types';

export const transactionService = {
  async getHistory(params: any = {}) {
    const response = await api.get<ApiResponse>('/transactions', { params });
    return response.data;
  },

  async sendMoney(data: PaymentRequest) {
    const response = await api.post<ApiResponse>('/transactions/send', data);
    return response.data;
  },

  async getDashboardAnalytics() {
    const response = await api.get<ApiResponse>('/transactions/analytics/dashboard');
    return response.data;
  },

  async getTransactionDetails(id: string) {
    const response = await api.get<ApiResponse>(`/transactions/${id}`);
    return response.data;
  },

  async cancelTransaction(id: string) {
    const response = await api.post<ApiResponse>(`/transactions/${id}/cancel`);
    return response.data;
  },
};
