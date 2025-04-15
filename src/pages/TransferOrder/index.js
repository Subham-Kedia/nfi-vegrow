import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import {
  AppButton,
  AppLoader,
  CreateAllowed,
  CustomPagination,
  CustomTable,
  PageFilter,
} from 'Components';
import Sm from 'Components/Responsive/Sm';
import { getTransferOrders } from 'Services/transferOrder';
import { RESOURCES, TO_STATUS_LIST } from 'Utilities/constants';
import { getFormattedDateTime } from 'Utilities/dateUtils';

import { getPackagingItem } from '../../services/lots';
import { getDcs } from '../../services/users';

import { LeftSection, RightSection } from './styled';
import TransferOrderAddEdit from './TransferOrderAddEdit';
import TransferOrderDetails from './TransferOrderDetails';

const PAGE_SIZE = 10;

const RenderItems = ({ items = [] }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {items
        ?.filter((_, index) => showMore || index < 2)
        ?.map(({ item_name = {} }, index) => (
          <Typography key={index} variant="body2" component="div">
            {item_name || ''}
          </Typography>
        ))}
      {items?.length > 2 && (
        <Grid item md={12}>
          <AppButton
            variant="text"
            size="medium"
            style={{ fontWeight: 'bold' }}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? `- Show Less` : `+${items.length - 2} More`}
          </AppButton>
        </Grid>
      )}
    </>
  );
};

const COLUMNS = [
  {
    key: 'identifier',
    header: 'TO ID',
  },
  {
    key: 'recipient_name',
    header: 'Destination',
  },
  {
    key: 'created_at',
    header: 'Created At',
    align: 'center',
    render: ({ data = '' }) => getFormattedDateTime(data) || '',
  },
  {
    key: 'non_fruit_shipment_items',
    header: 'Items',
    render: ({ data = [] }) => <RenderItems items={data || []} />,
  },
];

