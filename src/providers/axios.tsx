import { PropsWithChildren } from 'react';
import { AxiosInstanceContext } from '@/contexts/axios';
import { getJWT } from '@/contexts/auth';
import axios from 'axios';

export function AxiosInstanceProvider({ children }: PropsWithChildren) {
  const axiosInstace = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: getJWT()
      ? {
          Authorization: `Bearer ${getJWT()}`,
        }
      : undefined,
  });

  return (
    <AxiosInstanceContext.Provider value={axiosInstace}>
      {children}
    </AxiosInstanceContext.Provider>
  );
}
