import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSample } from '../api/api';

export const addSample = createAsyncThunk(
  'samples/addSample',
  async (sampleData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await createSample(sampleData, auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to record sample');
    }
  }
);

const sampleSlice = createSlice({
  name: 'samples',
  initialState: {
    samples: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSample.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addSample.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.samples.push(action.payload);
      })
      .addCase(addSample.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default sampleSlice.reducer;