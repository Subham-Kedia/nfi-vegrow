import { TextField } from '@mui/material';
import FieldSelect from 'Components/FormFields/FieldSelect';
import FieldInput from 'Components/FormFields/TextInput';
import { mergeValidator, toFixedNumber } from 'Utilities';
import { GST_LIST, OTHER_CHARGES_LABEL } from 'Utilities/constants';
import { validateMinEqual, validateRequired } from 'Utilities/formvalidation';
import { LibraryText } from 'vg-library/core';

export const OTHER_CHARGES_COLUMNS = [
  {
    header: {
      label: 'Other Charges',
    },
    props: { md: 3, xs: 12 },
    render: ({ charge_type = '' }) => (
      <TextField
        size="small"
        value={OTHER_CHARGES_LABEL[charge_type]}
        InputProps={{ readOnly: true }}
      />
    ),
  },
  {
    header: {
      label: 'Taxable Amount',
    },
    props: { md: 3, xs: 12 },
    render: (_, { isEditing, setFieldValue }, { rowIndex = 0 }) => (
      <FieldInput
        name={`other_bill_charges_metadata.${rowIndex}.taxable_amount`}
        label=""
        type="number"
        size="small"
        disabled={!isEditing}
        data-cy="nfi.dcArrival.OtherCharges"
        required
        validate={mergeValidator(validateRequired, validateMinEqual(0))}
        onChange={(e) => {
          if (+e.target.value <= 0) {
            setFieldValue(`other_bill_charges_metadata.${rowIndex}.gst`, null);
          }
          setFieldValue(
            `other_bill_charges_metadata.${rowIndex}.taxable_amount`,
            e.target.value ? +e.target.value : '',
          );
        }}
        placeholder="Enter Amount"
        variant="outlined"
      />
    ),
  },
  {
    header: {
      label: 'GST%',
    },
    props: { md: 2, xs: 12 },
    render: ({ taxable_amount }, { isEditing }, { rowIndex }) => (
      <FieldSelect
        name={`other_bill_charges_metadata.${rowIndex}.gst`}
        placeholder="Select GST"
        variant="outlined"
        data-cy="nfi.dcArrival.gst"
        size="small"
        label=""
        disabled={+taxable_amount <= 0 || !isEditing}
        validate={taxable_amount > 0 ? validateRequired : undefined}
        options={GST_LIST}
      />
    ),
  },
  {
    header: {
      label: 'Total Amount',
    },
    props: { md: 2, xs: 12 },
    render: ({ taxable_amount = 0, gst }) => {
      return (
        <LibraryText variant="h9" data-cy="nfi.dcArrival.total">
          {toFixedNumber(
            taxable_amount + (taxable_amount * (gst >= 0 ? gst : 0)) / 100,
            4,
          )}
        </LibraryText>
      );
    },
    style: {
      display: 'flex',
      height: '100%',
      alignItems: 'center',
    },
  },
];
