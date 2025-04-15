import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Save as SaveIcon } from '@mui/icons-material';
import { Grid, Tooltip, Typography } from '@mui/material';
import { AppButton, GridListView } from 'Components';
import { FieldInput } from 'Components/FormFields';
import { FieldArray, Formik } from 'formik';
import { notifyUser } from 'Utilities';
import { validateRequired } from 'Utilities/formvalidation';

import BOMAPI from '../../service';
import { ACTION_COLUMNS, COLUMNS_PRIMARY, COLUMNS_SECONDARY } from '../columns';
import { generateBomID } from '../utils';

import filterCloneData from './utils';

export const PackagingBomForm = ({
  bomData,
  packagingTypes = [{}],
  loadBOMList,
  isViewFlow,
  isCloning,
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { bomId = '' } = params;

  const backHandler = (id = '') => {
    return navigate(`/app/bom/${id || ''}`);
  };

  const navigateToBomView = (id) => navigate(`/app/bom/${id}`);

  const onSubmitForm = async (values, { setSubmitting, setFieldValue }) => {
    setSubmitting(true);

    const formatItems = (items, isPrimary = true) => {
      return items.map(({ nfi_packaging_item, is_flexible, ...rest }) => ({
        ...rest,
        is_flexible: isPrimary ? false : is_flexible || false,
        nfi_packaging_item_id: nfi_packaging_item?.id,
      }));
    };

    const payload = isCloning
      ? filterCloneData(values)
      : {
          id: bomId,
          primary_items: formatItems(values.primary_items),
          secondary_items: formatItems(values.secondary_items, false),
          bom: {
            bom_name: values.bom_name,
            bom_short_code: values.bom_short_code,
            bom_id:
              values.bom_id ||
              generateBomID(values, setFieldValue, packagingTypes, bomId),
          },
        };

    try {
      const response = bomId
        ? await BOMAPI.updateBom(payload)
        : await BOMAPI.addBom(payload);

      notifyUser(
        `Packaging BOM ${bomId ? 'updated' : 'created'} successfully.`,
      );
      loadBOMList();
      navigateToBomView(response.id);
    } catch (error) {
      console.error('Error submitting BOM form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const initialData = location.state?.clonedData || bomData;

  return (
    <Formik
      enableReinitialize
      initialValues={{
        primary_items: initialData?.primary_items || [{}],
        secondary_items: initialData?.secondary_items || [{}],
        bom_name: initialData?.bom_name || '',
        bom_short_code: isCloning
          ? initialData?.bom_short_code?.slice(-3) || ''
          : initialData?.bom_short_code || '',
        bom_id: initialData?.bom_id || '',
        ...initialData,
      }}
      onSubmit={onSubmitForm}
    >
      {({
        handleSubmit,
        isSubmitting,
        values,
        handleReset,
        setFieldValue,
        handleChange,
      }) => (
        <>
          <Grid
            item
            xs={12}
            md={12}
            style={{ margin: '1rem 0', width: '100%' }}
            display="flex"
            gap={1}
          >
            <Tooltip arrow title={values.bom_name} enterTouchDelay={200}>
              <section>
                <FieldInput
                  name="bom_name"
                  label="Packaging BOM Name"
                  placeholder="Enter Packaging BOM Name"
                  variant="outlined"
                  validate={validateRequired}
                  required
                  size="small"
                  disabled={isViewFlow}
                  onChange={(e) => {
                    handleChange(e);
                    generateBomID(
                      {
                        ...values,
                        bom_name: e.target.value,
                      },
                      setFieldValue,
                      packagingTypes,
                      bomId,
                    );
                  }}
                />
              </section>
            </Tooltip>
            <FieldInput
              name="bom_short_code"
              label="Packaging Short Code"
              placeholder="Enter Packaging Short Code"
              variant="outlined"
              size="small"
              validate={validateRequired}
              required
              disabled={bomId}
              inputProps={{ maxlength: 3 }}
            />
          </Grid>

          <Typography
            variant="h6"
            style={{ margin: '1rem 0', fontSize: '1rem' }}
          >
            <b>Primary Item</b>
          </Typography>
          <FieldArray
            name="primary_items"
            render={(arrayHelpers) => (
              <GridListView
                isHeaderSticky
                data={values?.primary_items || []}
                columns={[
                  ...COLUMNS_PRIMARY,
                  ...(!bomId ? [...ACTION_COLUMNS] : []),
                ]}
                cellProps={{
                  setFieldValue,
                  handleChange,
                  arrayHelpers,
                  items: values.primary_items,
                  disablePrimary: Boolean(bomId),
                  values,
                  packagingTypes,
                  isViewFlow,
                  bomId,
                }}
              />
            )}
          />

          <Typography
            variant="h6"
            style={{ margin: '0.8rem 0', fontSize: '1rem' }}
          >
            <b>Secondary Item</b>
          </Typography>
          <FieldArray
            name="secondary_items"
            render={(arrayHelpers) => (
              <GridListView
                border={false}
                isHeaderSticky
                data={values?.secondary_items || []}
                columns={[
                  ...COLUMNS_SECONDARY,
                  ...(!isViewFlow ? [...ACTION_COLUMNS] : []),
                ]}
                cellProps={{
                  setFieldValue,
                  handleChange,
                  arrayHelpers,
                  items: values.secondary_items,
                  disableSecondary: isViewFlow || bomData?.is_disabled,
                  values,
                  packagingTypes,
                  isViewFlow,
                  bomId,
                }}
              />
            )}
          />

          <Grid item xs={12} md={5} style={{ margin: '1rem 0' }}>
            <FieldInput
              name="bom_id"
              size="small"
              label="BOM ID"
              style={{ width: '100%' }}
              placeholder="Enter BOM ID"
              variant="outlined"
              disabled={Boolean(bomId)}
              inputProps={{ maxlength: 20 }}
            />
          </Grid>

          <Grid container justifyContent="flex-end" gap="1rem">
            <AppButton
              variant="contained"
              className="margin-horizontal"
              size="small"
              color="inherit"
              onClick={() => {
                handleReset();
                backHandler(bomData?.id);
              }}
            >
              Cancel
            </AppButton>
            <AppButton
              startIcon={<SaveIcon />}
              variant="contained"
              size="small"
              color="primary"
              loading={isSubmitting}
              type="submit"
              onClick={handleSubmit}
            >
              Save
            </AppButton>
          </Grid>
        </>
      )}
    </Formik>
  );
};
