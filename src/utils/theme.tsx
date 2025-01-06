import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4949b4',
        },
        secondary: {
            main: 'rgb(215, 135, 49)'
        },
        info: {
          main: 'rgb(20, 60, 119)'
        }
    },
    components: {
        MuiButton: {
          styleOverrides: {
            contained: {
              color: '#ffffff',
            },
          },
        },
      },
});

export default theme;