import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getShipmentById } from 'Services/shipment';
import RouteTransformer from 'Routes/routeTransformer';

import TripsRegistration from '.';

const AddTripWithTransferOrder = () => {
  const [shipmentData, setShipmentData] = useState({});
  const { toId } = useParams();

  useEffect(() => {
    if (toId) {
      getShipmentById(toId, { nfi_trip: true }).then((res) => {
        const data = { [res.id]: res };
        setShipmentData(data);
      });
    }
  }, [toId]);

  if (!Object.keys(shipmentData).length) {
    return null;
  }
  return (
    <TripsRegistration
      toShipmentData={shipmentData}
      backHandlerLink={RouteTransformer.getTransferOrderListingLink()}
    />
  );
};

export default AddTripWithTransferOrder;
