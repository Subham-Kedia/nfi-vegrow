import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { AppLoader } from 'Components';
import { cloneMA } from 'Pages/MaterialAssignment/utils';

import AddEdit from '../AddEdit';

const CloneMA = () => {
  const [data, setData] = useState({});
  const [isApiInProgress, setIsApiInProgress] = useState(false);
  const navigate = useNavigate();

  const {
    state: { type, id },
  } = useLocation();

  const {
    prepareInitialData,
    getData,
    printHandler,
    submitHandler,
    formInfo: { addColumns, uploadColumns, emptyRowStructure },
    showVendors,
    showCustomers,
    isUploadLaterAllowed,
  } = cloneMA(type);

  const cancelHandler = () => {
    navigate(-1);
  };

  useEffect(() => {
    setIsApiInProgress(true);
    getData(id)
      .then((res) => {
        setData(res);
      })
      .finally(() => {
        setIsApiInProgress(false);
      });
  }, [id]);

  const initialData = prepareInitialData(data);

  // removing the uploaded acknowledgement and remark as it is different for each MA
  if (initialData.ma_upload) {
    delete initialData.ma_upload;
  }

  if (initialData.remark) {
    delete initialData.remark;
  }

  const handleSubmit = (values) => {
    submitHandler(values, setIsApiInProgress, navigate);
  };

  const banner = (
    <Alert icon={<Check fontSize="inherit" />} severity="success">
      <strong>MA with id: {id} cloned successfully</strong>
    </Alert>
  );

  if (!Object.keys(initialData).length) return <AppLoader />;

  return (
    <AddEdit
      title="ADD Material Assignment"
      columns={addColumns}
      uploadColumns={uploadColumns}
      initialValues={initialData}
      submitHandler={handleSubmit}
      cancelHandler={cancelHandler}
      confirmationMssg="Are you sure you want to add this MA ?"
      canSaveAndUploadLater={isUploadLaterAllowed}
      isApiInProgress={isApiInProgress}
      showVendors={showVendors}
      showCustomers={showCustomers}
      printHandler={printHandler}
      formStructure={emptyRowStructure}
      banner={banner}
    />
  );
};

export default CloneMA;
