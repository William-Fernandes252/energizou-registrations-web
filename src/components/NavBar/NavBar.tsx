import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '@/contexts/auth';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';

const drawerWidth = 240;

export default function NavBar() {
  const title = 'Energizou Registrations';

  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const showUserMenu = Boolean(menuAnchorEl);
  const navItems = new Map<string, string>();
  if (isAuthenticated) {
    navItems.set('/companies', 'Clientes');
    navItems.set('/companies/new', 'Cadastrar cliente');
  } else {
    navItems.set('/login', 'Login');
  }

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography
        variant="h6"
        sx={{ my: 2 }}
        textTransform={'uppercase'}
        component={NavLink}
        to={'/'}>
        {title}
      </Typography>
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
  );

  const navElements = [...navItems.entries()].map(([path, page]) => (
    <Button key={path} component={NavLink} to={path}>
      {page}
    </Button>
  ));
  if (isAuthenticated) {
    navElements.push(
      <>
        <IconButton
          id="account-button"
          onClick={handleClick}
          aria-haspopup="true"
          aria-controls={showUserMenu ? 'account-menu' : undefined}
          aria-expanded={showUserMenu ? 'true' : undefined}>
          <AccountCircleIcon />
        </IconButton>
        <Menu
          id="account-menu"
          anchorEl={menuAnchorEl}
          open={showUserMenu}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'account-button',
          }}>
          <MenuItem disabled>{user?.email}</MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <LogoutOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>Cut</ListItemText>
          </MenuItem>
        </Menu>
      </>,
    );
  }

  return (
    <>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            textTransform={'uppercase'}
            sx={{
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' },
            }}>
            {title}
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{navElements}</Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}>
          {drawer}
        </Drawer>
      </nav>
      <Toolbar />
    </>
  );
}
