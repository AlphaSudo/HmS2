import axios, { type InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('hms_token');
  if (token) {
    // Axios v1 uses AxiosHeaders which provides a `set` method
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
}); 