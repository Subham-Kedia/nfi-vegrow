import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DialogContentText, Tab, Tabs } from '@mui/material';
import PageLayout from 'App/PageLayout';
import {
  AppLoader,
  ConfirmationDialog,
  CreateAllowed,
  CustomPagination,
  GridListView,
  PageFilter,
} from 'Components';
import { RouteTransformer } from 'Routes';
import { getPackagingItem } from 'Services/lots';
import {
  getPartners,
  getPurchaseOrders,
  undoClosePO,
  updatePurchaseOrder,
} from 'Services/purchaseOrder';
import { getDcs } from 'Services/users';
import { notifyUser } from 'Utilities';
import { onFilterbyIdTabChange } from 'Utilities/actionUtils';
import { PO_STATUS, RESOURCES } from 'Utilities/constants';
import { PAYMENT_REQUEST_FILTERS } from 'Utilities/constants/paymentRequest';
import { PO_TYPE } from 'Utilities/constants/purchaseOrder';
import { LibraryGrid, LibraryText } from 'vg-library/core';

import {
  ACTION_COLUMNS,
  COLUMNS,
  SHIPMENT_PR_COLUMNS,
} from '../components/Columns';
import PurchaseOrderService from '../service';
import ShipmentAddEditModal from '../ShipmentAddEditModal';
import { styles } from '../styled';

const PAGE_SIZE = 10;

