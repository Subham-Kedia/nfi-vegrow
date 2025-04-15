import React, { useState } from 'react';
import CustomModal from 'Components/Modal';

import AppButton from '../AppButton';

const FormPopUp = (props) => {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };
  return (
    <>
      <AppButton
        size="medium"
        fullWidth
        style={{ margin: '8px 0' }}
        onClick={openModal}
      >
        {props.buttonName}
      </AppButton>
      <CustomModal
        isLoading={false}
        title={props.title}
        open={open}
        onClose={() => closeModal()}
        halfScreen
      >
        {React.cloneElement(props.children, { closeModal })}
      </CustomModal>
    </>
  );
};

export default FormPopUp;
