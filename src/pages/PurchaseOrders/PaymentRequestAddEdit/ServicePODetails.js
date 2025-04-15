import { Box } from '@mui/material';
import { GridListView } from 'Components';
import { LibraryGrid, LibraryText } from 'vg-library/core';

import { calculateRemainingPayment } from '../utils';

import AdvanceAdjustment from './AdvanceAdjustment';
import { SERVICE_PO_DETAILS_COLUMN } from './columns';

const ServicePODetails = ({
  purchaseItems,
  advAdjustmentUtils,
  poId,
  purchaseValues,
}) => {
  const { totalTaxableAmt, totalGST, totalPayment } = purchaseValues;

  const config = [
    {
      label: 'Taxable Amount: ',
      value: totalTaxableAmt,
    },
    {
      label: 'GST: ',
      value: totalGST,
    },
    {
      label: 'Total: ',
      value: totalPayment,
    },
  ];
  return (
    <Box mt={2}>
      <Box mb={2}>
        <GridListView
          data={purchaseItems}
          columns={SERVICE_PO_DETAILS_COLUMN}
        />
      </Box>
      <LibraryGrid container direction="column" alignItems="flex-end" gap={2}>
        {config.map(({ label, value }) => {
          return (
            <LibraryGrid
              container
              direction="row"
              justifyContent="flex-end"
              key={label}
            >
              <LibraryGrid item md={2}>
                <LibraryText>
                  <b>{label}</b>
                </LibraryText>
              </LibraryGrid>
              <LibraryGrid item md={1} alignItems="flex-end">
                <LibraryText>{value}</LibraryText>
              </LibraryGrid>
            </LibraryGrid>
          );
        })}
      </LibraryGrid>
      <AdvanceAdjustment
        poId={poId}
        {...advAdjustmentUtils}
        calculateTotalPaymentAfterAdjustments={calculateRemainingPayment(
          totalGST + totalTaxableAmt,
        )}
      />
    </Box>
  );
};

export default ServicePODetails;
