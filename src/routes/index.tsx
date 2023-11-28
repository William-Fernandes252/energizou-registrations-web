import IndexPage from '@/pages/IndexPage';
import CompanyListPage, { getCompaniesLoader } from '@/pages/CompanyListPage';
import Root from '@/pages';
import type { RouteObject } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegistrationPage from '@/pages/RegistrationPage/RegistrationPage';
import type { AxiosInstance } from 'axios';
import { redirectToLoginOnUnauthorized } from './utils';

export function createRoutes(axios: AxiosInstance): RouteObject[] {
  return [
    {
      path: '/',
      element: <Root />,
      children: [
        {
          index: true,
          element: <IndexPage />,
        },
        {
          path: 'companies',
          loader: redirectToLoginOnUnauthorized(getCompaniesLoader(axios)),
          element: <CompanyListPage />,
          children: [
            {
              path: 'new',
              element: <RegistrationPage />,
            },
          ],
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
      ],
    },
  ];
}
