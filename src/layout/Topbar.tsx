import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { AccountCircle, Notifications, Logout } from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { auth } from '../firebase/client';

const Topbar = () => {
  const { user } = useAuthStore();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Welcome, {user?.displayName || 'User'}
        </Typography>
        <IconButton color="inherit">
          <Notifications />
        </IconButton>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <IconButton color="inherit" onClick={handleLogout}>
          <Logout />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
