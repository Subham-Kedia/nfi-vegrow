import React from 'react';
import { Box, Card, Typography, useTheme } from '@mui/material';

import { classes } from '../style';

const DeliveryDetailsCard = ({ cardInfoConstant, selectedShipments }) => {
  const { HEADER, ADDRESS_KEY } = cardInfoConstant;
  const {
    palette: { colors },
  } = useTheme();
  const {
    deliveryDetailsCard,
    deliveryDetailsCardAddress,
    detailsSubContainer,
    deliveryDetailsHeader,
  } = classes();

  return (
    <Box>
      <Typography component="h2" className={deliveryDetailsHeader}>
        <strong>{HEADER}</strong>
      </Typography>
      <Box bgcolor={colors.darkGray} className={detailsSubContainer}>
        {Object.values(selectedShipments).map((shipment) => (
          <>
            <Card className={deliveryDetailsCard}>
              <Typography component="h2" color="primary">
                <strong>{shipment.identifier}</strong>
              </Typography>
              <Typography className={deliveryDetailsCardAddress}>
                <span>
                  <strong>Address: </strong>
                  {shipment[ADDRESS_KEY]}
                </span>
              </Typography>
            </Card>
          </>
        ))}
      </Box>
    </Box>
  );
};

export default DeliveryDetailsCard;
