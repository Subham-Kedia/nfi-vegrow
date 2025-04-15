import { useEffect, useState } from 'react';
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { Grid, Link, Tab, Tabs, Typography } from '@mui/material';
import PageLayout from 'App/PageLayout';
import {
  AppButton,
  AppLoader,
  CustomPagination,
  GridListView,
  PageFilter,
} from 'Components';
import { getPackagingItem } from 'Services/lots';
import { getPartners, getPurchaseOrders } from 'Services/purchaseOrder';
import { getDcs } from 'Services/users';
import {
  PO_APPROVAL_STATUS,
  PO_APPROVAL_STATUS_LIST,
} from 'Utilities/constants';
import { PAYMENT_REQUEST_FILTERS } from 'Utilities/constants/paymentRequest';
import { getFormattedDate, getFormattedDateTime } from 'Utilities/dateUtils';

const COLUMNS = [
  {
    header: {
      label: 'PO Number/Date',
    },
    key: 'id',
    props: { md: 1, xs: 12 },
    render: ({ id = '', purchase_date = '' }) => (
      <>
        <Typography>{getFormattedDate(purchase_date || '')}</Typography>
        <AppButton
          variant="text"
          size="medium"
          style={{ fontWeight: 'bold', padding: 0, fontSize: '1.3rem' }}
          target="_blank"
        >
          PO {id || ''}
        </AppButton>
      </>
    ),
  },
  {
    header: {
      label: 'Vendor',
    },
    key: 'vendor',
    props: { md: 1, xs: 12 },
    render: ({ partner: { name = '' } = {} }) => name,
  },
  {
    header: {
      label: 'User Details',
    },
    key: 'user',
    props: { md: 2, xs: 12 },
    render: ({
      user = '',
      approver = '',
      status = '',
      created_date = '',
      approved_date = '',
      rejected_date = '',
    }) => (
      <Grid container>
        <Typography variant="body2">Created By: {user}</Typography>
        <Typography variant="caption">
          {getFormattedDateTime(created_date)}
        </Typography>
        {status !== PO_APPROVAL_STATUS.PENDING_APPROVAL && (
          <>
            <Typography variant="body2">
              {status === PO_APPROVAL_STATUS.REJECTED ? 'Rejected' : 'Approved'}{' '}
              By: {approver}
            </Typography>
            <Typography variant="caption">
              {status === PO_APPROVAL_STATUS.REJECTED
                ? getFormattedDateTime(rejected_date)
                : getFormattedDateTime(approved_date)}
            </Typography>
          </>
        )}
      </Grid>
    ),
  },
  {
    header: {
      label: 'Items/Services',
    },
    props: { md: 2, xs: 12 },
    render: ({ purchase_items = [] }) =>
      purchase_items?.map(({ packaging_item = {}, service_type }, index) => (
        <Typography key={index} variant="body2">
          {packaging_item?.item_code || service_type.name || ''}
        </Typography>
      )),
  },
];

