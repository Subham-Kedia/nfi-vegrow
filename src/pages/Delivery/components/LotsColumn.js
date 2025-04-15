import { InputAdornment, Typography } from '@mui/material';
import FieldInput from 'Components/FormFields/TextInput';
import { mergeValidator, toFixedNumber } from 'Utilities';
import { validateMinEqual, validateRequired } from 'Utilities/formvalidation';

export const LotsColumn = [
  {
    header: {
      label: 'Item ID',
    },
    key: 'item_code',
    props: { md: 2, xs: 12 },
    render: ({ item_code = '', shipment_identifier = '' }) => {
      return (
        <>
          <Typography variant="body1" data-cy="nfi.dcArrival.ItemID">
            {item_code}
          </Typography>
          <Typography variant="caption">{shipment_identifier}</Typography>
        </>
      );
    },
  },
  {
    header: {
      label: 'Item Name',
    },
    key: 'item_name',
    props: { md: 2, xs: 12 },
  },
  {
    header: {
      label: 'Transfer Qty',
    },
    key: 'current_quantity',
    props: { md: 2, xs: 12 },
    render: ({ current_quantity = 0, uom_name }) => {
      return (
        <Typography variant="body1" data-cy="nfi.dcArrival.transferQty">
          {`${current_quantity} ${uom_name}`}
        </Typography>
      );
    },
  },
  {
    header: {
      label: 'Received Qty',
    },
    key: 'received_quantity',
    props: { md: 2, xs: 12 },
    render(
      { received_quantity = '', uom_name },
      { isEditing = false },
      { rowIndex = 0 },
    ) {
      return isEditing ? (
        <FieldInput
          name={`non_fruit_lots.${rowIndex}.received_quantity`}
          size="small"
          label=""
          placeholder="Quantity"
          variant="outlined"
          type="number"
          data-cy="nfi.dcArrival.Qty"
          validate={mergeValidator(validateRequired, validateMinEqual(0))}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{uom_name}</InputAdornment>
            ),
          }}
        />
      ) : (
        <Typography>{received_quantity}</Typography>
      );
    },
  },
  {
    header: {
      label: 'Gap',
    },
    key: 'gap',
    props: { md: 2, xs: 12 },
    render(_, { values }, { rowIndex = 0 }) {
      const { non_fruit_lots = [] } = values || {};
      const { current_quantity = 0, received_quantity = 0 } =
        non_fruit_lots[rowIndex] || {};
      return (
        <Typography variant="body1" data-cy="nfi.dcArrival.Gap">
          {toFixedNumber(current_quantity - received_quantity, 2)}
        </Typography>
      );
    },
  },
];
