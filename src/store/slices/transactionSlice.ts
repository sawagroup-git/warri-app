import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction, PaymentRequest, DashboardStats, TransactionState } from '../../types/index';
import { transactionService } from '../../services/transactionService';

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  page: 1,
};

// Async Thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await transactionService.getHistory(params);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const sendMoneyAction = createAsyncThunk(
  'transactions/send',
  async (data: PaymentRequest, { rejectWithValue }) => {
    try {
      const response = await transactionService.sendMoney(data);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchAnalyticsAction = createAsyncThunk(
  'transactions/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await transactionService.getDashboardAnalytics();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const cancelTransactionAction = createAsyncThunk(
  'transactions/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await transactionService.cancelTransaction(id);
      if (response.success) {
        return { id, message: response.data.message };
      }
      return rejectWithValue(response.error);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.totalCount = action.payload.pagination.totalCount || action.payload.transactions.length;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send Money
      .addCase(sendMoneyAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMoneyAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions.unshift(action.payload.transaction);
      })
      .addCase(sendMoneyAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Analytics
      .addCase(fetchAnalyticsAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAnalyticsAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Cancel Transaction
      .addCase(cancelTransactionAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelTransactionAction.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index].status = 'cancelled';
        }
      })
      .addCase(cancelTransactionAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
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
