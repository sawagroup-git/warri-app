import api from './api';
import * as SecureStore from 'expo-secure-store';
import { LoginRequest, RegisterRequest, ApiResponse } from '../types';

export const authService = {
  async login(data: LoginRequest) {
    const response = await api.post<ApiResponse>('/auth/login', data);
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
    }
    return response.data;
  },

  async register(data: RegisterRequest) {
    const response = await api.post<ApiResponse>('/auth/register', data);
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
    }
    return response.data;
  },

  async logout() {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    await api.post('/auth/logout', { refreshToken });
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  },

  async getProfile() {
    const response = await api.get<ApiResponse>('/auth/profile');
    return response.data;
  },

  async verifyOTP(phone: string, code: string) {
    const response = await api.post<ApiResponse>('/auth/verify-otp', { phone, code });
    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
    }
    return response.data;
  },
};
