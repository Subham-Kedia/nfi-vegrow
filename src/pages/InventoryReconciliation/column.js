import { FieldInput } from 'Components/FormFields';
import { toFixedNumber } from 'Utilities';

import { columnStyles } from './styled';

export const COLUMNS = [
  {
    key: 'item_code',
    header: {
      label: 'Item ID',
      style: columnStyles.header,
    },
    props: { md: 1.5, xs: 12 },
  },
  {
    key: 'item_name',
    header: {
      label: 'Item Name',
      style: columnStyles.header,
    },
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'Available Quantity',
      style: columnStyles.header,
    },
    props: { md: 1, xs: 12 },
    render({ available_quantity } = {}) {
      return toFixedNumber(available_quantity, 3);
    },
  },
  {
    header: {
      label: 'Actual Available Quantity',
      style: columnStyles.header,
    },
    props: { md: 1, xs: 12 },
    render(_, _$, { rowIndex }) {
      return (
        <FieldInput
          name={`inventory.${rowIndex}.actual_available_quantity`}
          size="small"
          label=""
          variant="outlined"
          type="number"
          required
          fullWidth
          InputLabelProps={{
            required: true,
            shrink: true,
          }}
        />
      );
    },
  },
  {
    header: {
      label: 'Consumed',
      style: columnStyles.headerWidth,
    },
    props: { md: 1, xs: 12 },
    render({ available_quantity = 0, actual_available_quantity = 0 }) {
      return !actual_available_quantity
        ? 0
        : toFixedNumber(available_quantity - actual_available_quantity, 3);
    },
  },
  {
    header: {
      label: 'Damaged Quantity',
      style: columnStyles.headerWidth,
    },
    props: { md: 1, xs: 12 },
    render({ grade_c_quantity } = {}) {
      return toFixedNumber(grade_c_quantity, 3);
    },
  },
  {
    header: {
      label: 'Packaged Lot Quantity',
      style: columnStyles.headerWidth,
    },
    props: { md: 1, xs: 12 },
    render({ packed_lot_quantity } = {}) {
      return toFixedNumber(packed_lot_quantity, 3);
    },
  },
  {
    header: {
      label: 'Out for Use Quantity',
      style: columnStyles.headerWidth,
    },
    props: { md: 1, xs: 12 },
    render({ out_for_use_quantity } = {}) {
      return toFixedNumber(out_for_use_quantity, 3);
    },
  },
  {
    header: {
      label: 'Description',
      style: columnStyles.header,
    },
    props: { md: 3, xs: 12 },
    render(_, _$, { rowIndex }) {
      return (
        <FieldInput
          name={`inventory.${rowIndex}.description`}
          size="medium"
          label=""
          type="text"
          placeholder="Enter Description"
          required
          fullWidth
          InputLabelProps={{
            required: true,
          }}
        />
      );
    },
  },
];
