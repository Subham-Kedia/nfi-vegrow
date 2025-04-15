import {
  AddCircleOutlineOutlined as AddCircleOutlineOutlinedIcon,
  CancelOutlined as CancelOutlinedIcon,
} from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { FieldInput, FieldSelect } from 'Components/FormFields';
import { validateRequired } from 'Utilities/formvalidation';

import FieldCheckbox from 'Components/FormFields/FieldCheckBox/index';
import { generateBomID } from './utils';

export const COLUMNS_PRIMARY = [
  {
    header: {
      label: 'Item Code',
    },
    key: 'itemCode',
    props: { md: 4, xs: 12 },
    render: (
      data,
      {
        disablePrimary,
        setFieldValue,
        handleChange,
        values,
        packagingTypes,
        bomId,
      },
      { rowIndex = 0 },
    ) => (
      <FieldSelect
        name={`primary_items[${rowIndex}].nfi_packaging_item.id`}
        size="small"
        variant="outlined"
        id="item_code"
        options={packagingTypes
          .filter(({ is_primary }) => is_primary)
          .map((item) => {
            return {
              ...item,
              value: item?.id,
              text: item?.item_code,
            };
          })}
        onChange={(e) => {
          handleChange(e);
          const selectedItem = packagingTypes?.find(
            (item) => item.id === e?.target?.value,
          );
          if (selectedItem) {
            setFieldValue(
              `primary_items.${rowIndex}.nfi_packaging_item.unit_of_measurement_label`,
              selectedItem.unit_of_measurement_label,
            );
            generateBomID(
              {
                ...values,
                primary_items: values.primary_items.map((item, index) =>
                  index === rowIndex
                    ? {
                        ...values.primary_items[rowIndex],
                        nfi_packaging_item: {
                          ...values.primary_items[rowIndex].nfi_packaging_item,
                          id: e.target.value,
                        },
                      }
                    : item,
                ),
              },
              setFieldValue,
              packagingTypes,
              bomId,
            );
          }
        }}
        validate={validateRequired}
        placeholder="Select Item Code"
        label="Select Item Code"
        required
        disabled={disablePrimary}
      />
    ),
  },
  {
    header: {
      label: 'UoM',
    },
    key: 'primary_items',
    props: { md: 2, xs: 12 },
    render: (data) => {
      return (
        <Typography>
          {data.nfi_packaging_item?.unit_of_measurement_label}
        </Typography>
      );
    },
  },
  {
    header: {
      label: 'Composition',
    },
    key: 'composition',
    props: { md: 2, xs: 12 },
    render: (data, { disablePrimary }, { rowIndex = 0 }) => (
      <FieldInput
        name={`primary_items.${rowIndex}.composition`}
        size="small"
        variant="outlined"
        id="composition"
        required
        validate={validateRequired}
        disabled={disablePrimary}
      />
    ),
  },

  {
    header: {
      label: '',
    },
    key: 'placeholder',
    props: { md: 2, xs: 12 },
    render: () => <div />,
  },
];

export const COLUMNS_SECONDARY = [
  {
    header: {
      label: 'Item Code',
    },
    key: 'itemCode',
    props: { md: 4, xs: 12 },
    render: (
      data,
      {
        setFieldValue,
        handleChange,
        disableSecondary,
        values,
        packagingTypes,
        bomId,
      },
      { rowIndex = 0 },
    ) => (
      <FieldSelect
        name={`secondary_items.${rowIndex}.nfi_packaging_item.id`}
        size="small"
        variant="outlined"
        id="item_code"
        options={packagingTypes
          .filter(({ is_primary }) => !is_primary)
          .map((item) => {
            return {
              ...item,
              value: item?.id,
              text: item?.item_code,
            };
          })}
        validate={validateRequired}
        onChange={(e) => {
          handleChange(e);
          const selectedItem = packagingTypes?.find(
            (item) => item.id === e?.target?.value,
          );
          if (selectedItem) {
            setFieldValue(
              `secondary_items.${rowIndex}.nfi_packaging_item.unit_of_measurement_label`,
              selectedItem.unit_of_measurement_label,
            );
            generateBomID(
              {
                ...values,
                secondary_items: values.secondary_items.map((item, index) =>
                  index === rowIndex
                    ? {
                        ...values.secondary_items[rowIndex],
                        nfi_packaging_item: {
                          ...values.secondary_items[rowIndex]
                            .nfi_packaging_item,
                          id: e.target.value,
                        },
                      }
                    : item,
                ),
              },
              setFieldValue,
              packagingTypes,
              bomId,
            );
          }
        }}
        placeholder="Select Item Code"
        label="Select Item Code"
        required
        disabled={disableSecondary}
      />
    ),
  },
  {
    header: {
      label: 'UoM',
    },
    key: 'secondary_items',
    props: { md: 2, xs: 12 },
    render: (data) => {
      return (
        <Typography>
          {data.nfi_packaging_item?.unit_of_measurement_label}
        </Typography>
      );
    },
  },
  {
    header: {
      label: 'Composition',
    },
    key: 'composition',
    props: { md: 2, xs: 12 },
    render: (data, { disableSecondary }, { rowIndex = 0 }) => (
      <FieldInput
        name={`secondary_items.${rowIndex}.composition`}
        size="small"
        variant="outlined"
        id="composition"
        required
        validate={validateRequired}
        disabled={disableSecondary}
      />
    ),
  },
  {
    header: {
      label: '',
    },
    key: 'is_flexible',
    props: { md: 2, xs: 12 },
    render: (data, { isViewFlow }, { rowIndex = 0 }) => (
      <FieldCheckbox
        name={`secondary_items.${rowIndex}`}
        options={[{ key: `is_flexible`, label: 'Flexible' }]}
        disabled={isViewFlow}
        style={{ marginLeft: '0.8rem' }}
      />
    ),
  },
];

export const ACTION_COLUMNS = [
  {
    header: {
      label: '',
    },
    key: 'actions',
    props: {
      md: 1,
      xs: 12,
      style: { display: 'flex', alignItems: 'center' },
    },
    render: (_data, { items, arrayHelpers, isViewFlow }, { rowIndex = 0 }) => {
      const isFirstOnlyRowEmpty =
        items.length === 1 && !items[0].nfi_packaging_item;
      return (
        <Grid container>
          {!isFirstOnlyRowEmpty && (
            <CancelOutlinedIcon
              fontSize="large"
              onClick={() => {
                if (items.length === 1) arrayHelpers.replace(rowIndex, {});
                else arrayHelpers.remove(rowIndex);
              }}
              style={{
                pointerEvents: isViewFlow ? 'none' : '',
                opacity: isViewFlow ? 0.5 : 1,
              }}
            />
          )}
          {rowIndex === items?.length - 1 && (
            <AddCircleOutlineOutlinedIcon
              fontSize="large"
              onClick={() => arrayHelpers.push({})}
              style={{
                pointerEvents: isViewFlow ? 'none' : '',
                opacity: isViewFlow ? 0.5 : 1,
              }}
            />
          )}
        </Grid>
      );
    },
  },
];
