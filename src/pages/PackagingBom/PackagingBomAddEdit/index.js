import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Grid, Typography } from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';
import InputAdornment from '@mui/material/InputAdornment';
import PageLayout from 'App/PageLayout';
import { AppButton, ConfirmationDialog, DeleteButton } from 'Components';
import {
  FieldCheckbox as FieldCheckBox,
  FieldCombo,
  FieldInput,
} from 'Components/FormFields';
import { FieldArray, Formik } from 'formik';
import {
  createPackagingBom,
  disablePackagingBom,
  getPackagingBomById,
  updatePackagingBom,
} from 'Services/packagingBom';
import { getPackagingItems } from 'Services/packagingItem';
import { notifyUser } from 'Utilities';
import { validateRequired } from 'Utilities/formvalidation';

import UnitOfMeasurementField from './components/UnitOfMeasurementField';
import {
  ActionIcons,
  ButtonWrapper,
  FormWrapper,
  GridContainer,
  ItemGridContainer,
  Wrapper,
} from './styled';

const ITEM_STRUCTURE = {
  item_code: '',
  uom: '',
  composition: '',
  is_flexible: '',
};

const PackagingBomAddEdit = ({ edit = false, loadPackagingBoms }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [packagingBom, setPackagingBom] = useState({
    bom_name: '',
    packaging_bom_items: [ITEM_STRUCTURE],
  });
  const [packagingItems, setPackagingItems] = useState([]);
  const [disableConfirm, setDisableConfirm] = useState(false);

  const getAllDropDownValues = () => {
    Promise.all([getPackagingItems()]).then(([packagingItemsRes]) => {
      setPackagingItems(packagingItemsRes?.items || []);
    });
  };

  useEffect(() => {
    if (params?.id) {
      setLoading(true);
      getPackagingBomById(params?.id)
        .then((bomRes) => {
          setPackagingBom(bomRes);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setPackagingBom({
        bom_name: '',
        packaging_bom_items: [ITEM_STRUCTURE],
      });
    }
  }, [params?.id]);

  useEffect(() => {
    getAllDropDownValues();
  }, []);

  const submitForm = (values, { setSubmitting }) => {
    setSubmitting(true);
    const processPackagingBom = packagingBom?.id
      ? updatePackagingBom
      : createPackagingBom;

    const postData = { ...values };
    postData.packaging_bom_items = postData?.packaging_bom_items?.map(
      (pItem) => {
        return {
          ...(pItem.id ? { id: pItem.id } : {}),
          packaging_item_id: pItem?.packaging_item?.id,
          composition: pItem?.composition,
          is_flexible: pItem?.is_flexible || false,
        };
      },
    );

    processPackagingBom(
      {
        packaging_bom: {
          ...postData,
        },
      },
      packagingBom?.id,
    )
      .then((res) => {
        loadPackagingBoms();
        notifyUser(
          `Packaging BOM ${
            packagingBom?.id ? 'updated' : 'created'
          } successfully.`,
        );
        if (res.id) {
          navigate(`/app/packaging-bom/${res.id}`);
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const backHandler = () => {
    if (params.id) {
      navigate(`/app/packaging-bom/${params.id}`);
    } else {
      navigate(`/app/packaging-bom`);
    }
  };

  const toggleConfirmDialog = () => {
    setDisableConfirm(!disableConfirm);
  };

  const confirmDisableBOM = () => {
    disablePackagingBom(packagingBom?.id)
      .then(() => {
        loadPackagingBoms({ resetSelection: true });
        notifyUser('Packaging BOM disabled successfully.');
      })
      .finally(() => setDisableConfirm(false));
  };

  return (
    <Wrapper>
      <PageLayout
        isLoading={isLoading}
        title={`${params.id ? (edit ? 'Edit' : 'View') : 'Add'} Packaging BOM`}
        titleComponent={
          params.id && (
            <>
              <AppButton
                style={{ marginRight: '5px' }}
                startIcon={<EditIcon />}
                onClick={() => navigate(`/app/packaging-bom/${params.id}/edit`)}
              >
                Edit
              </AppButton>
              <DeleteButton
                text="Disable"
                isDelete
                toggleConfirmDialog={toggleConfirmDialog}
              />
            </>
          )
        }
      >
        <Formik
          initialValues={{
            ...packagingBom,
          }}
          onSubmit={submitForm}
          enableReinitialize
        >
          {({ handleSubmit, handleReset, isSubmitting, values }) => (
            <PageLayout.Body>
              <FormWrapper>
                <GridContainer container direction="row" spacing={0}>
                  <FieldInput
                    name="bom_name"
                    size="small"
                    label="Packagnin BOM Name"
                    placeholder="Name"
                    variant="outlined"
                    required
                    validate={validateRequired}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={!edit}
                  />
                </GridContainer>
                <Typography
                  variant="subtitle1"
                  className="title"
                  color="textPrimary"
                >
                  <strong>Packaging BOM Items</strong>
                </Typography>
                <FieldArray
                  name="packaging_bom_items"
                  render={(arrayHelpers) => {
                    return (
                      !!values.packaging_bom_items &&
                      values.packaging_bom_items.map((item, index) => (
                        <ItemGridContainer
                          key={index}
                          container
                          direction="row"
                          spacing={0}
                        >
                          <Grid item style={{ maxWidth: '100px' }}>
                            <Typography
                              variant="subtitle1"
                              className="title"
                              color="textPrimary"
                            >
                              {values?.packaging_bom_items?.[index]
                                ?.packaging_item?.is_primary
                                ? 'Primary Item'
                                : `Item ${index + 1}`}
                            </Typography>
                          </Grid>
                          <FieldCombo
                            name={`packaging_bom_items.${index}.packaging_item`}
                            label="PackagingItem"
                            placeholder="Item"
                            variant="outlined"
                            options={packagingItems}
                            optionLabel={(obj) => obj?.item_code}
                            required
                            validate={validateRequired}
                            disabled={!edit}
                            style={{ width: '30ch' }}
                          />
                          <UnitOfMeasurementField
                            name={`packaging_bom_items.${index}.unit_of_measurement_label`}
                            index={index}
                            size="small"
                            label="Unit Of Measurement"
                            placeholder="UOM"
                            variant="outlined"
                            style={{ width: '20ch' }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled
                          />
                          <FieldInput
                            type="number"
                            name={`packaging_bom_items.${index}.composition`}
                            size="small"
                            label="Composition"
                            placeholder="Composition"
                            variant="outlined"
                            style={{ width: '20ch' }}
                            required
                            validate={validateRequired}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {
                                    values?.packaging_bom_items?.[index]
                                      ?.unit_of_measurement_label
                                  }
                                </InputAdornment>
                              ),
                            }}
                            disabled={!edit}
                          />
                          <Grid item style={{ paddingLeft: '20px' }}>
                            <FieldCheckBox
                              size="small"
                              name={`packaging_bom_items.${index}`}
                              labelPlacement="start"
                              options={[
                                { key: 'is_flexible', label: 'Flexible? ' },
                              ]}
                              disabled={!edit}
                            />
                          </Grid>
                          <ActionIcons>
                            {values.packaging_bom_items.length > 1 && edit && (
                              <CancelOutlinedIcon
                                fontSize="large"
                                onClick={() => {
                                  arrayHelpers.remove(index);
                                }}
                              />
                            )}
                            {values.packaging_bom_items.length - 1 === index &&
                              edit && (
                                <AddCircleOutlineOutlinedIcon
                                  fontSize="large"
                                  onClick={() =>
                                    arrayHelpers.insert(
                                      values.packaging_bom_items.length,
                                      {
                                        ...ITEM_STRUCTURE,
                                      },
                                    )
                                  }
                                />
                              )}
                          </ActionIcons>
                        </ItemGridContainer>
                      ))
                    );
                  }}
                />
              </FormWrapper>
              {edit && (
                <ButtonWrapper>
                  <AppButton
                    color="inherit"
                    className="margin-horizontal"
                    onClick={() => {
                      handleReset();
                      backHandler();
                    }}
                  >
                    Cancel
                  </AppButton>
                  <AppButton
                    startIcon={<SaveIcon />}
                    loading={isSubmitting}
                    type="submit"
                    onClick={() => {
                      handleSubmit();
                      backHandler();
                    }}
                    disabled={!edit}
                  >
                    Save
                  </AppButton>
                </ButtonWrapper>
              )}
            </PageLayout.Body>
          )}
        </Formik>
        <ConfirmationDialog
          title="Confirm Disable Packaging BOM"
          open={disableConfirm}
          onConfirm={confirmDisableBOM}
          onCancel={toggleConfirmDialog}
        >
          <DialogContentText>
            Are you sure you want to disable Packaging BOM?
          </DialogContentText>
        </ConfirmationDialog>
      </PageLayout>
    </Wrapper>
  );
};

export default PackagingBomAddEdit;
