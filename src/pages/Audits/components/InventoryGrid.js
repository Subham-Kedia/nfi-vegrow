import { useState } from 'react';
import { Cancel, Image, Upload } from '@mui/icons-material';
import { Badge, IconButton } from '@mui/material';
import { FieldInput } from 'Components/FormFields';
import { mergeValidator, toFixedNumber } from 'Utilities';
import { validateDecimal, validateRequired } from 'Utilities/formvalidation';
import { LibraryGrid, LibraryText } from 'vg-library/core';

import { AUDIT_STATUS, FIELD_NAME, FIELD_NAMES } from '../constants';
import ImageGalleryModal from '../modals/ImageGalleryModal';
import { useStyles } from '../styled';
import { calculateDifferenceQuantity, handleNumberChange } from '../utils';

const GridRowContainer = ({ md, lg, gap, children }) => {
  const { gridRowWiseContainer } = useStyles();
  return (
    <LibraryGrid
      item
      container
      alignItems="center"
      justifyContent="center"
      className={gridRowWiseContainer}
      md={md}
      lg={lg}
      gap={gap}
    >
      {children}
    </LibraryGrid>
  );
};

const GridText = ({ children, additionalStyle }) => {
  const { textCenter } = useStyles();
  return (
    <LibraryGrid
      item
      alignItems="center"
      justifyContent="center"
      className={textCenter}
      style={additionalStyle}
    >
      <LibraryText>{children}</LibraryText>
    </LibraryGrid>
  );
};

const InventoryGridColumnHeader = () => {
  const { width100 } = useStyles();

  const quantityDetails = [
    {
      label1: 'Available Quantity',
      label2: 'Actual available quantity',
      diff: 'Diff.',
    },
    {
      label1: 'Damaged Quantity',
      label2: 'Actual Damaged Quantity',
      diff: 'Diff.',
    },
  ];

  return (
    <LibraryGrid container justifyContent="space-evenly" className={width100}>
      <GridRowContainer md={1.5}>
        <GridText>Item</GridText>
      </GridRowContainer>
      {quantityDetails.map(({ label1, label2, diff }, index) => (
        <GridRowContainer gap={4} md={3.5} key={index}>
          <LibraryGrid container spacing={2} alignItems="center">
            <LibraryGrid item xs={4}>
              <GridText>{label1}</GridText>
            </LibraryGrid>
            <LibraryGrid item xs={4}>
              <GridText>{label2}</GridText>
            </LibraryGrid>
            <LibraryGrid item xs={4}>
              <GridText>{diff}</GridText>
            </LibraryGrid>
          </LibraryGrid>
        </GridRowContainer>
      ))}
      <GridRowContainer md={1}>
        <GridText>Packaged Lot Quantity</GridText>
      </GridRowContainer>
      <GridRowContainer md={2}>
        <GridText>Remarks</GridText>
      </GridRowContainer>
    </LibraryGrid>
  );
};

const InventoryGridCell = ({
  rowIndex,
  field,
  value,
  actualValue,
  diff,
  onChange,
  validate,
  isEditable,
  saveMethod,
  isDecimal,
}) => {
  const isAuditCompleted = saveMethod.current === AUDIT_STATUS.PENDING_APPROVAL;

  const handleValidation = (value) =>
    !value && isAuditCompleted ? validate(value) : undefined;

  return (
    <LibraryGrid container spacing={2} alignItems="center">
      <LibraryGrid item xs={4}>
        <GridText>{toFixedNumber(value, 2)}</GridText>
      </LibraryGrid>
      <LibraryGrid item xs={4}>
        <GridText>
          <FieldInput
            name={`${FIELD_NAME.INVENTORY_AUDIT_ITEMS}.${rowIndex}.${field}`}
            label=""
            type="number"
            size="small"
            onChange={(e) => handleNumberChange(e, onChange)}
            required={!!isAuditCompleted}
            validate={mergeValidator(
              handleValidation,
              validateDecimal(isDecimal),
            )}
            disabled={!isEditable}
          />
        </GridText>
      </LibraryGrid>
      <LibraryGrid item xs={4}>
        <GridText additionalStyle={{ color: diff.color }}>
          {diff.isZero || !actualValue
            ? ''
            : `${diff.sign}${diff.formattedDifference}`}
        </GridText>
      </LibraryGrid>
    </LibraryGrid>
  );
};

