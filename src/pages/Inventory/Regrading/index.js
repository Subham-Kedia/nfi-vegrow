import { useEffect, useRef, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import {
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { AppButton, GridListView, ImageThumb } from 'Components';
import { FieldInput, UploadInput } from 'Components/FormFields';
import { FieldArray, Formik } from 'formik';
import { createRegrading } from 'Services/lots';
import { mergeValidator, notifyUser } from 'Utilities';
import { STATUS_LIST } from 'Utilities/constants/inventory';
import imageDirectUpload from 'Utilities/directUpload';
import {
  validateMax,
  validateMin,
  validateRequired,
} from 'Utilities/formvalidation';

import { ColumnGrid, ImageListWrapper, RowGrid } from './styled';

const REGRADE_COLUMN = [
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
      label: 'Available Quantity',
      style: {},
    },
    key: 'status',
    props: { md: 2, xs: 12 },
    render(
      { available_quantity = '', grade_c_quantity = '' },
      { lot_type },
      { rowIndex },
    ) {
      return +lot_type === STATUS_LIST.GRADE_C ? (
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
      ) : (
        available_quantity
      );
    },
  },
  {
    header: {
      label: 'Damaged Quantity',
      style: {},
    },
    key: 'item_code',
    props: { md: 2, xs: 12 },
    render(
      { available_quantity = '', grade_c_quantity = '' },
      { lot_type },
      { rowIndex },
    ) {
      return +lot_type === STATUS_LIST.AVAILABLE ? (
        <FieldInput
          name={`selectedInventory.${rowIndex}.quantity`}
          size="small"
          label=""
          placeholder="Quantity"
          variant="outlined"
          type="number"
          validate={mergeValidator(
            validateRequired,
            validateMax(available_quantity),
            validateMin(0),
          )}
          InputLabelProps={{
            shrink: true,
          }}
        />
      ) : (
        grade_c_quantity
      );
    },
  },
];

const PICTURES_VIDEO_COLUMN = [
  {
    header: {
      label: 'Pictures/Videos',
      style: {},
    },
    key: 'item_code',
    props: { md: 2, xs: 12 },
    render(data, { lot_type = '', removeAttachment }, { rowIndex }) {
      return (
        +lot_type === STATUS_LIST.AVAILABLE && (
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
              {data.grade_c_attachments &&
                data.grade_c_attachments?.map((photo, index) => (
                  <ImageThumb
                    file={photo}
                    url={photo}
                    index={index}
                    style={{ height: '3rem', width: '3rem' }}
                    removeAttachment={(index) =>
                      removeAttachment(rowIndex, index)
                    }
                  />
                ))}
            </ImageListWrapper>
          </>
        )
      );
    },
  },
];

