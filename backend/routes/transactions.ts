import express, { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/authentication';

const router: Router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: { id: string; phone: string };
}

/**
 * POST /transactions/create
 * Initiate a money transfer
 */
router.post('/create', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recipientPhone, amount, provider, notes } = req.body;
    const userId = req.user?.id;

    // Validate inputs
    if (!recipientPhone || !amount || !provider) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Validate amount
    if (amount < 100 || amount > 5000000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount',
      });
    }

    // Calculate fee
    const feePercentages: Record<string, number> = {
      'wave': 0.012,
      'orange-money': 0.015,
      'moov-money': 0.017,
      'mtn-money': 0.018,
    };

    const feePercentage = feePercentages[provider] || 0.012;
    const fee = Math.ceil(amount * feePercentage);

    // Create transaction (placeholder)
    const transaction = {
      id: 'txn-' + Date.now(),
      senderId: userId,
      recipientPhone,
      amount,
      provider,
      fee,
      totalAmount: amount + fee,
      status: 'pending',
      reference: 'WAR' + Date.now(),
      notes,
      createdAt: new Date(),
    };

    // TODO: Process with actual provider API
    // TODO: Store in database
    // TODO: Send SMS notification

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Transaction creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Transaction creation failed',
    });
  }
});

/**
 * GET /transactions/history
 * Get user's transaction history
 */
router.get('/history', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 20 } = req.query;

    // TODO: Fetch from database with pagination
    const transactions = [
      {
        id: 'txn-1',
        senderId: userId,
        recipientPhone: '0712345678',
        amount: 50000,
        provider: 'wave',
        fee: 600,
        totalAmount: 50600,
        status: 'completed',
        reference: 'WAR1234567890',
        createdAt: new Date(),
        completedAt: new Date(),
      },
    ];

    res.json({
      success: true,
      data: {
        transactions,
        page: Number(page),
        limit: Number(limit),
        total: transactions.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction history',
    });
  }
});

/**
 * GET /transactions/:id
 * Get transaction details
 */
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Fetch from database
    const transaction = {
      id,
      senderId: req.user?.id,
      recipientPhone: '0712345678',
      amount: 50000,
      provider: 'wave',
      fee: 600,
      totalAmount: 50600,
      status: 'completed',
      reference: 'WAR1234567890',
      createdAt: new Date(),
    };

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction',
    });
  }
});

export default router;
