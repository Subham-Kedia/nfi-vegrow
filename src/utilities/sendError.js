import { Notifier } from '@airbrake/browser';

import { getUserData } from './localStorage';

let airbrakeObj = null;

export const initializeService = () => {
  if (process.env.NODE_ENV === 'production') {
    airbrakeObj = new Notifier({
      projectId: 298512,
      projectKey: '52829f74f522281d0a8faf55b2a1cbd4',
      environment: process.env.NODE_ENV,
    });
  }
};

export const logError = (error, errorInfo) => {
  if (!airbrakeObj) {
    console.log('no error obj initialize');
    return false;
  }

  if (process.env.NODE_ENV === 'production') {
    airbrakeObj.notify({
      error,
      params: { info: errorInfo },
      session: { username: getUserData()?.username || '' },
    });
  }

  return true;
};

// exporting for unit test cases
export const clearAirbrakeObj = () => {
  airbrakeObj = null;
};

// exporting for unit test cases
export const getAirbrakeObj = () => airbrakeObj;
