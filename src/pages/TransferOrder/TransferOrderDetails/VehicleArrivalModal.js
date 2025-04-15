import { useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AppButton from 'Components/AppButton';
import ShipmentRecordModal from 'Components/Modal/ShipmentRecordModal';
import { updatePickup } from 'Services/pickup';
import { notifyUser } from 'Utilities';
import imageDirectUpload from 'Utilities/directUpload';

import { classes } from './styled';

const VehicleArrivalModal = (props) => {
  const [showArrivalModal, setShowArrivalModal] = useState(false);
  const { colorBlack } = classes();

  const { pickup, reloadTO } = props;

  const isVehicleArrivalCompleted = pickup.vehicle_arrival_time;

  const toggleShowArrivalModal = () => {
    setShowArrivalModal(!showArrivalModal);
  };

  const submitForm = async (values, { setSubmitting }) => {
    // TODO: throttle for avoiding multiple submit
    setSubmitting(true);

    if (values?.arrival_truck_images_input) {
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

    if (values?.arrival_truck_images) {
      values.arrival_truck_images_remaining = values.arrival_truck_images.map(
        (a) => a.id,
      );
    }

    updatePickup(
      {
        pickup: values,
      },
      pickup.id,
    )
      .then(() => {
        notifyUser('Pickup updated successfully.');
        reloadTO();
      })
      .finally(() => {
        setSubmitting(false);
        toggleShowArrivalModal();
      });
  };

  return (
    <>
      <AppButton
        variant="outlined"
        size="small"
        color="primary"
        className={isVehicleArrivalCompleted ? colorBlack : ''}
        onClick={toggleShowArrivalModal}
        endIcon={
          isVehicleArrivalCompleted && (
            <CheckCircleOutlineIcon color="primary" />
          )
        }
      >
        {isVehicleArrivalCompleted ? 'Vehicle Arrived' : 'Vehicle Arrival'}
      </AppButton>
      <ShipmentRecordModal
        open={!!showArrivalModal}
        close={toggleShowArrivalModal}
        title="Vehicle Arrival"
        imageHeaderName="Arrival Truck Image"
        datePickerLabel="Vechile Arrival Time"
        shipmentImage="arrival_truck_images"
        images={pickup.arrival_truck_images || []}
        recordTimeFieldName="vehicle_arrival_time"
        time={pickup.vehicle_arrival_time}
        submitForm={submitForm}
      />
    </>
  );
};

export default VehicleArrivalModal;
