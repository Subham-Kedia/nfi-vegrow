import { AddCircleOutlineOutlined, CancelOutlined } from '@mui/icons-material';
import { FieldCombo, FieldInput } from 'Components/FormFields';
import { mergeValidator } from 'Utilities';
import { validateMin } from 'Utilities/formvalidation';
import { LibraryGrid, LibraryText } from 'vg-library/core';

const COMMON_PROPS = {
  md: 2,
  xs: 12,
};

const COMMON_STYLE = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
};

const customerAddMAColumns = [
  {
    header: {
      label: 'Item Code',
    },
    props: {
      md: 3,
      xs: 12,
    },
    render: (_, { packagingOptions }, { rowIndex }) => {
      return (
        <FieldCombo
          label=""
          name={`material_info[${rowIndex}].packaging_item`}
          options={packagingOptions}
          optionLabel={({ item_code }) => item_code}
          placeholder="Select Code"
          size="small"
        />
      );
    },
  },
  {
    header: {
      label: 'Item Name',
      style: COMMON_STYLE,
    },
    props: COMMON_PROPS,
    render: ({ packaging_item }) => {
      return <LibraryText>{packaging_item?.item_name}</LibraryText>;
    },
  },
  {
    header: {
      label: 'Description',
      style: COMMON_STYLE,
    },
    props: COMMON_PROPS,
    render: ({ packaging_item }) => {
      return <LibraryText>{packaging_item?.description}</LibraryText>;
    },
  },
  {
    header: {
      label: 'Quantity',
      style: COMMON_STYLE,
    },
    props: {
      md: 1,
      xs: 12,
    },
    render: (_, _$, { rowIndex }) => {
      return (
        <FieldInput
          label=""
          name={`material_info[${rowIndex}].quantity`}
          validate={mergeValidator(validateMin(0))}
          type="number"
          size="small"
        />
      );
    },
  },
  {
    header: {
      label: 'Rate',
    },
    props: {
      md: 1,
      xs: 12,
    },
    render: (_, _$, { rowIndex }) => {
      return (
        <FieldInput
          label=""
          name={`material_info[${rowIndex}].rate`}
          validate={validateMin(0)}
          type="number"
          size="small"
        />
      );
    },
  },
  {
    header: {
      label: '',
      style: COMMON_STYLE,
    },
    props: { md: 1, xs: 12 },
    render: (
      _,
      { arrayHelpers, materialInfo, defaultStructure },
      { rowIndex },
    ) => {
      return (
        <LibraryGrid container>
          {materialInfo.length > 1 && (
            <CancelOutlined
              fontSize="large"
              className="cursor-pointer"
              onClick={() => {
                arrayHelpers.remove(rowIndex);
              }}
            />
          )}
          {rowIndex === materialInfo.length - 1 && (
            <AddCircleOutlineOutlined
              fontSize="large"
              className="cursor-pointer"
              onClick={() => {
                arrayHelpers.push(defaultStructure);
              }}
            />
          )}
        </LibraryGrid>
      );
    },
  },
];

export default customerAddMAColumns;
