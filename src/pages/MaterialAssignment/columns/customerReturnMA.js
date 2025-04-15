import { FieldInput } from 'Components/FormFields';
import { mergeValidator } from 'Utilities';
import { validateMax, validateMin } from 'Utilities/formvalidation';
import { LibraryText } from 'vg-library/core';

const COMMON_PROPS = {
  md: 2,
  xs: 12,
};

const COMMON_STYLE = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
};

const customerReturnMAColumns = [
  {
    header: {
      label: 'Item Code',
      style: COMMON_STYLE,
    },
    props: {
      md: 3,
      xs: 12,
    },
    render: ({ item_code }) => {
      return <LibraryText>{item_code}</LibraryText>;
    },
  },
  {
    header: {
      label: 'Item Name',
      style: COMMON_STYLE,
    },
    props: COMMON_PROPS,
    render: ({ item_name }) => {
      return <LibraryText>{item_name}</LibraryText>;
    },
  },
  {
    header: {
      label: 'Description',
      style: COMMON_STYLE,
    },
    props: COMMON_PROPS,
    render: ({ description }) => {
      return <LibraryText>{description}</LibraryText>;
    },
  },
  {
    header: {
      label: 'Pickup Quantity',
      style: COMMON_STYLE,
    },
    props: {
      md: 1,
      xs: 12,
    },
    render: ({ pending_quantity }, _$, { rowIndex }) => {
      return (
        <FieldInput
          label=""
          name={`material_info[${rowIndex}].pickup_quantity`}
          disabled={pending_quantity === 0}
          validate={mergeValidator(
            validateMin(0),
            validateMax(pending_quantity),
          )}
          type="number"
          size="small"
        />
      );
    },
  },
  {
    header: {
      label: 'Delivered Quantity',
      style: COMMON_STYLE,
    },
    props: {
      md: 1,
      xs: 12,
    },
    render: ({ pending_quantity, pickup_quantity }, _$, { rowIndex }) => {
      return (
        <FieldInput
          label=""
          name={`material_info[${rowIndex}].quantity`}
          disabled={pending_quantity === 0}
          validate={mergeValidator(
            validateMin(-1),
            validateMax(pickup_quantity),
          )}
          type="number"
          size="small"
        />
      );
    },
  },
  {
    header: {
      label: 'Gap',
      style: COMMON_STYLE,
    },
    props: {
      md: 1,
      xs: 12,
    },
    render: ({ pickup_quantity, quantity }) => {
      return <LibraryText>{pickup_quantity - quantity}</LibraryText>;
    },
  },
];

export default customerReturnMAColumns;
