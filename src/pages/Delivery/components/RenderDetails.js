import { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { AppButton, ImageThumb } from 'Components';
import UploadInput from 'Components/FormFields/UploadInput';
import UploadBillModal from 'Pages/PurchaseOrders/PaymentRequestAddEdit/UploadBillModal';
import { validateFileUpload } from 'Utilities/formvalidation';

import { classes, ImageListWrapper } from '../styled';

export const RenderText = ({ data = {}, keys }) => {
  return (
    <>
      {keys.map(
        ([label, key, { callback, render, dependency = false } = {}]) => (
          <Grid container key={label} spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body1">{label}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              {dependency ? (
                render()
              ) : (
                <Typography variant="body1" data-cy="nfi.dcArrival.delivery">
                  : {callback && data[key] ? callback(data[key]) : data[key]}
                </Typography>
              )}
            </Grid>
          </Grid>
        ),
      )}
    </>
  );
};

export const RenderImagesToDelivery = ({
  values,
  imageKey,
  imageInputKey,
  setFieldValue,
  buttonTxt,
}) => {
  const { marginTop, fullWidth } = classes();

  const removeAttachments = (index, field, values, setFieldValue) => {
    const ImageArray = values[field];
    ImageArray.splice(index, 1);
    setFieldValue(field, ImageArray);
  };

  return (
    <Grid container direction="column" className={marginTop}>
      <Grid item>
        <UploadInput
          accept="image/*, application/pdf"
          name={imageInputKey}
          label={buttonTxt}
          validate={!values[imageKey]?.length && validateFileUpload}
          multiple
        />
      </Grid>
      <Grid container direction="row" justifyContent="start">
        {!!values[imageInputKey]?.length && (
          <Grid item direction="row" alignItems="center" className={fullWidth}>
            <ImageListWrapper>
              {values[imageInputKey].map((file, index) => (
                <ImageThumb
                  key={file.url}
                  file={file}
                  url={file.url}
                  removeAttachment={() =>
                    removeAttachments(
                      index,
                      imageInputKey,
                      values,
                      setFieldValue,
                    )
                  }
                />
              ))}
            </ImageListWrapper>
          </Grid>
        )}
        {!!values[imageKey]?.length && (
          <Grid item direction="row" alignItems="center" className={fullWidth}>
            <ImageListWrapper>
              {values[imageKey].map((file, index) => (
                <ImageThumb
                  key={file.url}
                  file={file}
                  url={file.url}
                  removeAttachment={() =>
                    removeAttachments(index, imageKey, values, setFieldValue)
                  }
                />
              ))}
            </ImageListWrapper>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export const RenderImagesPoDelivery = ({ values, setFieldValue }) => {
  const { marginTop } = classes();
  const [showUploadBillModal, setShowUploadBillModal] = useState(false);

  const toggleShowUploadBillModal = () => {
    setShowUploadBillModal(!showUploadBillModal);
  };
  return (
    <Grid container direction="column" spacing={1}>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="start"
      >
        <AppButton
          size="medium"
          className={marginTop}
          onClick={toggleShowUploadBillModal}
        >
          Upload bill
        </AppButton>
        <UploadBillModal
          open={!!showUploadBillModal}
          close={toggleShowUploadBillModal}
          setFieldValue={setFieldValue}
        />
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="start"
        className={marginTop}
      >
        {(!!values.bill || !!values.payment_request_bill) && (
          <ImageThumb
            url={values.bill?.url || ''}
            file={values.payment_request_bill?.[0] || ''}
            title={values.bill_number && `Bill.No.-${values.bill_number}`}
          />
        )}
      </Grid>
    </Grid>
  );
};
