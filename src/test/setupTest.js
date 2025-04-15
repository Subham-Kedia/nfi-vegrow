/* eslint-disable import/no-extraneous-dependencies */
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import '@testing-library/jest-dom';
import './global';

import theme from '../theme';

const AllTheProviders = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </MuiThemeProvider>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
