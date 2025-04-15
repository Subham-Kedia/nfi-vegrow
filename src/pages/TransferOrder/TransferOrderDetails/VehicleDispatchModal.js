import { useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AppButton from 'Components/AppButton';
import ShipmentRecordModal from 'Components/Modal/ShipmentRecordModal';
import { updatePickup } from 'Services/pickup';
import { notifyUser } from 'Utilities';
import { TO_STATUS_LIST } from 'Utilities/constants';
import imageDirectUpload from 'Utilities/directUpload';

import { classes } from './styled';

const VehicleDispatchModal = (props) => {
  const [showDispatchModal, setShowDispatchModalModal] = useState(false);
  const { colorBlack } = classes();

  const { pickup, reloadTO, loadTransferOrders, setTab } = props;

  const toggleShowDispatchModal = () => {
    setShowDispatchModalModal(!showDispatchModal);
  };

  const isVehicleDispatchCompleted = pickup.vehicle_dispatch_time;

  const submitForm = async (values, { setSubmitting }) => {
    // TODO: throttle for avoiding multiple submit
    setSubmitting(true);

    if (values?.dispatch_truck_images_input) {
      await Promise.all(
        values.dispatch_truck_images_input.map((value) =>
          imageDirectUpload(value),
        ),
      ).then((res) => {
        values.dispatch_truck_images_input = res
          .filter(Boolean)
          .map(({ data }) => data.signed_id);
      });
    }

    if (values?.dispatch_truck_images) {
      values.dispatch_truck_images_remaining = values.dispatch_truck_images.map(
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
        setTab(TO_STATUS_LIST.DISPATCHED.value);
        loadTransferOrders({
          status: TO_STATUS_LIST.DISPATCHED.value,
        });
        reloadTO();
      })
      .finally(() => {
        setSubmitting(false);
        toggleShowDispatchModal();
      });
  };

  return (
    <>
      <AppButton
        variant="outlined"
        size="small"
        color="primary"
        className={isVehicleDispatchCompleted ? colorBlack : ''}
        onClick={toggleShowDispatchModal}
        endIcon={
          isVehicleDispatchCompleted && (
            <CheckCircleOutlineIcon color="primary" />
          )
        }
      >
        {isVehicleDispatchCompleted ? 'Vehicle Dispatched' : 'Vehicle Dispatch'}
      </AppButton>
      <ShipmentRecordModal
        open={!!showDispatchModal}
        close={toggleShowDispatchModal}
        title="Vehicle Dispatch"
        imageHeaderName="Dispatch Truck Image"
        datePickerLabel="Vechile Dispatch Time"
        shipmentImage="dispatch_truck_images"
        images={pickup.dispatch_truck_images || []}
        recordTimeFieldName="vehicle_dispatch_time"
        time={pickup.vehicle_dispatch_time}
        submitForm={submitForm}
      />
    </>
  );
};

export default VehicleDispatchModal;
