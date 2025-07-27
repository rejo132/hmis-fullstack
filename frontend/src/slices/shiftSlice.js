import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getShifts, createShift } from '../api/api';

export const fetchShifts = createAsyncThunk(
  'shifts/fetchShifts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await getShifts(auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch shifts');
    }
  }
);

export const addShift = createAsyncThunk(
  'shifts/addShift',
  async (shiftData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await createShift(shiftData, auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create shift');
    }
  }
);

const shiftSlice = createSlice({
  name: 'shifts',
  initialState: {
    shifts: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShifts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShifts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shifts = action.payload;
      })
      .addCase(fetchShifts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addShift.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addShift.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shifts.push(action.payload);
      })
      .addCase(addShift.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default shiftSlice.reducer;