const InventoryGridColumnBody = ({
  rowIndex,
  item_name,
  item_code,
  available_qty,
  packed_lot_qty,
  damaged_qty,
  rowImages,
  setOpenImageModal,
  handleFileChange,
  setCurrentRow,
  cellProps,
  isZeroInventoryItem,
  isDecimal,
}) => {
  const { handleChange, values, saveMethod, isEditable } = cellProps;

  const { inventoryGridBodyContainer, gridPosition, closeButtonDesktop } =
    useStyles();

  const imageCount = rowImages[rowIndex]?.length || 0;

  const actual_available_quantity =
    +values.inventory_audit_items[rowIndex]?.actual_available_qty;
  const actual_damage_quantity =
    +values.inventory_audit_items[rowIndex]?.actual_damaged_qty;

  const available_qty_diff = calculateDifferenceQuantity(
    available_qty,
    actual_available_quantity,
  );
  const damaged_qty_diff = calculateDifferenceQuantity(
    damaged_qty,
    actual_damage_quantity,
  );

  return (
    <LibraryGrid
      container
      justifyContent="space-evenly"
      className={inventoryGridBodyContainer}
    >
      <GridRowContainer md={1.5}>
        <GridText className={gridPosition}>
          <LibraryText className="word-break">{item_name}</LibraryText>
          <LibraryText variant="caption" className="word-break">
            {item_code}
          </LibraryText>
        </GridText>
      </GridRowContainer>
      <GridRowContainer gap={4} md={3.5}>
        <InventoryGridCell
          rowIndex={rowIndex}
          field={FIELD_NAMES.ACTUAL_AVAILABLE_QTY}
          value={available_qty}
          actualValue={actual_available_quantity}
          diff={available_qty_diff}
          onChange={handleChange}
          validate={validateRequired}
          isEditable={isEditable}
          saveMethod={saveMethod}
          isDecimal={isDecimal}
        />
      </GridRowContainer>
      <GridRowContainer gap={4} md={3.5}>
        <InventoryGridCell
          rowIndex={rowIndex}
          field={FIELD_NAMES.ACTUAL_DAMAGED_QTY}
          value={damaged_qty}
          actualValue={actual_damage_quantity}
          diff={damaged_qty_diff}
          onChange={handleChange}
          validate={validateRequired}
          isEditable={isEditable}
          saveMethod={saveMethod}
          isDecimal={isDecimal}
        />
      </GridRowContainer>
      <GridRowContainer md={1}>
        <GridText>{packed_lot_qty}</GridText>
      </GridRowContainer>
      <GridRowContainer md={2}>
        {isZeroInventoryItem && (
          <IconButton
            className={closeButtonDesktop}
            onClick={() =>
              cellProps.handleRemoveCard(rowIndex, cellProps.values)
            }
          >
            <Cancel />
          </IconButton>
        )}
        <GridText>
          {isEditable && (
            <IconButton component="label">
              <Upload />
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => handleFileChange(rowIndex, e)}
              />
            </IconButton>
          )}
          <IconButton
            onClick={() => {
              setOpenImageModal(true);
              setCurrentRow(rowIndex);
            }}
          >
            <Badge badgeContent={imageCount} color="primary">
              <Image />
            </Badge>
          </IconButton>
        </GridText>
        <FieldInput
          minRows={2}
          name={`${FIELD_NAME.INVENTORY_AUDIT_ITEMS}.${rowIndex}.remarks`}
          disabled={!isEditable}
        />
      </GridRowContainer>
    </LibraryGrid>
  );
};

const InventoryGrid = ({ data, rowImages, setRowImages, cellProps }) => {
  const [openImageModal, setOpenImageModal] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const handleFileChange = (rowIndex, event) => {
    const files = Array.from(event.target.files);
    setRowImages((prev) => ({
      ...prev,
      [rowIndex]: (prev[rowIndex] || []).concat(files),
    }));
  };

  return (
    <LibraryGrid>
      <InventoryGridColumnHeader />
      {data.map(
        (
          {
            item_name,
            item_code,
            available_qty,
            available_quantity,
            packed_lot_qty = 0,
            packed_lot_quantity = 0,
            damaged_qty,
            grade_c_quantity,
            isZeroInventoryItem,
            is_decimal_value,
          },
          index,
        ) => (
          <InventoryGridColumnBody
            key={index}
            rowIndex={index}
            item_name={item_name}
            item_code={item_code}
            available_qty={available_quantity || available_qty}
            packed_lot_qty={packed_lot_quantity || packed_lot_qty}
            damaged_qty={grade_c_quantity || damaged_qty}
            rowImages={rowImages}
            setOpenImageModal={setOpenImageModal}
            handleFileChange={handleFileChange}
            setCurrentRow={setCurrentRow}
            cellProps={cellProps}
            isZeroInventoryItem={isZeroInventoryItem}
            isDecimal={is_decimal_value}
          />
        ),
      )}

      <ImageGalleryModal
        openImageModal={openImageModal}
        setOpenImageModal={setOpenImageModal}
        images={rowImages[currentRow] || []}
        currentRow={currentRow}
        setRowImages={setRowImages}
        isEditable={cellProps.isEditable}
      />
    </LibraryGrid>
  );
};

export default InventoryGrid;
