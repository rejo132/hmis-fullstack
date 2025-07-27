import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRadiologyOrders, createRadiologyOrder } from '../api/api';

export const fetchRadiologyOrders = createAsyncThunk(
  'radiologyOrders/fetchRadiologyOrders',
  async (page, { rejectWithValue }) => {
    try {
      const response = await getRadiologyOrders(page);
      console.log('Fetch radiology orders response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Fetch radiology orders failed:', err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const addRadiologyOrder = createAsyncThunk(
  'radiologyOrders/addRadiologyOrder',
  async (radiologyOrderData, { rejectWithValue }) => {
    try {
      const response = await createRadiologyOrder(radiologyOrderData);
      console.log('Add radiology order response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Add radiology order failed:', err.message);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const radiologySlice = createSlice({
  name: 'radiologyOrders',
  initialState: {
    radiologyOrders: [],
    status: 'idle',
    error: null,
    page: 1,
    pages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRadiologyOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRadiologyOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.radiologyOrders = action.payload.radiologyOrders;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.error = null;
      })
      .addCase(fetchRadiologyOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(addRadiologyOrder.fulfilled, (state, action) => {
        state.radiologyOrders.push(action.payload);
      });
  },
});

export default radiologySlice.reducer;