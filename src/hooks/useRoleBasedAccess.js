import { useSiteValue } from 'App/SiteContext';
import { ROLES } from 'Utilities/constants/index';

// if checkHasAccess -> true => useRoleBasedAccess will return true is the user has access
// if checkHasAccess -> false => useRoleBasedAccess will return true is the user does not have access

// useRoleBasedAccess() -> returns true if user doesnot have access based on the role
// useRoleBasedAccess({checkHasAccess: true}) -> returns true if user has Access based on the role

const useRoleBasedAccess = ({
  checkHasAccess = false,
  rolesList = [ROLES.LOGISTIC_MANAGER],
} = {}) => {
  const { userInfo: { roles = [] } = {} } = useSiteValue();

  const userHasAccess = rolesList.some((role) => roles.includes(role));

  return checkHasAccess ? userHasAccess : !userHasAccess;
};

export default useRoleBasedAccess;
