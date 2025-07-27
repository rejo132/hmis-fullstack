import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInventory, dispenseMedication } from '../api/api';

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await getInventory(auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch inventory');
    }
  }
);

export const dispenseItem = createAsyncThunk(
  'inventory/dispenseItem',
  async (dispenseData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await dispenseMedication(dispenseData, auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to dispense medication');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(dispenseItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(dispenseItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update inventory if needed
      })
      .addCase(dispenseItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default inventorySlice.reducer;