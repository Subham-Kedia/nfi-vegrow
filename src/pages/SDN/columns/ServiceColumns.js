import { FieldInput } from 'Components/FormFields';
import { validateRequired } from 'Utilities/formvalidation';

export const SERVICE_ACK_COLUMNS = [
  {
    header: {
      label: 'S.No',
    },
    props: { md: 1, xs: 12 },
    render: (_, _$, { rowIndex }) => rowIndex + 1,
  },
  {
    header: {
      label: 'Service Type',
    },
    props: { md: 3, xs: 12 },
    render: ({ service_type }) => service_type.name,
  },
  {
    header: {
      label: 'Service Description',
    },
    props: { md: 4, xs: 12 },
    render: ({ description }) => description,
  },
  {
    header: {
      label: 'Quantity',
    },
    props: { md: 3, xs: 12 },
    render: (_, _$, { rowIndex }) => {
      return (
        <FieldInput
          name={`purchase_items.${rowIndex}.quantity`}
          validate={validateRequired}
          type="number"
          size="small"
          disabled
        />
      );
    },
  },
];

export const REMARKS_COLUMN = [
  {
    header: {
      label: 'Remarks',
    },
    props: { md: 12, xs: 12 },
    render: (_, { disabled }) => {
      return (
        <FieldInput
          name="remarks"
          multiline
          minRows={4}
          className="width100"
          disabled={disabled}
        />
      );
    },
  },
];
