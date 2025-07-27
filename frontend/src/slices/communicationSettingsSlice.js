import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCommunicationSettings,
  addCommunication as addCommunicationAPI,
  toggleCommunicationSetting as toggleCommunicationSettingAPI
} from '../api/api';

export const fetchCommunicationSettings = createAsyncThunk(
  'communicationSettings/fetchCommunicationSettings',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await getCommunicationSettings(auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch communication settings');
    }
  }
);

export const addCommunication = createAsyncThunk(
  'communicationSettings/addCommunication',
  async ({ message, type, token }, { rejectWithValue }) => {
    try {
      const response = await addCommunicationAPI({ message, type }, token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send message');
    }
  }
);

export const toggleCommunicationSetting = createAsyncThunk(
  'communicationSettings/toggleCommunicationSetting',
  async ({ setting, token }, { rejectWithValue }) => {
    try {
      const response = await toggleCommunicationSettingAPI({ setting }, token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || `Failed to toggle ${setting}`);
    }
  }
);

const communicationSettingsSlice = createSlice({
  name: 'communicationSettings',
  initialState: {
    settings: { sms: false, email: false, chat: false },
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunicationSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCommunicationSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
        state.error = null;
      })
      .addCase(fetchCommunicationSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addCommunication.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(addCommunication.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(toggleCommunicationSetting.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.settings = action.payload;
        state.error = null;
      })
      .addCase(toggleCommunicationSetting.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default communicationSettingsSlice.reducer;
