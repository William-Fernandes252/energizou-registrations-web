import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './providers/auth';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './query-client';
import { axiosInstance } from './axios';
import { createRoutes } from '@/routes';
import { ThemeProvider } from '@mui/material';
import theme from '@/theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider
            router={createBrowserRouter(createRoutes(axiosInstance))}
          />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
