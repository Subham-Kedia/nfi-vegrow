import TABS from 'Routes/route';
import { getUserData } from 'Utilities/localStorage';

const USER_ACTIONS = ['read', 'create', 'manage'];

export const USER_PERMISSION = () => {
  const { permission_set = {} } = getUserData() || {};

  return TABS.filter((tab) => {
    if (!tab.resource?.length) return true;
    if (Object.keys(permission_set).includes('*')) return true;
    return tab.resource.every((resource) => {
      return (
        Object.keys(permission_set)?.some((allowed) => allowed === resource) &&
        USER_ACTIONS.some((action) =>
          permission_set[resource]?.includes(action),
        )
      );
    });
  });
};

export const GOOGLE_SSO = {
  CLIENTID:
    '178048511656-b30pu3sppgd1pchbfam73u39ftuiiuhh.apps.googleusercontent.com',
};
