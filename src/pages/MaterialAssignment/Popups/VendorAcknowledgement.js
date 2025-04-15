import { useRef } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { AppButton, ImageThumb, Text } from 'Components';
import UploadInput from 'Components/FormFields/UploadInput';
import CustomModal from 'Components/Modal';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

import {
  BoldText,
  ButtonWrapper,
  DocumentContainer,
  StyledGrid,
  styles,
} from './style';

const AcknowledgementContent = () => {
  const { marginBottom } = styles();
  return (
    <Text className={marginBottom}>
      After the Vendor's signed copy is uploaded and saved. You will not be able
      to edit this material assignment. Want to continue and save?
    </Text>
  );
};

const CloseMaContent = ({ vendor }) => {
  const { gapAcknowledgementWrapper } = styles();
  return (
    <main>
      <section>
        <BoldText>Vendor Name:</BoldText>
        <Text>{vendor}</Text>
      </section>
      <section className={gapAcknowledgementWrapper}>
        <Text>
          Please upload the gap acknowledgement signed by the vendor to close
          the MA
        </Text>
        <BoldText>
          Note: Once Saved, no further receivings can be made for this MA.
        </BoldText>
        <BoldText>Upload Gap Acknowledgement*</BoldText>
      </section>
    </main>
  );
};

const VendorAcknowledgement = ({
  open,
  onClose,
  handleSubmit,
  field,
  data,
}) => {
  const isLoadingRef = useRef(false);
  const removeAttachments = (index, field, values, setFieldValue) => {
    const vendorAcknowledgementReceipts = values[field];
    vendorAcknowledgementReceipts.splice(index, 1);
    setFieldValue(field, vendorAcknowledgementReceipts);
  };

  const { identifier, name } = data;

  const title = identifier
    ? `Close MA : ${identifier}`
    : `Upload Vendor's Signed Copy`;

  const content = identifier ? (
    <CloseMaContent vendor={name} />
  ) : (
    <AcknowledgementContent />
  );

  return (
    <CustomModal open={open} onClose={onClose} title={title}>
      <Formik
        initialValues={{ [field]: [] }}
        onSubmit={(file) => handleSubmit(file)}
      >
        {({ isSubmitting, handleSubmit, values, setFieldValue }) => {
          const isLoading = isSubmitting;

          if (isLoading !== isLoadingRef.current) {
            if (isLoading) isLoadingRef.current = isLoading;
            else setTimeout(() => (isLoadingRef.current = isLoading), 100);
          }

          return (
            <>
              <DocumentContainer>
                {content}
                <UploadInput
                  accept="image/*,application/pdf"
                  name={field}
                  label="UPLOAD"
                  multiple={false}
                />
                <StyledGrid container>
                  {values[field].map((file, index) => (
                    <ImageThumb
                      key={file.url}
                      file={file}
                      url={file.url}
                      removeAttachment={() =>
                        removeAttachments(index, field, values, setFieldValue)
                      }
                    />
                  ))}
                </StyledGrid>
              </DocumentContainer>
              <ButtonWrapper>
                <AppButton
                  startIcon={<SaveIcon />}
                  loading={isLoadingRef.current}
                  onClick={(values) => handleSubmit(values[field])}
                >
                  Save
                </AppButton>
              </ButtonWrapper>
            </>
          );
        }}
      </Formik>
    </CustomModal>
  );
};

VendorAcknowledgement.propTypes = {
  open: PropTypes.bool,
  field: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};

VendorAcknowledgement.defaultProps = {
  open: false,
  data: {},
};

export default VendorAcknowledgement;
