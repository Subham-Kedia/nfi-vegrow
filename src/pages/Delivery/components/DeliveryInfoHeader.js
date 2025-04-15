import React from 'react';
import { Grid } from '@mui/material';

import { classes } from '../styled';

const HeaderLabelWrapper = ({ children, md = 3, xs = 3 }) => {
  const { headerLabel } = classes();
  return (
    <Grid item md={md} xs={xs} className={headerLabel}>
      {children}
    </Grid>
  );
};

const DeliveryInfoHeader = () => {
  const { deliveryHeaderWrapper } = classes();

  return (
    <Grid container className={deliveryHeaderWrapper}>
      <HeaderLabelWrapper>Delivery ID</HeaderLabelWrapper>
      <HeaderLabelWrapper>Source</HeaderLabelWrapper>
      <HeaderLabelWrapper>Created At</HeaderLabelWrapper>
      <HeaderLabelWrapper>Items</HeaderLabelWrapper>
    </Grid>
  );
};

export default DeliveryInfoHeader;
