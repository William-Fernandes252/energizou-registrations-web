import { it, expect, afterEach, beforeEach } from 'vitest';
import FormErrorsAlert from './FormErrorsAlert';
import { render, screen } from '@testing-library/react';
import { clearScreenAndMocks } from '@/__tests__/utils';

const errors = { email: 'Email inválido', password: 'Senha fraca' };

beforeEach(() => {
  render(<FormErrorsAlert errors={errors} />);
});

it('renders without crashing', () => {
  const alert = screen.getByRole('alert');
  expect(alert).toBeDefined();
});

it('renders correct number of errors', () => {
  const listItems = screen.getAllByRole('listitem');
  expect(listItems.length).toBe(2);
});

it('renders correct error messages', () => {
  const emailError = screen.getByText('Email inválido');
  const passwordError = screen.getByText('Senha fraca');
  expect(emailError).toBeDefined();
  expect(passwordError).toBeDefined();
});

afterEach(clearScreenAndMocks);
