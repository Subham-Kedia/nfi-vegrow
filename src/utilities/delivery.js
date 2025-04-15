import { getFormattedDateTime } from './dateUtils';

export const getModifiedShipmentsLots = (delivery) => {
  const lots = [];
  const { shipments = [] } = delivery || {};

  shipments.forEach((shipment) => {
    shipment.non_fruit_lots.forEach((lot) => {
      let parentLot = null;
      if (shipment.non_fruit_dc_lots.length) {
        parentLot = shipment.non_fruit_dc_lots.find(
          (dcLot) => dcLot.parent_id === lot.id,
        );
      }

      const lotData = {
        id: parentLot ? parentLot.id : null,
        current_quantity: lot.current_quantity,
        item_code: lot.packaging_item.item_code,
        item_name: lot.packaging_item.item_name,
        uom_name: lot.purchase_item?.uom_name || '',
        shipment_identifier: shipment.identifier,
      };

      if (parentLot?.unloaded_quantity) {
        lotData.received_quantity = parentLot.unloaded_quantity;
      }

      lots.push(lotData);
    });
  });
  return lots;
};

export const getShipmentsSourceName = (shipments) => {
  const senderNames = shipments.map((shipment) => shipment.sender_name);
  return senderNames.join(', ');
};

export const getShipmentsCreatedAt = (shipments) => {
  const shipmentsCreatedAt = shipments.map((shipment) =>
    getFormattedDateTime(shipment.created_at),
  );
  return shipmentsCreatedAt.join(', ');
};
