import { useState } from 'react';
import { CheckCircleOutline } from '@mui/icons-material';
import { AppButton } from 'Components';
import ShipmentRecordModal from 'Components/Modal/ShipmentRecordModal';
import { updateDelivery } from 'Services/delivery';
import { notifyUser } from 'Utilities';
import { STATUS_LIST } from 'Utilities/constants';
import imageDirectUpload from 'Utilities/directUpload';

const RecordArrivalPopUp = ({ delivery, loadDelivery }) => {
  const [showRecordArrivalModal, setShowrecordArrivalModal] = useState(false);
  const isRecordArrivalCompleted = delivery.vehicle_arrival_time;

  const submitForm = async (values, { setSubmitting }) => {
    setSubmitting(true);

    if (values.arrival_truck_images_input) {
      await Promise.all(
        values.arrival_truck_images_input.map((value) =>
          imageDirectUpload(value),
        ),
      ).then((res) => {
        values.arrival_truck_images_input = res
          .filter(Boolean)
          .map(({ data }) => data.signed_id);
      });
    }

    if (values.arrival_truck_images) {
      values.arrival_truck_images_remaining = values.arrival_truck_images.map(
        (a) => a.id,
      );
    }

    updateDelivery(
      {
        delivery: {
          ...values,
          status: delivery.status || STATUS_LIST.PENDING.value,
        },
      },
      delivery.id,
    )
      .then(() => {
        notifyUser('Delivery Arrival updated successfully.');
        loadDelivery();
      })
      .finally(() => {
        setSubmitting(false);
        toggleRecordArrivalModal();
      });
  };

  const toggleRecordArrivalModal = () => {
    setShowrecordArrivalModal(!showRecordArrivalModal);
  };
  return (
    <>
      <AppButton
        className="margin-horizontal"
        onClick={toggleRecordArrivalModal}
        endIcon={isRecordArrivalCompleted && <CheckCircleOutline />}
      >
        Record Arrival
      </AppButton>
      <ShipmentRecordModal
        open={showRecordArrivalModal}
        close={toggleRecordArrivalModal}
        title="Record Arrival"
        datePickerLabel="Vechile Arrival Time"
        imageHeaderName="Arrival Truck Image"
        submitForm={submitForm}
        recordSubHeader="Arrival Details"
        buttonText="SAVE ARRIVAL DETAILS"
        recordTimeFieldName="vehicle_arrival_time"
        images={delivery.arrival_truck_images || []}
        shipmentImage="arrival_truck_images"
      />
    </>
  );
};

export default RecordArrivalPopUp;
