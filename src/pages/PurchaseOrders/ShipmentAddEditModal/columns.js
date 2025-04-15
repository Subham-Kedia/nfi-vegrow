import { FieldInput } from 'Components/FormFields';
import { mergeValidator } from 'Utilities';
import { validateMinEqual, validateRequired } from 'Utilities/formvalidation';

import { checkShipmentCondition } from '../utils';

export const SHIPMENT_COLUMNS = [
  {
    header: {
      label: 'S.No',
    },
    key: 'index',
    props: { md: 0.5, xs: 12 },
    render: (_data, _cellData, { rowIndex = 0 }) => `${rowIndex + 1}.`,
    style: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  {
    header: {
      label: 'Item ID',
    },
    key: 'item_name',
    props: { md: 2.5, xs: 12 },
    render: (data) => data?.packaging_item?.item_code || '',
  },
  {
    header: {
      label: 'Item Name',
    },
    key: 'item_name',
    props: { md: 1.5, xs: 12 },
    render: (data) => data?.packaging_item?.item_name || '',
  },
  {
    header: {
      label: 'Item Description',
    },
    key: 'item_name',
    props: { md: 1.5, xs: 12 },
    render: (data) => data?.packaging_item?.description || '',
  },
  {
    key: 'uom_name',
    header: {
      label: 'UoM',
    },
    props: { md: 1, xs: 12 },
  },
  {
    key: 'conversion_rate',
    header: {
      label: 'Conversion Rate',
    },
    props: { md: 2, xs: 12 },
  },
  {
    key: 'quantity_conversion',
    header: {
      label: 'Quantity',
    },
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'Transfer Quantity',
    },
    key: '',
    props: { md: 2, xs: 12 },
    render: (
      _data,
      { selectedShipment = {}, isPOClosed },
      { rowIndex = 0 },
    ) => (
      <FieldInput
        name={`non_fruit_shipment_items.${rowIndex}.quantity`}
        type="number"
        size="small"
        required
        validate={mergeValidator(validateRequired, validateMinEqual(0))}
        disabled={checkShipmentCondition(selectedShipment, isPOClosed)}
        placeholder="Enter quantity"
        variant="outlined"
      />
    ),
  },
];
