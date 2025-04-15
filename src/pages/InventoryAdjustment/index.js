import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import { AppLoader, CustomPagination, GridListView } from 'Components';
import { getInventoryAddjustments } from 'Services/lots';
import { toFixedNumber } from 'Utilities';
import { getFormattedDate } from 'Utilities/dateUtils';

import { columnStyles } from './styled';

const PAGE_SIZE = 25;

const COLUMNS = [
  {
    key: 'item_code',
    header: {
      label: 'Item ID',
      style: columnStyles.header,
    },
    props: { md: 2, xs: 12 },
    render({ packaging_item: { item_code } = {} } = {}) {
      return item_code;
    },
  },
  {
    key: 'item_name',
    header: {
      label: 'Item Name',
      style: columnStyles.data,
    },
    props: { md: 1, xs: 12 },
    render({ packaging_item: { item_name } = {} } = {}) {
      return item_name;
    },
  },
  {
    key: 'quantity',
    header: {
      label: 'Quantity',
      style: columnStyles.data,
    },
    props: { md: 1, xs: 12 },
    render({ quantity } = {}) {
      return toFixedNumber(quantity, 3);
    },
  },
  {
    key: 'unit_of_measurement_label',
    header: {
      label: 'UoM',
      style: columnStyles.data,
    },
    props: { md: 1, xs: 12 },
    render({ packaging_item: { unit_of_measurement_label } = {} } = {}) {
      return unit_of_measurement_label;
    },
  },
  {
    key: 'reason_label',
    header: {
      label: 'Type',
      style: columnStyles.data,
    },
    props: { md: 1, xs: 12 },
  },
  {
    key: 'description',
    header: {
      label: 'Description',
      style: columnStyles.data,
    },
    props: { md: 3, xs: 12 },
  },
  {
    key: 'date',
    header: {
      label: 'Date',
      style: columnStyles.data,
    },
    props: { md: 1, xs: 12 },
    render({ date } = {}) {
      return getFormattedDate(date);
    },
  },
  {
    key: 'user_name',
    header: {
      label: 'User',
      style: columnStyles.data,
    },
    props: { md: 2, xs: 12 },
  },
];

const InventoryAdjustmentPage = () => {
  const [loading, setLoading] = useState(false);
  const [inventoryAdjustment, setInventoryAdjustment] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { dcId } = useSiteValue();

  const loadInventoryAdjustment = () => {
    setLoading(true);
    getInventoryAddjustments({
      dc_id: dcId,
      offset: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    })
      .then((res) => {
        if (res?.items) {
          const data = res.items.map(
            ({ available_quantity, gap_quantity, ...rest }) => ({
              ...rest,
              available_quantity,
              gap_quantity,
              actual_available_quantity: available_quantity,
            }),
          );
          setInventoryAdjustment(data);
          setTotalCount(Math.ceil(res?.total_count / PAGE_SIZE) || 0);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInventoryAdjustment();
  }, [dcId, page]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return <AppLoader />;
  }

  return (
    <PageLayout title="Inventory Adjustment" showSelectDC>
      {inventoryAdjustment.length > 0 ? (
        <PageLayout.Body>
          <GridListView
            data={inventoryAdjustment}
            columns={COLUMNS}
            isHeaderSticky
          />
          <CustomPagination
            count={totalCount}
            page={page}
            shape="rounded"
            onChange={handleChangePage}
          />
        </PageLayout.Body>
      ) : (
        <Typography
          variant="subtitle2"
          component="div"
          className="disabled-text"
          style={{
            textAlign: 'center',
            alignSelf: 'center',
            marginTop: '15%',
            padding: '25px',
            border: 'solid 1px #cccccc',
          }}
        >
          No packaging item available for selected DC
        </Typography>
      )}
    </PageLayout>
  );
};

export default InventoryAdjustmentPage;
