import { useEffect, useRef, useState } from 'react';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { Grid, Link, Tab, Tabs, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import {
  Carousel,
  CustomPagination,
  GridListView,
  PageFilter,
} from 'Components';
import RouteTransformer from 'Routes/routeTransformer';
import {
  getCostHeads,
  getDCVendors,
  getPaymentListing,
} from 'Services/payments';
import { STATUS, STATUS_LIST } from 'Utilities/constants/paymentRequest';
import { getFormattedDate, getFormattedDateTime } from 'Utilities/dateUtils';
import { columnStyles } from './styled'

const useStyles = makeStyles((theme) => ({
  status: {
    border: `1px solid ${theme.palette.primary.light}`,
    padding: '2px 4px',
    borderRadius: '10px',
    textTransform: 'uppercase',
  },
}));

const COLUMNS = [
  {
    header: {
      label: 'PR ID',
      style: {},
    },
    key: 'identifier',
    props: { md: 1, xs: 12 },
    style: columnStyles.prIdColumn,
    render: (data) => {
      const {
        id,
        nfi_purchase_order_id,
        identifier,
        nfi_trip_id,
        dc_id,
        priority,
        status,
        parent_bill_id,
      } = data;
      let URL;
      if (nfi_purchase_order_id) {
        URL = `/app/purchase-order/${nfi_purchase_order_id}/payment-requests/${id}/edit`;
      } else if (nfi_trip_id) {
        URL = parent_bill_id
          ? `/app/${RouteTransformer.getEditBalancePrLink(
              nfi_trip_id,
              parent_bill_id,
              id,
            )}`
          : `/app/${RouteTransformer.getEditPrLink(nfi_trip_id, id)}`;
      } else {
        URL = `/app/inventory/${dc_id}/payment-request/${id}/edit`;
      }

      return (
        <Grid container alignItems="center">
          {priority === 1 ? (
            <ArrowUpward style={columnStyles.arrowUpward} />
          ) : (
            <ArrowDownward style={columnStyles.arrowDownward} />
          )}
          {status === STATUS.PENDING || status === STATUS.REJECTED ? (
            <Link href={URL}>{identifier}</Link>
          ) : (
            identifier
          )}
        </Grid>
      );
    },
  },
  {
    header: {
      label: 'PO ID/ Trip ID',
    },
    key: 'source_label',
    props: { md: 1, xs: 12 },
    render: (data) => {
      const { nfi_purchase_order_id, source_label, nfi_trip_id } = data;
      const URL = nfi_purchase_order_id
        ? `/app/${RouteTransformer.getTripsListingLinkForPO(
            nfi_purchase_order_id,
          )}`
        : `/app/${RouteTransformer.getPrListingLink(nfi_trip_id)}`;
      return (
        <Link href={URL} style={columnStyles.sourceLabelColumn}>
          {source_label}
        </Link>
      );
    },
  },
  {
    header: {
      label: 'Vendor',
    },
    key: 'vendor',
    render: (data, props) => (
      <Grid container>
        <Grid item md={12} xs={12} style={columnStyles.vendorMargin}>
          <Typography
            variant="body1"
            onClick={() => props.openPartnerDetails(data.vendor || {})}
            style={columnStyles.vendorText }
          >
            {data?.vendor?.name || ''}
          </Typography>
        </Grid>
        <Grid item md={12} xs={12}>
          <Typography
            variant="caption"
            color={
              data?.vendor?.bank_status === 'Verified' ? 'primary' : 'secondary'
            }
            className={props.classes.status}
          >
            KYC {data?.vendor?.kyc_status}
          </Typography>
        </Grid>
        <Grid item md={12} xs={12}>
          <Typography
            variant="caption"
            color={
              data?.vendor?.bank_status === 'Verified' ? 'primary' : 'secondary'
            }
            className={props.classes.status}
          >
            Bank {data?.vendor?.bank_status}
          </Typography>
        </Grid>
      </Grid>
    ),
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'Category',
    },
    key: 'category_label',
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'Value (Type)',
    },
    key: 'amount',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <>
        <Typography>₹ {data.amount}</Typography>
        <Typography>({data.payment_request_type_label})</Typography>
      </>
    ),
  },
  {
    header: {
      label: 'Balance Advance',
    },
    key: 'outstanding_advance',
    props: { md: 1, xs: 12 },
    render: (data) =>
      !data.dc_id && data.outstanding_advance ? (
        <Typography>₹ {data.outstanding_advance}</Typography>
      ) : (
        <>--</>
      ),
  },
  {
    header: {
      label: 'Due Date',
    },
    key: 'due_date',
    props: { md: 1, xs: 12 },
    render: (data) => (
      <Typography variant="body1">{getFormattedDate(data.due_date)}</Typography>
    ),
  },
  {
    header: {
      label: 'Requested',
    },
    key: 'created_date',
    style: {},
    props: { md: 1, xs: 12 },
    render: (data) => (
      <>
        <Typography variant="body1">{data.creator_name}</Typography>
        <Typography variant="caption">
          {getFormattedDateTime(data.created_date)}
        </Typography>
      </>
    ),
  },
  {
    header: {
      label: 'Approvers',
    },
    key: 'id',
    render: (data) => (
      <>
        {data.status === STATUS.APPROVED ||
        data.status === STATUS.PAID ||
        data.status === STATUS.FINANCE_APPROVED ? (
          <>
            <Typography variant="body1">
              (B) {data.approver_name} <br />
            </Typography>
            <Typography variant="caption">
              {getFormattedDateTime(data.approved_date)}
            </Typography>
            {/* Check if data.finance_approver_name is not null and render below */}
            {data.finance_approver_name && (
              <>
                <Typography variant="body1">
                  (F) {data.finance_approver_name}
                </Typography>
                <Typography variant="caption">
                  {getFormattedDateTime(data.finance_approved_date)}
                </Typography>
              </>
            )}
          </>
        ) : (
          <>
            {data.approvers.map((approver) => (
              <Typography key={approver.id} variant="body1">
                {approver.name}
              </Typography>
            ))}
          </>
        )}
      </>
    ),
    props: { md: 1, xs: 12 },
  },
  {
    header: {
      label: 'Paid at/Attachments',
    },
    key: 'id',
    render: (data) => {
      return (
        <Grid container direction="row" spacing={1}>
          {data.zoho_payment_ids?.map((paymentId) => (
            <Typography variant="body1" key={paymentId}>
              {paymentId}
            </Typography>
          ))}
          {getFormattedDateTime(data.paid_date)}
          {data.bill_date ? (
            <>
              <Typography variant="body2" style={columnStyles.billFont}>
                Bill Date:
              </Typography>
              <Typography variant="body1">
                {getFormattedDate(data.bill_date)}
              </Typography>
            </>
          ) : (
            <></>
          )}
          <Grid item md={10}>
            <Carousel imageData={data?.files} />
          </Grid>
        </Grid>
      );
    },
    props: { md: 1, xs: 12 },
  },
];

