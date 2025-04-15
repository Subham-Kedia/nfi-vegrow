import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { AppButton, ImageThumb } from 'Components';
import { FieldCombo, UploadInput } from 'Components/FormFields';
import { FieldArray } from 'formik';
import { getPartners } from 'Services/purchaseOrder';
import { validateRequired } from 'Utilities/formvalidation';

import { ImageListWrapper } from '../styled';

const Quotation = ({
  values,
  filterOptions,
  setFieldValue,
  quotation_initial,
  disabled,
}) => {
  const [partners, setPartners] = useState([]);

  const getUpdatedPartners = (query) => {
    getPartners({ q: query }).then((res) => {
      setPartners(res?.items || []);
    });
  };

  return (
    <FieldArray
      name="quotation_attributes"
      render={(arrayHelpers) => {
        return (
          <Grid container item direction="column" spacing={1}>
            <Grid item style={{ marginTop: '0.5rem' }}>
              <Grid
                item
                container
                direction="row"
                alignItems="center"
                justifyContent="start"
                style={{ marginTop: '1rem' }}
                spacing={1}
              >
                <Grid item>
                  <Typography
                    variant="subtitle1"
                    className="title"
                    color="textPrimary"
                  >
                    <strong>OTHER QUOTATIONS</strong>
                  </Typography>
                </Grid>
                <Grid item>
                  <AppButton
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() =>
                      arrayHelpers.insert(
                        values.quotation_attributes.length,
                        quotation_initial,
                      )
                    }
                    disabled={disabled}
                  >
                    Add
                  </AppButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="row"
              alignItems="center"
              justifyContent="start"
              spacing={1}
            >
              {values.quotation_attributes.map((value, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Grid key={index} item md={3} sm={12}>
                  <Card>
                    <CardContent>
                      <Grid
                        container
                        spacing={1}
                        data-cy="nfi.po.otherQuotationCard"
                      >
                        <Grid
                          container
                          justifyContent="space-between"
                          style={{ margin: '0.5rem 0' }}
                          alignItems="center"
                        >
                          <FieldCombo
                            name={`quotation_attributes.${index}.partner`}
                            label="Vendor"
                            placeholder="Vendor"
                            variant="outlined"
                            options={partners}
                            required
                            data-cy="nfi.po.otherQuotationVendors"
                            validate={validateRequired}
                            optionLabel={(obj) => obj?.name || ''}
                            onChangeInput={(query) => getUpdatedPartners(query)}
                            filterOptions={filterOptions}
                            style={{ width: '100%' }}
                            onChange={() =>
                              setFieldValue(
                                `quotation_attributes.${index}.quotation_file`,
                                null,
                              )
                            }
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
                            <strong>Quotation L{index + 2}</strong>
                          </Typography>
                          <UploadInput
                            accept="image/*, application/pdf"
                            name={`quotation_attributes.${index}.quotation_file`}
                            data-cy="nfi.po.otherQuotationUpload"
                            multiple={false}
                            required
                            validate={validateRequired}
                          />
                        </Grid>
                        <Grid container justifyContent="space-between">
                          <ImageListWrapper>
                            {values.quotation_attributes?.[index]
                              ?.quotation_file &&
                              values.quotation_attributes?.[index]
                                ?.quotation_file?.length && (
                                <ImageThumb
                                  url={
                                    values.quotation_attributes?.[index]
                                      ?.quotation_file || ''
                                  }
                                  file={
                                    values.quotation_attributes?.[index]
                                      ?.quotation_file?.[0] || ''
                                  }
                                  style={{ height: '4rem', width: '4rem' }}
                                />
                              )}
                          </ImageListWrapper>
                          <Grid
                            item
                            justifyContent="flex-end"
                            style={{ margin: '0.3rem 0' }}
                            alignItems="end"
                          >
                            <AppButton
                              variant="contained"
                              size="small"
                              color="inherit"
                              style={{ marginLeft: '0.5rem' }}
                              data-cy="nfi.po.otherQuotationRemove"
                              onClick={() => {
                                arrayHelpers.remove(index);
                              }}
                            >
                              Remove
                            </AppButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

export default Quotation;
