import { useState } from 'react';
import { TextField } from '@mui/material';
import { AppButton, CustomModal } from 'Components';
import { useFormikContext } from 'formik';

import { FIELD_NAME } from '../constants';

const RemarksModal = ({ handleClose, open, row, isEditable }) => {
  const { setFieldValue, values } = useFormikContext();

  const { INVENTORY_AUDIT_ITEMS } = FIELD_NAME;
  const enteredVal = values[INVENTORY_AUDIT_ITEMS][row].remarks;

  const [remarks, setRemarks] = useState(enteredVal);

  const submitRemarks = () => {
    setFieldValue(`${INVENTORY_AUDIT_ITEMS}.${row}.remarks`, remarks);
    setRemarks('');
    handleClose();
  };

  const handleInputChange = (e) => {
    setRemarks(e.target.value);
  };

  return (
    <CustomModal
      open={open}
      title="Remarks"
      footerComponent={
        isEditable && <AppButton onClick={submitRemarks}>Submit</AppButton>
      }
      onClose={handleClose}
    >
      <TextField
        minRows={3}
        multiline
        value={remarks}
        placeholder={isEditable ? 'Add Remarks' : 'No Remarks Added'}
        onChange={handleInputChange}
        disabled={!isEditable}
      />
    </CustomModal>
  );
};

export default RemarksModal;
