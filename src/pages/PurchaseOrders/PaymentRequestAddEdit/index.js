import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import {
  AppButton,
  AppLoader,
  DeleteButtonWithModal,
  GridListView,
  ImageThumb,
} from 'Components';
import {
  FieldCombo,
  FieldDatePicker,
  FieldDateTimePicker,
  FieldInput,
  FieldSwitch,
} from 'Components/FormFields';
import { FieldArray, Formik } from 'formik';
import {
  createPaymentRequest,
  deletePaymentRequestById,
  getCostHeads,
  getDCApprovers,
  getDCVendors,
  getPaymentListing,
  getPaymentRequestById,
  getPaymentRequestVendors,
  getVendorAdvanceAdjustmentListing,
  updatePaymentRequest,
} from 'Services/payments';
import { getCategoryProducts } from 'Services/product';
import { getPaymentsById, getPurchaseOrderById } from 'Services/purchaseOrder';
import { notifyUser, toFixedNumber } from 'Utilities';
import {
  PAYMENT_REQUEST_TYPE,
  STATUS,
} from 'Utilities/constants/paymentRequest';
import { PURCHASE_ORDER_TYPE } from 'Utilities/constants/purchaseOrder';
import imageDirectUpload from 'Utilities/directUpload';
import {
  validateArrayRequired,
  validateRequired,
} from 'Utilities/formvalidation';

import {
  calculatePurchaseValues,
  calculateRemainingPayment,
  getCostHeadId,
  getOtherChargesData,
  prAttachment,
  shouldDisableBillPR,
} from '../utils';

import AdvanceAdjustment from './AdvanceAdjustment';
import { OTHER_CHARGES_COLUMNS, SHIPMENT_COLUMNS } from './columns';
import SelectShipments from './SelectShipments';
import ServicePODetails from './ServicePODetails';
import { useStyles } from './styled';
import UploadBillModal from './UploadBillModal';

