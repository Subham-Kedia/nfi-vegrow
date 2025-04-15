import { useEffect, useState } from 'react';
import { AppButton, CustomModal, FloatingButton } from 'Components';
import { FieldCombo } from 'Components/FormFields';
import { useFormikContext } from 'formik';
import { getZeroOrNoInventory } from 'Services/lots';

import { FIELD_NAME } from '../constants';

const AddNewItems = ({
  handleSubmit,
  selectedItems = [],
  inventoryData = [],
}) => {
  const [open, setOpen] = useState(false);
  const [zeroInventoryData, setZeroInventoryData] = useState([]);

  const { values, setFieldValue } = useFormikContext();

  const selectedItemsIds = new Set(
    selectedItems.map(({ nfi_packaging_item_id }) => nfi_packaging_item_id),
  );

  const inventoryDataIds = new Set(
    inventoryData.map(({ nfi_packaging_item_id }) => nfi_packaging_item_id),
  );

  useEffect(() => {
    if (open && !zeroInventoryData.length) {
      getZeroOrNoInventory().then(({ items }) => {
        const inventoryItems = items.map(
          ({
            id,
            available_quantity,
            grade_c_quantity,
            packed_lot_quantity,
            item_code,
            item_name,
          }) => ({
            nfi_packaging_item_id: id,
            available_qty: available_quantity,
            damaged_qty: grade_c_quantity,
            packed_lot_qty: packed_lot_quantity,
            item_code,
            item_name,
          }),
        );
        setZeroInventoryData(inventoryItems);
      });
    }
  }, [open]);

  const togglePopup = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setFieldValue('additionalItems', []);
    togglePopup();
  };

  const handleAdd = () => {
    // values.additionalItems only has name and id of the item
    // newItems will have all the relevant details that BE will need
    // isZeroInventoryItem is added to identify the cards with zero inventory count as per system

    const itemIds = new Set();

    values.additionalItems.forEach((item) => {
      itemIds.add(item.id);
    });

    const newItems = zeroInventoryData
      .filter(({ nfi_packaging_item_id: id }) => itemIds.has(id))
      .map((item) => ({
        ...item,
        isZeroInventoryItem: true,
      }));

    handleSubmit(
      {
        ...values,
        additionalItems: [],
        [FIELD_NAME.INVENTORY_AUDIT_ITEMS]: [
          ...values[FIELD_NAME.INVENTORY_AUDIT_ITEMS],
          ...newItems,
        ],
      },
      newItems,
    );

    togglePopup();
  };

  const filteredInventory = zeroInventoryData.filter(
    ({ nfi_packaging_item_id: id }) =>
      !selectedItemsIds.has(id) && !inventoryDataIds.has(id),
  );

  return (
    <>
      <FloatingButton onClick={togglePopup}>+ Add Items</FloatingButton>
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Add Items"
        contentSize
        footerComponent={
          <AppButton
            disabled={!(values.additionalItems || []).length}
            onClick={handleAdd}
          >
            Add
          </AppButton>
        }
      >
        <FieldCombo
          name="additionalItems"
          label=""
          options={filteredInventory.map(
            ({ nfi_packaging_item_id, item_code }) => ({
              name: item_code,
              id: nfi_packaging_item_id,
            }),
          )}
          multiple
        />
      </CustomModal>
    </>
  );
};

export default AddNewItems;
