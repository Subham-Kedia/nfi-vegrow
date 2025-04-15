import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LinearProgress from '@mui/material/LinearProgress';
import { AppLoader } from 'Components';
import _isEmpty from 'lodash/isEmpty';
import TabComponentsMap from 'Pages';
import RouteTransformer from 'Routes/routeTransformer';
import { userLogout, userPermission } from 'Services/users';
import { getLogoutRedirectPath, processPermission } from 'Utilities';
import { USER_PERMISSION } from 'Utilities/constants/userPermission';
import {
  getSavedPermissions,
  getSavedUserDCId,
  getUserData,
  removeUser,
  saveUserDCId,
  // saveUserPermission,
} from 'Utilities/localStorage';
import { VgLibraryContext } from 'vg-library/core';

import CustomCommandPalette from '../components/CustomCustomPalette/index';
import theme from '../theme';

import AppLayout from './Layout';
import { SiteProvider } from './SiteContext';

const App = () => {
  const navigate = useNavigate();
  const [dcId, setDcId] = useState(getSavedUserDCId());
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({});
  const [allowedTabs, setAllowedTabs] = useState([]);

  const userInfo = getUserData();
  const { token } = userInfo || {};

  const routeToLoginPage = () => {
    if (token) {
      userLogout();
    }
    const path = !token
      ? getLogoutRedirectPath()
      : RouteTransformer.getLoginPath();
    removeUser();
    navigate(path);
  };

  useEffect(() => {
    if (!token) {
      routeToLoginPage();
    } else {
      const savedPermission = getSavedPermissions();
      const allowedTabs = USER_PERMISSION() || [];

      setAllowedTabs(allowedTabs);

      if (_isEmpty(savedPermission)) {
        userPermission().then((res) => {
          // Not using this configuration, so commenting out.
          // saveUserPermission(res.permissions);
          setLoading(false);
          setPermissions(processPermission(res.permissions));
        });
      } else {
        setLoading(false);
        setPermissions(processPermission(savedPermission));
      }
    }
  }, [token]);

  const setDCId = (id) => {
    saveUserDCId(id);
    setDcId(id);
  };

  if (loading) {
    return <AppLoader />;
  }

  const defaultUrl = () => {
    const firstTab = allowedTabs?.[0];
    return firstTab.children
      ? `${firstTab.url}/${firstTab.children[0].url}`
      : `${firstTab.url}`;
  };

  return (
    <SiteProvider
      value={{
        userInfo,
        dcId,
        allowedTabs,
        permissions,
        logoutUser: routeToLoginPage,
        setDCId,
      }}
    >
      <VgLibraryContext.Provider
        value={{
          theme,
          userInfo,
          authToken: userInfo.token,
          dcId,
          API: {
            nonFruit: API.nonFruit,
            supplyChainService: API.supplyChainService,
          },
        }}
      >
        <AppLayout>
          <React.Suspense fallback={<LinearProgress />}>
            <Routes>
              {allowedTabs.map((t) =>
                t.children ? (
                  [
                    ...t.children.map((child) => (
                      <Route
                        key={child.id}
                        path={`${t.url}/${child.url}/*`}
                        element={TabComponentsMap[child.id]}
                      />
                    )),
                    ...[
                      <Route
                        key={t.id}
                        path={`${t.url}/*`}
                        element={TabComponentsMap[t.id]}
                      />,
                    ],
                  ]
                ) : (
                  <Route
                    key={t.url}
                    path={`${t.url}/*`}
                    element={TabComponentsMap[t.id]}
                  />
                ),
              )}
              <Route
                path="*"
                element={<Navigate to={defaultUrl()} replace />}
              />
            </Routes>
          </React.Suspense>
        </AppLayout>
        <CustomCommandPalette />
      </VgLibraryContext.Provider>
    </SiteProvider>
  );
};

export default App;
