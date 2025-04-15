import { Navigate, Route, Routes } from 'react-router-dom';
import CreateAllowed from 'Components/CreateAllowed';
import { RESOURCES } from 'Utilities/constants';

import POApprovalDetails from './POApprovalDetails';
import POApprovalList from './POApprovalList';

const POApprovalsPage = () => {
  return (
    <CreateAllowed resource={RESOURCES.PO_APPROVALS}>
      {() => (
        <Routes>
          <Route path="list" element={<POApprovalList />} />
          <Route path="view/:id?" element={<POApprovalDetails />} />
          <Route path="" element={<Navigate to="list" replace />} />
        </Routes>
      )}
    </CreateAllowed>
  );
};

export default POApprovalsPage;
