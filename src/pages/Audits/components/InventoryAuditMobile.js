import { useState } from 'react';
import { CameraAlt, Cancel, Chat, Photo, Upload } from '@mui/icons-material';
import { Badge, Box, IconButton } from '@mui/material';
import { WebCamCapture } from 'Components';
import { FieldInput } from 'Components/FormFields';
import { mergeValidator, toFixedNumber } from 'Utilities';
import { validateDecimal, validateRequired } from 'Utilities/formvalidation';
import { LibraryGrid, LibraryText } from 'vg-library/core';

import { AUDIT_STATUS, FIELD_NAME, FIELD_NAMES } from '../constants';
import ImageGalleryModal from '../modals/ImageGalleryModal';
import RemarksModal from '../modals/RemarksModal';
import { useStyles } from '../styled';
import { calculateDifferenceQuantity, handleNumberChange } from '../utils';

const InventoryCard = ({
  rowImages,
  setRowImages,
  setOpenImageModal,
  handleOpenWebcam = () => {},
  setCurrentRow,
  cellProps,
  itemName,
  itemCode,
  availableQuantity,
  packedLotQuantity,
  damagedQuantity,
  rowIndex,
  isDecimal,
}) => {
  const [openRemarkPopup, setOpenRemarkPopup] = useState(false);
  const { values, isEditable, saveMethod, handleChange } = cellProps;

  const { inventoryCard, diffWrapper, quantityInput, itemCodeText } =
    useStyles();

  const imageCount =
    rowImages && rowImages[rowIndex] ? rowImages[rowIndex].length : 0;

  const actual_available_quantity =
    +values.inventory_audit_items[rowIndex]?.actual_available_qty;
  const actual_damage_quantity =
    +values.inventory_audit_items[rowIndex]?.actual_damaged_qty;

  const available_qty_diff = calculateDifferenceQuantity(
    availableQuantity,
    actual_available_quantity,
  );
  const damaged_qty_diff = calculateDifferenceQuantity(
    damagedQuantity,
    actual_damage_quantity,
  );

  const config = [
    {
      label: 'Available quantity',
      value: toFixedNumber(availableQuantity, 2),
      field: FIELD_NAMES.ACTUAL_AVAILABLE_QTY,
      inputLabel: 'Actual available quantity',
      diff:
        available_qty_diff.isZero || !actual_available_quantity
          ? ''
          : `${available_qty_diff.sign}${available_qty_diff.formattedDifference}`,
      color: available_qty_diff.color,
    },
    {
      label: 'Damaged quantity',
      value: toFixedNumber(damagedQuantity, 2),
      field: FIELD_NAMES.ACTUAL_DAMAGED_QTY,
      inputLabel: 'Actual damaged quantity',
      diff:
        damaged_qty_diff.isZero || !actual_damage_quantity
          ? ''
          : `${damaged_qty_diff.sign}${damaged_qty_diff.formattedDifference}`,
      color: damaged_qty_diff.color,
    },
  ];

  const handleFileChange = (rowIndex, event) => {
    const files = Array.from(event.target.files);
    setRowImages((prev) => ({
      ...prev,
      [rowIndex]: (prev[rowIndex] || []).concat(files),
    }));
  };

  const toggleRemarksPopup = () => {
    setOpenRemarkPopup(!openRemarkPopup);
  };

  const isAuditCompleted = saveMethod.current === AUDIT_STATUS.PENDING_APPROVAL;

  const handleValidation = (value) =>
    !value && isAuditCompleted ? validateRequired(value) : undefined;

  return (
    <Box className={inventoryCard}>
      <LibraryGrid container alignItems="baseline" mb={2}>
        <LibraryGrid xs={6}>
          <LibraryText variant="h6" gutterBottom className="word-break">
            {itemName}
          </LibraryText>
        </LibraryGrid>
        <LibraryGrid xs={6}>
          <LibraryText className={`${itemCodeText} word-break`}>
            {itemCode}
          </LibraryText>
        </LibraryGrid>
      </LibraryGrid>
      {config.map(({ label, value, field, inputLabel, diff, color }) => {
        return (
          <LibraryGrid container key={field}>
            <LibraryGrid item xs={5}>
              <LibraryGrid container alignItems="center">
                <LibraryGrid item xs={4}>
                  <LibraryText>{label}: </LibraryText>
                </LibraryGrid>
                <LibraryGrid item xs={8} textAlign="end" pr={1}>
                  <LibraryText>{value}</LibraryText>
                </LibraryGrid>
              </LibraryGrid>
            </LibraryGrid>
            <LibraryGrid item xs={5}>
              <Box
                display="flex"
                alignItems="center"
                mb={2}
                justifyContent="center"
              >
                <FieldInput
                  name={`${FIELD_NAME.INVENTORY_AUDIT_ITEMS}.${rowIndex}.${field}`}
                  label={inputLabel}
                  type="number"
                  className={quantityInput}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  onChange={(e) => handleNumberChange(e, handleChange)}
                  required={!!isAuditCompleted}
                  validate={mergeValidator(
                    handleValidation,
                    validateDecimal(isDecimal),
                  )}
                  disabled={!isEditable}
                />
              </Box>
            </LibraryGrid>
            <LibraryGrid item xs={2}>
              <LibraryText color={color} className={diffWrapper}>
                {diff}
              </LibraryText>
            </LibraryGrid>
          </LibraryGrid>
        );
      })}
      <LibraryGrid container>
        <LibraryGrid item xs={5}>
          <LibraryGrid container alignItems="center">
            <LibraryGrid item xs={5}>
              <LibraryText>Packaged quantity: </LibraryText>
            </LibraryGrid>
            <LibraryGrid item xs={7} textAlign="end" pr={1}>
              <LibraryText>{packedLotQuantity}</LibraryText>
            </LibraryGrid>
          </LibraryGrid>
        </LibraryGrid>
        <LibraryGrid item xs={7}>
          <Box display="flex" justifyContent="flex-end">
            {isEditable && (
              <>
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
                <IconButton onClick={() => handleOpenWebcam(rowIndex)}>
                  <CameraAlt />
                </IconButton>
              </>
            )}
            <IconButton
              onClick={() => {
                setOpenImageModal(true);
                setCurrentRow(rowIndex);
              }}
            >
              <Badge badgeContent={imageCount} color="primary">
                <Photo />
              </Badge>
            </IconButton>
            <IconButton onClick={toggleRemarksPopup}>
              <Chat />
            </IconButton>
          </Box>
        </LibraryGrid>
      </LibraryGrid>
      {openRemarkPopup && (
        <RemarksModal
          open={openRemarkPopup}
          handleClose={toggleRemarksPopup}
          row={rowIndex}
          isEditable={isEditable}
        />
      )}
    </Box>
  );
};

