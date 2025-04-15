import React from 'react';
import { Grid } from '@mui/material';
import Text from 'Components/Text';
import { getDate } from 'Utilities/dateUtils';

import { classes, CustomText } from '../styled';

const DeliveryInfoGrid = ({ children, md = 3, xs = 3 }) => {
  const { deliveryGridWrapper } = classes();
  return (
    <Grid
      item
      md={md}
      className={deliveryGridWrapper}
      xs={xs}
      data-cy="nfi.dcArrival.DeliveryInfo"
    >
      {children}
    </Grid>
  );
};

const IdentifierInfo = ({ identifier }) => {
  return (
    <DeliveryInfoGrid>
      <Text>{identifier}</Text>
    </DeliveryInfoGrid>
  );
};

const SourceInfo = ({ source }) => {
  return (
    <DeliveryInfoGrid>
      <Text>{source}</Text>
    </DeliveryInfoGrid>
  );
};

const CreatedAtInfo = ({ date }) => {
  const createdDate = getDate(date);
  return (
    <DeliveryInfoGrid>
      <Text>{createdDate}</Text>
    </DeliveryInfoGrid>
  );
};

const ItemsInfo = ({ items }) => {
  const itemList = items.map(({ id, item_identifier }, idx) => {
    return (
      <CustomText key={id} idx={idx}>
        {item_identifier}
      </CustomText>
    );
  });

  return <DeliveryInfoGrid>{itemList}</DeliveryInfoGrid>;
};

export { CreatedAtInfo, IdentifierInfo, ItemsInfo, SourceInfo };
