import { getJWT } from '@/contexts/auth';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: getJWT()
    ? {
        Authorization: `Bearer ${getJWT()}`,
      }
    : undefined,
});