const TransferOrder = () => {
  const navigate = useNavigate();
  const { dcId } = useSiteValue();

  const [transferOrders, setTransferOrders] = useState([]);
  const [tab, setTab] = useState(TO_STATUS_LIST.PENDING.value);
  const [filters, setFilters] = useState({});
  const [dropDownValues, setDropDownValues] = useState({ dcs: [] });
  const [page, setPage] = useState(1);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(1);
  const [packagingTypes, setPackagingTypes] = useState([]);

  const loadTransferOrders = ({
    filter = filters,
    newPage = page,
    status = tab,
  } = {}) => {
    setLoading(true);
    getTransferOrders({
      offset: (newPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      status,
      ...filter,
    })
      .then(({ items = [], counts = {}, total_count = 0 }) => {
        setTransferOrders(items);
        setCounts(counts || {});
        setTotalCount(Math.ceil(total_count / PAGE_SIZE) || 0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getAllDropDownValues = () => {
    Promise.all([
      getDcs({ include_central_dc: true }),
      getPackagingItem(),
    ]).then(([{ items: dcs } = {}, { items: packaging_types } = {}]) => {
      setDropDownValues({
        dcs: dcs.map((dc) => ({
          ...dc,
          id: `${dc.id}`,
          dc_id: dc.id,
          type: 'DC',
        })),
      });
      setPackagingTypes(packaging_types);
    });
  };

  useEffect(() => {
    getAllDropDownValues();
  }, []);

  useEffect(() => {
    loadTransferOrders();
    navigate(location.pathname);
  }, [dcId]);

  const handleChangeTab = (_event, value) => {
    setTab(value);
    setPage(1);
    loadTransferOrders({
      status: value,
      newPage: 1,
    });
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    loadTransferOrders({ newPage });
  };

  const backHandler = () => {};

  const renderTabs = () => {
    return (
      <Tabs
        value={tab}
        onChange={handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        className="transfer-order-tabs"
        style={{ marginBottom: '0.2rem' }}
      >
        {Object.values(TO_STATUS_LIST).map(({ value = 0, label = '' }) => (
          <Tab
            label={`${label || ''} (${counts[value] || 0})`}
            key={value}
            value={value}
          />
        ))}
      </Tabs>
    );
  };

  const onClickRow = ({ id = '' }) => {
    navigate(`${id}`);
  };

  const tableData = () => {
    return transferOrders || [];
  };

  const renderLeftSection = () => {
    if (loading) return <AppLoader />;

    if (!tableData().length) {
      return (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: '100%' }}
        >
          <Typography variant="h5" gutterBottom>
            No Data Available
          </Typography>
        </Grid>
      );
    }

    return (
      <>
        <CustomTable
          size="medium"
          sticky
          hover="true"
          columns={COLUMNS}
          data={tableData}
          dataKey="id"
          className="transfer-table"
          totalRows={0}
          rowProps={(rowData) => ({
            onClick: () => onClickRow(rowData),
          })}
        />
        {transferOrders.length > 0 && (
          <CustomPagination
            count={totalCount}
            page={page}
            shape="rounded"
            onChange={handleChangePage}
          />
        )}
      </>
    );
  };

  const onFilterSubmit = ({
    recipient_id = {},
    packaging_item_ids = [],
    ...restValues
  }) => {
    const queryValues = {
      ...restValues,
      ...(recipient_id?.id ? { recipient_id: recipient_id?.id || null } : {}),
      ...(packaging_item_ids.length
        ? {
            packaging_item_ids:
              packaging_item_ids.map(({ id = '' }) => id) || null,
          }
        : {}),
    };
    setFilters(queryValues);
    loadTransferOrders({ filter: queryValues });
  };

  return (
    <PageFilter
      filterLabel="Transfer Orders"
      showSelectDC
      initialValues={{
        packaging_item_ids: [],
        recipient_id: null,
        after: null,
        before: null,
      }}
      titleComponent={
        <CreateAllowed
          resource={RESOURCES.TRANSFER_ORDER}
          label="Transfer Order"
          buttonProps={{
            onClick: () => {
              navigate(`add`);
            },
          }}
        />
      }
      data={[
        {
          type: 'fieldCombo',
          name: 'recipient_id',
          label: 'Destination',
          placeholder: 'Select Destination',
          style: { width: '200px', marginTop: 0 },
          options: dropDownValues?.dcs || [],
        },
        {
          type: 'fieldDatepicker',
          name: 'after',
          label: 'Start Date',
          placeholder: 'Start Date',
          style: { width: '150px', marginTop: 0 },
        },
        {
          type: 'fieldDatepicker',
          name: 'before',
          label: 'End Date',
          placeholder: 'End Date',
          style: { width: '150px', marginTop: 0 },
        },
        {
          type: 'fieldCombo',
          name: 'packaging_item_ids',
          label: 'Select Packaging Item',
          placeholder: 'Select Packaging Item',
          multiple: true,
          optionLabel: (obj) => obj?.item_code,
          style: { width: '200px', marginTop: 0 },
          options: packagingTypes || [],
        },
      ]}
      setFilters={onFilterSubmit}
    >
      <PageLayout.Body flexDirection="row">
        <Sm
          backHandler={backHandler}
          rightSection={() => (
            <RightSection>
              <CreateAllowed resource={RESOURCES.TRANSFER_ORDER}>
                {() => (
                  <Routes>
                    <Route
                      path="add"
                      element={
                        <TransferOrderAddEdit
                          loadTransferOrders={loadTransferOrders}
                        />
                      }
                    />
                    <Route
                      path=":toId/edit"
                      element={
                        <TransferOrderAddEdit
                          loadTransferOrders={loadTransferOrders}
                        />
                      }
                    />
                    <Route
                      path=":toId"
                      element={
                        <TransferOrderDetails
                          loadTransferOrders={loadTransferOrders}
                          setTab={setTab}
                        />
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <Typography
                          variant="h6"
                          component="h6"
                          style={{
                            textAlign: 'center',
                            alignSelf: 'center',
                            flex: 1,
                          }}
                        >
                          Select OR Add Transfer order
                        </Typography>
                      }
                    />
                  </Routes>
                )}
              </CreateAllowed>
            </RightSection>
          )}
          leftSection={() => (
            <LeftSection>
              {renderTabs()}
              {renderLeftSection()}
            </LeftSection>
          )}
        />
      </PageLayout.Body>
    </PageFilter>
  );
};

export default TransferOrder;
