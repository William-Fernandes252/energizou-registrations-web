import { Button, type ButtonProps } from '@mui/material';
import { NavLink } from 'react-router-dom';

type Props = Omit<ButtonProps<typeof NavLink>, 'component'>;

export default function LinkButton({ children, ...props }: Props) {
  return (
    <Button {...props} component={NavLink}>
      {children}
    </Button>
  );
}
