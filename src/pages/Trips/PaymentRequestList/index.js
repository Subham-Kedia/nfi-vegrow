import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material';
import PageLayout from 'App/PageLayout';
import { AppButton, GridListView } from 'Components';
import useTripsAccess from 'Hooks/useRoleBasedAccess';
import RouteTransformer from 'Routes/routeTransformer';
import { getPaymentListing } from 'Services/payments';

import { PaymentRequestListColumns } from './paymentRequestListColumns';
import { MaxHeightGrid } from './styled';

const PaymentRequestList = () => {
  const navigate = useNavigate();
  const [paymentList, setPaymentList] = useState([]);

  const { tripId } = useParams();

  const hasLimitedAccessToTrips = useTripsAccess();

  useEffect(() => {
    getPaymentListing({ nfi_trip_id: tripId }).then((res) =>
      setPaymentList(res.items),
    );
  }, [tripId]);

  const createPaymentRequest = () => {
    navigate(`/app/${RouteTransformer.getAddPrLink(tripId)}`);
  };

  const uploadDocuments = (prVendors) => {
    window.open(`${API.CRMUrl}partners/${prVendors.id}`);
  };

  const titleComponent = !hasLimitedAccessToTrips && (
    <AppButton onClick={createPaymentRequest} startIcon={<AddIcon />}>
      New Payment Request
    </AppButton>
  );

  return (
    <PageLayout
      title={`Payment Request for Trip: ${tripId}`}
      titleComponent={titleComponent}
    >
      <PageLayout.Body>
        {paymentList.length ? (
          <GridListView
            data={paymentList}
            columns={PaymentRequestListColumns}
            cellProps={{
              tripId,
              uploadDocuments,
              navigate,
              hasLimitedAccessToTrips,
            }}
          />
        ) : (
          <MaxHeightGrid container justifyContent="center" alignItems="center">
            <Typography variant="h5" gutterBottom>
              No Payment Request Available
            </Typography>
          </MaxHeightGrid>
        )}
      </PageLayout.Body>
    </PageLayout>
  );
};

export default PaymentRequestList;
