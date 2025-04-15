import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { DialogContentText } from '@mui/material';
import PropTypes from 'prop-types';

import AppButton from '../AppButton';
import ConfirmationDialog from '../ConfirmationDialog';

const DeleteButtonWithModal = ({
  buttonText,
  confirmationTitle,
  confirmationText,
  onDelete,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const closeDialog = () => setOpen(false);

  const handleConfirm = () => {
    onDelete(closeDialog);
  };

  return (
    <>
      <AppButton
        variant="text"
        size="medium"
        startIcon={<DeleteIcon />}
        onClick={() => setOpen(true)}
        {...props}
      >
        {buttonText}
      </AppButton>
      <ConfirmationDialog
        open={open}
        title={confirmationTitle}
        onConfirm={handleConfirm}
        onCancel={closeDialog}
      >
        <DialogContentText>{confirmationText}</DialogContentText>
      </ConfirmationDialog>
    </>
  );
};

DeleteButtonWithModal.defaultProps = {
  buttonText: 'Delete',
};

DeleteButtonWithModal.propTypes = {
  buttonText: PropTypes.string,
  confirmationTitle: PropTypes.string.isRequired,
  confirmationText: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteButtonWithModal;
