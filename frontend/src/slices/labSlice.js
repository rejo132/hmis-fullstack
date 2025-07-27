import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLabOrders, createLabOrder } from '../api/api';

export const fetchLabOrders = createAsyncThunk(
  'labOrders/fetchLabOrders',
  async (page, { rejectWithValue }) => {
    try {
      const response = await getLabOrders(page);
      console.log('Fetch lab orders response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Fetch lab orders failed:', err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const addLabOrder = createAsyncThunk(
  'labOrders/addLabOrder',
  async (labOrderData, { rejectWithValue }) => {
    try {
      const response = await createLabOrder(labOrderData);
      console.log('Add lab order response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Add lab order failed:', err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const labSlice = createSlice({
  name: 'labOrders',
  initialState: {
    labOrders: [],
    status: 'idle',
    error: null,
    page: 1,
    pages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLabOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.labOrders = action.payload.labOrders;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.error = null;
      })
      .addCase(fetchLabOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(addLabOrder.fulfilled, (state, action) => {
        state.labOrders.push(action.payload);
      });
  },
});

export default labSlice.reducer;