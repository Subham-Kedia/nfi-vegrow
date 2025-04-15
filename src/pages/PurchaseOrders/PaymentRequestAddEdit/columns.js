import Text from 'Components/Text';
import { toFixedNumber } from 'Utilities';
import { GST_LIST, OTHER_CHARGES_LABEL } from 'Utilities/constants';

export const OTHER_CHARGES_COLUMNS = [
  {
    header: {
      label: 'Other Charges',
    },
    props: { md: 3, xs: 12 },
    render: ({ charge_type = '' }) => (
      <Text variant="body1" p={1}>
        {OTHER_CHARGES_LABEL[charge_type]}
      </Text>
    ),
  },
  {
    header: {
      label: 'Taxable Amount',
    },
    props: { md: 3, xs: 12 },
    render: ({ taxable_amount }) => (
      <Text variant="body1" p={1}>
        {taxable_amount}
      </Text>
    ),
  },
  {
    header: {
      label: 'GST%',
    },
    key: 'gst',
    props: { md: 2, xs: 12 },
    render: ({ gst = '' }) => (
      <Text variant="body1" p={1}>
        {GST_LIST.find(({ value }) => value === gst)?.text}
      </Text>
    ),
  },
  {
    header: {
      label: 'Total Amount',
    },
    props: { md: 2, xs: 12 },
    render: ({ taxable_amount, gst }) => (
      <Text variant="body1" p={1}>
        {toFixedNumber(
          taxable_amount + (taxable_amount * (gst >= 0 ? gst : 0)) / 100,
          4,
        )}
      </Text>
    ),
    style: {
      display: 'flex',
      height: '100%',
      alignItems: 'center',
    },
  },
];

export const SHIPMENT_COLUMNS = [
  {
    header: {
      label: 'S.No',
      style: { minHeight: '20px' },
    },
    key: 'index',
    props: { md: 1, xs: 12 },
    render: (_data, _cellData, { rowIndex = 0 }) => `${rowIndex + 1}.`,
  },
  {
    header: {
      label: 'Item ID',
    },
    key: 'itemId',
    props: { md: 1, xs: 12 },
    render: ({ packaging_item: { item_code = '' } = {} }) => item_code || '',
  },
  {
    header: {
      label: 'UoM',
    },
    key: 'uom',
    props: { md: 1, xs: 12 },
    render: ({ purchase_item: { uom_name } = {} }) => uom_name,
  },
  {
    header: {
      label: 'Received Quantity',
    },
    key: 'uom',
    props: { md: 1, xs: 12 },
    render: ({ quantity = '' }) => quantity || '',
  },
  {
    header: {
      label: 'Rate/UoM',
    },
    key: 'ratePerUom',
    props: { md: 1, xs: 12 },
    render: ({ rate_per_unit = '' }) => rate_per_unit || '',
  },
  {
    header: {
      label: 'Taxable Amount',
    },
    key: 'taxableAmount',
    props: { md: 1, xs: 12 },
    render: ({ taxable_amount = '' }) => taxable_amount || '',
  },
  {
    header: {
      label: 'GST%',
    },
    props: { md: 1, xs: 12 },
    render: ({ gst }) => (
      <Text>{GST_LIST.find(({ value }) => value === gst)?.text}</Text>
    ),
  },
  {
    header: {
      label: 'Total Amount',
    },
    props: { md: 1, xs: 12 },
    render: ({ taxable_amount, gst }) => {
      const gstPercent = +gst >= 0 ? +gst : 0;
      return (
        <Text>{toFixedNumber(+taxable_amount * (1 + gstPercent / 100))}</Text>
      );
    },
  },
];

export const SERVICE_PO_DETAILS_COLUMN = [
  {
    header: {
      label: 'S.No',
      style: { minHeight: '20px' },
    },
    key: 'index',
    props: { md: 1, xs: 12 },
    render: (_, _$, { rowIndex }) => `${rowIndex + 1}.`,
  },
  {
    header: {
      label: 'Service Name',
    },
    key: 'service_name',
    props: { md: 1, xs: 12 },
    render: ({ service_type }) => service_type.name,
  },
  {
    header: {
      label: 'UoM',
    },
    key: 'uom',
    props: { md: 1, xs: 12 },
    render: ({ service_type }) => service_type.unit_of_measurement,
  },
  {
    header: {
      label: 'Received Quantity',
    },
    key: 'quantity',
    props: { md: 1, xs: 12 },
    render: ({ quantity }) => quantity,
  },
  {
    header: {
      label: 'Rate/UoM',
    },
    key: 'rate_conversion',
    props: { md: 1, xs: 12 },
    render: ({ rate_conversion }) => rate_conversion,
  },
  {
    header: {
      label: 'Taxable Amount',
    },
    key: 'agreed_value',
    props: { md: 1, xs: 12 },
    render: ({ agreed_value }) => agreed_value,
  },
  {
    header: {
      label: 'GST%',
    },
    props: { md: 1, xs: 12 },
    render: ({ gst }) => (
      <Text>{GST_LIST.find(({ value }) => value === gst)?.text}</Text>
    ),
  },
  {
    header: {
      label: 'Total Amount',
    },
    key: 'total_amount',
    props: { md: 1, xs: 12 },
    render: ({ agreed_value, gst }) => {
      const gstPercent = +gst >= 0 ? +gst : 0;
      return (
        <Text>{toFixedNumber(+agreed_value * (1 + gstPercent / 100))}</Text>
      );
    },
  },
];
