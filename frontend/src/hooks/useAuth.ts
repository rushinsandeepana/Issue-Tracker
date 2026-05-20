import { useAppDispatch, useAppSelector } from '../store/store';
import { login, register, logout } from '../store/slices/authSlice';
import type { LoginCredentials, RegisterData } from '../types';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const handleLogin = async (credentials: LoginCredentials) => {
    const result = await dispatch(login(credentials)).unwrap();
    if (result) {
      navigate('/dashboard');
    }
    return result;
  };

  const handleRegister = async (data: RegisterData) => {
    const result = await dispatch(register(data)).unwrap();
    if (result) {
      navigate('/dashboard');
    }
    return result;
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};