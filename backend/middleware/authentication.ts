import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: { id: string; phone: string };
}

/**
 * Middleware to verify JWT token
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required',
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as { id: string; phone: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

/**
 * Middleware for input validation
 */
export const validateInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Sanitize inputs to prevent injection attacks
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key];
      if (typeof value === 'string') {
        req.body[key] = value.trim();
      }
    });
  }
  next();
};

/**
 * Middleware for rate limiting
 */
const requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

export const rateLimit = (windowMs: number = 900000, maxRequests: number = 100) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || 'unknown';
    const now = Date.now();

    let record = requestCounts.get(ip);

    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs };
      requestCounts.set(ip, record);
    }

    record.count++;

    if (record.count > maxRequests) {
      res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
      });
      return;
    }

    next();
  };
};
