import { omit } from 'lodash';

import { TRIP_CATEGORY_TYPES } from './constants/trips';

// Rather than having a constant with 30 fields.
// Used a generator to generate all the options for Dropdown.
export const generateVehicleTonnageList = () => {
  const tonnage = [];
  for (let i = 1; i < 31; i += 1) {
    tonnage.push({ value: 1000 * i, text: `${i}T` });
  }
  return tonnage;
};

// generate Data to prefill the form while editing
export const generateTripsFormData = (data) => {
  const {
    id,
    trip_category: category,
    start_time: startTime,
    trip_metadata: tripData,
    pickup_order_shipment_ids: shipmentIds,
  } = data;

  const {
    partner,
    vehicle_details_json: { type, number },
    vehicle_tonnage_max: vehicleTonnage,
    driver_details_json: { name, phone },
    transportation_cost_in_rs: transportationCost,
  } = tripData[0];

  if (category === +TRIP_CATEGORY_TYPES.MONTHLY_VEHICLE.value) {
    return {
      category: `${category}`,
      shouldDisableCategory: !!startTime,
      vehicleNumber: number,
      shipmentIds,
      id,
      originalData: data,
    };
  }

  const formData = {
    category: `${category}`,
    shouldDisableCategory: !!startTime,
    vehicleTonnage,
    id,
    partner,
    vehicleType: type,
    vehicleNumber: number,
    driverName: name,
    driverPhone: phone,
    transportationCost,
    shipmentIds,
    originalData: data,
  };

  return formData;
};

// generate data to make the Shipment Cards while editing
export const getPreSelectedShiments = (shipments, ids) => {
  const preSelectedShipments = {};
  shipments.forEach((shipment) => {
    if (ids.includes(shipment.id)) preSelectedShipments[shipment.id] = shipment;
  });
  return preSelectedShipments;
};

// generate post call data of Add Trips while submitting
export const generateAddTripsPostData = (values, selectedShipments) => {
  const {
    category,
    transportationCost,
    vehicleTonnage,
    driverPhone,
    driverName,
    vehicleNumber,
    vehicleType,
    partner,
  } = values;

  const shipments = Object.values(selectedShipments);
  const shipmentIds = Object.keys(selectedShipments).map((id) => +id);

  if (category === TRIP_CATEGORY_TYPES.MONTHLY_VEHICLE.value) {
    return {
      trip: {
        source_type: 'Dc',
        destination_type: 'DC',
        trip_type: 1,
        trip_category: +category,
        shipments,
        delivery_order_shipment_ids: shipmentIds,
        pickup_order_shipment_ids: shipmentIds,
        trip_metadata: [
          {
            vehicle_details_json: { number: vehicleNumber },
          },
        ],
      },
    };
  }

  const vehicle_details_json = {
    type: vehicleType,
    number: vehicleNumber,
  };

  const driver_details_json = {
    name: driverName,
    phone: +driverPhone,
  };

  const trip_metadata = [
    {
      vehicle_tonnage_max: vehicleTonnage,
      transportation_cost_in_rs: +transportationCost,
      vehicle_details_json,
      driver_details_json,
      partner_id: partner.id,
      trip_order: 1,
    },
  ];

  return {
    trip: {
      source_type: 'Dc',
      destination_type: 'DC',
      trip_type: 1,
      trip_category: +category,
      trip_metadata,
      shipments,
      delivery_order_shipment_ids: shipmentIds,
      pickup_order_shipment_ids: shipmentIds,
    },
  };
};

// generate put call data of Add Trips while submitting
export const generateEditTripsData = (values, selectedShipments) => {
  const {
    originalData,
    category,
    transportationCost,
    vehicleTonnage,
    driverPhone,
    driverName,
    vehicleNumber,
    vehicleType,
    partner,
  } = values;

  const shipments = Object.values(selectedShipments);
  const shipmentIds = Object.keys(selectedShipments).map((id) => +id);

  if (category === TRIP_CATEGORY_TYPES.MONTHLY_VEHICLE.value) {
    return {
      trip: {
        ...originalData,
        source_type: 'Dc',
        destination_type: 'Dc',
        shipments,
        delivery_order_shipment_ids: shipmentIds,
        pickup_order_shipment_ids: shipmentIds,
        trip_category: +category,
        trip_metadata: [
          {
            ...originalData.trip_metadata[0],
            driver_details_json: {},
            vehicle_details_json: { number: vehicleNumber },
            partner_id: null,
            partner: null,
            vehicle_rc: null,
            driver_license: null,
            vehicle_tonnage_max: null,
            transportation_cost_in_rs: null,
          },
        ],
      },
    };
  }

  const vehicle_details_json = {
    type: vehicleType,
    number: vehicleNumber,
  };

  const driver_details_json = {
    name: driverName,
    phone: driverPhone,
  };

  const tripData = {
    vehicle_tonnage_max: vehicleTonnage,
    transportation_cost_in_rs: +transportationCost,
    vehicle_details_json,
    driver_details_json,
    partner_id: partner.id,
  };

  const omitKeys = ['driver_license', 'vehicle_rc'];
  const restTripMetaInfo = omit(originalData.trip_metadata[0], omitKeys);

  const trip_metadata = [{ ...restTripMetaInfo, ...tripData }];

  return {
    trip: {
      source_type: 'Dc',
      destination_type: 'Dc',
      ...originalData,
      trip_category: +category,
      delivery_order_shipment_ids: shipmentIds,
      pickup_order_shipment_ids: shipmentIds,
      trip_metadata,
      shipments,
    },
  };
};
