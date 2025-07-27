import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFinanceExpenses, getFinanceReimbursements, getFinancePayroll, createExpense } from '../api/api';

export const fetchExpenses = createAsyncThunk(
  'finance/fetchExpenses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await getFinanceExpenses(auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch expenses');
    }
  }
);

export const fetchReimbursements = createAsyncThunk(
  'finance/fetchReimbursements',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await getFinanceReimbursements(auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch reimbursements');
    }
  }
);

export const fetchPayroll = createAsyncThunk(
  'finance/fetchPayroll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await getFinancePayroll(auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch payroll');
    }
  }
);

export const addExpense = createAsyncThunk(
  'finance/addExpense',
  async (expenseData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await createExpense(expenseData, auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add expense');
    }
  }
);

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    expenses: [],
    reimbursements: [],
    payroll: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchReimbursements.fulfilled, (state, action) => {
        state.reimbursements = action.payload;
      })
      .addCase(fetchReimbursements.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchPayroll.fulfilled, (state, action) => {
        state.payroll = action.payload;
      })
      .addCase(fetchPayroll.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addExpense.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.expenses.push(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default financeSlice.reducer;