const PAGE_SIZE = 25;

const MyPaymentRequestLists = () => {
  const classes = useStyles();

  const { userInfo: { id: userId } = {} } = useSiteValue();
  // const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [approvalList, setApprovalList] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [counts, setCounts] = useState({});
  const [vendors, setVendorList] = useState([]);
  const didMount = useRef(false);
  const [dropDownValues, setDropDownValues] = useState({
    cost_heads: [],
  });

  const loadPaymentListing = (newPage) => {
    getPaymentListing({
      creator_id: userId,
      creator: true,
      status: tab,
      offset: (newPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      show_counts: true,
      ...filters,
    }).then((res) => {
      setCounts(res?.counts || {});
      if (res.items) {
        setApprovalList(res?.items || []);
        setTotalCount(Math.ceil(res?.total_count / PAGE_SIZE) || 0);
      }
    });
  };

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
    } else {
      loadPaymentListing(1);
    }
  }, [tab]);

  const getAllDropDownValues = () => {
    Promise.all([getCostHeads()])
      .then(([{ items: cost_heads } = {}]) => {
        setDropDownValues({
          cost_heads,
        });
      })
      .catch(() => ({}));
  };

  useEffect(() => {
    getAllDropDownValues();
  }, []);

  const submitFilters = ({
    after,
    before,
    id,
    trip_id,
    vendors,
    cost_head,
  }) => {
    const currentFilter =
      id || trip_id
        ? { ...(id ? { id } : { trip_id }) }
        : {
            ...(after ? { after } : {}),
            ...(before ? { before } : {}),
            ...(vendors ? { vendor_id: vendors?.id } : {}),
            ...(cost_head ? { cost_head_id: cost_head?.id } : {}),
          };

    setFilters(currentFilter);

    getPaymentListing({
      creator_id: userId,
      creator: true,
      status: tab,
      offset: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      show_counts: true,
      ...currentFilter,
    }).then((res) => {
      setCounts(res?.counts || {});
      if (res.items) {
        setApprovalList(res?.items || []);
        setTotalCount(Math.ceil(res?.total_count / PAGE_SIZE) || 0);
      }
    });
  };

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
    setPage(1);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const openPartnerDetails = (partner) => {
    window.open(`${API.CRMUrl}partners/${partner.id}`);
  };

  const getUpdatedVendors = (query) => {
    getDCVendors({ q: query }).then(({ items = [] }) => setVendorList(items));
  };

  return (
    <PageFilter
      initialValues={{
        id: '',
        after: null,
        before: null,
        vendors: null,
        cost_head: null,
        ...filters,
      }}
      initialApiCall
      filterLabel="My Payment Request List"
      setFilters={(value) => submitFilters(value)}
      data={[
        {
          type: 'fieldInput',
          name: 'id',
          label: 'PR ID',
          placeholder: 'Enter PR ID',
          style: { width: '150px' },
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
          name: 'vendors',
          label: 'Select Vendors',
          placeholder: 'Select Vendor',
          options: vendors,
          optionLabel: (vendors) => `${vendors?.name}-${vendors?.role_names}`,
          onChangeInput: (value) => getUpdatedVendors(value),
          groupBy: (value) => value.type,
          style: { width: '200px', marginTop: 0 },
        },
        {
          type: 'fieldCombo',
          name: 'cost_head',
          label: 'Select Category',
          placeholder: 'Select Category',
          options: dropDownValues.cost_heads,
        },
      ]}
    >
      <PageLayout.Body>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
        >
          {STATUS_LIST.map(({ value, label }) => (
            <Tab
              label={`${label} (${counts[value] || 0})`}
              key={value}
              value={value}
            />
          ))}
        </Tabs>
        <GridListView
          data={approvalList}
          columns={COLUMNS}
          cellProps={{ classes, openPartnerDetails }}
          isHeaderSticky
        />
      </PageLayout.Body>
      {totalCount > 1 && (
        <CustomPagination
          count={totalCount}
          page={page}
          shape="rounded"
          onChange={handleChangePage}
        />
      )}
    </PageFilter>
  );
};

export default MyPaymentRequestLists;
