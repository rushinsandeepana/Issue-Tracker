import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import type { LoginCredentials, RegisterData, AuthResponse, CreateIssueData, UpdateIssueData, IssuesResponse, Issue, ApiError } from '../types/index';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else if (error.message) {
      toast.error('Network error. Please check your connection.');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: RegisterData) => 
    api.post<AuthResponse>('/auth/register', data),
  
  login: (data: LoginCredentials) => 
    api.post<AuthResponse>('/auth/login', data),
  
  getMe: () => 
    api.get<{ id: number; email: string; name: string }>('/auth/me'),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const issuesAPI = {
  getAll: (params?: Record<string, any>) => 
    api.get<IssuesResponse>('/issues', { params }),
  
  getById: (id: number) => 
    api.get<Issue>(`/issues/${id}`),
  
  create: (data: CreateIssueData) => 
    api.post<{ message: string; issue: Issue }>('/issues', data),
  
  update: (id: number, data: UpdateIssueData) => 
    api.put<{ message: string; issue: Issue }>(`/issues/${id}`, data),
  
  delete: (id: number) => 
    api.delete<{ message: string }>(`/issues/${id}`),
  
  getStatusCounts: () => 
    api.get<Record<string, number>>('/issues/status-counts'),
};

export default api;