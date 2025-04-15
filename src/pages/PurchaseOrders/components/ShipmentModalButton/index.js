import { useEffect, useState } from 'react';
import { AppButton } from 'Components';
import { getPurchaseOrderById } from 'Services/purchaseOrder';

import ShipmentAddEditModal from '../../ShipmentAddEditModal';

const ShipmentModalButton = ({ identifier, shipmentId, poId }) => {
  const [showModal, setShowModal] = useState(false);
  const [poData, setPOData] = useState({});

  useEffect(() => {
    getPurchaseOrderById(poId).then((res) => {
      setPOData(res);
    });
  }, [poId]);

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <>
      <AppButton variant="text" onClick={openModal}>
        {identifier}
      </AppButton>
      {showModal && (
        <ShipmentAddEditModal
          selectedShipment={{
            open: showModal,
            shipmentId,
            shipmentData: poData,
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ShipmentModalButton;
