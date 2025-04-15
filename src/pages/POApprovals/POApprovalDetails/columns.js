import { IconButton } from '@mui/material';
import { AppIcons } from 'Components';
import { toFixedNumber } from 'Utilities';
import { GST_LIST } from 'Utilities/constants';
import { LibraryText } from 'vg-library/core';

const COLUMNS = [
  {
    key: 'index',
    header: 'SR No',
  },
  {
    key: 'item_code',
    header: 'Item/Service ID:',
    render: ({ rowData, props }) => {
      const { getInventory, isInventoryApiInProgress, itemCodeWrapper } = props;
      const { packaging_item, service_type } = rowData;

      if (!packaging_item && !service_type) return null;

      if (service_type?.id) {
        return service_type.id;
      }

      return (
        <article className={itemCodeWrapper} data-cy="nfi.poApproval.Item">
          {packaging_item.item_code}
          <IconButton
            disabled={isInventoryApiInProgress}
            onClick={() =>
              getInventory(packaging_item.id, packaging_item.item_code)
            }
          >
            <AppIcons name="eyeIcon" />
          </IconButton>
        </article>
      );
    },
  },
  {
    key: 'item_name',
    header: 'Item/Service Name:',
    render: ({ rowData }) => {
      const { packaging_item, service_type } = rowData || {};

      const { item_name } = packaging_item || {};
      const { name } = service_type || {};

      return item_name || name || '';
    },
  },
  {
    key: 'description',
    header: 'Item/Service Description:',
    render: ({ rowData }) => {
      const { packaging_item, description } = rowData || {};
      return <> {packaging_item?.description || description || '-'}</>;
    },
  },
  {
    key: 'uom_name',
    header: 'UoM',
  },
  {
    key: 'conversion_rate',
    header: 'Conversion Rate',
  },
  {
    key: 'quantity_conversion',
    header: 'Quantity',
  },
  {
    key: 'rate_uom',
    header: 'Rate / UoM:',
    render: ({ rowData }) => <> {rowData?.rate_uom || ''}</>,
  },
  {
    key: 'gst',
    header: 'GST %',
    render: ({ rowData }) =>
      GST_LIST.find(({ value }) => value === rowData?.gst)?.text || '',
  },
  {
    key: 'total',
    header: 'Total Amount:',
    render: ({ rowData }) => {
      const gstPercent = +rowData.gst >= 0 ? +rowData.gst : 0;
      return (
        <>
          {' '}
          {`₹ ${toFixedNumber(+rowData.agreed_value * (1 + gstPercent / 100))}`}
        </>
      );
    },
  },
];

export const INVENTORY_COLUMNS = [
  {
    key: 'dc_name',
    header: 'DC Name',
    render: ({ rowData: { dc_name, totalTransitQty } }) => {
      if (totalTransitQty)
        return (
          <LibraryText variant="h6">
            <strong>{totalTransitQty}</strong>
          </LibraryText>
        );

      return dc_name;
    },
  },
  {
    key: 'current_quantity',
    header: 'Available Quantity',
  },
];

export default COLUMNS;
