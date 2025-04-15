import { AddCircleOutlineOutlined, CancelOutlined } from '@mui/icons-material';
import { FieldCombo, FieldInput, FieldSelect } from 'Components/FormFields';
import { mergeValidator, toFixedNumber } from 'Utilities';
import { GST_LIST } from 'Utilities/constants';
import { validateMin, validateRequired } from 'Utilities/formvalidation';
import { LibraryGrid, LibraryText } from 'vg-library/core';

import { PURCHASE_ITEM } from '../constant';

import { UOM_TYPE } from './const';
import {
  ConversionRate,
  ConversionRateWrapper,
  StyledIconButton,
} from './styled';

export const COLUMNS = [
  {
    header: {
      label: 'S.No',
      style: { minHeight: '20px' },
    },
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
      style: { minHeight: '20px' },
    },
    props: { md: 2, xs: 12 },
    render: (
      { nfi_packaging_item = {} },
      { items = [], purchase_items = [], setFieldValue, isReadOnly },
      { rowIndex = 0 },
    ) => {
      const handleChange = (val) => {
        const { unit_of_measurement_label_market, unit_of_measurement_label } =
          val;

        const uomName =
          unit_of_measurement_label_market || unit_of_measurement_label;

        setFieldValue(`purchase_items.${rowIndex}.nfi_packaging_item`, val);
        setFieldValue(`purchase_items.${rowIndex}.uom_name`, uomName);
      };

      return (
        <FieldCombo
          name={`purchase_items.${rowIndex}.nfi_packaging_item`}
          variant="outlined"
          data-cy="nfi.po.packagingItem"
          options={items.filter(
            ({ id = '' }) =>
              nfi_packaging_item?.id === id || !purchase_items?.includes(id),
          )}
          optionLabel={(obj) => obj?.item_code || ''}
          required
          validate={mergeValidator(validateRequired)}
          placeholder="Select Item"
          onChange={handleChange}
          disabled={isReadOnly}
        />
      );
    },
  },
  {
    header: {
      label: 'Item Name',
    },
    props: { md: 1, xs: 12 },
    render: ({ nfi_packaging_item = {} }, { items = [] }) =>
      items?.find(({ id = '' }) => id === nfi_packaging_item?.id)?.item_name ||
      '',
  },
  {
    header: {
      label: 'Item Description',
    },
    props: { md: 1, xs: 12 },
    render: ({ nfi_packaging_item = {} }, { items = [] }) =>
      items.find(({ id = '' }) => id === nfi_packaging_item?.id)?.description ||
      '',
  },
  {
    header: {
      label: 'UoM',
    },
    props: { md: 1, xs: 12 },
    render: (
      { nfi_packaging_item },
      { setFieldValue, isReadOnly },
      { rowIndex },
    ) => {
      const handleChange = (e) => {
        e.stopPropagation();
        setFieldValue(`purchase_items.${rowIndex}.uom_name`, e.target.value);
        setFieldValue(
          `purchase_items.${rowIndex}.market_to_system_uom`,
          undefined,
        );
      };

      const { uom_dropdown = [] } = nfi_packaging_item || {};
      return (
        <FieldSelect
          name={`purchase_items.${rowIndex}.uom_name`}
          data-cy="nfi.po.Uom"
          validate={validateRequired}
          options={uom_dropdown}
          sx={{ mx: 1 }}
          onChange={handleChange}
          disabled={isReadOnly}
        />
      );
    },
  },
  {
    header: {
      label: 'Conversion Rate',
    },
    props: { md: 2, xs: 12 },
    render: (
      { nfi_packaging_item, uom_name },
      { isReadOnly },
      { rowIndex },
    ) => {
      const {
        unit_of_measurement_label_market,
        unit_of_measurement_label,
        uom_dropdown = [],
      } = nfi_packaging_item || {};

      const isSystemUOMSelected =
        uom_dropdown.find(({ value }) => value === uom_name)?.uom_type ===
        UOM_TYPE.SYSTEM;

      const hideInput =
        !unit_of_measurement_label_market || isSystemUOMSelected;

      const validation = hideInput
        ? undefined
        : mergeValidator(validateRequired, validateMin(0));

      return (
        <ConversionRateWrapper container showInput={!hideInput}>
          <>1 {unit_of_measurement_label_market} = </>
          <ConversionRate
            name={`purchase_items.${rowIndex}.market_to_system_uom`}
            size="small"
            type="number"
            data-cy="nfi.po.conversionRate"
            validate={validation}
            disabled={isReadOnly}
          />
          {unit_of_measurement_label}
        </ConversionRateWrapper>
      );
    },
  },
  {
    header: {
      label: 'Quantity',
    },
    props: { md: 0.8, xs: 12 },
    render: (
      { market_to_system_uom, quantity, nfi_packaging_item },
      { isReadOnly },
      { rowIndex = 0 },
    ) => {
      const { unit_of_measurement_label } = nfi_packaging_item || {};
      const helperText = market_to_system_uom
        ? `(${+quantity * +market_to_system_uom} ${unit_of_measurement_label})`
        : '';

      return (
        <FieldInput
          name={`purchase_items.${rowIndex}.quantity`}
          type="number"
          size="small"
          data-cy="nfi.po.quantity"
          required
          validate={mergeValidator(validateRequired, validateMin(0))}
          placeholder="Enter quantity"
          variant="outlined"
          helperText={helperText}
          FormHelperTextProps={{
            sx: { opacity: 0.7 },
          }}
          disabled={isReadOnly}
        />
      );
    },
  },
  {
    header: {
      label: 'Rate/UoM',
    },
    props: { md: 0.8, xs: 12 },
    render: (
      { rate_uom, market_to_system_uom, nfi_packaging_item },
      { isReadOnly },
      { rowIndex = 0 },
    ) => {
      const { unit_of_measurement_label } = nfi_packaging_item || {};
      const helperText = market_to_system_uom
        ? `(₹ ${toFixedNumber(rate_uom / market_to_system_uom, 2)}/${unit_of_measurement_label})`
        : '';

      return (
        <FieldInput
          name={`purchase_items.${rowIndex}.rate_uom`}
          type="number"
          size="small"
          required
          data-cy="nfi.po.rateUom"
          validate={mergeValidator(validateRequired, validateMin(0))}
          placeholder="Enter Rate/UoM"
          variant="outlined"
          helperText={helperText}
          FormHelperTextProps={{
            sx: { opacity: 0.7 },
          }}
          disabled={isReadOnly}
        />
      );
    },
  },
  {
    header: {
      label: 'GST',
      style: { paddingLeft: '1rem' },
    },
    props: { md: 1, xs: 12 },
    render: (_, { isReadOnly }, { rowIndex }) => (
      <FieldSelect
        name={`purchase_items.${rowIndex}.gst`}
        size="small"
        data-cy="nfi.po.gst"
        validate={validateRequired}
        options={GST_LIST}
        sx={{ mx: 1 }}
        disabled={isReadOnly}
      />
    ),
  },
  {
    header: {
      label: 'Total Amount',
      style: { wordBreak: 'break-all' },
    },
    props: { md: 0.8, xs: 12 },
    render: ({ rate_uom = 0, quantity = 0, gst }) => {
      const gstPercent = +gst >= 0 ? +gst : 0;
      const gstIncludedRate = rate_uom * (1 + gstPercent / 100);
      return (
        <LibraryText>{toFixedNumber(quantity * gstIncludedRate)}</LibraryText>
      );
    },
  },
  {
    header: {
      label: '',
    },
    props: { md: 0.2, xs: 12 },
    render: (
      { id = '' },
      {
        purchase_items = [],
        arrayHelpers,
        items = [],
        handleRemovePurchaseItems = () => {},
        isReadOnly,
      },
      { rowIndex = 0 },
    ) => {
      const removedPurchaseItems = handleRemovePurchaseItems(id);
      return (
        <LibraryGrid container>
          {purchase_items.length > 1 && (
            <StyledIconButton
              onClick={() => {
                arrayHelpers.remove(rowIndex);
                removedPurchaseItems(id);
              }}
              disabled={isReadOnly}
            >
              <CancelOutlined fontSize="large" />
            </StyledIconButton>
          )}
          {rowIndex === purchase_items.length - 1 &&
            items.length !== purchase_items.length && (
              <StyledIconButton
                onClick={() => arrayHelpers.push(PURCHASE_ITEM)}
                disabled={isReadOnly}
              >
                <AddCircleOutlineOutlined fontSize="large" />
              </StyledIconButton>
            )}
        </LibraryGrid>
      );
    },
  },
];

