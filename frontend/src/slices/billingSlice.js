import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBills, createBill, updateBill, deleteBill, submitClaim as submitClaimAPI, processRefund as processRefundAPI } from '../api/api';

export const fetchBills = createAsyncThunk(
  'billing/fetchBills',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await getBills(page);
      console.log('Fetch bills response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch bills failed:', error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createBillThunk = createAsyncThunk(
  'billing/createBill',
  async (billData, { rejectWithValue }) => {
    try {
      const response = await createBill(billData);
      console.log('Create bill response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create bill failed:', error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const editBill = createAsyncThunk(
  'billing/editBill',
  async ({ id, billData }, { rejectWithValue }) => {
    try {
      const response = await updateBill(id, billData);
      console.log('Update bill response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update bill failed:', error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeBill = createAsyncThunk(
  'billing/removeBill',
  async (id, { rejectWithValue }) => {
    try {
      await deleteBill(id);
      console.log('Delete bill successful:', id);
      return id;
    } catch (error) {
      console.error('Delete bill failed:', error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const submitClaim = createAsyncThunk(
  'billing/submitClaim',
  async ({ billId, insuranceProvider }, { rejectWithValue }) => {
    try {
      const response = await submitClaimAPI({ billId, insuranceProvider });
      console.log('Submit claim response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Submit claim failed:', error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const processRefund = createAsyncThunk(
  'billing/processRefund',
  async ({ billId, refundAmount, processedBy }, { rejectWithValue }) => {
    try {
      const response = await processRefundAPI({ billId, refundAmount, processedBy });
      console.log('Process refund response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Process refund failed:', error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const billingSlice = createSlice({
  name: 'billing',
  initialState: {
    bills: [],
    status: 'idle',
    error: null,
    page: 1,
    pages: 1,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bills = action.payload.bills || [];
        state.page = action.payload.current_page || action.payload.page || 1;
        state.pages = action.payload.pages || 1;
        state.total = action.payload.total || 0;
        state.error = null;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createBillThunk.fulfilled, (state, action) => {
        state.bills.push(action.payload);
        state.error = null;
      })
      .addCase(createBillThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(editBill.fulfilled, (state, action) => {
        const index = state.bills.findIndex(bill => bill.id === action.payload.id);
        if (index !== -1) {
          state.bills[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(editBill.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeBill.fulfilled, (state, action) => {
        state.bills = state.bills.filter(bill => bill.id !== action.payload);
        state.error = null;
      })
      .addCase(removeBill.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(submitClaim.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(submitClaim.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(processRefund.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(processRefund.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default billingSlice.reducer;