const PurchaseOrderList = () => {
  const styleClass = styles();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [counts, setCounts] = useState({});
  const [closeConfirm, setCloseConfirm] = useState(false);
  const [undoCloseConfirm, setUndoCloseConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [filters, setFilters] = useState({
    id: '',
    startDate: null,
    endDate: null,
    vendors: [],
    deliveryLocation: [],
    itemId: [],
    payment: null,
    po_types: [],
  });
  const [dropDownValues, setDropDownValues] = useState({
    vendors: [],
    deliveryLocation: [],
    itemIds: [],
    payment: PAYMENT_REQUEST_FILTERS,
    po_types: PO_TYPE,
  });
  const [selectedShipment, setSelectedShipment] = useState({
    selectedShipment: null,
    shipmentId: null,
    open: false,
    isPOClosed: false,
  });
  const [packagingTypes, setPackagingTypes] = useState([]);
  const [tab, setTab] = useState(PO_STATUS.DRAFT.value);

  const navigate = useNavigate();

  const controllerRef = useRef(null);

  const loadPurchaseOrders = ({
    newPage = 1,
    selectedTab = tab,
    currentFilter = filters,
  } = {}) => {
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();
    setLoading(true);
    getPurchaseOrders(
      {
        offset: (newPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        status: selectedTab,
        ...currentFilter,
      },
      { signal: controllerRef.current.signal },
    )
      .then(({ items = [], total_count = 0, counts = {} }) => {
        if (currentFilter.id && !items.length) {
          const newTab = onFilterbyIdTabChange(counts, PO_STATUS);
          if (newTab) {
            setTab(newTab);
            loadPurchaseOrders({ selectedTab: newTab, currentFilter });
          }
        }

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
      setDropDownValues((prevState) => ({
        ...prevState,
        deliveryLocation,
      })),
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

  const handleShipmentModal = (
    shipmentData = null,
    shipmentId = null,
    purchaseOrder = {},
  ) => {
    return () => {
      setSelectedShipment({
        shipmentData,
        shipmentId,
        open: !!shipmentData,
        isPOClosed: purchaseOrder.status === PO_STATUS.GRN_CLOSED.value,
      });
    };
  };

  const toggleConfirmDialog = (id) => {
    setCloseConfirm(id);
  };

  const toggleUndoCloseConfirmDialog = (id) => {
    setUndoCloseConfirm(id);
  };

  const toggleDeleteConfirmDialog = (id) => {
    setDeleteConfirm(id);
  };

  const confirmClosePO = () => {
    updatePurchaseOrder(
      {
        status: PO_STATUS.GRN_CLOSED.value,
      },
      closeConfirm,
    ).then(() => {
      notifyUser('PO is GRN Closed');
      loadPurchaseOrders();
      toggleConfirmDialog(null);
    });
  };

  const undoClosePOConfirm = () => {
    undoClosePO(undoCloseConfirm).then(() => {
      notifyUser('PO close undone');
      loadPurchaseOrders();
      toggleUndoCloseConfirmDialog(null);
    });
  };

  const deletePO = () => {
    PurchaseOrderService.deletePO(deleteConfirm).then(() => {
      toggleDeleteConfirmDialog(null);
      notifyUser('PO Deleted Successfully');
      loadPurchaseOrders();
    });
  };

  const onFilterSubmit = ({
    partners = [],
    payment_request_type = '',
    product_ids = [],
    delivery_location_ids = [],
    id = '',
    po_types = [],
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
      ...(po_types.length ? { po_types: po_types.map((p) => p.value) } : {}),
    };
    setFilters(currentFilter);
    loadPurchaseOrders({ currentFilter });
  };

  const downloadPDF = (id) => {
    window.open(`${API.CRMUrl}nfi/purchase_orders/${id}/generate_po_pdf.pdf`);
  };

  const handlePOClick = (id) => {
    const url = `/app/${RouteTransformer.getPurchaseOrderViewPage(id)}`;
    navigate(url);
  };

  return (
    <>
      <PageFilter
        titleComponent={
          <CreateAllowed
            resource={RESOURCES.PURCHASE_ORDER}
            buttonProps={{
              href: '/app/purchase-order/create',
              'data-cy': 'nfi.poList.createPurchaseOrder',
            }}
            label="Purchase Order"
          />
        }
        data={[
          {
            type: 'fieldCombo',
            name: 'po_types',
            label: 'Select PO Type',
            placeholder: 'Select PO Type',
            multiple: true,
            options: dropDownValues.po_types,
            className: styleClass.midWidth,
          },
          {
            type: 'fieldInput',
            name: 'id',
            label: 'PO Number',
            placeholder: 'Enter PO Number',
            className: styleClass.midWidth,
          },
          {
            type: 'fieldDatepicker',
            name: 'after',
            label: 'Start Date',
            placeholder: 'Start Date',
            className: styleClass.midWidth,
          },
          {
            type: 'fieldDatepicker',
            name: 'before',
            label: 'End Date',
            placeholder: 'End Date',
            className: styleClass.midWidth,
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
            className: styleClass.maxWidth,
            options: packagingTypes || [],
          },
          {
            type: 'fieldCombo',
            name: 'payment_request_type',
            label: 'Select Payment Request Status',
            placeholder: 'Select Payment Request Status',
            options: dropDownValues.payment,
          },
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
          po_types: [],
        }}
        setFilters={onFilterSubmit}
      >
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          className={styleClass.spaceBottom}
        >
          {Object.values(PO_STATUS).map(({ value, label }) => (
            <Tab
              label={`${label} (${counts[value] || 0})`}
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
                <LibraryGrid container direction="column">
                  <GridListView
                    data={data}
                    columns={[
                      ...COLUMNS,
                      ...(tab !== PO_STATUS.PENDING_APPROVAL.value &&
                      tab !== PO_STATUS.REJECTED.value &&
                      tab !== PO_STATUS.DRAFT.value
                        ? SHIPMENT_PR_COLUMNS
                        : []),
                      ...ACTION_COLUMNS,
                    ]}
                    isHeaderSticky
                    cellProps={{
                      toggleConfirmDialog,
                      handleShipmentModal,
                      downloadPDF,
                      toggleUndoCloseConfirmDialog,
                      handlePOClick,
                      toggleDeleteConfirmDialog,
                      styleClass,
                    }}
                  />
                </LibraryGrid>
              ) : (
                <LibraryGrid
                  container
                  justifyContent="center"
                  alignItems="center"
                  className={styleClass.fullHeight}
                >
                  <LibraryText
                    variant="h4"
                    component="h2"
                    className="disabled-text"
                    color="textPrimary"
                  >
                    No Data Available
                  </LibraryText>
                </LibraryGrid>
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
      {selectedShipment?.shipmentData && (
        <ShipmentAddEditModal
          selectedShipment={selectedShipment}
          loadPurchaseOrders={loadPurchaseOrders}
          onClose={handleShipmentModal()}
        />
      )}
      <ConfirmationDialog
        title="Confirm Close GRN for this PO"
        open={!!closeConfirm}
        onConfirm={confirmClosePO}
        onCancel={() => toggleConfirmDialog(null)}
      >
        <DialogContentText>
          Are you sure you want to close GRN action for this PO? Once closed, no
          further shipments can be raised for this PO
        </DialogContentText>
      </ConfirmationDialog>
      <ConfirmationDialog
        title="Confirm Undo GRN Close for this PO"
        open={!!undoCloseConfirm}
        onConfirm={undoClosePOConfirm}
        onCancel={() => toggleUndoCloseConfirmDialog(null)}
      >
        <DialogContentText>
          Are you sure you want to undo GRN close for this PO?
        </DialogContentText>
      </ConfirmationDialog>
      <ConfirmationDialog
        title="Confirm Delete for this PO"
        open={!!deleteConfirm}
        onConfirm={deletePO}
        onCancel={() => toggleDeleteConfirmDialog(null)}
      >
        <DialogContentText>
          Are you sure you want to delete this draft PO?
        </DialogContentText>
      </ConfirmationDialog>
    </>
  );
};

export default PurchaseOrderList;
