import {
  getSavedPermissions,
  getSavedUserDCId,
  getUserData,
  getUserObj,
  removeUser,
  saveUserData,
  saveUserDCId,
  saveUserPermission,
} from '../localStorage';

describe('local storage functions', () => {
  const user = {
    id: 1,
    name: 'Gokul',
  };

  const userPermission = { read: true };
  const dcId = 99;

  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveUserData', () => {
    it('should save user data to userObj and localStorage', () => {
      saveUserData(user);
      expect(getUserObj().userObj).toEqual(user);

      const savedUser = JSON.parse(localStorage.getItem('user'));
      expect(savedUser).toEqual(user);
    });
  });

  describe('saveUserDCId', () => {
    it('should save data to local storage and userDcId', () => {
      saveUserDCId(dcId);

      expect(getUserObj().userDcId).toEqual(dcId);

      const savedDcId = JSON.parse(localStorage.getItem('dcid'));
      expect(savedDcId).toEqual(dcId);
    });
  });

  describe('saveUserPermission', () => {
    it('should save data to local storage and userPermission', () => {
      saveUserPermission(userPermission);

      expect(getUserObj().userPermission).toEqual(userPermission);

      const savedUserPermission = JSON.parse(
        localStorage.getItem('userpermission'),
      );

      expect(savedUserPermission).toEqual(userPermission);
    });
  });

  describe('removeUser', () => {
    beforeEach(() => {
      saveUserData(user);
      localStorage.setItem('userpermission', JSON.stringify(userPermission));
      localStorage.setItem('dcid', dcId);
    });

    it('should remove user data from localStorage and reset user-related variables', () => {
      expect(getUserData().userObj).not.toBeNull();
      expect(localStorage.getItem('user')).not.toBeNull();
      expect(localStorage.getItem('userpermission')).not.toBeNull();
      expect(localStorage.getItem('dcid')).not.toBeNull();

      removeUser();

      const { userObj, userDcId, userPermission } = getUserObj();

      expect(userObj).toBeNull();
      expect(userPermission).toBeNull();
      expect(userDcId).toBeNull();

      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('userpermission')).toBeNull();
      expect(localStorage.getItem('dcid')).toBeNull();
    });
  });

  describe('getUserData', () => {
    it('should return userObj if it is already set', () => {
      saveUserData(user);
      localStorage.removeItem('user');
      const res = getUserData();
      expect(res).toEqual(user);
    });

    it('should return null if userObj is not set and localStorage is empty', () => {
      removeUser();
      const res = getUserData();
      expect(res).toBeNull();
    });

    it('should return userObj from localStorage and set the userObj if it is not set', () => {
      localStorage.setItem('user', JSON.stringify(user));
      const res = getUserData();

      expect(res).toEqual(user);
      expect(getUserObj().userObj).toEqual(user);
    });
  });

  describe('getSavedPermissions', () => {
    it('should return userPermission if it is already set', () => {
      saveUserPermission(userPermission);
      localStorage.removeItem('userPermission');

      const res = getSavedPermissions();
      expect(res).toEqual(userPermission);
    });

    it('should return null if userPermission is not set and localStorage is empty', () => {
      removeUser();
      const res = getSavedPermissions();

      expect(res).toBeNull();
    });

    it('should return userPermission from localStorage and set the userPermission if it is not set', () => {
      localStorage.setItem('userpermission', JSON.stringify(userPermission));
      const res = getSavedPermissions();

      expect(res).toEqual(userPermission);
      expect(getUserObj().userPermission).toEqual(userPermission);
    });
  });

  describe('getSavedUserDCId', () => {
    it('should return userDcId if it is already set', () => {
      saveUserDCId(dcId);
      localStorage.removeItem('userDcId');

      const res = getSavedUserDCId();
      expect(res).toEqual(dcId);
    });

    it('should return null if userDcId is not set and localStorage is empty', () => {
      removeUser();
      const res = getSavedUserDCId();

      expect(res).toBeNull();
    });

    it('should return userDcId from localStorage and set the userDcId if it is not set', () => {
      localStorage.setItem('dcid', JSON.stringify(dcId));
      const res = getSavedUserDCId();

      expect(res).toEqual(`${dcId}`);
      expect(getUserObj().userDcId).toEqual(`${dcId}`);
    });
  });
});
