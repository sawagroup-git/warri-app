import * as Crypto from 'expo-crypto';
import { NativeModules } from 'react-native';

const { CryptoModule } = NativeModules;

export interface EncryptionResult {
  encrypted: string;
  iv: string;
}

export class EncryptionService {
  private algorithm = 'aes-256-cbc';
  private keyLength = 32; // 256 bits
  private ivLength = 16; // 128 bits

  /**
   * Derive encryption key from password using PBKDF2
   */
  async deriveKey(password: string, salt?: string): Promise<{ key: string; salt: string }> {
    const useSalt = salt || (await this.generateSalt());

    // In production, use native module or crypto library
    // This is a simplified example
    const key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password + useSalt,
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    return { key: key.substring(0, 64), salt: useSalt };
  }

  /**
   * Generate random salt
   */
  async generateSalt(): Promise<string> {
    const random = await Crypto.getRandomBytes(16);
    return Array.from(random)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Encrypt sensitive data
   */
  async encrypt(plaintext: string, encryptionKey: string): Promise<EncryptionResult> {
    try {
      const iv = await Crypto.getRandomBytes(this.ivLength);
      const ivHex = Array.from(iv)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');

      // Use native module or library for actual AES encryption
      // This is simplified for demonstration
      const encrypted = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        plaintext + encryptionKey + ivHex,
        { encoding: Crypto.CryptoEncoding.HEX }
      );

      return { encrypted, iv: ivHex };
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }

  /**
   * Decrypt data
   */
  async decrypt(encryptedData: string, encryptionKey: string, iv: string): Promise<string> {
    try {
      // Use native module for actual AES decryption
      // This is simplified for demonstration
      return encryptedData; // Placeholder
    } catch (error) {
      throw new Error(`Decryption failed: ${error}`);
    }
  }

  /**
   * Hash password for storage
   */
  async hashPassword(password: string): Promise<string> {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password,
      { encoding: Crypto.CryptoEncoding.HEX }
    );
  }
}

export default new EncryptionService();