import { useState } from 'react';
import { useParams } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import { Box, Grid, Typography } from '@mui/material';
import { AppButton, GridListView } from 'Components';
import { FieldArray, Formik } from 'formik';
import { updateDelivery } from 'Services/delivery';
import { updateLots } from 'Services/lots';
import { notifyUser } from 'Utilities';
import { STATUS_LIST } from 'Utilities/constants';
import { getFormattedDateTime } from 'Utilities/dateUtils';
import {
  getModifiedShipmentsLots,
  getShipmentsCreatedAt,
  getShipmentsSourceName,
} from 'Utilities/delivery';
import imageDirectUpload from 'Utilities/directUpload';
import { validateRequired } from 'Utilities/formvalidation';

import { LotsColumn } from './components/LotsColumn';
import { OTHER_CHARGES_COLUMNS } from './components/otherChargesColumns';
import {
  RenderImagesPoDelivery,
  RenderImagesToDelivery,
  RenderText,
} from './components/RenderDetails';
import { INITIAL_OTHER_CHARGES } from './constant';
import RecordArrivalPopUp from './RecordArrivalPopUp';
import { classes } from './styled';

const DeliveryDetails = ({ loadDelivery, data, backHandler = () => {} }) => {
  const { deliveryId } = useParams();
  const [isEditing, setIsEditing] = useState(false);

  const { RECEIVED } = STATUS_LIST;

  const { gapMarginTop, largeWidth, marginTop, padding, receivedDateWrapper } =
    classes();

  const delivery = data.find(({ id }) => id === +deliveryId) || {};
  const isPOShipment = delivery.has_po_shipment;
  const other_bill_charges_metadata =
    delivery.shipments?.[0]?.other_bill_charges_metadata;

  const submitHandler = async (values, { setSubmitting }) => {
    if (
      values.has_po_shipment &&
      !values.payment_request_bill?.length &&
      !values.bill
    ) {
      notifyUser('Please upload Bill', 'error');
      return;
    }
    const {
      non_fruit_lots,
      id,
      delivery_images_input,
      delivery_images,
      stn_input,
      stn,
      payment_request_bill,
      bill_number,
      other_bill_charges_metadata,
    } = values;
    setSubmitting(true);
    const postData = non_fruit_lots.reduce(
      (acc, { id, received_quantity = 0 }) => {
        if (received_quantity >= 0) {
          acc.push({
            id,
            current_quantity: +received_quantity,
            initial_quantity: +received_quantity,
          });
        }
        return acc;
      },
      [],
    );

    let billData = {};
    let delivery_img;
    let stn_img;
    if (payment_request_bill?.length) {
      const result = await imageDirectUpload(payment_request_bill[0]);
      billData = result.data || {};
    }

    if (delivery_images_input) {
      await Promise.all(
        delivery_images_input.map((value) => imageDirectUpload(value)),
      ).then((res) => {
        delivery_img = res.filter(Boolean).map(({ data }) => data.signed_id);
      });
    }

    if (stn_input) {
      await Promise.all(
        stn_input.map((value) => imageDirectUpload(value)),
      ).then((res) => {
        stn_img = res.filter(Boolean).map(({ data }) => data.signed_id);
      });
    }

    updateDelivery(
      {
        delivery: {
          status: RECEIVED.value,
          shipment: {
            delivery_images: delivery_img,
            delivery_images_remaining: delivery_images?.map((a) => a.id),
            stn: stn_img,
            stn_remaining: stn?.map((a) => a.id),
            bill: billData.signed_id,
            bill_number,
            other_bill_charges_metadata,
          },
        },
      },
      id,
    )
      .then(() => {
        updateLots({ lots: postData }).then(() => {
          notifyUser('Received quantity updated successfully.');
          loadDelivery();
          setIsEditing(false);
          backHandler();
        });
      })
      .finally(() => setSubmitting(false));
  };

  if (!Object.keys(delivery).length) {
    return null;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...delivery,
        non_fruit_lots: getModifiedShipmentsLots(delivery) || [],
        ...(isPOShipment
          ? {
              other_bill_charges_metadata: isEditing
                ? other_bill_charges_metadata || INITIAL_OTHER_CHARGES
                : other_bill_charges_metadata,
            }
          : {}),
      }}
      onSubmit={submitHandler}
    >
      {({ handleSubmit, handleReset, isSubmitting, values, setFieldValue }) => (
        <div className={padding}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="h5">{delivery.identifier}</Typography>
            <div>
              {!isEditing && (
                <RecordArrivalPopUp
                  loadDelivery={loadDelivery}
                  delivery={delivery}
                />
              )}
              {!isEditing && delivery.vehicle_arrival_time && (
                <AppButton
                  variant="contained"
                  className="margin-horizontal"
                  size="small"
                  onClick={() => setIsEditing(true)}
                >
                  {delivery.status === RECEIVED.value
                    ? 'Edit'
                    : 'Receive Materials'}
                </AppButton>
              )}
            </div>
          </Box>
          <RenderText
            data={delivery}
            keys={[
              ['TO', 'delivery_location'],
              ['Source', 'shipments', { callback: getShipmentsSourceName }],
              ['Created At', 'shipments', { callback: getShipmentsCreatedAt }],
              ...(delivery.status === RECEIVED.value
                ? [
                    [
                      'Received At',
                      'received_time',
                      { callback: getFormattedDateTime },
                    ],
                  ]
                : []),
            ]}
          />
          <div className={marginTop}>
            <FieldArray
              name="non_fruit_lots"
              render={() => {
                return (
                  <GridListView
                    isHeaderSticky
                    data={values.non_fruit_lots || []}
                    columns={LotsColumn}
                    cellProps={{ isEditing, values }}
                  />
                );
              }}
            />
            {values.other_bill_charges_metadata && (
              <FieldArray
                name="other_bill_charges_metadata"
                render={() => {
                  return (
                    <GridListView
                      data={values.other_bill_charges_metadata}
                      columns={OTHER_CHARGES_COLUMNS}
                      cellProps={{ isEditing, setFieldValue }}
                    />
                  );
                }}
              />
            )}
          </div>
          {isEditing && (
            <Grid container justifyContent="space-between">
              {values.has_po_shipment ? (
                <RenderImagesPoDelivery
                  values={values}
                  setFieldValue={setFieldValue}
                />
              ) : (
                <>
                  <RenderImagesToDelivery
                    values={values}
                    imageKey="delivery_images"
                    imageInputKey="delivery_images_input"
                    setFieldValue={setFieldValue}
                    buttonTxt="DELIVERY IMAGES"
                  />
                  <RenderImagesToDelivery
                    values={values}
                    imageKey="stn"
                    imageInputKey="stn_input"
                    setFieldValue={setFieldValue}
                    buttonTxt="UPLOAD STN"
                  />
                </>
              )}
              <Grid
                container
                justifyContent="flex-end"
                className={gapMarginTop}
              >
                <AppButton
                  variant="contained"
                  className="margin-horizontal"
                  size="small"
                  color="inherit"
                  onClick={() => {
                    handleReset();
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </AppButton>
                <AppButton
                  startIcon={<SaveIcon />}
                  variant="contained"
                  size="small"
                  color="primary"
                  loading={isSubmitting}
                  type="submit"
                  onClick={handleSubmit}
                >
                  Submit
                </AppButton>
              </Grid>
            </Grid>
          )}
        </div>
      )}
    </Formik>
  );
};

export default DeliveryDetails;
