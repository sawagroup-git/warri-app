import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository, UserRepository } from '../repositories/UserRepository';
import { refreshTokenRepository, RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { twilioService, TwilioService } from './TwilioService';
import { logger } from './LoggingService';
import { User, LoginRequest, RegisterRequest } from '../../src/types';
import { AppError } from '../../src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRATION || '1h';
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

export class AuthService {
  constructor(
    private userRepo: UserRepository = userRepository,
    private tokenRepo: RefreshTokenRepository = refreshTokenRepository,
    private smsService: TwilioService = twilioService
  ) {}

  async register(data: RegisterRequest) {
    const existingUser = await this.userRepo.findByPhone(data.phone);
    if (existingUser) {
      throw new AppError('AUTH_002', 400, 'User with this phone number already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Check if referral code was provided in a real app
    // const referredBy = await this.userRepo.findByReferralCode(data.referralCode);

    const user = await this.userRepo.create({
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
      kycStatus: 'pending',
      // @ts-ignore
      referralCode,
    });

    // Send verification SMS (non-blocking)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10);

    await this.userRepo.update(user.id, {
      // @ts-ignore
      otpCode: verificationCode,
      // @ts-ignore
      otpExpiresAt
    });

    this.smsService.sendVerificationCode(user.phone, verificationCode).catch(err => {
      logger.error('Failed to send verification SMS during registration', err);
    });

    return { user, message: 'OTP sent to your phone' };
  }

  async verifyOTP(phone: string, code: string) {
    const user = await this.userRepo.findByPhone(phone);
    if (!user) {
      throw new AppError('AUTH_006', 404, 'User not found');
    }

    // @ts-ignore
    if (user.otpCode !== code) {
      throw new AppError('AUTH_007', 400, 'Invalid verification code');
    }

    // @ts-ignore
    if (user.otpExpiresAt < new Date()) {
      throw new AppError('AUTH_008', 400, 'Verification code expired');
    }

    // Mark user as verified
    await this.userRepo.update(user.id, {
      kycStatus: 'verified',
      // @ts-ignore
      otpCode: null,
      // @ts-ignore
      otpExpiresAt: null
    });

    const tokens = await this.generateTokens(user.id);
    return { user, ...tokens };
  }

  async login(data: LoginRequest) {
    const user = await this.userRepo.findByPhone(data.phone);
    if (!user) {
      throw new AppError('AUTH_003', 401, 'Invalid phone or password');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash || '');
    if (!isMatch) {
      await this.userRepo.incrementLoginAttempts(user.id);
      throw new AppError('AUTH_003', 401, 'Invalid phone or password');
    }

    await this.userRepo.resetLoginAttempts(user.id);
    const tokens = await this.generateTokens(user.id);
    return { user, ...tokens };
  }

  async refresh(refreshToken: string) {
    const storedToken = await this.tokenRepo.findByToken(refreshToken);
    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw new AppError('AUTH_004', 401, 'Invalid or expired refresh token');
    }

    const tokens = await this.generateTokens(storedToken.userId);
    await this.tokenRepo.revoke(refreshToken); // Rotate refresh token
    return tokens;
  }

  async logout(refreshToken: string) {
    await this.tokenRepo.revoke(refreshToken);
  }

  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError('AUTH_005', 404, 'User not found');
    }
    // Remove passwordHash before returning
    const { passwordHash, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }

  private async generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY as any });
    const refreshTokenValue = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d` as any });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await this.tokenRepo.create({
      userId,
      token: refreshTokenValue,
      expiresAt,
    });

    return { accessToken, refreshToken: refreshTokenValue };
  }
}

export const authService = new AuthService();
