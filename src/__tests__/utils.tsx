import { vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { ReactNode } from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

export function clearScreenAndMocks() {
  cleanup();
  vi.clearAllMocks();
}

export function renderWithRouterContext(ui: ReactNode, path = '/') {
  return render(
    <RouterProvider
      router={createMemoryRouter([
        {
          path,
          element: ui,
        },
      ])}
    />,
  );
}
