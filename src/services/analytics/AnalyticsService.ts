import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '@types/index';

/**
 * Analytics Event Types
 */
export type AnalyticsEventType =
  | 'app_open'
  | 'login'
  | 'logout'
  | 'transaction_initiated'
  | 'transaction_completed'
  | 'transaction_failed'
  | 'screen_view'
  | 'feature_used'
  | 'error_occurred';

interface AnalyticsEvent {
  type: AnalyticsEventType;
  timestamp: number;
  userId?: string;
  metadata?: Record<string, any>;
}

interface AnalyticsSummary {
  totalTransactions: number;
  totalAmount: number;
  successRate: number;
  averageTransactionAmount: number;
  favoriteMobileMoneyProvider: string;
  lastActivityDate: number;
}

/**
 * Analytics Service
 */
export class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private readonly STORAGE_KEY = '@wari_analytics';
  private enabled: boolean = true;

  private constructor() {
    this.loadEvents();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Track event
   */
  trackEvent(
    type: AnalyticsEventType,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      userId,
      metadata,
    };

    this.events.push(event);

    // Save to storage
    this.saveEvents();

    // Send to server if needed
    this.sendToServer(event);
  }

  /**
   * Track screen view
   */
  trackScreenView(screenName: string, userId?: string): void {
    this.trackEvent('screen_view', userId, { screenName });
  }

  /**
   * Track transaction
   */
  trackTransaction(
    transaction: Transaction,
    status: 'initiated' | 'completed' | 'failed',
    userId?: string
  ): void {
    this.trackEvent(`transaction_${status}`, userId, {
      transactionId: transaction.id,
      amount: transaction.amount,
      provider: transaction.provider,
      fee: transaction.fee,
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, userId?: string, context?: string): void {
    this.trackEvent('error_occurred', userId, {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  /**
   * Get analytics summary
   */
  async getSummary(transactions: Transaction[]): Promise<AnalyticsSummary> {
    const completed = transactions.filter((t) => t.status === 'completed');
    const totalAmount = completed.reduce((sum, t) => sum + t.amount, 0);
    const successRate =
      transactions.length > 0
        ? (completed.length / transactions.length) * 100
        : 0;

    // Find favorite provider
    const providerCounts: Record<string, number> = {};
    completed.forEach((t) => {
      providerCounts[t.provider] = (providerCounts[t.provider] || 0) + 1;
    });

    const favoriteProvider = Object.keys(providerCounts).reduce((a, b) =>
      providerCounts[a] > providerCounts[b] ? a : b
    );

    return {
      totalTransactions: completed.length,
      totalAmount,
      successRate,
      averageTransactionAmount:
        completed.length > 0 ? totalAmount / completed.length : 0,
      favoriteMobileMoneyProvider: favoriteProvider || 'N/A',
      lastActivityDate:
        completed.length > 0
          ? Math.max(...completed.map((t) => new Date(t.createdAt).getTime()))
          : 0,
    };
  }

  /**
   * Clear events
   */
  async clearEvents(): Promise<void> {
    this.events = [];
    await AsyncStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Disable analytics
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * Enable analytics
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Load events from storage
   */
  private async loadEvents(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (data) {
        this.events = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load analytics events:', error);
    }
  }

  /**
   * Save events to storage
   */
  private async saveEvents(): Promise<void> {
    try {
      // Keep only last 1000 events
      const eventsToSave = this.events.slice(-1000);
      await AsyncStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(eventsToSave)
      );
    } catch (error) {
      console.error('Failed to save analytics events:', error);
    }
  }

  /**
   * Send event to server
   */
  private async sendToServer(event: AnalyticsEvent): Promise<void> {
    try {
      // TODO: Implement server-side analytics
      // await axios.post('/api/analytics/events', event);
    } catch (error) {
      console.error('Failed to send event to server:', error);
    }
  }
}

export const analyticsService = AnalyticsService.getInstance();
