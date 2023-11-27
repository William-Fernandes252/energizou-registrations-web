import { createContext, useContext, useEffect, useRef } from 'react';
import { axiosInstance as axios } from '@/axios';
import { jwtDecode } from 'jwt-decode';
import { AxiosError } from 'axios';
import { ErrorFactory, SessionExpiredError } from '@/errors';
import { useNavigate } from 'react-router-dom';

const CHECK_EXPIRATION_INTERVAL = 5 * 60 * 1000;

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
  const user = useContext(UserContext);
  const setUser = useContext(UserSetterContext)!;
  const checkTokenExpirationIntervalId = useRef<number | null>(null);
  const navigate = useNavigate();

  async function login(
    email: EnergizouRegistrations.LoggedUser['email'],
    password: string,
  ) {
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

  function logout() {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }

  useEffect(() => {
    if (user) {
      checkTokenExpirationIntervalId.current = window.setInterval(() => {
        const storedToken = getJWT();
        if (!storedToken) {
          return;
        }
        const decoded = jwtDecode(storedToken);
        if (decoded.exp! < Date.now() / 1000) {
          logout();
        }
      }, CHECK_EXPIRATION_INTERVAL);
    }
    return () => {
      if (checkTokenExpirationIntervalId.current) {
        clearInterval(checkTokenExpirationIntervalId.current);
      }
    };
  }, [user]);

  const isAuthenticated = !!user;

  return { user, login, logout, isAuthenticated };
}
