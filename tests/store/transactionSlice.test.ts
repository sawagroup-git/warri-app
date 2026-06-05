import { store } from '@store/store';
import { addTransaction, clearTransactions } from '@store/transactionSlice';
import { Transaction } from '@types/index';

describe('Transaction Slice', () => {
  describe('addTransaction', () => {
    it('should add transaction to state', () => {
      const transaction: Transaction = {
        id: '1',
        userId: 'user1',
        recipientPhone: '+22501234567',
        amount: 10000,
        fee: 150,
        provider: 'orange_money',
        status: 'completed',
        description: 'Payment',
        transactionHash: 'hash123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      store.dispatch(addTransaction(transaction));
      const state = store.getState();

      expect(state.transaction.transactions).toContainEqual(transaction);
      expect(state.transaction.transactions.length).toBe(1);
    });
  });

  describe('clearTransactions', () => {
    it('should clear all transactions', () => {
      store.dispatch(clearTransactions());
      const state = store.getState();

      expect(state.transaction.transactions).toEqual([]);
    });
  });
});
