import { Router, Request, Response } from 'express';
import { verifyToken } from '../middleware/authentication';
import { paymentSchema } from '../../src/constants/validation';
import { transactionService } from '../services/TransactionService';
import { logger } from '../services/LoggingService';

const router = Router();

/**
 * GET /api/transactions
 */
router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const { status, provider, page = 1, limit = 20 } = req.query;
    const userId = req.userId!;

    const offset = (Number(page) - 1) * Number(limit);
    const transactions = await transactionService.getHistory(userId, {
      status: status as string,
      provider: provider as string,
      limit: Number(limit),
      offset,
    });

    res.json({
      success: true,
      data: {
        transactions,
        pagination: { page: Number(page), limit: Number(limit) },
      },
    });
  } catch (error: any) {
    logger.error('Fetch transactions history error', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/transactions/:id
 */
router.get('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await transactionService.getTransactionDetails(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error: any) {
    logger.error('Fetch transactions history error', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/transactions/send
 */
router.post('/send', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    const validation = paymentSchema.safeParse({
      ...req.body,
      amount: Number(req.body.amount),
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: validation.error.errors,
      });
    }

    const result = await transactionService.sendMoney(userId, req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error('Send money error', error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/transactions/analytics/dashboard
 */
router.get('/analytics/dashboard', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const analytics = await transactionService.getDashboardAnalytics(userId);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    logger.error('Fetch analytics error', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/transactions/:id/cancel
 */
router.post('/:id/cancel', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const result = await transactionService.cancelTransaction(userId, id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error('Fetch analytics error', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
