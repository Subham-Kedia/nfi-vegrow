import FieldInput from 'Components/FormFields/TextInput';
import Text from 'Components/Text';
import { mergeValidator, toFixedNumber } from 'Utilities';
import { validateMinEqual, validateRequired } from 'Utilities/formvalidation';

export const COLUMN_KEY_NAME = 'material_assignment_items';
export const ITEM_KEY_NAME = 'nfi_packaging_item';

const columnsConfig = [
  {
    header: {
      label: 'S.No',
    },
    props: { md: 1, xs: 12 },
    render: (_, __, { rowIndex = 0 }) => (
      <Text variant="body1">{rowIndex + 1}</Text>
    ),
    style: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  {
    header: {
      label: 'Item ID',
    },
    props: { md: 3, xs: 12 },
    render: (rowData) => (
      <Text variant="body1">{rowData[ITEM_KEY_NAME].item_code}</Text>
    ),
  },
  {
    header: {
      label: 'Item Name',
    },
    props: { md: 2, xs: 12 },
    render: (rowData) => (
      <Text variant="body1">{rowData[ITEM_KEY_NAME].item_name}</Text>
    ),
  },
  {
    header: {
      label: 'Item Description',
    },
    props: { md: 1, xs: 12 },
    render: (rowData) => (
      <Text variant="body1">{rowData[ITEM_KEY_NAME].description}</Text>
    ),
  },
  {
    header: {
      label: 'Assigned Quantity',
    },
    key: 'quantity',
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'UoM',
    },
    props: { md: 1, xs: 12 },
    render: (rowData) => (
      <Text variant="body1">
        {rowData[ITEM_KEY_NAME].unit_of_measurement_label}
      </Text>
    ),
  },
  {
    header: {
      label: 'Rate/UoM',
    },
    props: { md: 1, xs: 12 },
    key: 'effective_rate',
  },
  {
    header: {
      label: 'Recieved Quantity',
    },
    key: 'received',
    props: { md: 1, xs: 12 },
    render: (_data, _cellData, { rowIndex = 0 }) => (
      <FieldInput
        name={`${COLUMN_KEY_NAME}.${rowIndex}.received`}
        type="number"
        size="small"
        required
        validate={mergeValidator(validateRequired, validateMinEqual(0))}
        placeholder="Enter quantity"
        variant="outlined"
      />
    ),
  },
  {
    header: {
      label: 'Gap',
    },
    props: { md: 1, xs: 12 },
    render: ({ received = 0, pending_quantity = 0 }) => (
      <Text variant="body1">
        {isNaN(pending_quantity - received)
          ? 0
          : toFixedNumber(pending_quantity - received, 2)}
      </Text>
    ),
  },
];

export default columnsConfig;
