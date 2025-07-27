import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createMedication } from '../api/api';

export const addMedication = createAsyncThunk(
  'medications/addMedication',
  async (medicationData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await createMedication(medicationData, auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to record medication');
    }
  }
);

const medicationSlice = createSlice({
  name: 'medications',
  initialState: {
    medications: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMedication.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addMedication.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.medications.push(action.payload);
      })
      .addCase(addMedication.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default medicationSlice.reducer;