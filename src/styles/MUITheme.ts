import { ThemeOptions, createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#16aa5e',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'unset',
        },
      },
    },
  },
});
