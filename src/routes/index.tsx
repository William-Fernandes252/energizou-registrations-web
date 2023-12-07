import type { RouteObject } from 'react-router-dom';
import type { AxiosInstance } from 'axios';
import IndexPage from '@/pages/IndexPage';
import CompanyListPage, { getCompaniesLoader } from '@/pages/CompanyListPage';
import Root from '@/pages';
import LoginPage from '@/pages/LoginPage';
import CompanyRegistrationPage from '@/pages/CompanyRegistrationPage';
import { getRegisterCompanyAction } from '@/pages/CompanyRegistrationPage/CompanyRegistrationPage';
import ErrorPage from '@/pages/ErrorPage';
import CompanyDetailPage, {
  getCompanyDetailLoader,
} from '@/pages/CompanyDetailPage';

export function createRoutes(axios: AxiosInstance): RouteObject[] {
  return [
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
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
              element: <CompanyRegistrationPage />,
              action: getRegisterCompanyAction(axios),
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
