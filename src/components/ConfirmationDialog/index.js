import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import AppButton from '../AppButton';

const ConfirmationDialog = ({
  title,
  open,
  children,
  onCancel,
  onConfirm,
  confirmText = 'ok',
  cancelButtonColor = 'primary',
  autoFocus = true,
  disableBackdropClick = true,
}) => {
  const onClose = (event, reason) => {
    if (disableBackdropClick) {
      if (reason !== 'backdropClick') {
        onCancel(event, reason);
      }
    } else onCancel(event, reason);
  };

  return (
    <Dialog
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        <b>{title}</b>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        {onCancel && (
          <AppButton
            autoFocus={autoFocus}
            onClick={onCancel}
            color={cancelButtonColor}
            variant="text"
            size="medium"
          >
            Cancel
          </AppButton>
        )}
        <AppButton onClick={onConfirm} variant="text" size="medium">
          {confirmText}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmationDialog;
