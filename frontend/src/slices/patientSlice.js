import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPatients, createPatient, updatePatient as apiUpdatePatient } from '../api/api';

// Fetch patients thunk
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await getPatients(page);
      console.log('Fetch patients response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Fetch patients failed:', err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add patient thunk
export const addPatient = createAsyncThunk(
  'patients/addPatient',
  async (patientData, { rejectWithValue }) => {
    try {
      const response = await createPatient(patientData);
      console.log('Add patient response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Add patient failed:', err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update patient thunk
export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, patientData }, { rejectWithValue }) => {
    try {
      const response = await apiUpdatePatient(id, patientData);
      console.log('Update patient response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Update patient failed:', err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice definition
const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    patients: [],
    status: 'idle',
    error: null,
    page: 1,
    pages: 1,
    universal: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.patients = action.payload.patients || [];
        state.page = action.payload.current_page || action.payload.page || 1;
        state.pages = action.payload.pages || 1;
        state.total = action.payload.total || 0;
        state.error = null;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.patients.push(action.payload);
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const index = state.patients.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
      });
  },
});

export default patientSlice.reducer;
