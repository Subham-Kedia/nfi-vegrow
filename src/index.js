import React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from 'styled-components';
import { GOOGLE_SSO } from 'Utilities/constants/userPermission';

import GlobalStyle from './theme/GlobalStyle';
import App from './RenderApp';
import theme from './theme';

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {});
}

const RenderRoot = () => (
  <MuiThemeProvider theme={theme}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyle />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          autoHideDuration={3000}
          maxSnack={5}
        >
          <GoogleOAuthProvider clientId={GOOGLE_SSO.CLIENTID}>
            <App />
          </GoogleOAuthProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </MuiThemeProvider>
);

const root = createRoot(document.getElementById('root'));

root.render(<RenderRoot />);

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${PUBLIC_URL}/serviceWorker.js`).then(
      (registration) => {
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope,
        );
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err);
      },
    );
  });
}
