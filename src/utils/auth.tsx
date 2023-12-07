import { useAuth } from '@/contexts/auth';
import type { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';

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
