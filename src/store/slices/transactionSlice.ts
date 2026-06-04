import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionState, Transaction } from '@types/index';

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  page: 1,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Fetch transactions start
    fetchTransactionsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // Fetch transactions success
    fetchTransactionsSuccess: (
      state,
      action: PayloadAction<{
        transactions: Transaction[];
        totalCount: number;
        page: number;
      }>
    ) => {
      state.isLoading = false;
      state.transactions = action.payload.transactions;
      state.totalCount = action.payload.totalCount;
      state.page = action.payload.page;
    },

    // Fetch transactions failure
    fetchTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Add transaction
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      state.totalCount += 1;
    },

    // Update transaction
    updateTransaction: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Transaction> }>
    ) => {
      const index = state.transactions.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) {
        state.transactions[index] = {
          ...state.transactions[index],
          ...action.payload.updates,
        };
      }
    },

    // Clear transactions
    clearTransactions: (state) => {
      state.transactions = [];
      state.totalCount = 0;
      state.page = 1;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  addTransaction,
  updateTransaction,
  clearTransactions,
  clearError,
} = transactionSlice.actions;

export default transactionSlice.reducer;
