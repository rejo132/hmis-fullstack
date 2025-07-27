import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAssets, scheduleMaintenance as apiScheduleMaintenance } from '../api/api';

export const fetchAssets = createAsyncThunk('assets/fetchAssets', async (token, { rejectWithValue }) => {
  try {
    const response = await getAssets(token);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch assets');
  }
});

export const scheduleAssetMaintenance = createAsyncThunk('assets/scheduleMaintenance', async ({ assetId, token }, { rejectWithValue }) => {
  try {
    const response = await apiScheduleMaintenance(assetId, token);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to schedule maintenance');
  }
});

const assetSlice = createSlice({
  name: 'assets',
  initialState: {
    assets: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle both array and object responses
        if (Array.isArray(action.payload)) {
          state.assets = action.payload;
        } else if (action.payload.assets) {
          state.assets = action.payload.assets;
        } else {
          state.assets = [];
        }
        state.error = null;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(scheduleAssetMaintenance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Ensure assets is an array before using findIndex
        if (Array.isArray(state.assets)) {
          const index = state.assets.findIndex((asset) => asset.id === action.payload.id);
          if (index !== -1) {
            state.assets[index] = { ...state.assets[index], status: 'Maintenance' };
          }
        }
      })
      .addCase(scheduleAssetMaintenance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default assetSlice.reducer;