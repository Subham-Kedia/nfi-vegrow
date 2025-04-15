import axios from 'axios';
import _get from 'lodash/get';
import RouteTransformer from 'Routes/routeTransformer';
import { getLogoutRedirectPath, notifyUser } from 'Utilities';
import {
  getSavedUserDCId,
  getUserData,
  removeUser,
  saveUserData,
} from 'Utilities/localStorage';

const serviceConfig = {
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

const getServiceInstance = (baseURL) => {
  const serviceInstance = axios.create({
    ...serviceConfig,
    ...{ baseURL },
  });

  serviceInstance.CancelToken = axios.CancelToken;
  serviceInstance.isCancel = axios.isCancel;

  serviceInstance.interceptors.request.use((config) => {
    const userObj = getUserData();
    const modifiedConfig = { ...config };
    if (userObj && userObj.token) {
      modifiedConfig.headers.Authorization = userObj.token;
      modifiedConfig.headers.dcid = getSavedUserDCId();
    }
    return modifiedConfig;
  });

  serviceInstance.interceptors.response.use(
    (response) => {
      if (response.headers.authorization) {
        const userObj = getUserData();
        saveUserData({ ...userObj, token: response.headers.authorization });
      }

      return response.data;
    },
    (error) => {
      if (serviceInstance.isCancel(error)) {
        return;
      }
      notifyUser(
        `${
          _get(error, 'response.data.message') ||
          _get(error, 'response.data.error') ||
          _get(error, 'message')
        }`,
        'error',
      );

      if (
        error.config.url !== 'login' &&
        error.response &&
        error.response.status === 401
      ) {
        removeUser();
        if (window.location.pathname !== RouteTransformer.getLoginPath()) {
          const path = getLogoutRedirectPath();
          window.location.href = path;
        }
        return;
      }
      throw error;
    },
  );
  return serviceInstance;
};

export const nonFruitService = getServiceInstance(`${API.nonFruit}/`);

export const supplyChainService = getServiceInstance(
  `${API.supplyChainService}/`,
);
