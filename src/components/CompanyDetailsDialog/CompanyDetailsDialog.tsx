import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  type DialogProps,
  DialogTitle,
} from '@mui/material';

type Props = {
  company: EnergizouRegistrations.Models.Company | null;
  onClose: () => void;
  onDelete: () => void;
} & Omit<DialogProps, 'open' | 'close'>;

export default function CompanyDetailsDialog({
  company,
  onClose,
  onDelete,
  ...props
}: Props) {
  return (
    <Dialog open={!!company} onClose={onClose} {...props}>
      <DialogTitle>Company Details</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <strong>Company Name:</strong> {company!.reason}
        </DialogContentText>
        <DialogContentText>
          <strong>Representative:</strong> {company!.representative}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDelete} color="error">
          Delete
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
