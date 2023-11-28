import { useAuth } from '@/contexts/auth';
import { UnauthorizedError } from '@/errors';
import type { ComponentType } from 'react';
import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
  Navigate,
  redirect,
} from 'react-router-dom';

export function redirectToLoginOnUnauthorized<T>(
  operation: LoaderFunction<T> | ActionFunction<T>,
) {
  return async function (
    context: ActionFunctionArgs<T> | LoaderFunctionArgs<T>,
  ) {
    try {
      return await operation(context);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return redirect('/login');
      } else {
        throw error;
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
