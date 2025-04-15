import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AppButton from 'Components/AppButton';
import CustomModal from 'Components/Modal';

const SelectShipments = ({ shipments, setSelectShipmentIds }) => {
  const [open, setOpen] = useState(false);
  const [selectShipment, setSelectShipment] = useState([]);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const submitSelectShipment = () => {
    setSelectShipmentIds(selectShipment);
    closeModal();
  };

  const updateSelectedShipment = (sId) => {
    if (selectShipment.indexOf(sId) > -1) {
      setSelectShipment(selectShipment.filter((s) => s !== sId));
    } else {
      setSelectShipment([sId]);
    }
  };

  return (
    <>
      <AppButton
        fullWidth
        onClick={openModal}
        style={{ margin: '8px', maxWidth: '300px' }}
        size="medium"
      >
        <Typography variant="button">Select Shipment</Typography>
      </AppButton>
      <CustomModal
        isLoading={false}
        title="Select Shipment"
        open={open}
        onClose={closeModal}
        fullScreen
        footerComponent={
          <AppButton
            startIcon={<SaveIcon />}
            loading={false}
            disabled={!selectShipment}
            type="submit"
            onClick={submitSelectShipment}
          >
            Save
          </AppButton>
        }
      >
        <div style={{ minHeight: '100px' }}>
          <Grid container direction="column" spacing={0}>
            {(shipments || []).map((s) => (
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <Checkbox
                  color="primary"
                  onChange={() => updateSelectedShipment(s.id)}
                  checked={selectShipment.indexOf(s.id) > -1}
                  style={{ padding: '0 8px' }}
                  disabled={s.has_payment_request || s.actual_quantity === 0}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="body1"
                    style={{
                      marginRight: '4px',
                      cursor: 'pointer',
                      color: s.has_payment_request
                        ? '#808080c9'
                        : 'textPrimary',
                    }}
                    onClick={() =>
                      s.has_payment_request ? '' : updateSelectedShipment(s.id)
                    }
                  >
                    <b>{s.identifier.replace('SHIP', 'GRN')}</b>
                  </Typography>
                  <Typography variant="body2" color="textPrimary">
                    {s.recipient_name}
                  </Typography>
                  <Typography variant="body2" color="textPrimary">
                    {s.recipient_address}
                  </Typography>
                </div>
              </div>
            ))}
            {shipments?.length === 0 && (
              <Typography
                variant="h6"
                component="h6"
                style={{ textAlign: 'center' }}
              >
                No Shipments Available
              </Typography>
            )}
          </Grid>
        </div>
      </CustomModal>
    </>
  );
};

export default SelectShipments;