const ACTION_COLUMNS = [
  {
    header: {
      label: 'Actions/Remark',
    },
    key: 'actions',
    props: { md: 2, xs: 12 },
    render: ({ id = '', status = '', rejected_reason = '' }) => (
      <Grid container direction="column">
        <Grid item>
          {status === PO_APPROVAL_STATUS.PENDING_APPROVAL && (
            <Link href={`/app/po-approvals/view/${id}`}>
              <Grid container direction="row" alignItems="center">
                <VisibilityIcon color="primary" />
                <Typography variant="subtitle2" color="primary">
                  View Detail
                </Typography>
              </Grid>
            </Link>
          )}
          {PO_APPROVAL_STATUS.APPROVED.includes(status) && (
            <Grid container direction="column">
              <Grid container direction="row">
                <CheckCircleIcon style={{ color: 'green' }} />
                <Typography variant="subtitle2" style={{ color: 'green' }}>
                  Approved
                </Typography>
              </Grid>
            </Grid>
          )}
          {status === PO_APPROVAL_STATUS.REJECTED && (
            <Grid container direction="column">
              <Grid container direction="row">
                <CancelIcon color="secondary" />
                <Typography variant="subtitle2" color="secondary">
                  Rejected
                </Typography>
              </Grid>
              {rejected_reason && (
                <Grid container direction="row">
                  <Typography
                    variant="caption"
                    style={{ backgroundColor: '#F4F4F4', padding: '5px' }}
                  >
                    {rejected_reason}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    ),
  },
];

const PAGE_SIZE = 10;

const POApprovalList = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [counts, setCounts] = useState({});

  const [filters, setFilters] = useState({
    id: null,
    startDate: null,
    endDate: null,
    vendors: [],
    deliveryLocation: [],
    itemId: [],
    payment: null,
  });
  const [dropDownValues, setDropDownValues] = useState({
    vendors: [],
    deliveryLocation: [],
    itemIds: [],
    payment: PAYMENT_REQUEST_FILTERS,
  });
  const [packagingTypes, setPackagingTypes] = useState([]);
  const [tab, setTab] = useState(PO_APPROVAL_STATUS_LIST[0].value);

  const loadPurchaseOrders = ({
    newPage = 1,
    selectedTab = tab,
    currentFilter = filters,
  } = {}) => {
    setLoading(true);
    getPurchaseOrders({
      approver: true,
      offset: (newPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      status: selectedTab,
      ...currentFilter,
    })
      .then(({ items = [], total_count = 0, counts = {} }) => {
        setData(items || []);
        setTotalCount(Math.ceil(total_count / PAGE_SIZE) || 0);
        setCounts(counts);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getPackagingItem().then(({ items: packaging_types } = {}) =>
      setPackagingTypes(packaging_types),
    );
    getDcs().then(({ items: deliveryLocation } = {}) =>
      setDropDownValues((prevState) => ({ ...prevState, deliveryLocation })),
    );
  }, []);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    loadPurchaseOrders({ newPage });
  };

  const handleChangeTab = (_event, newTab) => {
    setTab(newTab);
    setPage(1);
    loadPurchaseOrders({ selectedTab: newTab });
  };

  const getPartnersData = (query) => {
    getPartners({ q: query }).then(({ items: partners }) => {
      setDropDownValues({ ...dropDownValues, partners });
    });
  };

  const get_count = (value) => {
    let count = 0;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        count += counts[v];
      });
    } else {
      count += counts[value];
    }

    return count;
  };

  const onFilterSubmit = ({
    partners = [],
    payment_request_type = '',
    product_ids = [],
    delivery_location_ids = [],
    id = '',
    ...restValues
  }) => {
    const currentFilter = {
      ...restValues,
      ...(id ? { id } : {}),
      ...(partners.length ? { partner_ids: partners.map((p) => p.id) } : {}),
      ...(product_ids.length
        ? { product_ids: product_ids.map((p) => p.id) }
        : {}),
      ...(delivery_location_ids.length
        ? { delivery_location_ids: delivery_location_ids.map((d) => d.id) }
        : {}),
      ...(payment_request_type
        ? { payment_request_type: payment_request_type?.id }
        : {}),
    };
    setFilters(currentFilter);
    loadPurchaseOrders({ currentFilter });
  };

  return (
    <PageFilter
      data={[
        {
          type: 'fieldCombo',
          name: 'partners',
          label: 'Select Vendor',
          multiple: true,
          placeholder: 'Select Vendor',
          options: dropDownValues.partners,
          optionLabel: (partner) =>
            `${partner.name}-${partner.area}${`-${partner.phone_number}`}`,
          onChangeInput: (value) => getPartnersData(value),
          groupBy: (value) => value.type,
        },
        {
          type: 'fieldInput',
          name: 'id',
          label: 'PO Number',
          placeholder: 'Enter PO Number',
          style: { width: '150px', marginTop: 0 },
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
          name: 'delivery_location_ids',
          label: 'Delivery Location',
          multiple: true,
          placeholder: 'Select Delivery Location',
          options: dropDownValues?.deliveryLocation || [],
        },
        {
          type: 'fieldCombo',
          name: 'product_ids',
          label: 'Select Packaging Item',
          placeholder: 'Select Packaging Item',
          multiple: true,
          optionLabel: (obj) => obj?.item_code,
          style: { width: '200px', marginTop: 0 },
          options: packagingTypes || [],
        },
        {
          type: 'fieldCombo',
          name: 'payment_request_type',
          label: 'Select Payment Request Status',
          placeholder: 'Select Payment Request Status',
          options: dropDownValues.payment,
        },
      ]}
      filterLabel="Purchase Orders"
      initialValues={{
        id: '',
        partners: [],
        startDate: null,
        endDate: null,
        vendors: [],
        product_ids: [],
        delivery_location_ids: [],
        itemId: [],
        payment_request_type: null,
        ...filters,
      }}
      setFilters={onFilterSubmit}
    >
      <Tabs
        value={tab}
        onChange={handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        className="transfer-order-tabs"
        style={{ marginBottom: '0.2rem' }}
      >
        {PO_APPROVAL_STATUS_LIST.map(({ value, label }) => (
          <Tab
            label={`${label} (${get_count(value) || 0})`}
            key={value}
            value={value}
          />
        ))}
      </Tabs>
      {loading ? (
        <AppLoader />
      ) : (
        <>
          <PageLayout.Body>
            {data.length ? (
              <Grid container direction="column">
                <GridListView
                  data={data}
                  columns={[...COLUMNS, ...ACTION_COLUMNS]}
                  isHeaderSticky
                />
              </Grid>
            ) : (
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ height: '100%' }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  className="disabled-text"
                  color="textPrimary"
                >
                  No Data Available
                </Typography>
              </Grid>
            )}
          </PageLayout.Body>
          <CustomPagination
            count={totalCount}
            page={page}
            shape="rounded"
            onChange={handleChangePage}
          />
        </>
      )}
    </PageFilter>
  );
};

export default POApprovalList;
