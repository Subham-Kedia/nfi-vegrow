import SaveIcon from '@mui/icons-material/Save';
import { Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AppButton from 'Components/AppButton';
import UploadInput from 'Components/FormFields/UploadInput';
import ImageThumb from 'Components/ImageThumb';
import CustomModal from 'Components/Modal';
import { FieldArray, Formik } from 'formik';
import { updateTrip } from 'Services/trips';
import { notifyUser } from 'Utilities';
import imageDirectUpload from 'Utilities/directUpload';
import { validateRequired } from 'Utilities/formvalidation';

import { MarginGrid, MarginSpacedTypography, WidthGrid } from './styled';

// TO_DO in separate file
const useStyles = makeStyles((theme) => ({
  StyledGridItem: {
    border: `1px solid ${theme.palette.colors.gray}`,
    padding: '1rem',
    margin: '1rem 0',
  },
}));

const UploadRcandLicense = ({ open, close, trip, reloadTO }) => {
  const classes = useStyles();

  const uploadImagesAndGetData = async (metaData) => {
    const { vehicle_rc, driver_license, ...rest } = metaData;
    const data = {
      ...(vehicle_rc[0].name ? { vehicle_rc } : {}),
      ...(driver_license[0].name ? { driver_license } : {}),
    };

    await Promise.all(
      Object.entries(data).map(async ([key, items]) => {
        return await Promise.all(
          items.map((item) => imageDirectUpload(item)),
        ).then((res) => {
          data[key] = res.filter(Boolean).map(({ data: dt }) => dt.signed_id);
        });
      }),
    );

    return {
      ...rest,
      ...(Object.entries(data).reduce((acc, [key, value]) => {
        if (value.length) {
          acc[key] = value[0];
        }
        return acc;
      }, {}) || {}),
    };
  };

  const submitForm = async (values, { setSubmitting }) => {
    // TODO: throttle for avoiding multiple submit
    setSubmitting(true);

    const uploadedImages = await Promise.all(
      values.trip_metadata.map(uploadImagesAndGetData),
    );

    const updatedData = {
      trip_metadata: uploadedImages,
    };

    updateTrip({ trip: updatedData }, trip.id)
      .then(() => {
        setSubmitting(false);
        notifyUser('Trip updated successfully.');
        reloadTO();
      })
      .finally(() => {
        close(true);
      });
  };

  return (
    <Formik
      initialValues={{ trip_metadata: trip.trip_metadata }}
      onSubmit={submitForm}
    >
      {({ values, isSubmitting, handleSubmit }) => (
        <CustomModal
          halfWidth
          open={open}
          onClose={close}
          title="Upload Driver License and RC"
          footerComponent={
            <AppButton
              startIcon={<SaveIcon />}
              variant="contained"
              size="small"
              color="primary"
              type="submit"
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              SAVE
            </AppButton>
          }
        >
          <Grid container direction="row" spacing={0}>
            <FieldArray
              name="trip_metadata"
              render={() => {
                return values.trip_metadata.map((item, index) => (
                  <Grid item className={classes.StyledGridItem} key={item.id}>
                    <>
                      <Typography
                        variant="subtitle1"
                        className="title"
                        color="textPrimary"
                      >
                        <strong>Driver {index + 1}:</strong>
                        <br />
                        {item.driver_details_json.name}
                        <br />
                        {item.driver_details_json.phone}
                        <br />
                        {item.vehicle_details_json.number}
                      </Typography>
                      <MarginSpacedTypography
                        variant="subtitle1"
                        className="title"
                      >
                        <strong>Upload Documents*</strong>
                      </MarginSpacedTypography>
                      <WidthGrid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sm={12}
                      >
                        <Grid item>
                          <UploadInput
                            label="Upload RC"
                            accept="image/*, application/pdf"
                            name={`trip_metadata.${index}.vehicle_rc`}
                            required
                            validate={validateRequired}
                          />
                        </Grid>
                        <Grid item>
                          <UploadInput
                            label="Upload License"
                            accept="image/*, application/pdf"
                            name={`trip_metadata.${index}.driver_license`}
                            required
                            validate={validateRequired}
                          />
                        </Grid>
                      </WidthGrid>
                      <MarginGrid
                        container
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sm={12}
                      >
                        {values.trip_metadata[index].vehicle_rc && (
                          <Grid item>
                            <ImageThumb
                              title="Vehicle RC"
                              file={values.trip_metadata[index].vehicle_rc[0]}
                              url={values.trip_metadata[index].vehicle_rc}
                            />
                          </Grid>
                        )}
                        {values.trip_metadata[index].driver_license && (
                          <Grid item>
                            <ImageThumb
                              title="Driver license"
                              file={
                                values.trip_metadata[index].driver_license[0]
                              }
                              url={values.trip_metadata[index].driver_license}
                            />
                          </Grid>
                        )}
                      </MarginGrid>
                    </>
                  </Grid>
                ));
              }}
            />
          </Grid>
        </CustomModal>
      )}
    </Formik>
  );
};

export default UploadRcandLicense;
