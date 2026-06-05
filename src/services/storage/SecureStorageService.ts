import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

interface SecureStorageOptions {
  encrypt?: boolean;
}

/**
 * Secure Storage Service
 * Encrypts and stores sensitive data
 */
export class SecureStorageService {
  private static instance: SecureStorageService;

  private constructor() {}

  static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  /**
   * Save token securely
   */
  async saveToken(key: string, token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, token);
    } catch (error) {
      console.error('Failed to save token:', error);
      throw error;
    }
  }

  /**
   * Retrieve token securely
   */
  async getToken(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }

  /**
   * Delete token
   */
  async deleteToken(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Failed to delete token:', error);
    }
  }

  /**
   * Clear all tokens
   */
  async clearAllTokens(): Promise<void> {
    try {
      // Note: expo-secure-store doesn't have a clear all method
      // Would need to track keys separately
      const keys = ['accessToken', 'refreshToken', 'userId'];
      for (const key of keys) {
        await this.deleteToken(key);
      }
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Encrypt string
   */
  async encryptData(data: string): Promise<string> {
    try {
      const encrypted = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        data
      );
      return encrypted;
    } catch (error) {
      console.error('Failed to encrypt data:', error);
      throw error;
    }
  }

  /**
   * Verify PIN (compares hash)
   */
  async verifyPin(pin: string, hash: string): Promise<boolean> {
    try {
      const pinHash = await this.encryptData(pin);
      return pinHash === hash;
    } catch (error) {
      console.error('Failed to verify PIN:', error);
      return false;
    }
  }
}

export const secureStorageService = SecureStorageService.getInstance();
