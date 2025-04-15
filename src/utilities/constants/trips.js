import { WIDTH_150, WIDTH_250 } from 'Pages/Trips/style';

export const TRACKING_STATUS = {
  DISABLED: 'disabled',
  CONSENT_PENDING: 'consent pending',
  TO_BE_STARTED: 'yet to despatched',
  ONGOING: 'ongoing',
  COMPLETED: 'ended',
};

export const TRIP_STATUS = [
  {
    id: 1,
    name: 'Not Started',
    value: 'not_dispatched',
  },
  {
    id: 2,
    name: 'Started',
    value: 'ongoing',
  },
  {
    id: 3,
    name: 'Ended',
    value: 'ended',
  },
];

export const TRIP_TRACKINGSTATUS = [
  { id: 1, name: 'Disabled', value: 'Disabled' },
  { id: 2, name: 'Consent Pending', value: 'Consent Pending' },
  { id: 3, name: 'Ongoing', value: 'Ongoing' },
  { id: 4, name: 'Enabled', value: 'Enabled' },
];

export const TRIP_WEIGHMENT_STATUS = [
  { id: 1, name: 'Only Source Weighment attached', value: 'Source_Weighment' },
  {
    id: 2,
    name: 'Only Destination Weighment attached',
    value: 'Destination_Weighment',
  },
  { id: 3, name: 'Both attached', value: 'Both' },
  { id: 4, name: 'None attached', value: 'None' },
];

export const TRIP_TYPE = {
  FRUIT_MOVEMENT: 1,
  MATERIAL_MOVEMEMT: 2,
};

export const TRIP_VARIANT = {
  PURCHASE_ORDER: 'PurchaseOrder',
  DC: 'Dc',
  LOCATION: 'Location',
};

export const TRIP_CATEGORY_TYPES = {
  FULL_LOAD: {
    id: 1,
    value: '1',
    label: 'Full Load',
    name: 'Full Load',
  },
  MONTHLY_VEHICLE: {
    id: 2,
    value: '2',
    label: 'Monthly Vehicle',
    name: 'Monthly Vehicle',
  },
};

export const SOURCE_TYPE = [
  { id: 1, name: 'Farm' },
  { id: 2, name: 'PH' },
  { id: 3, name: 'DC' },
  { id: 4, name: 'CS' },
  { id: 5, name: 'Direct Customer' },
];

export const DESTINATION_TYPE = [
  { id: 1, name: 'PH' },
  { id: 2, name: 'DC' },
  { id: 3, name: 'CS' },
  { id: 4, name: 'Direct Customer' },
];

export const INITIAL_FILTER_DATA = {
  tripId: '',
  vehicleNo: '',
  vendorsList: [],
  paymentType: null,
};

export const TRIPS_STATUS = {
  NOT_DISPATCHED: { label: 'NOT STARTED', value: 'not_dispatched' },
  ONGOING: { label: 'STARTED', value: 'ongoing' },
  ENDED: { label: 'ENDED', value: 'ended' },
};

export const PAYMENT_TYPE_OPTIONS = [
  { id: 'not_raised', label: 'Not Raised', value: 0 },
  { id: 'advance', label: 'Advance', value: 1 },
  { id: 'bill', label: 'Bill', value: 2 },
];

export const FILTER_OPTIONS = [
  {
    type: 'fieldInput',
    name: 'tripId',
    label: 'Trip ID',
    placeholder: 'Enter Trip ID',
    inputType: 'number',
    style: WIDTH_150,
  },
  {
    type: 'fieldInput',
    name: 'vehicleNo',
    label: 'Vehicle No/Mobile No',
    placeholder: 'Enter Vehicle No/Mobile No',
    inputType: 'text',
    style: WIDTH_250,
  },
  {
    type: 'fieldCombo',
    name: 'paymentType',
    label: 'Select Payment Type',
    placeholder: 'Select Payment Type',
    style: WIDTH_250,
    multiple: false,
    showCheckBox: false,
    options: PAYMENT_TYPE_OPTIONS,
    optionLabel: ({ label }) => `${label}`,
  },
];

export const VEHICLE_TYPE = [
  { value: 'Normal', text: 'Normal' },
  { value: 'Reefer', text: 'Reefer' },
  { value: 'Container', text: 'Container' },
];

export const DELIVERY_DETAILS_CARD = {
  SENDER: { HEADER: 'Trip Pickup Order', ADDRESS_KEY: 'sender_address' },
  RECIEVER: { HEADER: 'Trip Delivery Order', ADDRESS_KEY: 'recipient_address' },
};

export const PAGE_TITLE = 'Trip';
export const PAGINATION_LIMIT = 10;
export const SELECT_SHIPMENT_TITLE = 'Select Shipments';

export const ACCESS_RESTRICTION_MSSG = 'Your access is restricted in this page';
