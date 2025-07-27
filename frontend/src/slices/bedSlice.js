import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBeds, reserveBed as apiReserveBed } from '../api/api';

export const fetchBeds = createAsyncThunk('beds/fetchBeds', async (token, { rejectWithValue }) => {
  try {
    const response = await getBeds(token);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch beds');
  }
});

export const reserveBedAsync = createAsyncThunk('beds/reserveBed', async ({ bedId, token }, { rejectWithValue }) => {
  try {
    const response = await apiReserveBed(bedId, token);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to reserve bed');
  }
});

const bedSlice = createSlice({
  name: 'beds',
  initialState: {
    beds: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBeds.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBeds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.beds = action.payload;
        state.error = null;
      })
      .addCase(fetchBeds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(reserveBedAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.beds.findIndex((bed) => bed.id === action.payload.id);
        if (index !== -1) state.beds[index] = action.payload;
      })
      .addCase(reserveBedAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default bedSlice.reducer;