import { beforeEach, afterEach, it, expect } from 'vitest';
import LinkButton from './LinkButton';
import { screen } from '@testing-library/react';
import {
  clearScreenAndMocks,
  renderWithRouterContext,
} from '@/__tests__/utils';

beforeEach(() => {
  renderWithRouterContext(<LinkButton to="/test">Test</LinkButton>);
});

it('renders without crashing', () => {
  const button = screen.getByRole('link');
  expect(button).toBeDefined();
});

it('has correct text', () => {
  const button = screen.getByText('Test');
  expect(button).toBeDefined();
});

it('has correct href', () => {
  const button = screen.getByRole('link');
  expect(button.getAttribute('href')).toBe('/test');
});

afterEach(clearScreenAndMocks);
