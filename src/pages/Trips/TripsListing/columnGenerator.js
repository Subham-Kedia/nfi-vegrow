import { Grid, Link, Typography } from '@mui/material';
import AppButton from 'Components/AppButton';
import Carousel from 'Components/Carousel';
import RouteTransformer from 'Routes/routeTransformer';
import { TRIP_CATEGORY_TYPES } from 'Utilities/constants/trips';

import { classes } from '../style';

const Header = ({ title }) => {
  return (
    <Typography className="disabled-text" component="header">
      {title}
    </Typography>
  );
};

export const TripIndentifier = ({ identifier, id, disableEdit }) => {
  const { disable } = classes();
  const link = RouteTransformer.getTripsEditLink(id);

  return (
    <Grid md={2} xs={12}>
      <Typography
        component="a"
        color="primary"
        href={link}
        className={disableEdit ? disable : ''}
      >
        {identifier}
      </Typography>
    </Grid>
  );
};

export const AddressInfo = ({ address = [], header = 'PICKUP' }) => {
  const { marginTop, addressWrapper } = classes();

  const addressUI = address.map((location, idx) => (
    <>
      <Typography component="summary">{location}</Typography>
      {idx !== address.length - 1 && <div className={marginTop} />}
    </>
  ));
  return (
    <Grid md="2" component="section" xs={12} className={addressWrapper}>
      <Header title={header} />
      {addressUI}
    </Grid>
  );
};

export const Attachments = ({ tripsData = [] }) => {
  const attachmentsUI = tripsData.map(({ vehicle_rc, driver_license }) => {
    const imageData = [
      { file: vehicle_rc, label: 'Vehicle RC' },
      { file: driver_license, label: 'Driver Liscence' },
    ];
    return (
      <Carousel imageData={imageData} key={`${vehicle_rc}-${driver_license}`} />
    );
  });

  return (
    <Grid md={2} xs={12}>
      <Header title="ATTACHMENTS" />
      {attachmentsUI}
    </Grid>
  );
};

export const DriverInfo = ({
  tripId,
  tripsData = [],
  paymentRequests,
  tripCategory,
}) => {
  const { disableLink, marginRight, marginTop } = classes();
  const prCount = paymentRequests?.length || 0;
  const { MONTHLY_VEHICLE } = TRIP_CATEGORY_TYPES;

  const driverDetailsUI = tripsData.map(
    ({ driver_details_json, vehicle_details_json }, idx) => {
      const { name, phone } = driver_details_json || {};
      const { number: vehicleNumber } = vehicle_details_json || {};

      return (
        <section key={`${name}-${phone}`}>
          <Typography component="summary">
            <Typography component="span" className={marginRight}>
              {name}
            </Typography>
            {!!phone && (
              <Typography component="span" color="primary">
                ({phone})
              </Typography>
            )}
            <Typography component="div">{vehicleNumber}</Typography>
          </Typography>
          {idx !== tripsData.length - 1 && <div className={marginTop} />}
        </section>
      );
    },
  );

  return (
    <Grid md={2} xs={12}>
      <Header title="DRIVER & VHNO" />
      {driverDetailsUI}
      <Typography component="div" color="primary" className={marginTop}>
        <Link
          href={RouteTransformer.getPrListingLink(tripId)}
          className={tripCategory === +MONTHLY_VEHICLE.value ? disableLink : ''}
        >
          <b>PAYMENT REQUEST({prCount})</b>
        </Link>
      </Typography>
    </Grid>
  );
};

export const Actions = ({ enableEndTrip, setUndoPopupId, id }) => {
  const handleUndoClick = () => {
    setUndoPopupId(id);
  };
  return (
    <Grid md={2} xs={12}>
      <Header title="ACTIONS" />
      <AppButton
        variant="outlined"
        disabled={!enableEndTrip}
        onClick={handleUndoClick}
      >
        End Trip
      </AppButton>
    </Grid>
  );
};
