import { db } from '../config/database';
import { Transaction } from '../../src/types';

export class KoriPayTransactRepo {
  private readonly tableName = 'transactions';

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await db(this.tableName).where({ id }).first();
    return transaction || null;
  }

  async findByReference(reference: string): Promise<Transaction | null> {
    const transaction = await db(this.tableName).where({ reference }).first();
    return transaction || null;
  }

  async findByUserId(userId: string, options: {
    limit?: number;
    offset?: number;
    status?: string;
    provider?: string;
  } = {}): Promise<Transaction[]> {
    let query = db(this.tableName).where({ senderId: userId });

    if (options.status) {
      query = query.andWhere({ status: options.status });
    }

    if (options.provider) {
      query = query.andWhere({ provider: options.provider });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.offset(options.offset);
    }

    return query.orderBy('createdAt', 'desc');
  }

  async create(transactionData: Partial<Transaction>): Promise<Transaction> {
    const [transaction] = await db(this.tableName)
      .insert({
        ...transactionData,
        updatedAt: db.fn.now(),
      })
      .returning('*');
    return transaction;
  }

  async updateStatus(id: string, status: string, providerTransactionId?: string): Promise<Transaction | null> {
    const updateData: any = {
      status,
      updatedAt: db.fn.now()
    };

    if (status === 'completed') {
      updateData.completedAt = db.fn.now();
    }

    if (providerTransactionId) {
      updateData.providerTransactionId = providerTransactionId;
    }

    const [transaction] = await db(this.tableName)
      .where({ id })
      .update(updateData)
      .returning('*');
    return transaction || null;
  }

  async getAnalytics(userId: string): Promise<any> {
    const stats = await db(this.tableName)
      .where({ senderId: userId, status: 'completed' })
      .select(
        db.raw('COALESCE(SUM(amount), 0) as total_sent'),
        db.raw('COUNT(*) as total_count'),
        db.raw('AVG(amount) as avg_amount'),
        db.raw('MAX("createdAt") as last_transaction')
      )
      .first();

    const monthlyTrends = await db(this.tableName)
      .where({ senderId: userId, status: 'completed' })
      .select(
        db.raw('TO_CHAR("createdAt", \'YYYY-MM\') as month'),
        db.raw('SUM(amount) as amount')
      )
      .groupBy('month')
      .orderBy('month', 'desc')
      .limit(6);

    return {
      stats,
      monthlyTrends
    };
  }

  async getRetentionStats(): Promise<any> {
    const multiTransactors = await db(this.tableName)
      .select('senderId')
      .count('* as txn_count')
      .groupBy('senderId')
      .having(db.raw('count(*) > 1'));

    return {
      multiTransactorCount: multiTransactors.length
    };
  }

  async getProviderSuccessRates(): Promise<any> {
    return db(this.tableName)
      .select('provider')
      .select(db.raw("COUNT(*) FILTER (WHERE status = 'completed') as success_count"))
      .select(db.raw("COUNT(*) FILTER (WHERE status = 'failed') as failure_count"))
      .groupBy('provider');
  }

  async getPeakTransactionTimes(): Promise<any> {
    return db(this.tableName)
      .select(db.raw('EXTRACT(HOUR FROM "createdAt") as hour'))
      .count('* as count')
      .groupBy('hour')
      .orderBy('count', 'desc');
  }
}

export const transactionRepository = new KoriPayTransactRepo();
