import { useEffect, useRef, useState } from 'react';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { Grid, Link, Tab, Tabs, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import {
  AppButton,
  AppLoader,
  Carousel,
  CustomPagination,
  GridListView,
  PageFilter,
} from 'Components';
import {
  FieldDatePicker,
  FieldInput,
  FieldSwitch,
} from 'Components/FormFields';
import CustomModal from 'Components/Modal';
import ViewPaymentRequest from 'Components/PaymentRequest/ViewPaymentRequest';
import { Formik } from 'formik';
import { throttle } from 'lodash';
import RouteTransformer from 'Routes/routeTransformer';
import {
  approveOrRejectPayment,
  getCostHeads,
  getDCVendors,
  getPaymentListing,
} from 'Services/payments';
import { toFixedNumber } from 'Utilities';
import {
  PAYMENT_REQUEST_PRIORITY,
  PAYMENT_REQUEST_TYPE,
  STATUS,
  STATUS_LIST,
} from 'Utilities/constants/paymentRequest';
import { getFormattedDate, getFormattedDateTime } from 'Utilities/dateUtils';
import { validateRequired } from 'Utilities/formvalidation';

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
    },
    key: 'identifier',
    props: { md: 1, xs: 12 },
    style: { minWidth: '4rem' },
    render: (data) => {
      const { identifier, priority } = data;
      return (
        <Grid container alignItems="center">
          {priority === 1 ? (
            <ArrowUpward style={{ color: 'red', marginRight: '1rem' }} />
          ) : (
            <ArrowDownward style={{ color: 'green', marginRight: '1rem' }} />
          )}
          {identifier}
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
    style: { minWidth: '4rem', wordWrap: 'break-word' },
    render: (data) => {
      const { nfi_purchase_order_id, source_label, nfi_trip_id } = data;
      const URL = nfi_purchase_order_id
        ? `/app/${RouteTransformer.getTripsListingLinkForPO(
            nfi_purchase_order_id,
          )}`
        : `/app/${RouteTransformer.getPrListingLink(nfi_trip_id)}`;
      return (
        <Link href={URL} sx={{ wordBreak: 'break-word' }}>
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
        <Grid item md={12} xs={12} style={{ marginBottom: '0.5rem' }}>
          <Typography
            variant="body1"
            onClick={() => props.openPartnerDetails(data.vendor || {})}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
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
        <Typography>
          {data.payment_request_type === PAYMENT_REQUEST_TYPE.BILL &&
          !data.dc_id ? (
            <ViewPaymentRequest data={data} />
          ) : (
            `₹ ${toFixedNumber(data.amount)}`
          )}
        </Typography>
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
        <></>
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
      label: 'Paid At/Attachments',
    },
    key: 'id',
    render: (data) => {
      return (
        <Grid container direction="row" spacing={1}>
          {(data?.status == STATUS.PENDING || data?.status == STATUS.PAID) &&
            data?.customer && (
              <Typography variant="body1">
                Paid By : {data?.customer?.name}
              </Typography>
            )}
          {!data?.customer &&
            data.zoho_payment_ids?.map((paymentId) => (
              <Typography variant="body1" key={paymentId}>
                {paymentId}
              </Typography>
            ))}
          {!data?.customer && getFormattedDateTime(data.paid_date)}
          {data.bill_date ? (
            <>
              <Typography variant="body2" style={{ fontWeight: 'bold' }}>
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
  {
    header: {
      label: 'Approval',
    },
    key: 'id',
    render: (data, props) => (
      <Grid container alignItems="center" spacing={1}>
        {data.status === STATUS.PENDING ? (
          <>
            <Grid item lg={9} sm={12}>
              <AppButton
                onClick={() => props.approvePaymentRequest(data)}
                color="primary"
                variant="contained"
                fullWidth
                size="small"
              >
                Approve
              </AppButton>
            </Grid>
            <Grid item lg={9} sm={12}>
              <AppButton
                onClick={() => props.rejectPaymentRequest(data)}
                color="error"
                variant="contained"
                size="small"
                fullWidth
              >
                Reject
              </AppButton>
            </Grid>
          </>
        ) : (
          <></>
        )}
      </Grid>
    ),
    props: { md: 1, xs: 12 },
  },
];

const PAGE_SIZE = 25;

const MyApprovalLists = () => {
  const classes = useStyles();

  const { userInfo: { id: userId } = {} } = useSiteValue();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [filters, setFilters] = useState({});
  const [approvalList, setApprovalList] = useState([]);
  const [openApproval, setOpenApproval] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [counts, setCounts] = useState({});
  const [vendorList, setVendorList] = useState([]);
  const didMount = useRef(false);
  const [dropDownValues, setDropDownValues] = useState({
    cost_heads: [],
  });

  const loadPaymentListing = ({ newPage = 1 }) => {
    setLoading(true);
    getPaymentListing({
      approver_id: userId,
      approver: true,
      status: tab,
      offset: (newPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      show_counts: true,
      ...filters,
    })
      .then((res) => {
        setCounts(res?.counts || {});
        if (res.items) {
          setApprovalList(res?.items || []);
          setTotalCount(Math.ceil(res?.total_count / PAGE_SIZE) || 0);
        }
      })
      .finally(() => setLoading(false));
  };

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

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
    } else {
      loadPaymentListing({ newPage: 1 });
    }
  }, [tab]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
    loadPaymentListing({ newPage });
  };

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
    setPage(1);
  };

  const approvePaymentRequest = (data) => {
    setSelectedData(data);
    setOpenApproval(true);
  };

  const rejectPaymentRequest = (data) => {
    setSelectedData(data);
    setOpenReject(true);
  };

  const updateData = (
    { approve = false, reject = false },
    { priority, due_date, reject_reason } = {},
  ) => {
    let updatedValues;
    if (approve) {
      updatedValues = {
        priority: priority ? 1 : 3,
        due_date,
        approved_date: Date.now(),
        approver_id: userId,
        status: STATUS.APPROVED,
      };
    } else if (reject) {
      updatedValues = {
        rejected_date: Date.now(),
        rejector_id: userId,
        status: STATUS.REJECTED,
        reject_reason,
      };
    }
    approveOrRejectPayment(selectedData.id, updatedValues)
      .then(() =>
        getPaymentListing({
          approver_id: userId,
          status: tab,
          approver: true,
          show_counts: true,
          ...filters,
        }).then((res) => {
          setCounts(res?.counts || {});
          if (res.items) {
            setApprovalList(res.items);
          }
        }),
      )
      .finally(() => {
        setSelectedData({});
        if (approve) {
          setOpenApproval(false);
        } else if (reject) {
          setOpenReject(false);
        }
      });
  };

  const submitFilters = ({
    after,
    before,
    id,
    trip_id,
    vendors,
    cost_head,
  }) => {
    setLoading(true);
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
      approver_id: userId,
      approver: true,
      status: tab,
      offset: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      show_counts: true,
      ...currentFilter,
    })
      .then((res) => {
        setCounts(res?.counts || {});
        if (res.items) {
          setApprovalList(res?.items || []);
          setTotalCount(Math.ceil(res?.total_count / PAGE_SIZE) || 0);
        }
      })
      .finally(() => setLoading(false));
  };

  const openPartnerDetails = (partner) => {
    window.open(`${API.CRMUrl}partners/${partner.id}`);
  };

  const getUpdatedVendors = (query) => {
    getDCVendors({ q: query }).then(({ items = [] }) => setVendorList(items));
  };

  const closeModal = (modal) => {
    return () => modal(false);
  };

  const throttleApi = (data) =>
    throttle((values) => updateData(data, values), 3000, {
      trailing: false,
    });

  return (
    <PageFilter
      initialValues={{
        ...{
          id: '',
          after: null,
          before: null,
          vendors: null,
          cost_head: null,
        },
        ...filters,
      }}
      filterLabel="My Approval List"
      setFilters={(value) => submitFilters(value)}
      initialApiCall
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
          label: 'Select Vendor',
          placeholder: 'Select Vendors',
          options: vendorList,
          optionLabel: (vendorList) =>
            `${vendorList?.name}-${vendorList?.role_names}`,
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
        {loading ? (
          <AppLoader />
        ) : approvalList.length ? (
          <GridListView
            data={approvalList}
            columns={COLUMNS}
            cellProps={{
              classes,
              approvePaymentRequest,
              rejectPaymentRequest,
              openPartnerDetails,
            }}
          />
        ) : (
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
        )}
        <CustomModal
          title="Approve this payment request"
          open={openApproval}
          onClose={closeModal(setOpenApproval)}
        >
          <Grid container direction="column" spacing={0}>
            <Formik
              initialValues={{
                ...selectedData,
                priority:
                  selectedData.priority === PAYMENT_REQUEST_PRIORITY.HIGH,
              }}
              enableReinitialize
              onSubmit={throttleApi({ approve: true })}
            >
              {({ handleSubmit, values }) => (
                <Grid container>
                  {values?.customer && (
                    <Typography variant="body1">
                      Approve this Payment Request as Paid by Customer?
                    </Typography>
                  )}
                  {!values?.customer && (
                    <>
                      <Grid container style={{ marginTop: '1rem' }}>
                        <Grid item md={4} xs={12}>
                          <Typography variant="body1">High Priority</Typography>
                        </Grid>
                        <Grid item md={8} xs={12}>
                          <FieldSwitch
                            size="medium"
                            label=""
                            name="priority"
                            checked={values.priority}
                            labelPlacement="end"
                            InputLabelProps={{
                              fullWidth: false,
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container style={{ marginTop: '1rem' }}>
                        <Grid item md={4} xs={12}>
                          <Typography variant="body1">Due Date</Typography>
                        </Grid>
                        <Grid item md={8} xs={12}>
                          <FieldDatePicker
                            name="due_date"
                            variant="inline"
                            placeholder="Due Date"
                            autoOk
                            inputVariant="outlined"
                            format="DD/MM/YYYY"
                            textFieldProps={{
                              size: 'small',
                            }}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                  <Grid
                    container
                    style={{ marginTop: '1rem' }}
                    justifyContent="flex-end"
                  >
                    <AppButton
                      variant="contained"
                      color="primary"
                      style={{ margin: '0 1rem' }}
                      onClick={handleSubmit}
                    >
                      {values.customer ? 'Yes' : 'Save'}
                    </AppButton>
                  </Grid>
                </Grid>
              )}
            </Formik>
          </Grid>
        </CustomModal>
        <CustomModal
          title="Warning"
          open={openReject}
          onClose={closeModal(setOpenReject)}
        >
          <Typography
            variant="body1"
            gutterBottom
            style={{ marginBottom: '1rem' }}
          >
            Are you sure you want to reject this payment request ?
          </Typography>
          <Formik
            initialValues={{}}
            onSubmit={throttleApi({ reject: true })}
            enableReinitialize
          >
            {({ handleSubmit }) => (
              <>
                <FieldInput
                  name="reject_reason"
                  size="small"
                  label="Reject Reason"
                  placeholder="Reject Reason"
                  variant="outlined"
                  required
                  validate={validateRequired}
                  multiline
                  rows={3}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Grid
                  container
                  style={{ marginTop: '1rem' }}
                  justifyContent="flex-end"
                >
                  <AppButton
                    variant="contained"
                    color="primary"
                    className="margin-horizontal"
                    size="small"
                    onClick={handleSubmit}
                  >
                    Yes
                  </AppButton>
                </Grid>
              </>
            )}
          </Formik>
        </CustomModal>
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

export default MyApprovalLists;
