import { supplyChainService } from 'Services/base';

export const userLogin = (params) => {
  return supplyChainService.post('login', params);
};

export const googleLogin = (params) => {
  return supplyChainService.post('google_authorization', params);
};

export const userPermission = (params) => {
  const defaultParams = { all_dcs: 'true' };
  return supplyChainService.get('users/current_user_profile', {
    ...defaultParams,
    ...params,
  });
};

export const userLogout = (params) => {
  return supplyChainService.delete('logout', params);
};

export const getCustomers = (params) => {
  return supplyChainService.get('/customers.json', { params });
};

export const getSalesExecs = (params) => {
  return supplyChainService.get('/sales_execs.json', { params });
};

export const getLogisticsManagers = (params) => {
  return supplyChainService.get('/logistics_managers.json', { params });
};

export const getDcs = (params = {}) => {
  params = {
    ...params,
    include_satellite: true,
  };
  return supplyChainService.get('/dcs.json', { params });
};

export const getBillToLocations = (params) => {
  return supplyChainService.get('/nfi/billto_locations.json', { params });
};

export const getUserByRoles = (params) => {
  return supplyChainService.get('/nfi/users_by_role.json', { params });
};