import { createContext, useContext } from 'react';
import type { AxiosInstance } from 'axios';

export const AxiosInstanceContext = createContext<AxiosInstance | null>(null);

export function useAxios(): AxiosInstance {
  return useContext(AxiosInstanceContext) as AxiosInstance;
}
