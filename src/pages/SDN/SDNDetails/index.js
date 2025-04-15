import { useState } from 'react';
import { Save } from '@mui/icons-material';
import { Box, Grid, Stack } from '@mui/material';
import { AppButton, AppLoader, GridListView, ImageThumb } from 'Components';
import { UploadInput } from 'Components/FormFields';
import { Formik } from 'formik';
import UploadBillModal from 'Pages/PurchaseOrders/PaymentRequestAddEdit/UploadBillModal';
import { notifyUser } from 'Utilities';
import { getFormattedDateTime } from 'Utilities/dateUtils';
import imageDirectUpload from 'Utilities/directUpload';
import { LibraryText } from 'vg-library/core';

import { REMARKS_COLUMN, SERVICE_ACK_COLUMNS } from '../columns/ServiceColumns';
import { SDN_STATUS } from '../const';
import SDNService from '../service';
import { ImageWrapper } from '../style';

import NoData from './NoData';

const SDNDetails = ({ selectedService, status, onSubmit }) => {
  const [openBillModal, setOpenBillModal] = useState(false);
  const [loading, setLoading] = useState(false);
  if (!selectedService.id) return <NoData />;

  const {
    remarks,
    purchase_order,
    acknowledgment_docs,
    id: ackId,
    completed_at,
    bill,
  } = selectedService;

  const payment_request_bill = bill ? [bill] : [];

  const isReadOnly = status === SDN_STATUS.RECEIVED.value;

  const {
    id,
    partner: { name: partnerName },
    delivery_dc: { name: dcName },
    created_date,
    purchase_items,
  } = purchase_order;

  const config = [
    { label: 'To', value: dcName },
    { label: 'Vendor Name', value: `PO-${id}/${partnerName}` },
    {
      label: 'Created At',
      value: getFormattedDateTime(new Date(created_date)),
    },
    {
      ...(status === SDN_STATUS.RECEIVED.value
        ? {
            label: 'Received At',
            value: getFormattedDateTime(new Date(completed_at)),
          }
        : {}),
    },
  ];

  const headerInfo = config.map(({ label, value }) => {
    if (!label) return null;
    return (
      <Grid container key={label}>
        <Grid item xs={12} md={4}>
          {label}
        </Grid>
        <Grid item xs={12} md={8}>
          :{value}
        </Grid>
      </Grid>
    );
  });

  const submitForm = async (values) => {
    try {
      setLoading(true);
      const { acknowledgment_docs, payment_request_bill, bill_number } = values;

      if (!acknowledgment_docs.length) {
        notifyUser('Please upload the necessary documents', 'error');
        return;
      }

      if (!payment_request_bill.length) {
        notifyUser('Please upload the bill', 'error');
        return;
      }

      const blobs = await Promise.all([
        ...acknowledgment_docs.map((doc) => imageDirectUpload(doc)),
        ...payment_request_bill.map((bill) => imageDirectUpload(bill)),
      ]);

      const acknowledgementBlobs = blobs
        .slice(0, acknowledgment_docs.length)
        .map(({ data }) => data.signed_id);

      const billBlobs = blobs
        .slice(acknowledgment_docs.length)
        .map(({ data }) => data.signed_id);

      SDNService.updateSDNAck(ackId, {
        acknowledgment_note: {
          acknowledgment_docs: acknowledgementBlobs,
          remarks: values.remarks,
          bill_number,
          bill: billBlobs[0],
        },
      }).then(() => {
        onSubmit();
        notifyUser('Entry Received Successfully');
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAttachment = (values, setFieldValue, index) => {
    const imgArray = values.acknowledgment_docs;
    imgArray.splice(index, 1);
    setFieldValue('acknowledgment_docs', imgArray);
  };

  const toggleBillModal = () => {
    setOpenBillModal(!openBillModal);
  };

  return (
    <Stack pl="1rem" pt="0.5rem" className="height100">
      <header>
        <LibraryText component="h5" variant="h5">
          PO-{id}/{partnerName}
        </LibraryText>
        {headerInfo}
      </header>
      <Formik
        initialValues={{
          purchase_items,
          remarks,
          acknowledgment_docs,
          payment_request_bill,
        }}
        onSubmit={submitForm}
        enableReinitialize
      >
        {({ handleSubmit, values, setFieldValue }) => {
          return (
            <Stack className="height100">
              {loading && <AppLoader />}
              {!loading && (
                <>
                  <main className="margin-top">
                    <Box mt="2rem">
                      <GridListView
                        data={purchase_items}
                        columns={SERVICE_ACK_COLUMNS}
                        cellProps={{ disabled: isReadOnly }}
                      />
                      <GridListView
                        data={[selectedService]}
                        columns={REMARKS_COLUMN}
                        cellProps={{ disabled: isReadOnly }}
                      />
                    </Box>
                  </main>
                  <footer>
                    <Stack mt="1rem">
                      <UploadInput
                        accept="image/*, application/pdf"
                        name="acknowledgment_docs"
                        label="Upload Images"
                        multiple
                        disabled={isReadOnly}
                      />
                      <ImageWrapper>
                        {values.acknowledgment_docs?.map((doc, index) => {
                          return (
                            <ImageThumb
                              key={doc.url || doc}
                              file={doc}
                              url={doc.url}
                              style={{ height: '2rem', width: '2rem' }}
                              removeAttachment={
                                isReadOnly
                                  ? null
                                  : () =>
                                      handleRemoveAttachment(
                                        values,
                                        setFieldValue,
                                        index,
                                      )
                              }
                            />
                          );
                        })}
                      </ImageWrapper>
                      <AppButton
                        onClick={toggleBillModal}
                        disabled={isReadOnly}
                      >
                        Upload Bill
                      </AppButton>
                      <ImageWrapper>
                        {values.payment_request_bill?.map((doc) => {
                          return (
                            <ImageThumb
                              key={doc.url || doc}
                              file={doc}
                              url={doc.url}
                              style={{ height: '2rem', width: '2rem' }}
                            />
                          );
                        })}
                      </ImageWrapper>
                      {openBillModal && (
                        <UploadBillModal
                          open={openBillModal}
                          close={toggleBillModal}
                          setFieldValue={setFieldValue}
                        />
                      )}
                      {!isReadOnly && (
                        <Grid container justifyContent="flex-end" my="2rem">
                          <AppButton
                            startIcon={<Save />}
                            onClick={handleSubmit}
                          >
                            Submit
                          </AppButton>
                        </Grid>
                      )}
                    </Stack>
                  </footer>
                </>
              )}
            </Stack>
          );
        }}
      </Formik>
    </Stack>
  );
};

export default SDNDetails;