const InventoryAuditMobile = ({ data, rowImages, setRowImages, cellProps }) => {
  const [currentRow, setCurrentRow] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);

  const { inventoryMobileWrapper, closeButton, webCamWrapper } = useStyles();

  const saveImageForRow = (rowIndex, image) => {
    setRowImages((prev) => ({
      ...prev,
      [rowIndex]: [...(prev[rowIndex] || []), image],
    }));
  };

  const handleOpenWebcam = (rowIndex) => {
    setCurrentRow(rowIndex);
    setShowWebcam(true);
  };

  const handleCloseWebcam = () => {
    setShowWebcam(false);
  };

  return (
    <>
      <Box>
        {data.map((d, idx) => {
          const {
            item_name,
            item_code,
            available_qty,
            available_quantity,
            packed_lot_qty = 0,
            packed_lot_quantity = 0,
            damaged_qty,
            grade_c_quantity,
            isZeroInventoryItem,
            id,
            is_decimal_value,
          } = d;
          const props = {
            itemName: item_name,
            itemCode: item_code,
            availableQuantity: available_quantity || available_qty,
            packedLotQuantity: packed_lot_quantity || packed_lot_qty,
            damagedQuantity: grade_c_quantity || damaged_qty,
            rowIndex: idx,
            isDecimal: is_decimal_value,
          };

          return (
            <section className={inventoryMobileWrapper} key={id}>
              {isZeroInventoryItem && (
                <IconButton
                  className={closeButton}
                  onClick={() =>
                    cellProps.handleRemoveCard(idx, cellProps.values)
                  }
                >
                  <Cancel />
                </IconButton>
              )}
              <InventoryCard
                key={item_code}
                rowImages={rowImages}
                setRowImages={setRowImages}
                setOpenImageModal={setOpenImageModal}
                handleOpenWebcam={handleOpenWebcam}
                setCurrentRow={setCurrentRow}
                cellProps={cellProps}
                {...props}
              />
            </section>
          );
        })}
      </Box>
      {showWebcam && (
        <figure className={webCamWrapper}>
          <WebCamCapture
            saveImages={(image) => saveImageForRow(currentRow, image)}
            Webstyle={{
              height: '100%',
              width: '100%',
            }}
            constraints={{ height: '100%', width: '100%' }}
            handleUpload={handleCloseWebcam}
            upload={showWebcam}
            viewType="fullScreen"
            showImagePreview
          />
        </figure>
      )}
      <ImageGalleryModal
        openImageModal={openImageModal}
        setOpenImageModal={setOpenImageModal}
        images={rowImages[currentRow] || []}
        currentRow={currentRow}
        setRowImages={setRowImages}
        isEditable={cellProps.isEditable}
      />
    </>
  );
};

export default InventoryAuditMobile;
