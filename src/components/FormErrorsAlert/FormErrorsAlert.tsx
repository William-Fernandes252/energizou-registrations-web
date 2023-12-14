import { Warning } from '@mui/icons-material';
import {
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

type Props = {
  errors: Record<string, string>;
};

export default function FormErrorsAlert({ errors }: Props) {
  return (
    <Alert severity="error" icon={false} sx={{ mt: 2 }}>
      <List disablePadding>
        {Object.values(errors).map((error, index) => (
          <ListItem key={index} disablePadding>
            <ListItemIcon>
              <Warning color="error" />
            </ListItemIcon>
            <ListItemText primary={error} />
          </ListItem>
        ))}
      </List>
    </Alert>
  );
}
