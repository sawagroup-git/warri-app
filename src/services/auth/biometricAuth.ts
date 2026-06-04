import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export class BiometricAuthService {
  private readonly storageKey = 'biometric_enabled';
  private readonly userIdKey = 'user_biometric_id';

  /**
   * Check if device supports biometric authentication
   */
  async isAvailable(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return compatible && enrolled;
    } catch (error) {
      console.error('Biometric availability check failed:', error);
      return false;
    }
  }

  /**
   * Get available biometric types
   */
  async getAvailableBiometrics(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Failed to get available biometrics:', error);
      return [];
    }
  }

  /**
   * Authenticate user with biometric
   */
  async authenticate(): Promise<BiometricAuthResult> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return { success: false, error: 'Biometric authentication not available' };
      }

      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
        reason: 'Authenticate to access your Wari account',
      });

      return { success: result.success };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Enable biometric authentication for user
   */
  async enableBiometric(userId: string): Promise<BiometricAuthResult> {
    try {
      const authResult = await this.authenticate();
      if (!authResult.success) {
        return authResult;
      }

      await SecureStore.setItemAsync(this.storageKey, 'true');
      await SecureStore.setItemAsync(this.userIdKey, userId);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to enable biometric';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Disable biometric authentication
   */
  async disableBiometric(): Promise<BiometricAuthResult> {
    try {
      await SecureStore.deleteItemAsync(this.storageKey);
      await SecureStore.deleteItemAsync(this.userIdKey);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to disable biometric';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Check if biometric is enabled for user
   */
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(this.storageKey);
      return enabled === 'true';
    } catch (error) {
      return false;
    }
  }
}

export default new BiometricAuthService();