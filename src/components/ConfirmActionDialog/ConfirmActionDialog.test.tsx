import { beforeEach, afterEach, it, expect } from 'vitest';
import ConfirmActionDialog from './ConfirmActionDialog';
import { render, screen } from '@testing-library/react';
import { clearScreenAndMocks } from '@/__tests__/utils';

beforeEach(() => {
  render(
    <ConfirmActionDialog
      title="Confirmar exclusão"
      message="Deseja realmente excluir o registro?"
      cancelButton={<button>Cancelar</button>}
      confirmButton={<button>Confirmar</button>}
      open={true}
    />,
  );
});

it('renders without crashing', () => {
  const dialog = screen.getByRole('dialog');
  expect(dialog).toBeDefined();
});

it('renders title', () => {
  const title = screen.getByRole('heading');
  expect(title.innerHTML.includes('Confirmar exclusão')).toBe(true);
});

it('renders message', () => {
  const message = screen.getByText('Deseja realmente excluir o registro?');
  expect(message).toBeDefined();
});

it('renders cancel button', () => {
  const cancelButton = screen.getByText('Cancelar');
  expect(cancelButton).toBeDefined();
});

it('renders confirm button', () => {
  const confirmButton = screen.getByText('Confirmar');
  expect(confirmButton).toBeDefined();
});

afterEach(clearScreenAndMocks);
