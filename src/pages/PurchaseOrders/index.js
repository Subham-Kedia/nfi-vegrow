import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import CreateAllowed from 'Components/CreateAllowed';
import { RESOURCES } from 'Utilities/constants';

const PaymentRequestAddEdit = lazy(() => import('./PaymentRequestAddEdit'));
const PaymentRequestList = lazy(() => import('./PaymentRequestList'));
const PurchaseOrderAddEdit = lazy(() => import('./PurchaseOrderAddEdit'));
const PurchaseOrderList = lazy(() => import('./PurchaseOrderList'));

const PurchaseOrderPage = () => {
  return (
    <CreateAllowed resource={RESOURCES.PURCHASE_ORDER}>
      {() => (
        <Routes>
          <Route path="list" element={<PurchaseOrderList />} />
          <Route path="create" element={<PurchaseOrderAddEdit />} />
          <Route path=":accessType/:id?" element={<PurchaseOrderAddEdit />} />
          <Route
            path=":poId/payment-requests/list"
            element={<PaymentRequestList />}
          />
          <Route
            path=":poId/payment-requests/create"
            element={<PaymentRequestAddEdit />}
          />
          <Route
            path=":poId/payment-requests/:prId/edit"
            element={<PaymentRequestAddEdit />}
          />
          <Route path="*" element={<Navigate to="list" replace />} />
        </Routes>
      )}
    </CreateAllowed>
  );
};

export default PurchaseOrderPage;
