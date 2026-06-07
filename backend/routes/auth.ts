import { Router, Request, Response } from 'express';
import { verifyToken } from '../middleware/authentication';
import { loginSchema, registerSchema } from '../../src/constants/validation';
import { authService } from '../services/AuthService';
import { logger } from '../services/LoggingService';

const router = Router();

/**
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    const validation = loginSchema.safeParse({ phone, password });
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: validation.error.errors,
      });
    }

    const result = await authService.login({ phone, password });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error('Login error', error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/verify-otp
 */
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ success: false, error: 'Phone and code are required' });
    }

    const result = await authService.verifyOTP(phone, code);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error('OTP verification error', error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: validation.error.errors,
      });
    }

    const result = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error('Registration error', error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/refresh
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required',
      });
    }

    const result = await authService.refresh(refreshToken);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    res.json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/biometric
 */
router.post('/biometric', async (req: Request, res: Response) => {
  try {
    const { phone, biometricData } = req.body;
    // Biometric authentication implementation pending
    res.json({
      success: true,
      message: 'Biometric auth endpoint - implementation pending',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/auth/profile
 */
router.get('/profile', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const user = await authService.getProfile(userId);
    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    logger.error('Fetch profile error', error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
