import { useState } from 'react';
import { Grid } from '@mui/material';
import { AppLoader } from 'Components';
import { endTrips } from 'Services/trips';

import UndoPopup from '../components/UndoPopup';
import { classes } from '../style';

import {
  Actions,
  AddressInfo,
  Attachments,
  DriverInfo,
  TripIndentifier,
} from './columnGenerator';

const TripsListing = ({
  data,
  enableEndTrip,
  fetchTripsData,
  disableEditTrip,
}) => {
  const [undoPopupId, setUndoPopupId] = useState(-1);
  const [loading, setLoading] = useState(false);
  const { noDataPage, cardContainer } = classes();

  if (!data.length)
    return <main className={noDataPage}>NO DATA AVAILABLE</main>;

  if (loading) return <AppLoader />;

  const endTripHandler = (endTime) => {
    setLoading(true);
    endTrips(undoPopupId, { endTime }).then(
      () => {
        setLoading(false);
        setUndoPopupId(-1);
        fetchTripsData();
      },
      () => {
        setLoading(false);
      },
    );
  };

  const listingUI = data.map((d, idx) => {
    const {
      id,
      identifier,
      trip_category,
      delivery_locations,
      pickup_locations,
      trip_metadata,
      payment_requests,
    } = d;
    return (
      <>
        <Grid container className={cardContainer}>
          <TripIndentifier
            identifier={identifier}
            id={id}
            disableEdit={disableEditTrip}
          />
          <AddressInfo address={pickup_locations} />
          <AddressInfo address={delivery_locations} header="DELIVERY" />
          <Attachments tripsData={trip_metadata} />
          <DriverInfo
            tripsData={trip_metadata}
            paymentRequests={payment_requests}
            tripId={id}
            tripCategory={trip_category}
          />
          <Actions
            enableEndTrip={enableEndTrip}
            setUndoPopupId={setUndoPopupId}
            id={id}
          />
        </Grid>
        {idx !== data.length - 1 && <br />}
      </>
    );
  });

  return (
    <main>
      <section>
        {listingUI}
        {undoPopupId !== -1 && (
          <UndoPopup
            setUndoPopupId={setUndoPopupId}
            tripId={undoPopupId}
            endTripHandler={endTripHandler}
          />
        )}
      </section>
    </main>
  );
};

export default TripsListing;
