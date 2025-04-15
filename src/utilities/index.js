import { enqueueSnackbar } from 'notistack';
import RouteTransformer from 'Routes/routeTransformer';

/*
 * get image local path
 */
export const getImageLocalPath = (file) => {
  return (window.URL || window.webkitURL).createObjectURL(file);
};

/*
 * formik validation function merging
 */
export const mergeValidator = (...validator) => {
  return (value) => {
    for (let i = 0; i < validator.length; i += 1) {
      const res = validator[i](value);
      if (res) {
        return res;
      }
    }
    return null;
  };
};

export const processPermission = (permissions) => {
  const formattedPermissions = {};
  permissions.forEach((obj) => {
    // const isAll = (obj.access || []).find((o) => o.action === '*');
    // eslint-disable-next-line prefer-destructuring
    formattedPermissions[obj.resource] = (obj.access || []).map(
      (a) => a[0] || a,
    );
  });
  return formattedPermissions;
};

export const checkForCondition = (conditionKeys, conditions, data) => {
  conditionKeys.some((key) => {
    if (data[key] === conditions[key]) {
      if (Object.keys(conditions[key]).length > 0) {
        return checkForCondition(
          Object.keys(conditions[key]),
          conditions[key],
          data[key],
        );
      }
      return true;
    }
    return false;
  });
};

export const checkPermissions = ({ permissions, resource, action, data }) => {
  if (!permissions) {
    return false;
  }
  let isAllowed = false;
  const permissionObj = permissions['*']
    ? permissions['*']
    : permissions[resource];

  const isAllActionObj = permissionObj.find((o) => o.action === '*');
  const actionObj =
    isAllActionObj || permissionObj.find((p) => p.action === action);
  isAllowed = !!actionObj;

  if (actionObj?.conditions && data) {
    const conditionKeys = Object.keys(actionObj.conditions);
    if (conditionKeys.length > 0) {
      isAllowed = checkForCondition(conditionKeys, actionObj.conditions, data);
    }
  }
  return { isAllowed, conditions: actionObj?.conditions || null };
};

export const priceFormat = (x) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const toFixedNumber = (num = 0, digit = 4) => {
  // Added this line to fix javascript calculation issue
  return +Number(num).toFixed(digit);
};
export const saveAttachments = (bill, bill_number, id, callback) => {
  const fd = new FormData();
  let isUpload = false;
  if (bill?.length > 0) {
    bill?.forEach((obj) => {
      fd.append('payment_request[bill]', obj);
      if (bill_number) fd.append('payment_request[bill_number]', bill_number);
    });
    isUpload = true;
  }

  if (isUpload) {
    return callback(fd, id);
  }

  return Promise.resolve();
};

export const notifyUser = (message, variant = 'success', options = {}) => {
  enqueueSnackbar(message, { variant, ...options });
};

export const serialize = (obj, prefix) => {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? `${prefix}[${p}]` : p;
      const v = obj[p];
      str.push(
        v !== null && typeof v === 'object'
          ? serialize(v, k)
          : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`,
      );
    }
  }
  return str.join('&');
};

export const getLoginRedirectPath = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get('from') || '/app';
};

export const getLogoutRedirectPath = () => {
  const { pathname, search } = window.location;

  return pathname === RouteTransformer.getLoginPath()
    ? pathname
    : `${RouteTransformer.getLoginPath()}?from=${encodeURIComponent(`${pathname}${search}`)}`;
};
