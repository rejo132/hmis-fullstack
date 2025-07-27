import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSettings, updateSettings } from '../api/api';

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await getSettings(auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

export const updateSystemSettings = createAsyncThunk(
  'settings/updateSystemSettings',
  async (settingsData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await updateSettings(settingsData, auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update settings');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    settings: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateSystemSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSystemSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
      })
      .addCase(updateSystemSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default settingsSlice.reducer;