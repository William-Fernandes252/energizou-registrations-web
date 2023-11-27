import { useAuth } from '@/contexts/auth';
import { UnauthorizedError } from '@/errors';
import type { ComponentType } from 'react';
import { Navigate, redirect } from 'react-router-dom';

export type Operation = ({
  request,
  params,
}: {
  request: Request;
  params?: Record<string, string>;
}) => Promise<unknown>;

export function redirectToLoginOnUnauthorized(operation: Operation) {
  return async function ({
    request,
    params,
  }: {
    request: Request;
    params?: Record<string, string>;
  }) {
    try {
      return await operation({ request, params });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      } else {
        redirect('/login');
      }
    }
  };
}

export function withAuthGuard<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>,
  redirectRoute: string,
) {
  function GuardedComponent(props: P) {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
      return <Component {...props} />;
    } else {
      return <Navigate to={redirectRoute} replace />;
    }
  }

  return GuardedComponent;
}
