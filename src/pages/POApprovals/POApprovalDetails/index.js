import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import PageLayout from 'App/PageLayout';
import {
  AppButton,
  AppLoader,
  ConfirmationDialog,
  CustomTable as Table,
  ImageThumb,
} from 'Components';
import FieldInput from 'Components/FormFields/TextInput';
import CustomModal from 'Components/Modal';
import { Formik } from 'formik';
import { ImageListWrapper } from 'Pages/PurchaseOrders/PurchaseOrderAddEdit/styled';
import { getDCInventory } from 'Services/lots';
import {
  approvePurchaseOrder,
  getPurchaseOrderById,
  rejectPurchaseOrder,
} from 'Services/purchaseOrder';
import { notifyUser } from 'Utilities';
import { getDate } from 'Utilities/dateUtils';
import { validateRequired } from 'Utilities/formvalidation';

import Summary from '../components/Summary';

import COLUMNS, { INVENTORY_COLUMNS } from './columns';
import { approveButtonStyle, classes, rejectButtonStyle } from './styled';
import { getTotalInTransitQty, shouldRefreshLocalInventoryData } from './utils';

const PURCHASE_ITEM = {
  nfi_packaging_item_id: '',
  quantity: '',
  rate_uom: '',
};

const POApprovalDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [purchaseOrder, setPurchaseOrder] = useState({
    purchase_items: [PURCHASE_ITEM],
    partner: null,
    purchase_date: null,
    expected_delivery_date: null,
  });
  const [inventoryData, setInventoryData] = useState({});
  const [viewInventoryId, setViewInventoryId] = useState(-1);
  const [isInventoryApiInProgress, setIsInventoryApiInProgress] =
    useState(false);

  const style = classes({ isInventoryApiInProgress });

  useEffect(() => {
    setLoading(true);
    getPurchaseOrderById(params.id || '')
      .then((data) => {
        const purchaseItemsById = data?.purchase_items?.map(
          (purchaseItem, rowIndex) => {
            const { rate_conversion } = purchaseItem;

            return {
              ...purchaseItem,
              index: rowIndex + 1,

              nfi_packaging_item_id: purchaseItem?.packaging_item?.id || '',
              agreed_value: parseFloat(purchaseItem?.agreed_value.toFixed(4)),
              rate_uom: rate_conversion,
            };
          },
        );

        setPurchaseOrder({
          ...data,
          purchase_items: purchaseItemsById,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  if (isLoading) {
    return <AppLoader />;
  }

  const generateSummaryInfo = () => {
    const summaryInfo = { taxableAmount: 0, totalAmount: 0 };
    purchaseOrder.purchase_items.forEach(({ agreed_value, gst }) => {
      const gstPercent = +gst >= 0 ? +gst : 0;
      summaryInfo.taxableAmount += agreed_value;
      summaryInfo.totalAmount += agreed_value * (1 + gstPercent / 100);
    });

    summaryInfo.gst = summaryInfo.totalAmount - summaryInfo.taxableAmount;
    return summaryInfo;
  };

  const rejectPO = ({ reject_reason } = {}) => {
    rejectPurchaseOrder(params.id, {
      purchase_order: { reject_reason },
    })
      .then(() => {
        notifyUser('PO Rejected successfully');
        navigate('/app/po-approvals/list');
      })
      .finally(() => {
        setOpenRejectDialog(false);
      });
  };

  const approvePO = () => {
    approvePurchaseOrder(params.id)
      .then(() => {
        notifyUser('PO Approved successfully');
        navigate('/app/po-approvals/list');
      })
      .finally(() => {
        setOpenApproveDialog(false);
      });
  };

  const openInventoryModal = (itemCode = -1) => {
    setViewInventoryId(itemCode);
  };

  const getInventory = (itemId, itemCode) => {
    if (shouldRefreshLocalInventoryData(inventoryData[itemCode])) {
      setIsInventoryApiInProgress(true);
      getDCInventory(itemId)
        .then((res) => {
          // add a row of total in transit qty at the bottom of table
          res.items.push({
            totalTransitQty: `Total In Transit Quantity: ${getTotalInTransitQty(res.items)}`,
          });
          setInventoryData({
            ...inventoryData,
            [itemCode]: {
              ...res,
              lastUpdatedTimeStamp: +new Date(),
            },
          });
          openInventoryModal(itemCode);
        })
        .finally(() => {
          setIsInventoryApiInProgress(false);
        });
    } else {
      openInventoryModal(itemCode);
    }
  };

  const viewInventory = viewInventoryId !== -1;

  const inventoryModal = viewInventory && (
    <CustomModal
      open={viewInventory}
      title={viewInventoryId}
      halfScreen
      onClose={() => openInventoryModal(-1)}
    >
      <Table
        data={inventoryData[viewInventoryId].items}
        columns={INVENTORY_COLUMNS}
      />
    </CustomModal>
  );

  return (
    <PageLayout title={`PO  ${params.id}`}>
      <PageLayout.Body>
        <Grid item className={style.gridWrapper}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Typography data-cy="nfi.poApproval.vendorHeader">
                <b>Vendor : </b>
                {purchaseOrder?.partner?.name || ''}
                <br />
                Address - {purchaseOrder?.partner?.address || ''}
              </Typography>
            </Grid>
            {purchaseOrder?.billto_location && (
              <Grid item xs={3}>
                <Typography data-cy="nfi.poApproval.billToLocation">
                  <b>Bill to - </b>
                  {purchaseOrder?.billto_location?.name || ''}
                  <br />
                  Address - {purchaseOrder?.billto_location?.address || ''}
                  <br />
                  GSTIN - {purchaseOrder?.billto_location?.gstin || ''}
                </Typography>
              </Grid>
            )}
            {purchaseOrder?.delivery_dc && (
              <Grid item xs={4} className={style.marginLeft}>
                <Typography data-cy="nfi.poApproval.shipTo">
                  <b>Ship To - </b>
                  {purchaseOrder?.delivery_dc?.name || ''}
                  <br />
                  Address - {purchaseOrder?.delivery_dc?.address || ''}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Grid>
            <Typography className={style.createdText}>
              <b>Created By : </b>
              {purchaseOrder?.user || ''}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={5} className={style.vendorBackground}>
          <Grid item className={style.vendorMargin}>
            <Typography data-cy="nfi.poApproval.vendor">
              <b>Vendor : </b>
              {purchaseOrder?.partner?.name || ''}
            </Typography>
          </Grid>
          <Grid item>
            <Typography data-cy="nfi.poApproval.purchaseDate">
              <b>Purchase Date : </b>
              {getDate(purchaseOrder?.purchase_date) || ''}
            </Typography>
          </Grid>
          {purchaseOrder?.expected_delivery_date && (
            <Grid item>
              <Typography data-cy="nfi.poApproval.expectedDate">
                <b>Expected Delivery Date : </b>
                {getDate(purchaseOrder?.expected_delivery_date) || ''}
              </Typography>
            </Grid>
          )}
          {purchaseOrder?.delivery_dc && (
            <Grid item>
              <Typography data-cy="nfi.poApproval.deliveryLocation">
                <b>Delivery Location : </b>
                {`${purchaseOrder?.delivery_dc?.id || ''} - ${
                  purchaseOrder?.delivery_dc?.name || ''
                }`}
              </Typography>
            </Grid>
          )}
        </Grid>
        <Grid item className={style.gridWrapper}>
          <Table
            size="medium"
            sticky
            hover
            columns={COLUMNS}
            data={purchaseOrder?.purchase_items.map((data) => data) || {}}
            totalRows={purchaseOrder?.purchase_items.length}
            showFooterComponent
            footerComponent={Summary}
            footerSummarydata={generateSummaryInfo()}
            cellProps={() => ({
              getInventory,
              isInventoryApiInProgress,
              itemCodeWrapper: style.itemCodeWrapper,
            })}
          />
        </Grid>
        <Grid item className={style.gridWrapper}>
          <Grid container spacing={3} className={style.conditionsPadding}>
            <Grid item xs={3}>
              <Typography variant="body1" data-cy="nfi.poApproval.paymentTerms">
                <b>Terms and Conditions:</b>
                <br />
                1. Taxes will be as per actuals
                <br />
                {`2. Payment Terms - ${purchaseOrder?.payment_terms || ''}.`}
              </Typography>
            </Grid>
            {purchaseOrder?.comments && (
              <Grid item xs={3}>
                <Typography paragraph={2} data-cy="nfi.poApproval.note">
                  <b>Note:</b>
                  <br />
                  {purchaseOrder?.comments || ''}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid container direction="column" className={style.gridWrapper}>
          <Grid item>
            <Typography
              variant="subtitle1"
              className="title"
              color="textPrimary"
            >
              <strong>QUOTATION L1:</strong>
            </Typography>
          </Grid>
          {purchaseOrder?.quotation_l1 &&
            purchaseOrder?.quotation_l1?.length > 0 && (
              <ImageListWrapper>
                <ImageThumb
                  url={purchaseOrder?.quotation_l1 || ''}
                  file={purchaseOrder?.quotation_l1?.[0] || ''}
                  data-cy="nfi.poApproval.quotation"
                />
              </ImageListWrapper>
            )}
        </Grid>
        <Grid
          container
          direction="column"
          alignItems="stretch"
          className={style.gridWrapper}
        >
          <Grid item>
            <Typography
              variant="subtitle1"
              className="title"
              color="textPrimary"
            >
              <strong>OTHER QUOTATIONS:</strong>
            </Typography>
          </Grid>
          <Grid item container direction="row" spacing={1}>
            {purchaseOrder?.po_quotations?.map((pq) => {
              return (
                <Grid key={pq.id} item xs={6} md={3} lg={2} align="center">
                  {pq?.quotation_file && pq?.quotation_file?.length > 0 && (
                    <ImageListWrapper data-cy="nfi.poApproval.otherQuotationVendor">
                      <ImageThumb
                        url={pq?.quotation_file || ''}
                        file={pq?.quotation_file?.[0] || ''}
                        className={style.imgStyle}
                        title={`${pq?.partner?.name}, Quotation L${pq?.preference}`}
                        data-cy="nfi.poApproval.otherQuotation"
                      />
                    </ImageListWrapper>
                  )}
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </PageLayout.Body>
      <PageLayout.Footer>
        <CustomModal
          title="Warning"
          open={openRejectDialog}
          onClose={() => setOpenRejectDialog(false)}
        >
          <Typography
            variant="body1"
            gutterBottom
            className={style.marginBottom}
          >
            Are you sure you want to reject this Purchase Order?
          </Typography>
          <Formik
            initialValues={{}}
            onSubmit={(values) => rejectPO(values)}
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
                  className={style.marginTop}
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
        <AppButton
          variant="contained"
          color="inherit"
          className="margin-horizontal"
          size="medium"
          style={rejectButtonStyle}
          onClick={() => {
            setOpenRejectDialog(true);
          }}
        >
          REJECT
        </AppButton>
        <ConfirmationDialog
          open={openApproveDialog}
          title={`PO  ${params.id}`}
          onCancel={() => setOpenApproveDialog(false)}
          onConfirm={() => {
            approvePO();
            setOpenApproveDialog(false);
          }}
        >
          Do you want to approve the request ?
        </ConfirmationDialog>
        <AppButton
          variant="contained"
          color="primary"
          className="margin-horizontal"
          size="medium"
          style={approveButtonStyle}
          onClick={() => {
            setOpenApproveDialog(true);
          }}
        >
          APPROVE
        </AppButton>
      </PageLayout.Footer>
      {inventoryModal}
    </PageLayout>
  );
};

export default POApprovalDetails;
