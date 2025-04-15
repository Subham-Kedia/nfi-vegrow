import Typography from '@mui/material/Typography';
import Table from 'Components/Table';
import { toFixedNumber } from 'Utilities';

const COLUMNS = [
  {
    key: 'item_code',
    header: 'Item Id',
    style: {
      fontSize: '0.7rem',
      maxWidth: '10rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    render: ({ data = [] }) => {
      const [first = '', second = '', third = '', fourth = ''] =
        data.split('/');
      return (
        <Typography
          variant="caption"
          component="div"
          color="textPrimary"
          data-cy="nfi.inventory.itemId"
        >
          {first}/{second} {third}/{fourth}
        </Typography>
      );
    },
  },
  {
    key: 'item_name',
    header: 'Item Name',
    style: {
      maxWidth: '10rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  },
  {
    key: 'available_quantity',
    header: 'Available Quantity',
    style: {
      maxWidth: '10rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    render: ({ rowData }) => {
      return (
        <Typography
          variant="h9"
          component="div"
          color="textPrimary"
          data-cy="nfi.inventory.availableQty"
        >
          {toFixedNumber(rowData.available_quantity || 0, 2)}{' '}
          {rowData.units_of_measurement || ''}
        </Typography>
      );
    },
  },
  {
    key: 'grade_c_quantity',
    header: 'Damaged Quantity',
    style: {
      maxWidth: '10rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    render: ({ rowData }) => toFixedNumber(rowData.grade_c_quantity, 2),
  },
  {
    key: 'packed_lot_quantity',
    header: 'Packed Lot Quantity',
    style: {
      maxWidth: '10rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  },
  {
    key: 'out_for_use_quantity',
    header: 'Out for Use Quantity',
    style: {
      maxWidth: '10rem',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  },
];

const InventoryList = ({
  selectedInventory,
  setSelectedInventory,
  showSelection,
  inventory,
}) => {
  const onSelectRow = (event) => {
    if (event?.target?.checked) {
      setSelectedInventory([
        ...new Set([...selectedInventory, Number(event?.target?.value)]),
      ]);
    } else {
      const removeIndex = selectedInventory.indexOf(
        Number(event?.target?.value),
      );
      if (removeIndex > -1) {
        selectedInventory.splice(removeIndex, 1);
        setSelectedInventory([...selectedInventory]);
      }
    }
  };

  const getFilterData = () => {
    if (showSelection === 'dump') {
      return inventory.filter(({ grade_c_quantity }) => grade_c_quantity > 0);
    }
    return inventory;
  };

  return (
    <Table
      size="medium"
      sticky
      hover
      columns={COLUMNS}
      data={getFilterData()}
      dataKey="id"
      className="shipment-table"
      isSelection={showSelection}
      onSelect={onSelectRow}
      selected={selectedInventory}
      totalRows={inventory.length}
    />
  );
};

export default InventoryList;
