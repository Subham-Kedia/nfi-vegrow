import AddIcon from '@mui/icons-material/Add';
import { getUserData } from 'Utilities/localStorage';

import AppButton from '../AppButton';

const DEFAULT_PROPS = {
  startIcon: <AddIcon />,
};

const CreateAllowed = ({
  children,
  resource,
  action = 'create',
  label,
  buttonProps,
}) => {
  const { permission_set = [] } = getUserData() || {};

  const canCreate =
    !!permission_set['*']?.includes(action) ||
    !!permission_set[resource]?.includes(action);

  if (children) {
    return children({ canCreate });
  }

  return (
    canCreate && (
      <AppButton {...DEFAULT_PROPS} {...buttonProps}>
        {label}
      </AppButton>
    )
  );
};

export default CreateAllowed;
