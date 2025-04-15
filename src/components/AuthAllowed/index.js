import React from 'react';
import PropTypes from 'prop-types';

import { useSiteValue } from 'App/SiteContext';
import { checkPermissions } from 'Utilities';

const AuthAllowed = ({ children, resource, action, data, yes, no }) => {
  const { permissions } = useSiteValue();

  const { isAllowed, conditions } = checkPermissions({
    permissions,
    resource,
    action,
    data,
  });

  if (yes || no) {
    return (
      <>{isAllowed ? yes && yes({ conditions }) : no && no({ conditions })}</>
    );
  }

  return children({ isAllowed, conditions });
};

AuthAllowed.propTypes = {
  resource: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  yes: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
  no: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.string]),
};

export default AuthAllowed;
