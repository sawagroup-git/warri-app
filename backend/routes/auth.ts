import express, { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: { id: string; phone: string };
}

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { phone, firstName, lastName, email, pin } = req.body;

    // Validate input
    if (!phone || !firstName || !lastName || !pin) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Validate phone format (10 digits for Côte d'Ivoire)
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format',
      });
    }

    // Hash PIN
    const hashedPin = await bcryptjs.hash(pin, 10);

    // Create user in database (placeholder)
    const user = {
      id: 'user-' + Date.now(),
      phone,
      firstName,
      lastName,
      email,
      pinHash: hashedPin,
      kycStatus: 'pending',
      accountStatus: 'active',
      createdAt: new Date(),
    };

    // Generate tokens
    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
    });
  }
});

/**
 * POST /auth/login
 * Login with phone and PIN
 */
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { phone, pin } = req.body;

    if (!phone || !pin) {
      return res.status(400).json({
        success: false,
        error: 'Phone and PIN required',
      });
    }

    // Fetch user from database (placeholder)
    // const user = await User.findOne({ phone });
    const user = {
      id: 'user-123',
      phone,
      firstName: 'Test',
      lastName: 'User',
      pinHash: await bcryptjs.hash(pin, 10),
    };

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Verify PIN
    const pinValid = await bcryptjs.compare(pin, user.pinHash);
    if (!pinValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Generate tokens
    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
});

/**
 * POST /auth/refresh
 * Refresh access token
 */
router.post('/refresh', (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required',
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'refresh-secret'
    ) as { id: string; phone: string };

    const newToken = jwt.sign(
      { id: decoded.id, phone: decoded.phone },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      data: { token: newToken },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token',
    });
  }
});

export default router;
