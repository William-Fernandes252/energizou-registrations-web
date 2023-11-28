import { getJWT } from '@/contexts/auth';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(config => {
  if (getJWT()) {
    config.headers['Authorization'] = `Bearer ${getJWT()}`;
  }
  return config;
});
