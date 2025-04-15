import { AddCircleOutlineOutlined, CancelOutlined } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { FieldCombo, FieldInput } from 'Components/FormFields';
import Text from 'Components/Text';
import { mergeValidator } from 'Utilities';
import { validateMin, validateRequired } from 'Utilities/formvalidation';

export const COLUMN_KEY_NAME = 'material_assignment_items';
export const ITEM_KEY_NAME = 'nfi_packaging_item';
export const EMPTY_ROW_VALUES = { [ITEM_KEY_NAME]: {} };

const columnsConfig = [
  {
    header: {
      label: 'S.No',
    },
    props: { md: 1, xs: 12 },
    render: (_, __, { rowIndex = 0 }) => (
      <Text variant="body1">{rowIndex + 1}</Text>
    ),
  },
  {
    header: {
      label: 'Item ID',
    },
    props: { md: 3, xs: 12 },
    render: (rowData, cellData, { rowIndex = 0 }) => {
      return (
        <FieldCombo
          name={`${COLUMN_KEY_NAME}.${rowIndex}.${ITEM_KEY_NAME}`}
          variant="outlined"
          options={
            cellData.items.filter(
              ({ id }) =>
                rowData[ITEM_KEY_NAME]?.id === id ||
                !cellData[COLUMN_KEY_NAME].includes(id),
            ) || []
          }
          optionLabel={(obj) => obj.item_code || ''}
          required
          validate={validateRequired}
          placeholder="Select Item"
        />
      );
    },
  },
  {
    header: {
      label: 'Item Name',
    },
    props: { md: 1, xs: 12 },
    render: (rowData) => (
      <Text variant="body1">{rowData[ITEM_KEY_NAME]?.item_name}</Text>
    ),
  },
  {
    header: {
      label: 'Item Description',
    },
    props: { md: 1, xs: 12 },
    render: (rowData) => (
      <Text variant="body1">{rowData[ITEM_KEY_NAME]?.description}</Text>
    ),
  },
  {
    header: {
      label: 'Quantity',
    },
    props: { md: 1, xs: 12 },
    render: (rowData, cellData, { rowIndex = 0 }) => (
      <FieldInput
        name={`${COLUMN_KEY_NAME}.${rowIndex}.quantity`}
        type="number"
        size="small"
        required
        validate={mergeValidator(validateRequired, validateMin(0))}
        placeholder="Enter quantity"
        variant="outlined"
      />
    ),
  },
  {
    header: {
      label: 'UoM',
    },
    props: { md: 1, xs: 12 },
    render: (rowData) => (
      <Text variant="body1">
        {rowData[ITEM_KEY_NAME]?.unit_of_measurement_label}
      </Text>
    ),
  },
  {
    header: {
      label: 'Rate/UoM',
    },
    props: { md: 1, xs: 12 },
    render: (rowData) => (
      <Text variant="body1">{rowData[ITEM_KEY_NAME]?.effective_rate}</Text>
    ),
  },
  {
    header: {
      label: 'Actions',
    },
    props: { md: 1, xs: 12 },
    render: (_, cellData, { rowIndex = 0 }) => {
      return (
        <Grid container>
          {cellData[COLUMN_KEY_NAME].length > 1 && (
            <CancelOutlined
              fontSize="large"
              onClick={() => {
                cellData.arrayHelpers.remove(rowIndex);
              }}
            />
          )}
          {rowIndex === cellData[COLUMN_KEY_NAME].length - 1 &&
            cellData.items.length !== cellData[COLUMN_KEY_NAME].length && (
              <AddCircleOutlineOutlined
                fontSize="large"
                onClick={() => cellData.arrayHelpers.push(EMPTY_ROW_VALUES)}
              />
            )}
        </Grid>
      );
    },
  },
];

export default columnsConfig;
