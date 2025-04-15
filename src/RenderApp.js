import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import App from 'App';
import { SiteLayout } from 'App/Layout';
import TabComponentsMap from 'Pages';
import RouteTransformer from 'Routes/routeTransformer';
import { initializeService } from 'Utilities/sendError';

initializeService();
const RenderApp = () => (
  <SiteLayout data-testid="app">
    <BrowserRouter basename={`${PUBLIC_URL}/`}>
      <React.Suspense fallback={<LinearProgress />}>
        <Routes>
          <Route
            path={RouteTransformer.getLoginPath()}
            element={TabComponentsMap.LOGIN_PAGE}
          />
          <Route path="/app/*" element={<App />} />
          <Route
            path="/*"
            element={<Navigate to={RouteTransformer.getLoginPath()} replace />}
          />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </SiteLayout>
);

export default RenderApp;
