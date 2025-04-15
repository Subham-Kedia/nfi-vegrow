import DeleteIcon from '@mui/icons-material/Delete';

import AppButton from '../AppButton';

const DeleteButton = ({
  children,
  toggleConfirmDialog,
  isDelete,
  disabled,
  text,
  ...rest
}) => {
  if (isDelete && children) {
    return children;
  }

  return isDelete ? (
    <AppButton
      startIcon={<DeleteIcon />}
      onClick={() => toggleConfirmDialog()}
      disabled={disabled}
      {...rest}
    >
      {text || 'DELETE'}
    </AppButton>
  ) : null;
};

export default DeleteButton;