const PaymentRequestAddEdit = () => {
  const { poId = null, prId = null } = useParams();
  const navigate = useNavigate();
  // const [vendor, setVendor] = useState(null);
  const [paymentRequest, setPaymentRequest] = useState({
    payment_request_type: PAYMENT_REQUEST_TYPE.ADVANCE,
    vendor: null,
    priority: false,
    cost_head: null,
    approvers: [],
    advance_amount_adjustments: [],
    product_categories: [],
  });
  const [isLoading, setLoading] = useState(false);
  const [prVendors, setPrVendors] = useState({});
  const [shipments, setShipments] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [approverList, setApproverList] = useState([]);
  const [costHeadsList, setCostHeadsList] = useState([]);
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [shipmentData, setShipmentsData] = useState(null);
  const [showUploadBillNModal, setShowUploadBillModal] = useState(false);
  const [advancePayment, setAdvancePayment] = useState([]);
  const [vendorAdvancePayment, setVendorAdvancePayment] = useState([]);
  const [remainingVendorAmount, setRemainingVendorAmount] = useState(0);
  const [productCategoryList, setProductCategoryList] = useState([]);

  const { marginTop } = useStyles();

  const { SERVICE_PURCHASE_ORDER } = PURCHASE_ORDER_TYPE;
  const { acknowledgement_note } = purchaseOrder;

  const isServicePO = purchaseOrder.po_type === SERVICE_PURCHASE_ORDER;

  let purchaseValues = {};
  if (isServicePO) {
    purchaseValues = calculatePurchaseValues(purchaseOrder.purchase_items);
  }

  const { userInfo: { id: userId } = {} } = useSiteValue();
  const bill_other_charges = getOtherChargesData(
    shipmentData?.[0]?.id,
    shipments,
  );

  const uploadFile = (file = '') => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve('');
      }
      if (file instanceof File) {
        imageDirectUpload(file)
          .then(({ data: { signed_id = '' } = {} }) => {
            resolve(signed_id);
          })
          .catch(() => reject(new Error('Failed to upload file.')));
      } else {
        resolve(file.signed_id);
      }
    });
  };

  const updateSelectedShipments = (values) => {
    if (values.length) {
      getPaymentsById({
        non_fruit_shipment_ids: values,
      }).then(({ items = [] }) => {
        setShipmentsData(items || []);
        if (!prId && items.length === 1) {
          setPaymentRequest({
            ...paymentRequest,
            bill_number: items[0].bill_number,
            payment_request_bill: [items[0].bill],
          });
        }
      });
    }
  };

  useEffect(() => {
    getPaymentRequestVendors({ non_fruit_purchase_order_id: poId }).then(
      (data) => setPrVendors(data),
    );

    getCostHeads().then(({ items = [] }) => setCostHeadsList(items));

    getCategoryProducts().then(({ items = [] }) =>
      setProductCategoryList(items),
    );

    getDCApprovers().then(({ items = [] }) => setApproverList(items));

    if (prId) {
      setLoading(true);
      getPaymentRequestById(prId)
        .then((res) => {
          const paymentRequestData = {
            ...paymentRequest,
            ...res,
            priority: res.priority === 1,
            payment_request_type: res.payment_request_type,
          };
          updateSelectedShipments(res?.non_fruit_shipment_ids || []);
          return paymentRequestData;
        })
        .then(({ bill_other_charges = [], ...paymentRequestData }) => {
          getPurchaseOrderById(poId).then((res) => {
            setShipments(res?.non_fruit_shipments || []);
            const shipmentsGst = res?.purchase_items.reduce(
              (acc, { packaging_item, service_type, gst } = {}) => {
                const { id } =
                  res.po_type === SERVICE_PURCHASE_ORDER
                    ? service_type
                    : packaging_item;
                return {
                  ...acc,
                  [id]: {
                    gst,
                  },
                };
              },
              {},
            );
            setPaymentRequest({
              ...paymentRequest,
              ...paymentRequestData,
              shipment: shipmentsGst,
              bill_other_charges,
            });
            setPurchaseOrder(res);
          });
        })
        .finally(() => setLoading(false));
    }

    if (poId && !prId) {
      getPurchaseOrderById(poId).then((res) => {
        setShipments(res?.non_fruit_shipments || []);
        const shipmentsGst = res?.purchase_items.reduce(
          (acc, { packaging_item, service_type } = {}) => {
            const { id } =
              res.po_type === SERVICE_PURCHASE_ORDER
                ? service_type
                : packaging_item;
            return {
              ...acc,
              [id]: {
                gst: null,
              },
            };
          },
          {},
        );
        setPaymentRequest({
          ...paymentRequest,
          shipment: shipmentsGst,
        });
        setPurchaseOrder(res);
      });
    }
  }, [prId, poId]);

  useEffect(() => {
    if (Object.keys(prVendors).length && paymentRequest?.shipment) {
      // calling only after both usestates been set
      setLoading(true);
      getPaymentListing({
        non_fruit_purchase_order_id: poId,
        adjustment_to_payment_request_id: prId,
        payment_request_type: PAYMENT_REQUEST_TYPE.ADVANCE,
        status: [STATUS.APPROVED, STATUS.PAID],
        vendor_id: prVendors?.id,
      })
        .then((res) => {
          const samePoAdjustments = [];
          const otherPoAdjustments = [];
          res.items.forEach((item) => {
            const { advance_amount_adjustments = [] } = paymentRequest;
            const foundAdjustment =
              advance_amount_adjustments?.find(
                (ad) => ad.from_payment_request_id === item.id,
              ) || {};

            const newItem = {
              ...foundAdjustment,
              from_payment_request_id: item.id,
              ...(prId ? { to_payment_request_id: +prId } : {}),
              amount: prId
                ? +foundAdjustment.amount || 0
                : (+foundAdjustment.amount || 0) + +item.remaining_amount,
              adjust: {
                adjust: prId
                  ? (+foundAdjustment.amount || 0) ===
                    (+foundAdjustment.amount || 0) + +item.remaining_amount
                  : true,
              },
              total_adjustment_amount:
                (+foundAdjustment.amount || 0) + +item.remaining_amount,
              nfi_purchase_order_id: item.nfi_purchase_order_id,
            };

            if (Number(item.nfi_purchase_order_id) === Number(poId)) {
              samePoAdjustments.push(newItem);
            } else {
              otherPoAdjustments.push(newItem);
            }
          });

          setAdvancePayment(samePoAdjustments);
          setVendorAdvancePayment(otherPoAdjustments);
          setRemainingVendorAmount(res?.remaining_vendor_amount || 0);
        })
        .finally(() => setLoading(false));
    }
  }, [prVendors, paymentRequest]);

  const getAdvancePaymentNotAdjusted = () => {
    getVendorAdvanceAdjustmentListing({
      vendor_id: prVendors?.id,
      nfi_purchase_order_id: purchaseOrder?.id,
    }).then((res) => {
      const adjustmentData = res.items
        .map((item) => {
          const { advance_amount_adjustments = [] } = paymentRequest;
          const foundAdjustment =
            advance_amount_adjustments.find(
              (ad) => ad.from_payment_request_id === item.id,
            ) || {};
          return {
            ...foundAdjustment,
            from_payment_request_id: item.id,
            ...(prId ? { to_payment_request_id: +prId } : {}),
            amount: prId
              ? +foundAdjustment.amount || 0
              : (+foundAdjustment.amount || 0) + +item.remaining_amount,
            adjust: {
              adjust: prId
                ? (+foundAdjustment.amount || 0) ===
                  (+foundAdjustment.amount || 0) + +item.remaining_amount
                : true,
            },
            total_adjustment_amount:
              (+foundAdjustment.amount || 0) + +item.remaining_amount,
            nfi_purchase_order_id: item.nfi_purchase_order_id,
          };
        })
        .filter((ad) => ad.total_adjustment_amount > 0);
      setVendorAdvancePayment(adjustmentData);
    });
  };

  const disableSubmit = (isServicePO, payment_request_type, file, url) => {
    const isAttachmentAvailable = !!url || !!file;
    if (isServicePO) {
      return (
        payment_request_type === PAYMENT_REQUEST_TYPE.BILL &&
        !isAttachmentAvailable
      );
    }

    return (
      payment_request_type === PAYMENT_REQUEST_TYPE.BILL &&
      (!isAttachmentAvailable || !shipmentData)
    );
  };

  const calculateTotalTaxableAmount = (values) => {
    const billOtherCharges = values.bill_other_charges || [];
    const shipmentsTaxableAmount = shipmentData
      .reduce((acc, { non_fruit_lots = [] }) => [...acc, ...non_fruit_lots], [])
      .reduce((acc, { taxable_amount = 0 }) => acc + taxable_amount, 0);
    const billOtherChargesTaxableAmount = billOtherCharges.reduce(
      (acc, { taxable_amount }) => acc + taxable_amount,
      0,
    );

    return toFixedNumber(
      Number(shipmentsTaxableAmount) + Number(billOtherChargesTaxableAmount),
      4,
    );
  };

  const calculateTotalGST = (values) => {
    const billOtherCharges = values.bill_other_charges || [];
    const shipmentsGSTAmount = shipmentData
      .reduce((acc, { non_fruit_lots = [] }) => [...acc, ...non_fruit_lots], [])
      .reduce(
        (acc, { taxable_amount = 0, gst = 0, packaging_item: { id = '' } }) => {
          if (!values?.shipment?.[id]) return acc;
          return (
            toFixedNumber(
              acc + (taxable_amount * (gst >= 0 ? gst : 0) || 0) / 100,
            ) || 0
          );
        },
        0,
      );
    const billOtherChargesGSTAmount = billOtherCharges.reduce(
      (acc, { gst, taxable_amount }) => {
        if (!gst) return acc;

        return acc + (taxable_amount * (gst >= 0 ? gst : 0)) / 100;
      },
      0,
    );

    return toFixedNumber(
      Number(shipmentsGSTAmount) + Number(billOtherChargesGSTAmount),
      4,
    );
  };

  const calculateTotalPayment = (values) => {
    return toFixedNumber(
      calculateTotalGST(values) + calculateTotalTaxableAmount(values),
      4,
    );
  };

  const calculateTotalPaymentAfterAdjustments = (values) => {
    const shipment_value = toFixedNumber(
      calculateTotalGST(values) + calculateTotalTaxableAmount(values),
      4,
    );
    const advanceAmount = toFixedNumber(
      values?.advance_amount_adjustments?.reduce(
        (acc, val) => acc + (val?.amount || 0),
        0,
      ) || 0,
      4,
    );
    const vendorAdvanceAmount = toFixedNumber(
      values?.vendor_advance_adjustments?.reduce(
        (acc, val) => acc + (val?.amount || 0),
        0,
      ) || 0,
      4,
    );
    return toFixedNumber(
      shipment_value - advanceAmount - vendorAdvanceAmount,
      4,
    );
  };

  const renderSelectedShipments = (values) => {
    const { bill_other_charges = [] } = values;
    if (!shipmentData) return null;

    return (
      <>
        {shipmentData.map(
          ({ non_fruit_lots = [], id = '', shipment_identifier = '' }) => {
            return (
              <>
                <Typography
                  variant="subtitle2"
                  component="label"
                  className="title"
                  color="textPrimary"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <strong>Shipment - {shipment_identifier}</strong>
                </Typography>
                <GridListView
                  columns={SHIPMENT_COLUMNS}
                  data={non_fruit_lots}
                  cellProps={{ values, shipmentId: id }}
                />
              </>
            );
          },
        )}
        <Grid container justifyContent="flex-end" p={1} mb={1}>
          {values.bill_other_charges ? (
            <Grid item xs={12} md={8}>
              <FieldArray
                name="bill_other_charges"
                render={() => (
                  <GridListView
                    data={bill_other_charges || []}
                    columns={OTHER_CHARGES_COLUMNS}
                  />
                )}
              />
            </Grid>
          ) : null}
        </Grid>
        <Grid container direction="column" alignItems="flex-end" spacing={2}>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            style={{ margin: '0.5rem 0' }}
          >
            <Grid item md={2}>
              <Typography>
                <b>Taxable Amount: </b>
              </Typography>
            </Grid>
            <Grid item md={1} alignItems="flex-end">
              <Typography>{calculateTotalTaxableAmount(values)}</Typography>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            style={{ margin: '0.5rem 0' }}
          >
            <Grid item md={2} justifyContent="flex-end" alignItems="flex-end">
              <Typography>
                <b>GST: </b>
              </Typography>
            </Grid>
            <Grid item md={1} alignItems="flex-end">
              <Typography>{calculateTotalGST(values)}</Typography>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            style={{ margin: '0.5rem 0' }}
          >
            <Grid item md={2} justifyContent="flex-end" alignItems="flex-end">
              <Typography>
                <b>Total: </b>
              </Typography>
            </Grid>
            <Grid item md={1} alignItems="flex-end">
              <Typography>{calculateTotalPayment(values)}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <AdvanceAdjustment
          poId={poId}
          {...{
            getAdvancePaymentNotAdjusted,
            remainingVendorAmount,
            calculateTotalPaymentAfterAdjustments,
          }}
        />
      </>
    );
  };

  const getUpdatedVendors = (query) => {
    getDCVendors({ q: query }).then(({ items = [] }) => setVendorList(items));
  };

  const goToAddVendor = () => {
    window.open(
      `${API.CRMUrl}partners/new?role=Others&show_kyc=true`,
      '_blank',
    );
  };

  const returnToListingPage = () => {
    navigate(`/app/purchase-order/${poId}/payment-requests/list`);
  };

  const onClickUploadBill = () => {
    setShowUploadBillModal(true);
  };

  const closeConfirmDialog = () => {
    setShowUploadBillModal(false);
  };

  if (isLoading) {
    return <AppLoader />;
  }

  const onFormSubmit = (values, { setSubmitting }) => {
    const {
      payment_request_bill: { 0: file } = [],
      priority = false,
      bill_other_charges = [],
      advance_amount_adjustments,
      vendor_advance_adjustments,
      ...restValues
    } = values;

    const isBillPR = values.payment_request_type === PAYMENT_REQUEST_TYPE.BILL;

    const uploadedFile =
      isServicePO && isBillPR && !file ? acknowledgement_note.bill : file;

    let createData = {
      created_date: Date.now(),
      creator_id: userId,
    };

    if (values.payment_request_type === PAYMENT_REQUEST_TYPE.BILL) {
      createData = {
        ...createData,
        ...(isServicePO
          ? {}
          : { non_fruit_shipment_ids: shipmentData.map(({ id = '' }) => id) }),
      };
    }

    const processPaymentRequest = prId
      ? updatePaymentRequest
      : createPaymentRequest;

    uploadFile(uploadedFile || '')
      .then((signedId) => {
        return signedId;
      })
      .then((signedId) => {
        processPaymentRequest(
          {
            payment_request: {
              ...(!prId && createData),
              ...restValues,
              bill_other_charges_attributes: bill_other_charges,
              non_fruit_purchase_order_id: poId,
              status: 1,
              cost_head_id: getCostHeadId(
                isServicePO,
                costHeadsList,
                values.cost_head,
              ),
              vendor_id: values?.vendor?.id,
              priority: priority ? 1 : 3,
              approver_ids: values?.approvers.map(({ id = '' }) => id),
              product_category_ids: values.product_categories.map(
                ({ id = '' }) => id,
              ),
              ...(!uploadedFile
                ? { bill: undefined }
                : !prId
                  ? { bill: signedId || '' }
                  : { bill: signedId || undefined }),
              ...(values.payment_request_type === PAYMENT_REQUEST_TYPE.BILL
                ? {
                    amount: isServicePO
                      ? calculateRemainingPayment(purchaseValues.totalPayment)(
                          values,
                        )
                      : calculateTotalPaymentAfterAdjustments(values),
                    advance_amount_adjustments: (
                      advance_amount_adjustments?.filter((adv) => adv.amount) ||
                      []
                    )
                      ?.map(({ from_payment_request_id, amount: value }) => ({
                        from_payment_request_id,
                        amount: value,
                      }))
                      .concat(
                        (
                          vendor_advance_adjustments?.filter(
                            (adv) => adv.amount,
                          ) || []
                        )?.map(
                          ({ from_payment_request_id, amount: value }) => ({
                            from_payment_request_id,
                            amount: value,
                          }),
                        ),
                      ),
                  }
                : {}),
            },
          },
          prId,
        )
          .then(() => {
            notifyUser(
              `Payment Request is successfully ${
                prId ? 'updated' : 'created'
              }.`,
            );
            returnToListingPage();
          })
          .finally(() => setSubmitting(false));
      });
  };

  const handleDeletePaymentRequest = (callback) => {
    if (prId) {
      deletePaymentRequestById(prId)
        .then(() => {
          notifyUser('Payment Request is successfully deleted.');
          returnToListingPage();
        })
        .finally(() => callback());
    }
  };

  return (
    <PageLayout
      title={`Payment Request for PO: ${poId}`}
      titleComponent={
        prId ? (
          <DeleteButtonWithModal
            variant="contained"
            buttonText="DELETE PAYMENT REQUEST"
            confirmationText="Are you sure you want to delete this Payment Request?"
            confirmationTitle="Delete Payment Request"
            onDelete={handleDeletePaymentRequest}
          />
        ) : null
      }
    >
      <Formik
        enableReinitialize
        initialValues={{
          bill_other_charges,
          ...(isServicePO && acknowledgement_note.bill
            ? {
                bill_number: acknowledgement_note.bill.bill_number,
              }
            : {}),
          ...paymentRequest,
          vendor: prVendors,
          advance_amount_adjustments: advancePayment,
          vendor_advance_adjustments: vendorAdvancePayment,
        }}
        onSubmit={onFormSubmit}
      >
        {({
          values,
          isSubmitting,
          setFieldValue,
          handleChange,
          handleSubmit,
        }) => {
          const { file, url } = prAttachment(
            isServicePO,
            prId,
            values,
            purchaseOrder,
          );
          return (
            <PageLayout.Body>
              <Paper style={{ padding: '1rem 0.5rem' }}>
                <Typography variant="h5" gutterBottom>
                  {prVendors.vendor_type ? `${prVendors.vendor_type}: ` : ''}{' '}
                  {prVendors.name}
                  {prVendors.phone_number ? ` (${prVendors.phone_number})` : ''}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {prVendors?.address}
                </Typography>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  className={marginTop}
                >
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Type</Typography>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <RadioGroup
                      row
                      value={values.payment_request_type}
                      name="payment_request_type"
                      onClick={(e) => {
                        handleChange(e);
                        setPaymentRequest({
                          ...paymentRequest,
                          payment_request_type: Number(e.target.value),
                        });
                      }}
                    >
                      <FormControlLabel
                        disabled={!!prId}
                        value={PAYMENT_REQUEST_TYPE.ADVANCE}
                        control={<Radio color="primary" />}
                        label="Advance"
                      />
                      <FormControlLabel
                        disabled={shouldDisableBillPR(
                          prId,
                          isServicePO,
                          acknowledgement_note,
                        )}
                        value={PAYMENT_REQUEST_TYPE.BILL}
                        control={<Radio color="primary" />}
                        label="Bill"
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
                <Grid
                  container
                  className={marginTop}
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Vendor</Typography>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    {/* TODOS:  Vendor logic can be moved to separate component as changing input will rerender the whole page, we only need selected result */}
                    <FieldCombo
                      name="vendor"
                      label=""
                      placeholder="Select Vendor"
                      variant="outlined"
                      inputMinLength={1}
                      required
                      validate={validateRequired}
                      options={vendorList}
                      disabled
                      optionLabel={(obj) =>
                        obj && Object.keys(obj).length
                          ? `${obj.name}
                          ${
                            obj.phone_number
                              ? `-${obj.phone_number}(${obj?.role_names || ''})`
                              : ''
                          }`
                          : ''
                      }
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onChangeInput={(query) => getUpdatedVendors(query)}
                    />
                  </Grid>
                  <AppButton
                    size="medium"
                    variant="text"
                    onClick={goToAddVendor}
                    disabled
                  >
                    Add Vendor
                  </AppButton>
                </Grid>

                {isServicePO && (
                  <>
                    <Grid
                      container
                      className={marginTop}
                      alignItems="center"
                      spacing={1}
                    >
                      <Grid item md={2} xs={12}>
                        <Typography variant="body1">Category</Typography>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <FieldCombo
                          name="cost_head"
                          label=""
                          placeholder="Select category"
                          variant="outlined"
                          required
                          options={costHeadsList}
                          optionLabel={(obj) => `${obj.name}`}
                          validate={validateRequired}
                        />
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      className={marginTop}
                      alignItems="center"
                      spacing={1}
                    >
                      <Grid item md={2} xs={12}>
                        <Typography variant="body1">
                          Product Category
                        </Typography>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <FieldCombo
                          name="product_categories"
                          label=""
                          placeholder="Select product categories"
                          variant="outlined"
                          required
                          options={productCategoryList}
                          validate={validateArrayRequired}
                          multiple
                        />
                      </Grid>
                    </Grid>
                  </>
                )}

                {values.payment_request_type === PAYMENT_REQUEST_TYPE.BILL &&
                  isServicePO && (
                    <ServicePODetails
                      purchaseItems={purchaseOrder.purchase_items}
                      poId={poId}
                      advAdjustmentUtils={{
                        getAdvancePaymentNotAdjusted,
                        remainingVendorAmount,
                      }}
                      purchaseValues={purchaseValues}
                    />
                  )}
                {values.payment_request_type === PAYMENT_REQUEST_TYPE.BILL &&
                  !isServicePO && (
                    <Grid>
                      <SelectShipments
                        shipments={shipments.filter(
                          ({ received_time = null }) => !!received_time,
                        )}
                        setSelectShipmentIds={(value) =>
                          updateSelectedShipments(value, setFieldValue)
                        }
                      />
                      {renderSelectedShipments(values, handleChange)}
                    </Grid>
                  )}
                {values.payment_request_type ===
                  PAYMENT_REQUEST_TYPE.ADVANCE && (
                  <Grid
                    container
                    className={marginTop}
                    alignItems="center"
                    spacing={1}
                  >
                    <Grid item md={2} xs={12}>
                      <Typography variant="body1">Amount</Typography>
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <FieldInput
                        name="amount"
                        size="small"
                        label=""
                        type="number"
                        variant="outlined"
                        placeholder="Advance amount"
                        style={{ width: '100%' }}
                      />
                    </Grid>
                  </Grid>
                )}
                {values.payment_request_type === PAYMENT_REQUEST_TYPE.BILL && (
                  <Grid
                    container
                    className={marginTop}
                    alignItems="center"
                    spacing={1}
                  >
                    <Grid item md={2} xs={12}>
                      <Typography variant="body1">Bill Date</Typography>
                    </Grid>
                    <Grid item md={2} xs={12}>
                      <FieldDateTimePicker
                        name="bill_date"
                        variant="outlined"
                        format="DD/MM/YYYY"
                        inputVariant="outlined"
                        placeholder="Select Bill Date"
                        validate={validateRequired}
                        textFieldProps={{
                          size: 'small',
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
                <Grid
                  container
                  className={marginTop}
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Approver</Typography>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <FieldCombo
                      name="approvers"
                      label=""
                      placeholder="Select approver"
                      variant="outlined"
                      required
                      options={approverList}
                      validate={validateRequired}
                      multiple
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  className={marginTop}
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Due Date</Typography>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <FieldDatePicker
                      name="due_date"
                      label=""
                      format="DD/MM/YYYY"
                      placeholder="Due Date"
                      variant="inline"
                      autoOk
                      inputVariant="outlined"
                      required
                      validate={validateRequired}
                      textFieldProps={{ size: 'small' }}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  className={marginTop}
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1"> Priority</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1"> Low</Typography>
                  </Grid>
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
                  <Grid item>
                    <Typography variant="body1"> High</Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  className={marginTop}
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item md={2} xs={12}>
                    <Typography variant="body1">Comment</Typography>
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <FieldInput
                      name="comments"
                      size="medium"
                      label=""
                      variant="outlined"
                      placeholder="Comments"
                      multiline
                      style={{ width: '100%' }}
                      rows={2}
                    />
                  </Grid>
                </Grid>
                {/* TODO:(performance improvement) move the state logic of this modal to UploadBillModal Component itself */}
                <Grid container className={marginTop}>
                  <AppButton
                    size="medium"
                    style={{ margin: '0 1rem' }}
                    onClick={onClickUploadBill}
                  >
                    Attach bill
                  </AppButton>
                  <UploadBillModal
                    open={!!showUploadBillNModal}
                    close={closeConfirmDialog}
                    setFieldValue={setFieldValue}
                  />
                </Grid>
                <Grid
                  container
                  className={marginTop}
                  justifyContent="space-between"
                >
                  <Grid item md={2} xs={12}>
                    {(!!file || !!url) && (
                      <ImageThumb
                        url={url}
                        file={file}
                        title={
                          values?.bill_number &&
                          `Bill.No.-${values.bill_number}`
                        }
                      />
                    )}
                  </Grid>
                  <Grid item md={2} xs={12}>
                    <AppButton
                      size="medium"
                      color="inherit"
                      onClick={returnToListingPage}
                    >
                      Cancel
                    </AppButton>
                    <AppButton
                      size="medium"
                      style={{ margin: '0 1rem' }}
                      loading={isSubmitting}
                      onClick={handleSubmit}
                      disabled={disableSubmit(
                        isServicePO,
                        values.payment_request_type,
                        file,
                        url,
                      )}
                    >
                      Save
                    </AppButton>
                  </Grid>
                </Grid>
              </Paper>
            </PageLayout.Body>
          );
        }}
      </Formik>
    </PageLayout>
  );
};

export default PaymentRequestAddEdit;
