import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { AppError } from '../../src/types/index';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Extend Express Request to include user and token info
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      token?: string;
    }
  }
}

/**
 * Verify JWT token middleware
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new AppError('AUTH_001', 401, 'No token provided');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; iat: number };
    req.userId = decoded.userId;
    req.token = token;
    next();
  } catch (error: any) {
    res.status(error.statusCode || 401).json({
      success: false,
      error: error.message || 'Invalid token',
    });
  }
};

/**
 * Validate input middleware
 */
export const validateInput = (req: Request, res: Response, next: NextFunction): void => {
  // Check if body is too large or suspicious
  if (req.body && Object.keys(req.body).length > 50) {
    res.status(400).json({
      success: false,
      error: 'Request body too large',
    });
    return;
  }
  next();
};

/**
 * Rate limiting middleware
 */
export const rateLimitMiddleware = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Error handling middleware
 */
export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction): void => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Generate JWT token
 */
export const generateToken = (userId: string, expiresIn: any = '1h'): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn });
};
