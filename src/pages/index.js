import React from 'react';
import PATH from 'Routes/path';

const LoginPage = React.lazy(() => import('./LoginPage'));
const PurchaseOrderPage = React.lazy(() => import('./PurchaseOrders'));
const InventoryPage = React.lazy(() => import('./Inventory'));
const DeliveryPage = React.lazy(() => import('./Delivery'));
const TransferOrderPage = React.lazy(() => import('./TransferOrder'));
const InventoryAdjustmentPage = React.lazy(
  () => import('./InventoryAdjustment'),
);
const InventoryReconciliationPage = React.lazy(
  () => import('./InventoryReconciliation'),
);
const PackagingBomPage = React.lazy(() => import('./PackagingBom'));
const MyApprovalListPage = React.lazy(
  () => import('./MyApprovalList/MyApprovalLists'),
);
const MyPaymentRequestPage = React.lazy(
  () => import('./MyPaymentRequestList/MyPaymentsRequestLists'),
);
const POApprovalsPage = React.lazy(() => import('./POApprovals'));
const TripsPage = React.lazy(() => import('./Trips'));
const TripsRegistration = React.lazy(() => import('./Trips/TripsRegistration'));
const EditTrips = React.lazy(
  () => import('./Trips/TripsRegistration/EditTrips'),
);
const PaymentRequestList = React.lazy(
  () => import('./Trips/PaymentRequestList'),
);
const AddEditPaymentRequest = React.lazy(
  () => import('./Trips/AddEditPaymentRequest'),
);
const BalancePaymentRequest = React.lazy(
  () => import('./Trips/AddEditPaymentRequest/BalancePaymentRequest'),
);
const AddTripWithTransferOrder = React.lazy(
  () => import('./Trips/TripsRegistration/AddTripWithTransferOrder'),
);
const PaymentRequestListForPurchaseOrder = React.lazy(
  () => import('./PurchaseOrders/PaymentRequestList'),
);

const MaterialAssignmentPage = React.lazy(() => import('./MaterialAssignment'));
const MaterialAssignmentVendor = React.lazy(
  () => import('./MaterialAssignment/Vendors'),
);

const VendorLedger = React.lazy(
  () => import('./MaterialAssignment/Vendors/VendorLedger'),
);

const CustomerLedger = React.lazy(
  () => import('./MaterialAssignment/Customers/CustomerLedger'),
);

const MaterialAssignmentCustomer = React.lazy(
  () => import('./MaterialAssignment/Customers'),
);

const CustomPageGenerator = React.lazy(
  () => import('Components/CustomPageGenerator'),
);

const AddMACustomers = React.lazy(
  () => import('./MaterialAssignment/Customers/AddMA'),
);

const AddMAVendors = React.lazy(
  () => import('./MaterialAssignment/Vendors/AddMA'),
);

const EditMAVendors = React.lazy(
  () => import('./MaterialAssignment/Vendors/EditMA'),
);

const AdjustMAVendors = React.lazy(
  () => import('./MaterialAssignment/Vendors/Adjustment'),
);

const AdjustMACustomers = React.lazy(
  () => import('./MaterialAssignment/Customers/Adjustment'),
);
const ReturnMAVendors = React.lazy(
  () => import('./MaterialAssignment/Vendors/Return'),
);

const ReturnMACustomers = React.lazy(
  () => import('./MaterialAssignment/Customers/Return'),
);

const BOM = React.lazy(() => import('./BOM'));
const AuditsPage = React.lazy(() => import('./Audits'));
const InventoryAudit = React.lazy(
  () => import('./Audits/components/InventoryAudit'),
);
const ViewAudits = React.lazy(() => import('./Audits/components/ViewAudits'));
const AuditApproval = React.lazy(() => import('./Audits/AuditApproval'));
const CloneMA = React.lazy(
  () => import('./MaterialAssignment/components/CloneMA'),
);
const ServiceDeliveryNote = React.lazy(() => import('./SDN'));

