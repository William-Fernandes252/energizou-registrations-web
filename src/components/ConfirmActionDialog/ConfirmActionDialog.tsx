import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  type DialogProps,
} from '@mui/material';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  message: string;
  cancelButton: ReactNode;
  confirmButton: ReactNode;
} & DialogProps;

export default function ConfirmActionDialog({
  title,
  message,
  cancelButton,
  confirmButton,
  ...dialogProps
}: Props) {
  return (
    <Dialog {...dialogProps}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {cancelButton}
        {confirmButton}
      </DialogActions>
    </Dialog>
  );
}
