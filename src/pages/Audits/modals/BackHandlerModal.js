import { AppButton, CustomModal } from 'Components';
import { LibraryText } from 'vg-library/core';

import { AUDIT_STATUS } from '../constants';
import { useStyles } from '../styled';
import { disableDraftBtnWhenNoData } from '../utils';

const BackHandlerModal = ({
  openBackHandlerModal,
  setOpenBackHandlerModal,
  handleDiscardClick,
  handleSubmit,
  setSaveMethod,
  loading,
  values,
  rowImages,
  isViewDraftAudit = false,
}) => {
  const { footerContainer, draftButton } = useStyles();

  return (
    <CustomModal
      title="Cancel Audit"
      open={openBackHandlerModal}
      isCloseIcon
      onClose={() => setOpenBackHandlerModal(false)}
      styleItems={{ borderRadius: '1rem' }}
      footerComponent={
        <div className={footerContainer}>
          <AppButton
            variant="outlined"
            color="inherit"
            onClick={() => {
              setSaveMethod(AUDIT_STATUS.DRAFT);
              handleSubmit();
            }}
            size="medium"
            className={draftButton}
            disabled={disableDraftBtnWhenNoData(values, rowImages) || loading}
          >
            Save as draft
          </AppButton>
          <AppButton
            onClick={handleDiscardClick}
            size="medium"
            disabled={loading}
            color={isViewDraftAudit ? 'error' : 'primary'}
          >
            {isViewDraftAudit ? 'Delete' : 'Discard'}
          </AppButton>
        </div>
      }
    >
      <LibraryText>Are you sure you want to discard this audit?</LibraryText>
    </CustomModal>
  );
};

export default BackHandlerModal;
