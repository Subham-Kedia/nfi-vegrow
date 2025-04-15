import { useEffect, useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { AppButton, ImageThumb } from 'Components';
import { FieldCombo, FieldInput, UploadInput } from 'Components/FormFields';
import CustomModal from 'Components/Modal';
import { FieldArray, Formik } from 'formik';
import {
  createQualityReport,
  getQualityReport,
  updateQualityReport,
} from 'Services/shipment';
import imageDirectUpload from 'Utilities/directUpload';
import { validateRequired } from 'Utilities/formvalidation';

import { ImageListWrapper } from './style';

const QualityReport = ({
  lots,
  shipment_id,
  isDisabled = false,
  style,
  label,
  buttonVariant = 'contained',
  source = false,
  report_id,
  callback = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState({ quality_samples_attributes: [{}] });

  useEffect(() => {
    if (report_id) {
      getQualityReport(report_id).then((res) => setReports(res));
    }
  }, [report_id]);

  const submitReports = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    const { summary: { 0: summaryFile } = [], quality_samples_attributes } =
      values;
    const { data: summaryData = {} } =
      (await imageDirectUpload(summaryFile)) || {};
    const postData = await Promise.all(
      quality_samples_attributes.map(async (report) => {
        const {
          clean_photos,
          reject_photos,
          defect_photos,
          undersized_photos,
          all_photos,
          lot,
          net_weight,
          ...rest
        } = report;

        const data = {
          ...(clean_photos ? { clean_photos } : {}),
          ...(reject_photos ? { reject_photos } : {}),
          ...(defect_photos ? { defect_photos } : {}),
          ...(undersized_photos ? { undersized_photos } : {}),
          ...(all_photos ? { all_photos } : {}),
        };

        await Promise.all(
          Object.entries(data).map(async ([key, values]) => {
            return await Promise.all(
              values.map((value) => imageDirectUpload(value)),
            ).then((res) => {
              data[key] = res
                .filter(Boolean)
                .map(({ data }) => data?.signed_id);
            });
          }),
        );

        return {
          lot_id: lot?.id,
          net_weight: +net_weight,
          // Remove all photos array if the don't have any
          ...(Object.entries(data).reduce((acc, [key, value]) => {
            if (value.length) {
              acc[key] = value;
            }
            return acc;
          }, {}) || {}),
          ...rest,
        };
      }),
    );

    const processQualityReport = report_id
      ? updateQualityReport
      : createQualityReport;

    processQualityReport(
      {
        quality_report: {
          source,
          report_type: 1,
          shipment_id,
          summary: summaryData?.signed_id,
          quality_samples_attributes: postData,
        },
      },
      report_id,
    )
      .then(() => {
        closeModal();
        return callback();
      })
      .finally(() => {
        setSubmitting(false);
        resetForm();
      });
  };

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Formik enableReinitialize initialValues={reports} onSubmit={submitReports}>
      {({ handleSubmit, values, isSubmitting }) => (
        <>
          <AppButton
            variant={buttonVariant}
            size="medium"
            onClick={openModal}
            style={{ cursor: 'pointer', width: '100%', ...style }}
            disabled={isDisabled}
            endIcon={
              report_id && (
                <CheckCircleOutlineIcon
                  color={buttonVariant === 'outlined' ? 'primary' : 'default'}
                />
              )
            }
          >
            {label || (source ? 'PQR' : 'AQR')}
          </AppButton>
          <CustomModal
            title="Quality report"
            open={open}
            onClose={closeModal}
            fullScreen
            footerComponent={
              <AppButton
                type="submit"
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Submit
              </AppButton>
            }
          >
            <Grid container spacing={1}>
              <Grid
                container
                alignItems="center"
                style={{
                  margin: '0.3rem 0',
                  padding: '1rem 0',
                  borderTop: '1px solid #000',
                  borderBottom: '1px solid #000',
                }}
              >
                <Typography
                  variant="h6"
                  style={{ marginRight: '1rem' }}
                  component="span"
                  color="textPrimary"
                >
                  <strong>Summary File</strong>
                </Typography>
                <UploadInput
                  accept="image/*, application/pdf"
                  name="summary"
                  multiple={false}
                  required
                  validate={validateRequired}
                />
                <ImageListWrapper>
                  {values.summary && (
                    <ImageThumb
                      file={values?.summary?.[0]}
                      url={values?.summary}
                      style={{ height: '1rem', width: '1rem' }}
                    />
                  )}
                </ImageListWrapper>
              </Grid>
              <FieldArray
                name="quality_samples_attributes"
                render={(arrayHelpers) =>
                  values.quality_samples_attributes.map((value, index) => (
                    <Grid key={index} item md={3} sm={12}>
                      <Card>
                        <CardContent>
                          <Grid container spacing={1}>
                            <Grid
                              container
                              justifyContent="space-between"
                              style={{ margin: '0.5rem 0' }}
                              alignItems="center"
                            >
                              <FieldCombo
                                name={`quality_samples_attributes.${index}.lot`}
                                label="Lot"
                                placeholder="Lot"
                                variant="outlined"
                                style={{ width: '100%' }}
                                optionLabel={(obj) => obj?.label || ''}
                                options={lots}
                                disabled={!lots.length}
                                required
                                validate={validateRequired}
                              />
                            </Grid>
                            <Grid
                              container
                              justifyContent="space-between"
                              style={{ margin: '0.3rem 0' }}
                              alignItems="center"
                            >
                              <FieldInput
                                name={`quality_samples_attributes.${index}.net_weight`}
                                size="small"
                                label="Net weight"
                                placeholder="Net weight"
                                style={{ width: '100%' }}
                                variant="outlined"
                                validate={validateRequired}
                                required
                                InputLabelProps={{
                                  required: true,
                                  shrink: true,
                                }}
                              />
                            </Grid>
                            <Grid
                              container
                              justifyContent="space-between"
                              alignItems="center"
                              style={{ margin: '0.3rem 0' }}
                            >
                              <Typography
                                variant="body2"
                                style={{ marginRight: '4px' }}
                                component="span"
                                color="textPrimary"
                              >
                                <strong>Clean Photos</strong>
                              </Typography>
                              <UploadInput
                                accept="image/*, application/pdf"
                                name={`quality_samples_attributes.${index}.clean_photos`}
                                multiple
                              />
                            </Grid>
                            <Grid container alignItems="center">
                              <ImageListWrapper>
                                {values.quality_samples_attributes?.[index]
                                  ?.clean_photos &&
                                  values.quality_samples_attributes?.[
                                    index
                                  ]?.clean_photos.map((photo) => (
                                    <ImageThumb
                                      file={photo}
                                      url={photo}
                                      style={{ height: '1rem', width: '1rem' }}
                                    />
                                  ))}
                              </ImageListWrapper>
                            </Grid>
                            <Grid
                              container
                              justifyContent="space-between"
                              style={{ margin: '0.3rem 0' }}
                              alignItems="center"
                            >
                              <Typography
                                variant="body2"
                                style={{ marginRight: '4px' }}
                                component="span"
                                color="textPrimary"
                              >
                                <strong>Reject Photos</strong>
                              </Typography>
                              <UploadInput
                                accept="image/*, application/pdf"
                                name={`quality_samples_attributes.${index}.reject_photos`}
                                multiple
                              />
                            </Grid>
                            <Grid container alignItems="center">
                              <ImageListWrapper>
                                {values.quality_samples_attributes?.[index]
                                  ?.reject_photos &&
                                  values.quality_samples_attributes?.[
                                    index
                                  ]?.reject_photos.map((photo) => (
                                    <ImageThumb
                                      file={photo}
                                      url={photo}
                                      style={{ height: '1rem', width: '1rem' }}
                                    />
                                  ))}
                              </ImageListWrapper>
                            </Grid>
                            <Grid
                              container
                              justifyContent="space-between"
                              style={{ margin: '0.3rem 0' }}
                              alignItems="center"
                            >
                              <Typography
                                variant="body2"
                                style={{ marginRight: '4px' }}
                                component="span"
                                color="textPrimary"
                              >
                                <strong>Defect Photos</strong>
                              </Typography>
                              <UploadInput
                                accept="image/*, application/pdf"
                                name={`quality_samples_attributes.${index}.defect_photos`}
                                multiple
                              />
                            </Grid>
                            <Grid container alignItems="center">
                              <ImageListWrapper>
                                {values.quality_samples_attributes?.[index]
                                  ?.defect_photos &&
                                  values.quality_samples_attributes?.[
                                    index
                                  ]?.defect_photos.map((photo) => (
                                    <ImageThumb
                                      file={photo}
                                      url={photo}
                                      style={{ height: '1rem', width: '1rem' }}
                                    />
                                  ))}
                              </ImageListWrapper>
                            </Grid>
                            <Grid
                              container
                              justifyContent="space-between"
                              style={{ margin: '0.3rem 0' }}
                              alignItems="center"
                            >
                              <Typography
                                variant="body2"
                                style={{ marginRight: '4px' }}
                                component="span"
                                color="textPrimary"
                              >
                                <strong>Undersized Photos</strong>
                              </Typography>
                              <UploadInput
                                accept="image/*, application/pdf"
                                name={`quality_samples_attributes.${index}.undersized_photos`}
                                multiple
                              />
                            </Grid>
                            <Grid container alignItems="center">
                              <ImageListWrapper>
                                {values.quality_samples_attributes?.[index]
                                  ?.undersized_photos &&
                                  values.quality_samples_attributes?.[
                                    index
                                  ]?.undersized_photos.map((photo) => (
                                    <ImageThumb
                                      file={photo}
                                      url={photo}
                                      style={{ height: '1rem', width: '1rem' }}
                                    />
                                  ))}
                              </ImageListWrapper>
                            </Grid>
                            <Grid
                              container
                              justifyContent="space-between"
                              style={{ margin: '0.3rem 0' }}
                              alignItems="center"
                            >
                              <Typography
                                variant="body2"
                                style={{ marginRight: '4px' }}
                                component="span"
                                color="textPrimary"
                              >
                                <strong>All Photos</strong>
                              </Typography>
                              <UploadInput
                                accept="image/*, application/pdf, video/*"
                                name={`quality_samples_attributes.${index}.all_photos`}
                                multiple
                              />
                            </Grid>
                            <Grid container alignItems="center">
                              <ImageListWrapper>
                                {values.quality_samples_attributes?.[index]
                                  ?.all_photos &&
                                  values.quality_samples_attributes?.[
                                    index
                                  ]?.all_photos.map((photo) => (
                                    <ImageThumb
                                      file={photo}
                                      url={photo}
                                      style={{ height: '1rem', width: '1rem' }}
                                    />
                                  ))}
                              </ImageListWrapper>
                            </Grid>
                            <Grid
                              container
                              justifyContent="flex-end"
                              style={{ margin: '0.3rem 0' }}
                              alignItems="center"
                            >
                              {values.quality_samples_attributes.length > 1 && (
                                <AppButton
                                  color="inherit"
                                  style={{ marginLeft: '0.5rem' }}
                                  onClick={() => {
                                    arrayHelpers.remove(index);
                                  }}
                                >
                                  Remove
                                </AppButton>
                              )}
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                      <Grid item style={{ marginTop: '0.5rem' }}>
                        {values.quality_samples_attributes.length - 1 ===
                          index && (
                          <AppButton
                            onClick={() =>
                              arrayHelpers.insert(
                                values.quality_samples_attributes.length,
                                {},
                              )
                            }
                          >
                            Add
                          </AppButton>
                        )}
                      </Grid>
                    </Grid>
                  ))
                }
              />
            </Grid>
          </CustomModal>
        </>
      )}
    </Formik>
  );
};

export default QualityReport;
