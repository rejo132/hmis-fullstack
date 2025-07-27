import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserRoles, updateUserRole } from '../api/api';

export const fetchUserRoles = createAsyncThunk(
  'userRoles/fetchUserRoles',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await getUserRoles(auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch user roles');
    }
  }
);

export const updateRole = createAsyncThunk(
  'userRoles/updateRole',
  async (roleData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await updateUserRole(roleData, auth.access_token);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update user role');
    }
  }
);

const userRoleSlice = createSlice({
  name: 'userRoles',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRoles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUserRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateRole.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u
        );
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userRoleSlice.reducer;