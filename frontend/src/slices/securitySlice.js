import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSecurityLogs } from '../api/api';

export const fetchSecurityLogs = createAsyncThunk(
  'security/fetchSecurityLogs',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await getSecurityLogs(auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch security logs');
    }
  }
);

const securitySlice = createSlice({
  name: 'security',
  initialState: {
    logs: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSecurityLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSecurityLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = action.payload;
      })
      .addCase(fetchSecurityLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default securitySlice.reducer;