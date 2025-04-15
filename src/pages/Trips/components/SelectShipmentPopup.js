import React, { useEffect, useState } from 'react';
import { Box, Checkbox, Typography } from '@mui/material';
import AppButton from 'Components/AppButton';
import CustomModal from 'Components/Modal';
import Table from 'Components/Table';
import { getShipmentsList } from 'Services/trips';
import { SELECT_SHIPMENT_TITLE } from 'Utilities/constants/trips';

import { classes } from '../style';

const AddressRenderer = ({ name, type, address }) => {
  return (
    <Box>
      <Typography component="div">
        <b>
          {type} - {name}
        </b>
      </Typography>
      <Typography component="div">{address}</Typography>
    </Box>
  );
};

const tableColumns = [
  {
    header: 'Shipment',
    key: '',
    style: { textAlign: 'center' },
    render: ({ rowData, props }) => {
      const { shipmentIdentifier } = classes();
      const { id, identifier } = rowData;
      const { addedShipments, setAddedShipments } = props;

      const isCheckBoxSelected = addedShipments[id];

      const handleCheckboxCliked = (_, val) => {
        const currentSelectedShipments = { ...addedShipments };

        if (!val) delete currentSelectedShipments[id];
        else currentSelectedShipments[id] = rowData;

        setAddedShipments(currentSelectedShipments);
      };

      return (
        <Box className={shipmentIdentifier}>
          <Checkbox
            checked={isCheckBoxSelected}
            onChange={handleCheckboxCliked}
            color="primary"
          />
          <Typography component="div">{identifier}</Typography>
        </Box>
      );
    },
  },
  {
    header: 'Sender',
    key: '',
    render: ({ rowData }) => {
      const {
        sender_name: name,
        sender_type: type,
        sender_address: address,
      } = rowData;
      return <AddressRenderer name={name} type={type} address={address} />;
    },
  },
  {
    header: 'Recipient',
    key: '',
    render: ({ rowData }) => {
      const {
        recipient_name: name,
        recipient_type: type,
        recipient_address: address,
      } = rowData;
      return <AddressRenderer name={name} type={type} address={address} />;
    },
  },
];

const AddShipmentPopup = ({
  open = true,
  onClose,
  setSelectedShipments,
  selectedShipments,
  tripId,
}) => {
  const [shipments, setShipments] = useState([]);
  const [addedShipments, setAddedShipments] = useState(selectedShipments);

  useEffect(() => {
    getShipmentsList(tripId).then((res) => {
      const { items = [] } = res || {};
      setShipments(items);
    });
  }, []);

  const handleShipmentsSelected = () => {
    setSelectedShipments(addedShipments);
    onClose();
  };

  const footer = (
    <AppButton
      color="primary"
      variant="contained"
      onClick={handleShipmentsSelected}
    >
      Select
    </AppButton>
  );

  const tableDataProps = {
    data: shipments,
    columns: tableColumns,
    cellProps: () => ({
      setAddedShipments,
      addedShipments,
    }),
  };

  return (
    <CustomModal
      open={open}
      width80
      title={SELECT_SHIPMENT_TITLE}
      footerComponent={footer}
      onClose={onClose}
    >
      <Table {...tableDataProps} />
    </CustomModal>
  );
};

export default AddShipmentPopup;
