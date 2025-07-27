import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createVitals } from '../api/api';

export const addVitals = createAsyncThunk(
  'vitals/addVitals',
  async (vitalsData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await createVitals(vitalsData, auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to record vitals');
    }
  }
);

const vitalsSlice = createSlice({
  name: 'vitals',
  initialState: {
    vitals: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addVitals.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addVitals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vitals.push(action.payload);
      })
      .addCase(addVitals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default vitalsSlice.reducer;