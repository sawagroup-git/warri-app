import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '@types/index';

interface TransactionState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: string;
    provider?: string;
    dateRange?: [string, string];
  };
}

const initialState: TransactionState = {
  transactions: [],
  currentTransaction: null,
  isLoading: false,
  error: null,
  filters: {},
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Fetch transactions
    fetchStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSuccess: (state, action: PayloadAction<Transaction[]>) => {
      state.isLoading = false;
      state.transactions = action.payload;
      state.error = null;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create transaction
    createStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createSuccess: (state, action: PayloadAction<Transaction>) => {
      state.isLoading = false;
      state.transactions.unshift(action.payload);
      state.currentTransaction = action.payload;
      state.error = null;
    },
    createFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Set current transaction
    setCurrentTransaction: (state, action: PayloadAction<Transaction | null>) => {
      state.currentTransaction = action.payload;
    },

    // Update transaction
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
      if (state.currentTransaction?.id === action.payload.id) {
        state.currentTransaction = action.payload;
      }
    },

    // Set filters
    setFilters: (state, action: PayloadAction<TransactionState['filters']>) => {
      state.filters = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  createStart,
  createSuccess,
  createFailure,
  setCurrentTransaction,
  updateTransaction,
  setFilters,
  clearError,
} = transactionSlice.actions;

export default transactionSlice.reducer;
