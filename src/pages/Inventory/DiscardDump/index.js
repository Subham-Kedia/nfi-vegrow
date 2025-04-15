import { useEffect, useRef, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { Grid, Typography } from '@mui/material';
import { AppButton, GridListView, ImageThumb } from 'Components';
import { FieldInput, UploadInput } from 'Components/FormFields';
import { FieldArray, Formik } from 'formik';
import { discardDump } from 'Services/lots';
import { mergeValidator, notifyUser } from 'Utilities';
import imageDirectUpload from 'Utilities/directUpload';
import {
  validateMax,
  validateMin,
  validateRequired,
} from 'Utilities/formvalidation';

import { ColumnGrid, ImageListWrapper, RowGrid } from './styled';

const DISCARD_COLUMN = [
  {
    header: {
      label: 'Item ID',
      style: {},
    },
    key: 'item_code',
    props: { md: 2, xs: 12 },
  },
  {
    header: {
      label: 'Item Name',
      style: {},
    },
    key: 'item_name',
    props: { md: 2, xs: 12 },
  },
  {
    header: {
      label: 'Damaged Quantity',
      style: {},
    },
    key: 'grade_c_quantity',
    props: { md: 2, xs: 12 },
  },
  {
    header: {
      label: 'Dump Quantity',
      style: {},
    },
    key: 'item_code',
    props: { md: 2, xs: 12 },
    render({ grade_c_quantity = 0 }, _propData, { rowIndex }) {
      return (
        <FieldInput
          name={`selectedInventory.${rowIndex}.quantity`}
          size="small"
          label=""
          placeholder="Quantity"
          variant="outlined"
          type="number"
          validate={mergeValidator(
            validateRequired,
            validateMax(grade_c_quantity),
            validateMin(0),
          )}
          InputLabelProps={{
            shrink: true,
          }}
        />
      );
    },
  },
  {
    header: {
      label: 'Pictures/Videos',
      style: {},
    },
    key: 'item_code',
    props: { md: 2, xs: 12 },
    render(data, { removeAttachment = () => {} }, { rowIndex }) {
      return (
        <>
          {!data.grade_c_attachments && (
            <UploadInput
              accept="image/*,video/*"
              name={`selectedInventory.${rowIndex}.grade_c_attachments`}
              label="Upload"
              multiple
            />
          )}
          <ImageListWrapper>
            {data?.grade_c_attachments &&
              data?.grade_c_attachments?.map((photo) => (
                <ImageThumb
                  file={photo}
                  url={photo}
                  style={{ height: '4rem', width: '4rem' }}
                  removeAttachment={() => removeAttachment(rowIndex)}
                />
              ))}
          </ImageListWrapper>
        </>
      );
    },
  },
];

const DiscardDump = ({
  setSelectedInventory,
  setShowSelection,
  selectedInventoryIds = [],
  inventory = [],
  loadInventory = () => {},
  toggleCancelConfirmDialog = () => {},
}) => {
  const [filteredInventory, setFilteredInventory] = useState([]);
  const formRef = useRef();

  const onSubmit = async (
    { selectedInventory = [], description = '' },
    { setSubmitting },
  ) => {
    const filesAttached = selectedInventory?.reduce(
      (acc, { grade_c_attachments = null }) => acc + !!grade_c_attachments,
      0,
    );
    if (filesAttached !== selectedInventory?.length) {
      return notifyUser('Please upload pictures', 'error');
    }
    const packaging_item = await Promise.all(
      selectedInventory.map(
        async ({ quantity = 0, id: packaging_item_id = null, attachments }) => {
          const data = { ...(attachments ? { attachments } : {}) };

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
            quantity,
            packaging_item_id,
            description,
            ...(Object.entries(data).reduce((acc, [key, value]) => {
              if (value.length) {
                acc[key] = value;
              }
              return acc;
            }, {}) || {}),
          };
        },
      ),
    );

    setSubmitting(true);
    discardDump({
      packaging_items: { packaging_item },
    })
      .then(() => {
        notifyUser('Damaged dump discarded successfully.');
      })
      .finally(() => {
        setSubmitting(false);
        setSelectedInventory([]);
        setShowSelection(false);
        loadInventory();
      });
  };

  const removeAttachment = (index) => {
    const { selectedInventory = [] } = formRef?.current?.values || {};
    selectedInventory[index].grade_c_attachments = null;

    setFilteredInventory([...selectedInventory]);
  };

  useEffect(() => {
    const { selectedInventory = [] } = formRef?.current?.values || {};

    const newSelectedInventory = selectedInventoryIds.reduce(
      (acc, selectedId) => {
        const isPresent = selectedInventory.find(
          ({ id = '' }) => id === selectedId,
        );
        if (isPresent) {
          acc.push(isPresent);
        } else {
          const newInventory =
            inventory.find(({ id = '' }) => id === selectedId) || {};
          acc.push(newInventory);
        }
        return acc;
      },
      [],
    );

    setFilteredInventory([...newSelectedInventory]);
  }, [selectedInventoryIds]);

  return (
    <>
      <Grid item container>
        <Typography
          variant="h6"
          color="textPrimary"
          style={{ fontWeight: 'bold' }}
        >
          Discard Dump
        </Typography>
      </Grid>
      {selectedInventoryIds.length > 0 ? (
        <Formik
          enableReinitialize
          initialValues={{ selectedInventory: filteredInventory }}
          innerRef={formRef}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, handleReset, isSubmitting, values }) => (
            <ColumnGrid container spacing={4} style={{ padding: '16px' }}>
              <ColumnGrid container item spacing={2}>
                <FieldArray
                  name="lots"
                  render={() => {
                    return (
                      <GridListView
                        data={values.selectedInventory}
                        columns={DISCARD_COLUMN}
                        cellProps={{
                          lot_type: values.lot_type,
                          removeAttachment,
                        }}
                      />
                    );
                  }}
                />
                <Grid item>
                  <FieldInput
                    name="description"
                    label="Comments"
                    size="medium"
                    placeholder="Enter details about Grade C dump"
                    variant="outlined"
                    multiline
                    InputLabelProps={{
                      shrink: true,
                    }}
                    rows={2}
                  />
                </Grid>
              </ColumnGrid>
              <RowGrid item container>
                <AppButton
                  className="margin-horizontal"
                  color="inherit"
                  onClick={() => {
                    handleReset();
                    toggleCancelConfirmDialog();
                  }}
                >
                  Cancel
                </AppButton>
                <AppButton
                  startIcon={<SaveIcon />}
                  disabled={!(selectedInventoryIds.length > 0) || isSubmitting}
                  loading={isSubmitting}
                  type="submit"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Confirm Discard Dump
                </AppButton>
              </RowGrid>
            </ColumnGrid>
          )}
        </Formik>
      ) : (
        <Typography
          variant="subtitle2"
          component="div"
          className="disabled-text"
          style={{
            textAlign: 'center',
            alignSelf: 'center',
            marginTop: '20%',
            padding: '25px',
            border: 'solid 1px #cccccc',
          }}
        >
          You have not selected any inventory items yet. Please select Damaged
          inventories to discard dumps.
        </Typography>
      )}
    </>
  );
};

export default DiscardDump;
