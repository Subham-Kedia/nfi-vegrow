import { useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { AppButton, AppLoader } from 'Components';
import CustomModal from 'Components/Modal';
import _groupBy from 'lodash/groupBy';
import { getLots } from 'Services/lots';
import { getPaymentsById } from 'Services/purchaseOrder';

import ShipmentCard from './ShipmentCard';

const ViewShipment = ({
  shipmentIds,
  displayString,
  isLink,
  showTotalPrice = false,
  style = {},
}) => {
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [lots, setLots] = useState([]);

  useEffect(() => {
    if (open && shipmentIds.length) {
      setLoading(true);

      getLots({
        shipment_id: shipmentIds,
      })
        .then((res) => {
          if (showTotalPrice) {
            getPaymentsById({ shipment_ids: shipmentIds }).then((data) => {
              data.items[0].lots = res?.items?.map((item, index) => ({
                ...data?.items[0]?.lots[index],
                ...item,
              }));
              setLots(data?.items[0]?.lots);
            });
          } else {
            setLots(res?.items || []);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, shipmentIds]);

  const lotsByShipment = useMemo(() => _groupBy(lots, 'shipment_id'), [lots]);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const getShipmentById = (sId) => {
    const shipment =
      lots.find((l) => l.shipment_id === parseInt(sId, 10)) || {};
    return {
      ...shipment,
      lots: lotsByShipment[sId],
    };
  };

  return (
    <>
      {isLink ? (
        <Link onClick={openModal} style={{ cursor: 'pointer' }}>
          {displayString || displayString === 0
            ? displayString
            : 'View Details'}
        </Link>
      ) : (
        <AppButton variant="outlined" onClick={openModal} style={style}>
          {displayString || 'View Details'}
        </AppButton>
      )}

      <CustomModal
        isLoading={false}
        title="View Shipment"
        open={open}
        onClose={closeModal}
        fullScreen
      >
        {isLoading ? (
          <AppLoader />
        ) : (
          <Grid container direction="column" spacing={0}>
            {(Object.keys(lotsByShipment).length &&
              Object.keys(lotsByShipment).map((s) => (
                <ShipmentCard
                  key={s}
                  shipment={getShipmentById(s)}
                  showTotalPrice={showTotalPrice}
                />
              ))) ||
              'No shipment data available'}
          </Grid>
        )}
      </CustomModal>
    </>
  );
};

export default ViewShipment;