const Regrading = ({
  selectedInventoryIds = [],
  inventory = [],
  setSelectedInventory = () => {},
  loadInventory = () => {},
  toggleCancelConfirmDialog = () => {},
}) => {
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [lotType, setLotType] = useState('1');
  const [isLoading, setLoading] = useState(false);
  const formRef = useRef();

  const regradeLots = async (
    { selectedInventory, lot_type, comments },
    { setSubmitting },
  ) => {
    const filesAttached = selectedInventory?.reduce(
      (acc, { grade_c_attachments = null }) => acc + !!grade_c_attachments,
      0,
    );
    if (filesAttached !== selectedInventory?.length && +lot_type === 1) {
      return notifyUser('Please upload pictures', 'error');
    }
    setLoading(true);

    const from_status_id = +lot_type;
    const to_status_id =
      from_status_id === STATUS_LIST.AVAILABLE
        ? STATUS_LIST.GRADE_C
        : STATUS_LIST.AVAILABLE;

    const non_fruit_regrade_tracker = await Promise.all(
      selectedInventory.map(async (inventory) => {
        const {
          id: packaging_item_id,
          quantity,
          grade_c_attachments,
        } = inventory;
        const data = {
          ...(grade_c_attachments ? { grade_c_attachments } : {}),
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
          packaging_item_id,
          quantity,
          from_status_id,
          to_status_id,
          ...(Object.entries(data).reduce((acc, [key, value]) => {
            if (value.length) {
              acc[key] = value;
            }
            return acc;
          }, {}) || {}),
          comments,
        };
      }),
    );

    createRegrading({
      non_fruit_regrade_trackers: {
        non_fruit_regrade_tracker,
      },
    })
      .then(() => {
        notifyUser('Regrading done successfully.');
        setSelectedInventory([]);
      })
      .finally(() => {
        setSubmitting(false);
        loadInventory();
      });
  };

  const removeAttachment = (rowIndex, index) => {
    const { selectedInventory = [] } = formRef?.current?.values || {};
    selectedInventory[index].grade_c_attachments = null;

    // if(selectedInventory?.[rowIndex]?.grade_c_attachments.length === 1) {
    //   selectedInventory?.[rowIndex]?.grade_c_attachments = [];
    // } else {
    //   selectedInventory[rowIndex]?.grade_c_attachments.splice(index, 1);
    // }

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
          acc.push({
            ...isPresent,
            quantity: isPresent?.quantity || '',
          });
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
          Regrading
        </Typography>
      </Grid>
      {selectedInventoryIds.length > 0 ? (
        <Formik
          enableReinitialize
          initialValues={{
            selectedInventory: filteredInventory,
            lot_type: lotType,
          }}
          innerRef={formRef}
          onSubmit={regradeLots}
        >
          {({ handleSubmit, values, handleChange }) => (
            <ColumnGrid container spacing={4} style={{ padding: '16px' }}>
              <RowGrid container item spacing={1} alignItems="center">
                <Typography
                  variant="subtitle1"
                  className="title"
                  style={{ marginRight: '1rem' }}
                >
                  <strong>Type</strong>
                </Typography>
                <RadioGroup
                  row
                  defaultValue="1"
                  value={values.lot_type}
                  name="lot_type"
                  onClick={(e) => {
                    handleChange(e);
                    setLotType(e?.target?.value);
                  }}
                >
                  <FormControlLabel
                    value={`${STATUS_LIST.AVAILABLE}`}
                    control={<Radio color="primary" size="small" />}
                    label="Available to Damaged"
                  />
                  <FormControlLabel
                    value={`${STATUS_LIST.GRADE_C}`}
                    control={<Radio color="primary" size="small" />}
                    label="Damaged to Available"
                  />
                </RadioGroup>
              </RowGrid>
              <Divider />
              <FieldArray
                name="lots"
                render={() => {
                  return (
                    <GridListView
                      isHeaderSticky
                      data={values?.selectedInventory || []}
                      columns={[
                        ...REGRADE_COLUMN,
                        ...(+values.lot_type === STATUS_LIST.AVAILABLE
                          ? PICTURES_VIDEO_COLUMN
                          : []),
                      ]}
                      cellProps={{
                        lot_type: values.lot_type,
                        removeAttachment,
                      }}
                    />
                  );
                }}
              />
              <ColumnGrid item container spacing={2}>
                <Grid item>
                  <FieldInput
                    name="comments"
                    label="Comments"
                    size="medium"
                    placeholder="Enter details about this regrading exercise"
                    variant="outlined"
                    multiline
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </ColumnGrid>
              <RowGrid item container>
                <AppButton
                  className="margin-horizontal"
                  color="inherit"
                  onClick={toggleCancelConfirmDialog}
                >
                  Cancel
                </AppButton>
                <AppButton
                  startIcon={<SaveIcon />}
                  loading={isLoading}
                  type="submit"
                  onClick={handleSubmit}
                >
                  Save
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
          You have not selected any inventory items yet. Please select
          inventories to start regrading.
        </Typography>
      )}
    </>
  );
};

export default Regrading;
