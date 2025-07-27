import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRecords, createMedicalRecord } from '../api/api';

export const fetchRecords = createAsyncThunk(
  'records/fetchRecords',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await getRecords(page);
      console.log('Fetch records response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Fetch records failed:', err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addRecord = createAsyncThunk(
  'records/addRecord',
  async (recordData, { rejectWithValue }) => {
    try {
      const response = await createMedicalRecord(recordData);
      console.log('Add record response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Add record failed:', err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const recordSlice = createSlice({
  name: 'records',
  initialState: {
    records: [],
    status: 'idle',
    error: null,
    page: 1,
    pages: 1,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecords.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.records = action.payload.records || [];
        state.page = action.payload.current_page || action.payload.page || 1;
        state.pages = action.payload.pages || 1;
        state.total = action.payload.total || 0;
        state.error = null;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addRecord.fulfilled, (state, action) => {
        state.records.push(action.payload);
      });
  },
});

export default recordSlice.reducer;