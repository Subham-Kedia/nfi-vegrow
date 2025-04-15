import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#eb9441',
      dark: '#ea7505',
      contrastText: '#fff',
    },
    text: {
      primary: '#2d3941',
      secondary: '#000',
      disabled: '#7c8891',
      hint: 'rgba(0,185,255,0.71)',
    },
    colors: {
      gray: '#E1E1E1',
      white: '#fff',
      black: '#000',
      darkGray: '#d4d4d4',
      chineseSilver: '#cccccc',
      gray1: '#0000000a',
      gray2: '#fafafa',
      gray94: '#f0f0f0',
      green: '#54B095',
      bgGreen: '#54B09521',
      darkGreen: '#008001',
      red: ' #E52810',
      bgRed: '#E5281014',
      dustyGray: '#ddd',
      brightGray: '#eeeeee',
      yellow: '#FFD601',
      lightGray: '#F4F4F4',
    },
  },
  typography: {
    fontFamily: ['"Noto Sans"', 'sans-serif'],
    textTransform: 'none',
    fontSize: 13,
    button: {
      fontWeight: 'bold',
    },
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 375,
      md: 768,
      lg: 1024,
      xl: 1440,
    },
  },
  overrides: {
    MuiBadge: {
      anchorOriginTopRightCircular: {
        transform: 'scale(0.8) translate(50%, -50%)',
      },
    },
  },
});

export default responsiveFontSizes(muiTheme);
