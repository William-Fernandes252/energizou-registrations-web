import { createContext, useContext } from 'react';
import { axiosInstance as axios } from '@/axios';
import { jwtDecode } from 'jwt-decode';
import { AxiosError } from 'axios';
import { ErrorFactory, SessionExpiredError } from '@/errors';
import { useNavigate } from 'react-router-dom';

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
  logout: (redirect?: boolean) => void;
  isAuthenticated: boolean;
} {
  const user = useContext(UserContext);
  const setUser = useContext(UserSetterContext)!;
  const navigate = useNavigate();

  async function login(
    email: EnergizouRegistrations.LoggedUser['email'],
    password: string,
  ): Promise<void> {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      const decoded = jwtDecode(response.data.access_token);
      if (decoded.exp! < Date.now() / 1000) {
        throw new SessionExpiredError();
      }
      setUser(jwtDecode(response.data.access_token));
      setJWT(response.data.access_token);
      navigate('/');
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError) {
        throw ErrorFactory.createFromAxiosError(error);
      } else {
        throw error;
      }
    }
  }

  function logout(redirect: boolean = false): void {
    localStorage.removeItem('user');
    setUser(null);
    if (redirect) {
      return navigate('/login');
    }
  }

  const isAuthenticated = !!user;

  return { user, login, logout, isAuthenticated };
}
