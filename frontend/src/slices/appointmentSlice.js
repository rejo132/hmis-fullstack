import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAppointments, createAppointment } from '../api/api';

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await getAppointments(page);
      console.log('Fetch appointments response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Fetch appointments failed:', err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const scheduleAppointment = createAsyncThunk(
  'appointments/scheduleAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await createAppointment(appointmentData);
      console.log('Schedule appointment response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Schedule appointment failed:', err.message);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    appointments: [],
    status: 'idle',
    error: null,
    page: 1,
    pages: 1,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.appointments = action.payload.appointments || [];
        state.page = action.payload.current_page || action.payload.page || 1;
        state.pages = action.payload.pages || 1;
        state.total = action.payload.total || 0;
        state.error = null;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(scheduleAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      });
  },
});

export default appointmentSlice.reducer;