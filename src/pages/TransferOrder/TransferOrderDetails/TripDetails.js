import React, { useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Grid, Typography } from '@mui/material';
import AppButton from 'Components/AppButton';
import { TRIP_CATEGORY_TYPES } from 'Utilities/constants/trips';
import { getFormattedDateTime } from 'Utilities/dateUtils';
import RouteTransformer from 'Routes/routeTransformer';

import {
  BoldTypography,
  BottomMarginGrid,
  classes,
  GridButtonContainer,
  MarginGridContainer,
  StyledPaper,
  TopMarginGrid,
} from './styled';
import UploadRcandLicense from './UploadRcandLicense';
import VehicleArrivalModal from './VehicleArrivalModal';
import VehicleDispatchModal from './VehicleDispatchModal';

const TripDetails = ({
  trip,
  transferOrder,
  reloadTO,
  loadTransferOrders,
  setTab,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { colorBlack } = classes();

  const toggleShowUploadModal = () => {
    setShowUploadModal(!showUploadModal);
  };

  const areTripDocumentsNeeded = () =>
    trip.trip_category !== +TRIP_CATEGORY_TYPES.MONTHLY_VEHICLE.value;

  const areTripDocumentsUploaded = () => {
    if (areTripDocumentsNeeded()) {
      return trip.trip_metadata
        .map((item) => {
          return !!item.driver_license && !!item.vehicle_rc;
        })
        .every((v) => !!v);
    }
    return true;
  };

  return (
    <StyledPaper elevation={0}>
      <BoldTypography variant="h6">Trip Details</BoldTypography>
      {!trip ? (
        <Grid container direction="column">
          <GridButtonContainer>
            <AppButton
              variant="contained"
              size="small"
              color="primary"
              className="margin-horizontal"
              href={`/app/${RouteTransformer.getAddTripsWithTransferOrderLink(
                transferOrder.id,
              )}`}
            >
              Add New Trip
            </AppButton>
            <Typography
              variant="subtitle1"
              color="textPrimary"
              className="margin-horizontal"
            >
              <strong>OR</strong>
            </Typography>
            <AppButton
              variant="contained"
              size="small"
              color="primary"
              className="margin-horizontal"
              href={`/app/${RouteTransformer.getTripsListingLink()}`}
            >
              Add An Existing Trip
            </AppButton>
          </GridButtonContainer>
        </Grid>
      ) : (
        <>
          <MarginGridContainer container direction="row" spacing={2}>
            <Grid item>
              <VehicleArrivalModal
                pickup={transferOrder.pickup}
                reloadTO={reloadTO}
              />
            </Grid>
            {areTripDocumentsNeeded() &&
              transferOrder.pickup.vehicle_arrival_time && (
                <Grid item>
                  <AppButton
                    variant="outlined"
                    size="small"
                    color="primary"
                    className={areTripDocumentsUploaded() ? colorBlack : ''}
                    onClick={toggleShowUploadModal}
                    endIcon={
                      areTripDocumentsUploaded() && (
                        <CheckCircleOutlineIcon color="primary" />
                      )
                    }
                  >
                    Upload
                  </AppButton>
                  <UploadRcandLicense
                    open={!!showUploadModal}
                    close={toggleShowUploadModal}
                    trip={trip}
                    reloadTO={reloadTO}
                  />
                </Grid>
              )}
            {areTripDocumentsUploaded() &&
              transferOrder.pickup.vehicle_arrival_time && (
                <Grid item>
                  <VehicleDispatchModal
                    pickup={transferOrder.pickup}
                    reloadTO={reloadTO}
                    loadTransferOrders={loadTransferOrders}
                    setTab={setTab}
                  />
                </Grid>
              )}
          </MarginGridContainer>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            spacing={2}
          >
            <Grid lg={3} md={12} item>
              <Typography variant="caption">Details</Typography>
              <Grid item direction="column">
                <Grid item>
                  <Typography
                    component="a"
                    color="primary"
                    href={`/app/${RouteTransformer.getTripsEditLink(trip.id)}`}
                  >
                    {trip.identifier}
                  </Typography>
                </Grid>
                <TopMarginGrid container direction="row" spacing={2}>
                  <Grid item direction="column">
                    <Typography variant="caption">Start</Typography>
                    <Typography>
                      {getFormattedDateTime(trip.start_time) || '--'}
                    </Typography>
                  </Grid>
                  <Grid item direction="column">
                    <Typography variant="caption">End</Typography>
                    <Typography>
                      {getFormattedDateTime(trip.end_time) || '--'}
                    </Typography>
                  </Grid>
                </TopMarginGrid>
              </Grid>
            </Grid>
            <Grid lg={3} md={12} item direction="column">
              <Typography variant="caption">Pickup</Typography>
              {trip.pickups.map((pickup) => (
                <Grid item key={pickup.id}>
                  <Typography>{pickup.sender_name}</Typography>
                </Grid>
              ))}
            </Grid>
            <Grid lg={3} md={12} item direction="column">
              <Typography variant="caption">Delivery</Typography>
              {trip.deliveries.map((delivery) => (
                <Grid item key={delivery.id}>
                  <Typography>{delivery.delivery_location}</Typography>
                </Grid>
              ))}
            </Grid>
            <Grid lg={3} md={12} xs={12} item>
              <Typography variant="caption">Driver</Typography>
              <Grid item>
                {trip.trip_metadata.map((item) => {
                  const { driver_details_json: { name, phone } = {} } =
                    item || {};
                  const driverDetails = phone
                    ? `${name} (${phone})`
                    : name || '';

                  return (
                    <BottomMarginGrid key={item.id}>
                      <Typography>{driverDetails}</Typography>
                      <AppButton size="small" disabled variant="outlined">
                        TRACK
                      </AppButton>
                    </BottomMarginGrid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </StyledPaper>
  );
};

export default TripDetails;
