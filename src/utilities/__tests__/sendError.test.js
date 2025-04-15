import { Notifier } from '@airbrake/browser';

import { getUserData } from '../localStorage';
import {
  clearAirbrakeObj,
  getAirbrakeObj,
  initializeService,
  logError,
} from '../sendError';

jest.mock('@airbrake/browser', () => ({
  Notifier: jest.fn(() => ({
    notify: jest.fn(),
  })),
}));

jest.mock('../localStorage', () => ({
  getUserData: jest.fn(),
}));

describe('send error tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development';
    clearAirbrakeObj();
  });

  describe('initializeService', () => {
    it('should initialize airbrakeObj in production environment', () => {
      process.env.NODE_ENV = 'production';

      initializeService();

      expect(Notifier).toHaveBeenCalledWith({
        projectId: 298512,
        projectKey: '52829f74f522281d0a8faf55b2a1cbd4',
        environment: 'production',
      });
    });

    it('should not initialize airbrakeObj in non-production environments', () => {
      initializeService();

      expect(Notifier).not.toHaveBeenCalled();
    });

    it('should not initialize airbrakeObj when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV;

      initializeService();

      expect(Notifier).not.toHaveBeenCalled();
    });
  });

  describe('logError', () => {
    beforeEach(() => {
      console.log = jest.fn();
      process.env.NODE_ENV = 'production';
    });

    it('should log a message and return false if airbrakeObj is not initialized', () => {
      const result = logError(new Error('Test error'), {
        info: 'Some error info',
      });

      expect(console.log).toHaveBeenCalledWith('no error obj initialize');
      expect(result).toBe(false);
    });

    it('should call airbrakeObj.notify in production environment when airbrakeObj is initialized', () => {
      initializeService();
      getUserData.mockReturnValue({ username: 'testUser' });

      const error = new Error('Test error');
      const errorInfo = { info: 'Some error info' };
      const result = logError(error, errorInfo);

      const airbrakeInstance = getAirbrakeObj();

      expect(jest.isMockFunction(airbrakeInstance.notify)).toBe(true);

      expect(airbrakeInstance.notify).toHaveBeenCalledWith({
        error,
        params: { info: errorInfo },
        session: { username: 'testUser' },
      });

      expect(result).toBe(true);
    });
  });
});