export default {
  LOGIN_PAGE: <LoginPage />,
  [PATH.PURCHASE_ORDER.ID]: <PurchaseOrderPage />,
  DELIVERY: <DeliveryPage />,
  [PATH.TO_LISTING.ID]: <TransferOrderPage />,
  [PATH.INVENTORY.ID]: <InventoryPage />,
  [PATH.INVENTORY_ADJUSTMENT.ID]: <InventoryAdjustmentPage />,
  [PATH.INVENTORY_RECONCILIATION.ID]: <InventoryReconciliationPage />,
  PACKAGING_BOM: <PackagingBomPage />,
  [PATH.MY_APPROVAL_LIST.ID]: <MyApprovalListPage />,
  [PATH.MY_PAYMENT_REQUEST.ID]: <MyPaymentRequestPage />,
  [PATH.PO_APPROVALS.ID]: <POApprovalsPage />,
  [PATH.VENDORS.ID]: <MaterialAssignmentPage />,
  [PATH.DC_VENDORS.ID]: <MaterialAssignmentVendor />,
  [PATH.DC_VENDOR_LEDGER.ID]: <VendorLedger />,
  [PATH.CUSTOMERS.ID]: <MaterialAssignmentCustomer />,
  [PATH.TRIPS_LISTING.ID]: <TripsPage />,
  [PATH.ADD_TRIPS.ID]: <TripsRegistration />,
  [PATH.EDIT_TRIPS.ID]: <EditTrips />,
  [PATH.PAYMENT_REQUEST_LISTING.ID]: <PaymentRequestList />,
  [PATH.ADD_PAYMENT_REQUEST.ID]: <AddEditPaymentRequest />,
  [PATH.EDIT_PAYMENT_REQUEST.ID]: <AddEditPaymentRequest />,
  [PATH.ADD_BALANCE_PAYMENT_REQUEST.ID]: <BalancePaymentRequest />,
  [PATH.EDIT_BALANCE_PAYMENT_REQUEST.ID]: <BalancePaymentRequest />,
  [PATH.ADD_TRIPS_WITH_TO.ID]: <AddTripWithTransferOrder />,
  [PATH.PAYMENT_REQUEST_LISTING_FOR_PO.ID]: (
    <PaymentRequestListForPurchaseOrder />
  ),
  [PATH.ADD_MATERIAL_ASSIGNMENT.ID]: <CustomPageGenerator />,
  [PATH.EDIT_MATERIAL_ASSIGNMENT.ID]: <CustomPageGenerator />,
  [PATH.RECEIVE_MATERIAL_ASSIGNMENT.ID]: <CustomPageGenerator />,
  [PATH.BOM.ID]: <BOM />,
  [PATH.AUDITS.ID]: <AuditsPage />,
  [PATH.INVENTORY_AUDIT_CREATE.ID]: <InventoryAudit />,
  [PATH.INVENTORY_AUDIT_VIEW.ID]: <ViewAudits />,
  [PATH.INVENTORY_AUDIT_EDIT.ID]: <ViewAudits />,
  [PATH.INVENTORY_AUDIT_REVIEW.ID]: <ViewAudits />,
  [PATH.ADD_MA_CUSTOMERS.ID]: <AddMACustomers />,
  [PATH.ADD_MA_VENDORS.ID]: <AddMAVendors />,
  [PATH.EDIT_MA_VENDORS.ID]: <EditMAVendors />,
  [PATH.MA_CUSTOMER_LEDGER.ID]: <CustomerLedger />,
  [PATH.ADJUST_MA_VENDORS.ID]: <AdjustMAVendors />,
  [PATH.ADJUST_MA_CUSTOMERS.ID]: <AdjustMACustomers />,
  [PATH.RETURN_MA_VENDORS.ID]: <ReturnMAVendors />,
  [PATH.RETURN_MA_CUSTOMERS.ID]: <ReturnMACustomers />,
  [PATH.AUDIT_APPROVAL.ID]: <AuditApproval />,
  [PATH.CLONE_MA.ID]: <CloneMA />,
  [PATH.SDN.ID]: <ServiceDeliveryNote />,
};
