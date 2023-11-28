import IndexPage from '@/pages/IndexPage';
import CompanyListPage, { getCompaniesLoader } from '@/pages/CompanyListPage';
import Root from '@/pages';
import type { RouteObject } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegistrationPage from '@/pages/RegistrationPage/RegistrationPage';
import type { AxiosInstance } from 'axios';
import ErrorPage from '@/pages/ErrorPage';
import CompanyDetailPage, {
  getCompanyDetailLoader,
} from '@/pages/CompanyDetailPage';

export function createRoutes(axios: AxiosInstance): RouteObject[] {
  return [
    {
      path: '/',
      element: <Root />,
      errorElement: import.meta.env.DEV ? undefined : <ErrorPage />,
      children: [
        {
          index: true,
          element: <IndexPage />,
        },
        {
          path: 'companies',
          loader: getCompaniesLoader(axios),
          element: <CompanyListPage />,
          children: [
            {
              path: 'new',
              element: <RegistrationPage />,
            },
            {
              path: ':cnpj',
              loader: getCompanyDetailLoader(axios),
              element: <CompanyDetailPage />,
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
