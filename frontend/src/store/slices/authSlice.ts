import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials, RegisterData, AuthResponse, User } from '../../types';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const loadInitialState = (): AuthState => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  return {
    user,
    token,
    isAuthenticated: !!token,
    loading: false,
  };
};

const initialState: AuthState = loadInitialState();

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  authAPI.logout();
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      toast.success(`Welcome back, ${action.payload.user.name}!`);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      toast.error(action.payload as string || 'Login failed');
    });
    
    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      toast.success(`Welcome, ${action.payload.user.name}! Account created successfully.`);
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      toast.error(action.payload as string || 'Registration failed');
    });
    
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      toast.success('Logged out successfully');
    });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;