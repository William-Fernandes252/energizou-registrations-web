import {
  Drawer,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { NavLink } from 'react-router-dom';

type Props = {
  navItems: Map<string, string>;
  width: number;
  title: string;
  onClose: () => void;
  open: boolean;
};

export default function NavBarDrawer({
  navItems,
  width,
  title,
  onClose,
  open,
}: Props) {
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width,
        },
      }}>
      <Box onClick={onClose} sx={{ textAlign: 'center' }}>
        <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="h6"
            sx={{ my: 2, color: 'primary' }}
            textTransform={'uppercase'}>
            {title}
          </Typography>
        </NavLink>
        <Divider />
        <List>
          {[...navItems.entries()].map(([path, page]) => (
            <ListItem key={path} disablePadding>
              <ListItemButton
                sx={{ textAlign: 'center' }}
                component={NavLink}
                to={path}>
                <ListItemText primary={page} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
