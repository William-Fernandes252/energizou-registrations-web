import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
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
import NavBarDrawer from '../NavBarDrawer';

const drawerWidth = 240;

export default function NavBar() {
  const title = 'Energizou Registrations';

  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const showUserMenu = Boolean(menuAnchorEl);

  const navItems = new Map<string, string>();
  if (isAuthenticated) {
    navItems.set('/companies', 'Cliente');
    navItems.set('/companies/new', 'Cadastrar cliente');
  } else {
    navItems.set('/login', 'Login');
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log(event.currentTarget);
    setMenuAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setMenuAnchorEl(null);
  }

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  function handleLogout() {
    setMenuAnchorEl(null);
    logout();
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
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {[...navItems.entries()].map(([path, page], index) => (
              <Button
                key={index}
                sx={{ color: 'white' }}
                component={NavLink}
                to={path}>
                {page}
              </Button>
            ))}
            {isAuthenticated && (
              <IconButton
                id="account-button"
                onClick={handleClick}
                aria-haspopup="true"
                aria-controls={showUserMenu ? 'account-menu' : undefined}
                aria-expanded={showUserMenu ? 'true' : undefined}>
                <AccountCircleIcon />
              </IconButton>
            )}
          </Box>
          <Menu
            id="account-menu"
            anchorEl={menuAnchorEl}
            open={showUserMenu}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'account-button',
            }}>
            <MenuItem disabled>{user?.email}</MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <nav>
        <NavBarDrawer
          width={drawerWidth}
          title={title}
          navItems={navItems}
          open={mobileOpen}
          onClose={handleDrawerToggle}
        />
      </nav>
      <Toolbar />
    </>
  );
}
