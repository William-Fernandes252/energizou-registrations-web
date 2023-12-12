import { createTheme } from '@mui/material';

export default createTheme({
  palette: {
    primary: {
      main: '#003063',
    },
    secondary: {
      main: '#FFCC00',
    },
    success: {
      main: '#1E9E79',
    },
  },
  components: {
    MuiAlert: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
        fullWidth: true,
      },
    },
  },
});
