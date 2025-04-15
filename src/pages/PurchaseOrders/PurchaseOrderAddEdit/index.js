import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Hidden, Paper, Typography } from '@mui/material';
import PageLayout from 'App/PageLayout';
import { useSiteValue } from 'App/SiteContext';
import { AppButton, AppLoader, GridListView, ImageThumb } from 'Components';
import {
  FieldCombo,
  FieldDatePicker,
  FieldInput,
  FieldSelect,
  UploadInput,
} from 'Components/FormFields';
import { FieldArray, Formik } from 'formik';
import { getPackagingItem } from 'Services/lots';
import {
  createPurchaseOrderWithItems,
  getPartners,
  getPurchaseOrderById,
  getPurchaseOrderConfigs,
  updatePurchaseOrderWithItems,
} from 'Services/purchaseOrder';
import { getBillToLocations, getDcs } from 'Services/users';
import { notifyUser } from 'Utilities';
import { PO_STATUS } from 'Utilities/constants';
import { PURCHASE_ORDER_TYPE } from 'Utilities/constants/purchaseOrder';
import imageDirectUpload from 'Utilities/directUpload';
import { validateRequired } from 'Utilities/formvalidation';

import BackHandlerModal from '../components/BackHandlerModal';
import { PURCHASE_ITEM, purchaseOrderType } from '../constant';
import PurchaseOrderService from '../service';
import {
  getFieldName,
  getPOAddEditPageTitle,
  getPODate,
  getPurchaseItemsData,
  isPOTypePurchaseOrder,
  isPOTypeSelected,
} from '../utils';

import Quotation from './components/quotation';
import { COLUMNS, SERVICE_PO_COLUMNS } from './column';
import { Banner, ImageListWrapper } from './styled';

const EXCLUDED_VENDOR = 'Migration Vendor';

const QUOTATION_ATTRIBUTE = {
  partner: null,
  quotation_file: null,
};

const PurchaseOrderAddEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [dropDownValues, setDropDownValues] = useState({
    items: [],
  });
  const [partners, setPartners] = useState([]);
  const { userInfo: { id: userId } = {} } = useSiteValue();
  const [purchaseOrder, setPurchaseOrder] = useState({
    purchase_items: [PURCHASE_ITEM],
    partner: null,
    purchase_date: null,
    expected_delivery_date: null,
    quotation_l1: null,
    quotation_attributes: [],
  });
  const [deletedPurchaseItems, setDeletedPurchaseItems] = useState([]);
  const [dcs, setDcs] = useState([]);
  const [billToLocations, setBillToLocations] = useState([]);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [nfiPoMaxDays, setNfiPoMaxDays] = useState(null);
  const [openBackHandlerModal, setOpenBackHandlerModal] = useState(false);

  const saveMethodStatus = useRef();

  const { poMaxDate, poMinDate } = getPODate(nfiPoMaxDays);

  const isReadOnly = params.accessType === 'read-only';

  const handleRemovePurchaseItems = (id = '') => {
    return () => {
      if (params?.id && id) {
        setDeletedPurchaseItems([...deletedPurchaseItems, id]);
      }
    };
  };

  const goToAddVendor = () => {
    setBannerVisible(true);
    window.open(
      `${API.CRMUrl}partners/new?role=Supplier&show_kyc=true`,
      '_blank',
    );
  };

  const closeBanner = () => {
    setBannerVisible(false);
  };

  const onSubmitForm = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const {
      partner = {},
      purchase_order_type = {},
      delivery_dc = {},
      bill_to_location = {},
      quotation_attributes = [{}],
      quotation_l1: { 0: quotation_l1 } = [],
      ...postData
    } = values;

    const { data: quotationL1Data = {} } =
      (await imageDirectUpload(quotation_l1)) || {};

    const processPurchaseOrder = params?.id
      ? updatePurchaseOrderWithItems
      : createPurchaseOrderWithItems;

    postData.purchase_items = postData?.purchase_items?.map(
      ({
        nfi_packaging_item = {},
        quantity = 0,
        rate_uom = 0,
        id,
        gst,
        market_to_system_uom,
        uom_name,
        service_type,
        description,
      }) => {
        return {
          ...(id ? { id } : {}),
          ...getPurchaseItemsData(
            nfi_packaging_item,
            service_type,
            values.purchase_order_type,
            uom_name,
            description,
          ),
          quantity,
          gst,
          ...(market_to_system_uom ? { market_to_system_uom } : {}),
          agreed_value:
            parseFloat(
              (quantity * parseFloat(rate_uom).toFixed(4)).toFixed(4),
            ) || 0,
        };
      },
    );

    postData.quotations = await Promise.all(
      quotation_attributes?.map(
        async (
          {
            partner: q_partner = {},
            quotation_file: { 0: quotation } = [],
            id,
          },
          index,
        ) => {
          const { data: quotationData = {} } =
            (await imageDirectUpload(quotation)) || {};

          return {
            ...(id ? { id } : {}),
            partner_id: q_partner.id,
            quotation_file: quotationData.signed_id,
            preference: index + 2,
          };
        },
      ),
    );

    processPurchaseOrder(
      {
        purchase_order: {
          ...postData,
          po_type: purchase_order_type,
          user_id: userId,
          partner_id: partner?.id,
          delivery_dc_id: delivery_dc?.id,
          status: saveMethodStatus.current,
          billto_location_id: bill_to_location?.id,
          quotation_l1: quotationL1Data.signed_id,
        },
      },
      params?.id,
    )
      .then(() => {
        navigate('/app/purchase-order/list');
        notifyUser(
          params?.id ? 'PO Updated successfully' : 'PO created successfully',
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleDiscardClick = () => {
    navigate(-1);
  };

  const getUpdatedPartners = (query) => {
    getPartners({ q: query }).then((res) => {
      setPartners(
        res.items.filter((partner) => partner.name !== EXCLUDED_VENDOR),
      );
    });
  };

  const setSaveMethodStatus = (status) => {
    saveMethodStatus.current = status;
  };

  useEffect(() => {
    if (params?.id) {
      setLoading(true);
      getPurchaseOrderById(params.id, { uom_dropdown_config: true })
        .then((data) => {
          const purchaseItemsById = data?.purchase_items?.map(
            (purchaseItem) => ({
              ...purchaseItem,
              nfi_packaging_item: purchaseItem?.packaging_item || {},
              rate_uom: parseFloat(
                (
                  purchaseItem?.agreed_value.toFixed(4) /
                  (purchaseItem?.quantity || 1)
                ).toFixed(4),
              ),
            }),
          );

          const quotation_attributes = data?.po_quotations
            ?.map((quotation) => ({
              ...quotation,
            }))
            .sort((a, b) => a.preference - b.preference);

          setPurchaseOrder({
            ...data,
            purchase_items: purchaseItemsById,
            quotation_attributes,
          });
          setPartners([...partners, data?.partner]);
        })
        .finally(() => setLoading(false));
    }
    getPackagingItem({
      include_deactivated_items: !!params?.id,
      include_partner_materials: false,
      uom_dropdown_config: true,
    }).then(({ items = [] }) => {
      setDropDownValues({
        ...dropDownValues,
        items: items.map((item) => ({
          ...item,
          text: item.item_code,
          value: item.id,
        })),
      });
    });
  }, []);

  useEffect(() => {
    getDcs().then((res) => {
      if (res?.items) {
        setDcs(res.items);
      }
    });
    getBillToLocations().then((res) => {
      if (res?.items) {
        setBillToLocations(res.items);
      }
    });
    PurchaseOrderService.getServiceTypes().then(({ items }) => {
      setServiceTypes(items);
    });
    getPurchaseOrderConfigs().then((res) => {
      if (res.nfi_po_max_days) {
        setNfiPoMaxDays(res.nfi_po_max_days);
      }
    });
  }, []);

  const filterOptions = (options = [], state = {}) => {
    return options.reduce((acc, item) => {
      if (
        item?.name
          .replace(',', '')
          .toLowerCase()
          ?.includes(state?.inputValue?.toLowerCase()) ||
        item?.phone_number?.includes(state?.inputValue)
      ) {
        acc.push(item);
      }
      return acc;
    }, []);
  };

  const handleBackAction = () => {
    setOpenBackHandlerModal(true);
  };

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <PageLayout
      isLoading={isLoading}
      showBackHandler={() => (isReadOnly ? navigate(-1) : handleBackAction())}
      title={getPOAddEditPageTitle(isReadOnly, params.id)}
    >
      <Formik
        enableReinitialize
        initialValues={{
          purchase_order_type: purchaseOrder?.po_type || null,
          purchase_items: purchaseOrder?.purchase_items || [],
          partner: purchaseOrder?.partner || null,
          delivery_dc: purchaseOrder?.delivery_dc || null,
          bill_to_location: purchaseOrder?.billto_location || null,
          purchase_date: purchaseOrder?.purchase_date || null,
          comments: purchaseOrder?.comments || null,
          payment_terms: purchaseOrder?.payment_terms || null,
          quotation_attributes: purchaseOrder?.quotation_attributes || [],
          quotation_l1: purchaseOrder?.quotation_l1 || null,
          ...(purchaseOrder.po_type ===
          PURCHASE_ORDER_TYPE.SERVICE_PURCHASE_ORDER
            ? {
                expected_completion_date:
                  purchaseOrder.expected_completion_date,
              }
            : {
                expected_delivery_date: purchaseOrder.expected_delivery_date,
              }),
        }}
        onSubmit={onSubmitForm}
      >
        {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
          <>
            <PageLayout.Body>
              {bannerVisible && (
                <Banner
                  elevation="8"
                  data-cy="nfi.po.banner"
                  message="Please reload the page after adding vendor on CRM."
                  action={
                    <>
                      <AppButton
                        variant="text"
                        onClick={() => window.location.reload()}
                      >
                        Reload Page
                      </AppButton>
                      <AppButton
                        variant="text"
                        color="secondary"
                        onClick={closeBanner}
                      >
                        Dismiss
                      </AppButton>
                    </>
                  }
                />
              )}
              <Paper style={{ padding: '1rem' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <FieldSelect
                      name="purchase_order_type"
                      label="PO Type"
                      placeholder="Select a PO Type"
                      size="small"
                      variant="outlined"
                      data-cy="nfi.po.poType"
                      options={purchaseOrderType}
                      required
                      validate={validateRequired}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled={isReadOnly}
                    />
                  </Grid>
                </Grid>
              </Paper>
              {(isPOTypeSelected(values) || purchaseOrder?.id) && (
                <Paper style={{ padding: '1rem', marginTop: '0.5rem' }}>
                  <Grid
                    container
                    direction="row"
                    spacing={2}
                    style={{ marginTop: '1rem' }}
                  >
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <FieldCombo
                        name="partner"
                        label="Vendor"
                        placeholder="Select a vendor"
                        variant="outlined"
                        options={partners}
                        required
                        validate={validateRequired}
                        onChangeInput={(query) =>
                          getUpdatedPartners(query, values.partner)
                        }
                        filterOptions={filterOptions}
                        onChange={() => setFieldValue('quotation_l1', null)}
                        disabled={isReadOnly}
                      />
                      <AppButton
                        onClick={goToAddVendor}
                        className="float-right"
                        size="medium"
                        variant="text"
                      >
                        Add Vendor
                      </AppButton>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <FieldDatePicker
                        name="purchase_date"
                        label="Purchase date"
                        maxDate={poMaxDate}
                        minDate={poMinDate}
                        placeholder="Purchase date"
                        variant="inline"
                        autoOk
                        inputVariant="outlined"
                        format="DD/MM/YYYY"
                        required
                        validate={validateRequired}
                        InputLabelProps={{
                          required: true,
                          shrink: true,
                        }}
                        textFieldProps={{
                          size: 'small',
                          fullWidth: true,
                          'data-cy': 'nfi.po.purchaseDate',
                        }}
                        disabled={isReadOnly}
                      />
                    </Grid>
                    {isPOTypePurchaseOrder(values) && (
                      <>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <FieldDatePicker
                            {...getFieldName(values)}
                            variant="inline"
                            autoOk
                            inputVariant="outlined"
                            data-cy="nfi.PO.ExpectedDate"
                            format="DD/MM/YYYY"
                            required
                            validate={validateRequired}
                            InputLabelProps={{
                              required: true,
                              shrink: true,
                            }}
                            textFieldProps={{
                              size: 'small',
                              fullWidth: true,
                              'data-cy': 'nfi.po.expectedDate',
                            }}
                            disabled={isReadOnly}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <FieldCombo
                            name="delivery_dc"
                            label="Delivery Location"
                            placeholder="Select Delivery Location"
                            variant="outlined"
                            options={dcs || []}
                            optionLabel={(obj) => `${obj.id}-${obj.name}`}
                            required
                            validate={validateRequired}
                            disabled={isReadOnly}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                          <FieldCombo
                            name="bill_to_location"
                            label="Bill-to Location"
                            placeholder="Select Bill-to Location"
                            variant="outlined"
                            options={billToLocations || []}
                            optionLabel={(obj) => `${obj.id}-${obj.name}`}
                            required
                            validate={validateRequired}
                            disabled={isReadOnly}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Typography
                    variant="subtitle1"
                    className="title"
                    color="textPrimary"
                    style={{ margin: '1rem 0' }}
                  >
                    <strong>Expected Purchase Items</strong>
                  </Typography>
                  <FieldArray
                    name="purchase_items"
                    render={(arrayHelpers) => (
                      <GridListView
                        data={values?.purchase_items || []}
                        columns={
                          values.purchase_order_type ===
                          PURCHASE_ORDER_TYPE.SERVICE_PURCHASE_ORDER
                            ? SERVICE_PO_COLUMNS
                            : COLUMNS
                        }
                        cellProps={{
                          items: dropDownValues?.items || [],
                          purchase_items: values?.purchase_items?.map(
                            ({ nfi_packaging_item = {} }) => nfi_packaging_item,
                          ),
                          arrayHelpers,
                          handleRemovePurchaseItems,
                          setFieldValue,
                          serviceTypes,
                          isReadOnly,
                        }}
                      />
                    )}
                  />
                  <Grid md={4} xs={12} style={{ padding: '1rem 0 0' }}>
                    <FieldInput
                      name="payment_terms"
                      label="Payment Terms"
                      size="medium"
                      data-cy="nfi.po.payment_terms"
                      placeholder="Please mention payment terms here"
                      variant="outlined"
                      multiline
                      required
                      validate={validateRequired}
                      InputLabelProps={{
                        required: true,
                        shrink: true,
                      }}
                      style={{ width: '35%' }}
                      rows={2}
                      disabled={isReadOnly}
                    />
                  </Grid>
                  <Grid container direction="column" spacing={1}>
                    <Grid
                      item
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="start"
                      style={{ marginTop: '1rem' }}
                      spacing={1}
                    >
                      <Grid item>
                        <Typography
                          variant="subtitle1"
                          className="title"
                          color="textPrimary"
                        >
                          <strong>QUOTATION L1*</strong>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <UploadInput
                          accept="image/*, application/pdf"
                          name="quotation_l1"
                          multiple={false}
                          required
                          validate={validateRequired}
                          disabled={isReadOnly}
                        />
                      </Grid>
                    </Grid>
                    {values?.quotation_l1 &&
                      values?.quotation_l1?.length > 0 && (
                        <ImageListWrapper>
                          <ImageThumb
                            url={values?.quotation_l1 || ''}
                            file={values?.quotation_l1?.[0] || ''}
                          />
                        </ImageListWrapper>
                      )}
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    style={{
                      alignItems: 'left',
                    }}
                  >
                    <Quotation
                      values={values}
                      filterOptions={filterOptions}
                      setFieldValue={setFieldValue}
                      quotation_initial={QUOTATION_ATTRIBUTE}
                      disabled={isReadOnly}
                    />
                  </Grid>
                  <Grid
                    md={4}
                    xs={12}
                    style={{ padding: '1rem 0 0 0', marginTop: '1rem' }}
                  >
                    <FieldInput
                      name="comments"
                      label="Comments"
                      size="medium"
                      data-cy="nfi.po.comments"
                      placeholder="Any comments?"
                      variant="outlined"
                      multiline
                      InputLabelProps={{
                        shrink: true,
                      }}
                      style={{ width: '35%' }}
                      rows={2}
                      disabled={isReadOnly}
                    />
                  </Grid>
                </Paper>
              )}
              <BackHandlerModal
                openBackHandlerModal={openBackHandlerModal}
                setOpenBackHandlerModal={setOpenBackHandlerModal}
                handleDiscardClick={handleDiscardClick}
                handleSubmit={handleSubmit}
                setSaveMethodStatus={setSaveMethodStatus}
                loading={isSubmitting}
              />
            </PageLayout.Body>
            <PageLayout.Footer>
              <Hidden smDown>
                <AppButton
                  size="medium"
                  color="inherit"
                  className="margin-horizontal"
                  disabled={isSubmitting}
                  onClick={() => {
                    setSaveMethodStatus(PO_STATUS.DRAFT.value);
                    handleSubmit();
                  }}
                >
                  Save as Draft
                </AppButton>
              </Hidden>
              <AppButton
                size="medium"
                className="margin-horizontal"
                type="submit"
                disabled={
                  purchaseOrder.status === PO_STATUS.GRN_CLOSED.value ||
                  isReadOnly ||
                  isSubmitting
                }
                onClick={() => {
                  setSaveMethodStatus(PO_STATUS.PENDING_APPROVAL.value);
                  handleSubmit();
                }}
              >
                Submit for Approval
              </AppButton>
            </PageLayout.Footer>
          </>
        )}
      </Formik>
    </PageLayout>
  );
};

export default PurchaseOrderAddEdit;
