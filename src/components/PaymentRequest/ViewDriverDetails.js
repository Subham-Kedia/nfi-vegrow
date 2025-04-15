import React from 'react';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const ViewDriverDetails = ({ trip = {}, trip_meta_info }) => {
  const { identifier } = trip;
  const {
    driver_license = '',
    vehicle_rc = '',
    driver_details_json: { name, phone } = {},
    vehicle_details_json: { type, number } = {},
  } = trip_meta_info;

  return (
    <>
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <Typography variant="button">Trip:</Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">{identifier}</Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <Typography variant="button">Driver:</Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">
            {name} {phone && `(${phone})`}
          </Typography>
        </Grid>
        {driver_license && (
          <Grid item>
            <Link href={driver_license} target="_blank" download>
              Driver License
            </Link>
          </Grid>
        )}
      </Grid>
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <Typography variant="button">Vehicle:</Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">
            {type} {number && `(${number})`}
          </Typography>
        </Grid>
        {vehicle_rc && (
          <Grid item>
            <Link href={vehicle_rc} target="_blank" download>
              Vehicle RC
            </Link>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default ViewDriverDetails;
