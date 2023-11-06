import { createContext, useContext } from 'react';
import { useAxios } from './axios';
import { jwtDecode } from 'jwt-decode';
import { AxiosError } from 'axios';

export const UserContext =
  createContext<EnergizouRegistrations.LoggedUser | null>(null);
export const UserSetterContext = createContext<React.Dispatch<
  React.SetStateAction<EnergizouRegistrations.Models.User | null>
> | null>(null);

export function getJWT(): string | null {
  return localStorage.getItem('user');
}

export function setJWT(token: string) {
  localStorage.setItem('user', token);
}

export function useAuth(): {
  user: EnergizouRegistrations.LoggedUser | null;
  login: (
    email: EnergizouRegistrations.LoggedUser['email'],
    password: string,
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
} {
  const axios = useAxios();
  const user = useContext(UserContext);
  const setUser = useContext(UserSetterContext)!;

  async function login(
    email: EnergizouRegistrations.LoggedUser['email'],
    password: string,
  ) {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });
      setUser(jwtDecode(response.data.access_token));
      setJWT(response.data.access_token);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError) {
        throw new Error(
          error?.response?.data.message ||
            'Ocorreu um erro inesperado no servidor',
        );
      }
    }
  }

  function logout() {
    localStorage.removeItem('user');
    setUser(null);
  }

  const isAuthenticated = !!user;

  return { user, login, logout, isAuthenticated };
}
