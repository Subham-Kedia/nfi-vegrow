import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import { Grid, Typography } from '@mui/material';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import { AppButton, AppLoader, GridListView } from 'Components';
import { FieldArray, Formik } from 'formik';
import { getInventory, updateConsumption } from 'Services/lots';
import { notifyUser, toFixedNumber } from 'Utilities';

import { COLUMNS } from './column';
import Filter from './Filter';
import { classes } from './styled';

const InventoryReconciliationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [selectedPackagingItem, setSelectedPackagingItem] = useState(null);
  const { dcId } = useSiteValue();

  const { noData } = classes();

  const loadInventory = (productId = selectedPackagingItem?.id) => {
    setLoading(true);
    const params = {
      dc_id: dcId,
      consumable: true,
      ...(productId ? { product_id: productId } : {}),
    };
    getInventory(params)
      .then((res) => {
        if (res?.items) {
          const data = res.items.map(
            ({ available_quantity, gap_quantity, ...rest }) => ({
              ...rest,
              available_quantity,
              gap_quantity,
              actual_available_quantity: null,
            }),
          );
          setInventory(data);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInventory();
  }, [dcId]);

  const adjustInventory = ({ inventory: data }) => {
    setLoading(true);
    const packaging_item = data
      .map(
        ({
          id: packaging_item_id,
          actual_available_quantity = 0,
          available_quantity = 0,
          description,
        }) => ({
          packaging_item_id,
          quantity:
            actual_available_quantity === null ||
            actual_available_quantity === ''
              ? actual_available_quantity
              : toFixedNumber(
                  available_quantity - actual_available_quantity,
                  3,
                ),
          description,
        }),
      )
      .filter(({ quantity }) => quantity !== null && quantity !== '');

    updateConsumption({ packaging_items: { packaging_item } })
      .then(() => notifyUser('Consumption is recorded successfully.'))
      .finally(() => {
        loadInventory();
        setLoading(false);
      });
  };

  const cancelHandler = () => {
    navigate('/app');
  };

  const isFormActualAvailableQuantityPresent = (values) => {
    const { inventory: inventoryList } = values;
    const present = inventoryList.some(
      (item) =>
        item.actual_available_quantity !== null &&
        item.actual_available_quantity !== '',
    );
    return !present;
  };

  const pageFilter = (
    <Filter
      loadPageData={loadInventory}
      handleSelectedPackagingItem={setSelectedPackagingItem}
    />
  );

  const renderPageData = (values, handleSubmit) => {
    if (loading) return <AppLoader />;

    if (!inventory.length) {
      return (
        <Typography
          variant="subtitle2"
          component="div"
          className={`disabled-text ${noData}`}
        >
          No consumable packaging items available for selected DC
        </Typography>
      );
    }

    return (
      <PageLayout.Body>
        <FieldArray
          name="lots"
          render={() => (
            <GridListView
              data={values.inventory}
              columns={COLUMNS}
              isHeaderSticky
            />
          )}
        />
        <Grid container justifyContent="flex-end" mt={1}>
          <AppButton
            className="margin-horizontal"
            color="inherit"
            onClick={cancelHandler}
          >
            Cancel
          </AppButton>
          <AppButton
            startIcon={<SaveIcon />}
            loading={loading}
            type="submit"
            disabled={isFormActualAvailableQuantityPresent(values)}
            onClick={handleSubmit}
          >
            Save
          </AppButton>
        </Grid>
      </PageLayout.Body>
    );
  };

  return (
    <PageLayout title="Inventory Consumption" showSelectDC>
      <Formik
        enableReinitialize
        initialValues={{ inventory, packagingItem: selectedPackagingItem }}
        onSubmit={adjustInventory}
      >
        {({ handleSubmit, values }) => (
          <>
            {pageFilter}
            {renderPageData(values, handleSubmit)}
          </>
        )}
      </Formik>
    </PageLayout>
  );
};

export default InventoryReconciliationPage;
