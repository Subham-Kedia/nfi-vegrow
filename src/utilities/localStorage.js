let userObj = null;
let userPermission = null;
let userDcId = null;

export const saveUserData = (user) => {
  userObj = user;
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = () => {
  userObj = null;
  userPermission = null;
  userDcId = null;
  localStorage.removeItem('user');
  localStorage.removeItem('userpermission');
  localStorage.removeItem('dcid');
};

export const getUserData = () => {
  if (userObj) {
    return userObj;
  }

  userObj = JSON.parse(localStorage.getItem('user') || null);
  return userObj;
};

export const getSavedPermissions = () => {
  if (userPermission) {
    return userPermission;
  }

  userPermission = JSON.parse(localStorage.getItem('userpermission') || null);
  return userPermission;
};

export const saveUserPermission = (permission) => {
  userPermission = permission;
  localStorage.setItem('userpermission', JSON.stringify(permission));
};

export const getSavedUserDCId = () => {
  if (userDcId) {
    return userDcId;
  }

  userDcId = localStorage.getItem('dcid') || null;

  return userDcId;
};

export const saveUserDCId = (id) => {
  userDcId = id;
  localStorage.setItem('dcid', id);
};

// exporting for unit tests
export const getUserObj = () => {
  return { userObj, userPermission, userDcId };
};