export const SERVICE_PO_COLUMNS = [
  {
    header: {
      label: 'S.No',
    },
    props: { md: 0.5, xs: 12 },
    render: (_, _$, { rowIndex }) => `${rowIndex + 1}.`,
  },
  {
    header: {
      label: 'Service Type',
    },
    props: { md: 2, xs: 12 },
    render: (_, { serviceTypes, isReadOnly }, { rowIndex }) => {
      return (
        <FieldCombo
          name={`purchase_items.${rowIndex}.service_type`}
          validate={validateRequired}
          options={serviceTypes}
          optionLabel={({ name }) => name}
          disabled={isReadOnly}
        />
      );
    },
  },
  {
    header: {
      label: 'Service Description',
    },
    props: { md: 2, xs: 12 },
    render: (_, { isReadOnly }, { rowIndex }) => {
      return (
        <FieldInput
          name={`purchase_items.${rowIndex}.description`}
          multiline
          rows={3}
          size="small"
          validate={validateRequired}
          placeholder="Enter Service Description"
          disabled={isReadOnly}
        />
      );
    },
  },
  {
    header: {
      label: 'UoM',
    },
    props: { md: 1, xs: 12 },
    render: ({ service_type }) => {
      return (
        <LibraryText>{(service_type || {}).unit_of_measurement}</LibraryText>
      );
    },
  },
  {
    header: {
      label: 'Quantity',
    },
    props: { md: 1, xs: 12 },
    render: (_, { isReadOnly }, { rowIndex }) => {
      return (
        <FieldInput
          name={`purchase_items.${rowIndex}.quantity`}
          type="number"
          size="small"
          validate={mergeValidator(validateRequired, validateMin(0))}
          placeholder="Enter quantity"
          disabled={isReadOnly}
        />
      );
    },
  },
  {
    header: {
      label: 'Rate/UoM',
    },
    props: { md: 1, xs: 12 },
    render: (_, { isReadOnly }, { rowIndex = 0 }) => {
      return (
        <FieldInput
          name={`purchase_items.${rowIndex}.rate_uom`}
          type="number"
          size="small"
          validate={mergeValidator(validateRequired, validateMin(0))}
          placeholder="Enter Rate/UoM"
          disabled={isReadOnly}
        />
      );
    },
  },
  {
    header: {
      label: 'GST',
    },
    props: { md: 1, xs: 12 },
    render: (_, { isReadOnly }, { rowIndex }) => (
      <FieldSelect
        name={`purchase_items.${rowIndex}.gst`}
        size="small"
        validate={validateRequired}
        options={GST_LIST}
        disabled={isReadOnly}
      />
    ),
  },
  {
    header: {
      label: 'Total Amount',
      style: { wordBreak: 'break-all' },
    },
    props: { md: 1, xs: 12 },
    render: ({ rate_uom = 0, quantity = 0, gst }) => {
      const gstPercent = +gst >= 0 ? +gst : 0;
      const gstIncludedRate = rate_uom * (1 + gstPercent / 100);
      return (
        <LibraryText>
          {toFixedNumber(quantity * gstIncludedRate, 2)}
        </LibraryText>
      );
    },
  },
  {
    header: {
      label: '',
      style: { cursor: 'pointer' },
    },
    props: { md: 0.2, xs: 12 },
    render: (
      { id = '' },
      {
        purchase_items = [],
        arrayHelpers,
        items = [],
        handleRemovePurchaseItems = () => {},
        isReadOnly,
      },
      { rowIndex },
    ) => {
      const removedPurchaseItems = handleRemovePurchaseItems(id);
      return (
        <LibraryGrid container>
          {purchase_items.length > 1 && (
            <StyledIconButton
              onClick={() => {
                arrayHelpers.remove(rowIndex);
                removedPurchaseItems(id);
              }}
              disabled={isReadOnly}
            >
              <CancelOutlined fontSize="large" />
            </StyledIconButton>
          )}
          {rowIndex === purchase_items.length - 1 &&
            items.length !== purchase_items.length && (
              <StyledIconButton
                onClick={() => arrayHelpers.push(PURCHASE_ITEM)}
                disabled={isReadOnly}
              >
                <AddCircleOutlineOutlined fontSize="large" />
              </StyledIconButton>
            )}
        </LibraryGrid>
      );
    },
  },
];
