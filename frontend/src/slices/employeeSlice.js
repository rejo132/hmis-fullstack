import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEmployees, createEmployee } from '../api/api';

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await getEmployees(auth.access_token);
      return response.data.employees;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const addEmployee = createAsyncThunk(
  'employees/addEmployee',
  async (employeeData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await createEmployee(employeeData, auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add employee');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;