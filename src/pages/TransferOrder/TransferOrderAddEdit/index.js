import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AddCircleOutlineOutlined as AddCircleOutlineOutlinedIcon,
  CancelOutlined as CancelOutlinedIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { Grid, Paper, Typography } from '@mui/material';
import { useSiteValue } from 'App/SiteContext';
import { AppButton, AppLoader, GridListView } from 'Components';
import { FieldCombo, FieldInput, FieldSelect } from 'Components/FormFields';
import { FieldArray, Formik } from 'formik';
import {
  addTransferOrder,
  getAvailableInventory,
  getTransferOrderById,
  updateTransferOrder,
} from 'Services/transferOrder';
import { getDcs } from 'Services/users';
import { mergeValidator } from 'Utilities';
import { RECIPIENT_TYPE } from 'Utilities/constants';
import {
  validateMax,
  validateMin,
  validateRequired,
} from 'Utilities/formvalidation';

const COLUMNS = [
  {
    header: {
      label: 'Item Id',
    },
    key: 'itemId',
    props: { md: 3, xs: 12 },
    render: (
      { packaging_item_id = '' },
      { items = [], non_fruit_shipment_items = [] },
      { rowIndex = 0 },
    ) => (
      <FieldSelect
        name={`non_fruit_shipment_items.${rowIndex}.packaging_item_id`}
        size="small"
        variant="outlined"
        id="packaging_item"
        options={items?.filter(
          ({ id = '' }) =>
            packaging_item_id === id || !non_fruit_shipment_items?.includes(id),
        )}
        validate={validateRequired}
        placeholder="Select Item"
        showNone
      />
    ),
  },
  {
    header: {
      label: 'Item Name',
    },
    key: 'index',
    props: { md: 2, xs: 12, style: { display: 'flex', alignItems: 'center' } },
    render: ({ packaging_item_id = '' }, { items = [] }) =>
      items?.find(
        ({ id = '' }) => id === packaging_item_id && packaging_item_id,
      )?.item_name || '',
    style: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  {
    header: {
      label: 'Available Quantity',
    },
    key: 'available_quantity',
    props: { md: 2, xs: 12, style: { display: 'flex', alignItems: 'center' } },
    render: (
      { packaging_item_id = '' },
      { items = [], transferOrder = {} },
      { rowIndex },
    ) => {
      const { available_quantity = 0 } =
        items?.find(
          ({ id = '' }) => packaging_item_id && id === packaging_item_id,
        ) || {};
      const { quantity = 0 } =
        transferOrder?.non_fruit_shipment_items?.[rowIndex] || {};
      return available_quantity + quantity || '';
    },
    style: {
      display: 'flex',
      alignItems: 'flex-start',
    },
  },
  {
    header: {
      label: 'Transfer Qty',
    },
    key: 'index',
    props: { md: 2, xs: 12, style: { display: 'flex', alignItems: 'center' } },
    render: (
      { packaging_item_id = '' },
      { items = [], transferOrder = {} },
      { rowIndex = 0 },
    ) => {
      const { available_quantity = 0 } =
        items.find(
          ({ id = '' }) => id === packaging_item_id && packaging_item_id,
        ) || {};
      const { quantity = 0 } =
        transferOrder?.non_fruit_shipment_items?.[rowIndex] || {};
      return (
        <FieldInput
          name={`non_fruit_shipment_items.${rowIndex}.quantity`}
          type="number"
          size="small"
          required
          validate={mergeValidator(
            validateMax(available_quantity + quantity || 0),
            validateRequired,
            validateMin(0),
          )}
          placeholder="Enter quantity"
          variant="outlined"
        />
      );
    },
    style: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  // {
  //   header: {
  //     label: 'Gap',
  //   },
  //   key: 'index',
  //   props: { md: 1, xs: 12, style: { display: 'flex', alignItems: 'center' } },
  //   render: ({ packaging_item_id = '' }, { items = [], transferOrder = {}, values }, { rowIndex = 0 }) => {
  //     const { available_quantity = 0 } = items.find(({ id = '' }) => id === packaging_item_id && packaging_item_id) || { };
  //     const { quantity = 0 } = transferOrder?.non_fruit_shipment_items?.[rowIndex] || {};
  //     const { quantity: currentQuantity } = values?.non_fruit_shipment_items?.[rowIndex] || {};

  //     return available_quantity + quantity - currentQuantity || ''
  //   },
  //   style: {
  //     display: 'flex',
  //     alignItems: 'center',
  //   },
  // },
];

const ACTION_COLUMNS = [
  {
    header: {
      label: 'Actions',
    },
    key: 'actions',
    props: { md: 2, xs: 12, style: { display: 'flex', alignItems: 'center' } },
    render: (
      _data,
      { non_fruit_shipment_items = [], arrayHelpers, items = [] },
      { rowIndex = 0 },
    ) => (
      <Grid container>
        {non_fruit_shipment_items?.length > 1 && (
          <CancelOutlinedIcon
            fontSize="large"
            onClick={() => arrayHelpers.remove(rowIndex)}
          />
        )}
        {rowIndex === non_fruit_shipment_items?.length - 1 &&
          items.length !== non_fruit_shipment_items?.length && (
            <AddCircleOutlineOutlinedIcon
              fontSize="large"
              onClick={() =>
                arrayHelpers.push({ quantity: '', packaging_item_id: '' })
              }
            />
          )}
      </Grid>
    ),
  },
];

const TransferOrderAddEdit = ({ loadTransferOrders = () => {} }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { dcId } = useSiteValue();
  const { toId = '' } = params;

  const [dcs, setDcs] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [transferOrder, setTransferOrder] = useState();
  const [availableInventory, setAvailableInventory] = useState(null);

  const loadDcs = () => {
    getDcs({ exclude_dc: dcId }).then((res) => {
      if (res?.items) {
        setDcs(res?.items || []);
      }
    });
  };

  useEffect(() => {
    loadDcs();
    if (dcId && !toId) {
      getAvailableInventory().then(({ items = [] }) => {
        const inventoryItems = items?.map(
          ({ item_code = '', id = '', ...rest }) => ({
            ...rest,
            text: item_code,
            value: id,
            id,
            item_code,
          }),
        );
        setAvailableInventory(inventoryItems);
      });
    }
  }, [dcId]);

  useEffect(() => {
    if (toId) {
      setLoading(true);
      Promise.all([getTransferOrderById(toId || ''), getAvailableInventory()])
        .then(([data, { items = [] }]) => {
          const { non_fruit_shipment_items = [] } = data;
          setTransferOrder(data);

          const inventoryItems = items.map(({ item_code = '' }) => item_code);

          const availableInventoryModified = non_fruit_shipment_items.reduce(
            (acc, item) => {
              const { item_identifier = '' } = item;
              if (!inventoryItems.includes(item_identifier)) {
                return [
                  ...acc,
                  {
                    ...item,
                    text: item_identifier,
                    value: item?.packaging_item_id || null,
                    id: item?.packaging_item_id || null,
                  },
                ];
              }
              return acc;
            },
            [],
          );

          const inventoryAvailableItems = items?.map(
            ({ item_code = '', id = '', ...rest }) => ({
              ...rest,
              text: item_code,
              value: id,
              id,
              item_code,
            }),
          );

          setAvailableInventory([
            ...(inventoryAvailableItems || []),
            ...availableInventoryModified,
          ]);
        })
        .finally(() => setLoading(false));
    } else {
      setTransferOrder({});
    }
  }, [toId]);

  const backHandler = (id = '') => {
    return navigate(`/app/transfer-orders/${id || ''}`);
  };

  const onSubmitForm = (values, { setSubmitting }) => {
    const processTransferOrder = params?.toId
      ? updateTransferOrder
      : addTransferOrder;
    processTransferOrder(
      {
        non_fruit_shipment: {
          non_fruit_shipment_items: values?.non_fruit_shipment_items || [],
          sender_id: dcId,
          recipient_id: values?.recipient?.id,
          recipient_type: RECIPIENT_TYPE.DC,
          sender_type: RECIPIENT_TYPE.DC,
          instructions: '',
        },
      },
      params.toId,
    )
      .then(({ id = '' }) => {
        loadTransferOrders();
        backHandler(id);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const getPackagingIds = (values) => {
    return (
      values?.non_fruit_shipment_items?.map(
        ({ packaging_item_id = '' }) => packaging_item_id,
      ) || []
    );
  };

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <Paper style={{ padding: '1rem' }}>
      <Typography
        variant="h6"
        color="textPrimary"
        style={{ fontWeight: 'bold' }}
      >
        {`${transferOrder?.id ? 'Edit' : 'Add'} Transfer Order`}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={{
          recipient: transferOrder?.recipient_id
            ? dcs.find(({ id = '' }) => id === transferOrder.recipient_id)
            : null,
          non_fruit_shipment_items: [
            ...(params?.toId && transferOrder
              ? transferOrder?.non_fruit_shipment_items || []
              : [
                  {
                    quantity: '',
                    packaging_item_id: '',
                  },
                ]),
          ],
        }}
        onSubmit={onSubmitForm}
      >
        {({ values, isSubmitting, handleSubmit, handleReset }) => (
          <>
            <Grid item xs={12} md={4} style={{ margin: '1rem 0' }}>
              <FieldCombo
                name="recipient"
                label="Destination DC"
                placeholder="Select Destination DC"
                variant="outlined"
                options={dcs || []}
                optionLabel={(obj) => `${obj.id}-${obj.name}`}
                validate={validateRequired}
                required
              />
            </Grid>
            <FieldArray
              name="non_fruit_shipment_items"
              render={(arrayHelpers) => (
                <GridListView
                  isHeaderSticky
                  data={values?.non_fruit_shipment_items || []}
                  columns={[
                    ...COLUMNS,
                    ...(availableInventory?.length === 1 ? [] : ACTION_COLUMNS),
                  ]}
                  cellProps={{
                    arrayHelpers,
                    items: availableInventory || [],
                    transferOrder,
                    non_fruit_shipment_items: getPackagingIds(values),
                  }}
                />
              )}
            />
            <Grid container justifyContent="flex-end">
              <AppButton
                variant="contained"
                className="margin-horizontal"
                size="small"
                color="inherit"
                onClick={() => {
                  handleReset();
                  backHandler(transferOrder?.id);
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
    </Paper>
  );
};

export default TransferOrderAddEdit;
