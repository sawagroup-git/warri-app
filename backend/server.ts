import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';

// Middleware
import { validateInput, rateLimit } from './middleware/authentication';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global middleware
app.use(validateInput);
app.use(rateLimit(900000, 100)); // 15 minutes, 100 requests

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, _next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Wari App Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
