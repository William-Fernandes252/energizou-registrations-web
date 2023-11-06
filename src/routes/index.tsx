import IndexPage from '@/pages/IndexPage';
import CompaniesPage from '@/pages/CompaniesPage';
import Root from '@/pages';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegistrationPage from '@/pages/RegistrationPage/RegistrationPage';

const routes: RouteObject[] = [
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
        element: <CompaniesPage />,
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

export const router = createBrowserRouter(routes);
