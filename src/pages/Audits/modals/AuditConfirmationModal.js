import { Box } from '@mui/material';
import { AppButton, CustomModal } from 'Components';
import { FieldInput, FieldSelect } from 'Components/FormFields';
import { LibraryText } from 'vg-library/core';
import { validateRequired } from 'Utilities/formvalidation';

import { useStyles } from '../styled';

const AuditConfirmationModal = ({
  title,
  message,
  open,
  confirmBtnText,
  handleSubmit,
  loading,
  handleClose,
  remarks_key,
  approver_key,
  approvers,
}) => {
  const { footerContainer, flex2, paddingTop1 } = useStyles();

  return (
    <CustomModal
      title={title}
      open={open}
      isCloseIcon={false}
      onClose={handleClose}
      styleItems={{ borderRadius: '1rem' }}
      footerComponent={
        <div className={footerContainer}>
          <AppButton
            variant="outlined"
            color="inherit"
            onClick={handleClose}
            size="medium"
            disabled={loading}
            className={flex2}
          >
            Cancel
          </AppButton>
          <AppButton
            onClick={() => {
              handleSubmit();
            }}
            disabled={loading}
            size="medium"
            className={flex2}
          >
            {confirmBtnText}
          </AppButton>
        </div>
      }
    >
      <LibraryText color="grey">{message}</LibraryText>
      <Box className={paddingTop1}>
        <LibraryText variant="button" color="primary">
          Remarks
        </LibraryText>
        <FieldInput
          name={remarks_key}
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          sx={{ mt: 2 }}
        />
      </Box>
      {/* This condition has been written for Audit Creation modal only */}
      {Array.isArray(approvers) && approvers.length > 0 && (
      <Box className={paddingTop1}>
        <FieldSelect
          name={approver_key}
          label="Select Approver"
          options={approvers.map(approver => ({ text: approver.name, value: approver.id }))}
          size="small"
          fullWidth
          required
          validate={validateRequired}
        />
      </Box>
      )}
    </CustomModal>
  );
};

export default AuditConfirmationModal;