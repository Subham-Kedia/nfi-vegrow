import { AppButton, CustomModal } from 'Components';
import { PO_STATUS } from 'Utilities/constants';
import { LibraryText } from 'vg-library/core';

import { styles } from '../styled';

const BackHandlerModal = ({
  openBackHandlerModal,
  setOpenBackHandlerModal,
  handleDiscardClick,
  handleSubmit,
  setSaveMethodStatus,
  isSubmitting,
}) => {
  const { footerContainer, draftButton, borderRadius } = styles();

  return (
    <CustomModal
      title="Warning!"
      open={openBackHandlerModal}
      isCloseIcon
      onClose={() => setOpenBackHandlerModal(false)}
      styleItems={borderRadius}
      footerComponent={
        <div className={footerContainer}>
          <AppButton
            variant="outlined"
            color="inherit"
            onClick={() => {
              setSaveMethodStatus(PO_STATUS.DRAFT.value);
              handleSubmit();
            }}
            data-cy="nfi.poDraft.save"
            size="medium"
            className={draftButton}
            disabled={isSubmitting}
          >
            Save as draft
          </AppButton>
          <AppButton
            onClick={handleDiscardClick}
            size="medium"
            color="error"
            data-cy="nfi.poDraft.discard"
            disabled={isSubmitting}
          >
            Discard
          </AppButton>
        </div>
      }
    >
      <LibraryText>
        Are you sure you want to cancel? Changes will be lost.
      </LibraryText>
    </CustomModal>
  );
};

export default BackHandlerModal;
