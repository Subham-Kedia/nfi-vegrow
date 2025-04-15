import { useEffect, useState } from 'react';
import PageLayout from 'App/PageLayout';
import { AppButton, AppLoader } from 'Components';
import { FieldInput } from 'Components/FormFields';
import { Formik, useFormikContext } from 'formik';
import { getPackagingItem } from 'Services/lots';
import { notifyUser } from 'Utilities';
import { LibraryText } from 'vg-library/core';

import { ADD_MA_TRACKER_STATES } from '../../const';
import Confirmation from '../../Popups/Confirmation';
import { validateAddEdit } from '../../utils';
import PrintButton from '../PrintButton';
import Tracker from '../Tracker';
import TransactionRecorder from '../TransactionRecorder';

import Header from './Header';
import classes from './style';
import UploadFooter from './UploadFooter';

const ConfirmationPopup = ({
  open,
  bodyContent,
  handleClosePopup,
  handleConfirm,
}) => {
  const { values } = useFormikContext();

  return (
    <Confirmation
      open={open}
      title="CONFIRMATION"
      handleOnConfirm={() => handleConfirm(values)}
      handleClose={handleClosePopup}
      bodyContent={bodyContent}
    />
  );
};

const AddEdit = ({
  title,
  columns,
  uploadColumns,
  initialValues,
  submitHandler,
  cancelHandler,
  confirmationMssg,
  canSaveAndUploadLater = false,
  isApiInProgress = false,
  showVendors = false,
  showCustomers = false,
  TRACKER_STATES = ADD_MA_TRACKER_STATES,
  disableHeader = false,
  formStructure,
  disableVendors = false,
  disableCustomer = false,
  showSource = true,
  validate = validateAddEdit,
  sourceLabel = 'Source',
  printHandler,
  banner,
}) => {
  const [trackerVal, setTrackerVal] = useState(
    Object.values(TRACKER_STATES)[0].value,
  );
  const [packagingOptions, setPackagingOptions] = useState([]);
  const [isUploadDeferred, setIsUploadDeferred] = useState(false);

  useEffect(() => {
    getPackagingItem({ include_deactivated_items: false }).then((res) => {
      setPackagingOptions(res.items || []);
    });
  }, []);

  const { formWrapper, footerWrapper, commentField } = classes();

  const nextHandler = (values) => {
    // if the use is at the creation stage and filling data, validation shall take place
    if (
      trackerVal === Object.values(TRACKER_STATES)[0].value &&
      !validate(values.material_info)
    ) {
      notifyUser('Please enter all values for one or more item', 'error');
      return;
    }

    const currentStatusIndex = Object.values(TRACKER_STATES).findIndex(
      (status) => status.value === trackerVal,
    );

    const nextStatus = Object.values(TRACKER_STATES)[currentStatusIndex + 1];

    setTrackerVal(nextStatus.value);
  };

  const uploadLaterHandler = () => {
    setIsUploadDeferred(true);
    setTrackerVal(TRACKER_STATES.CONFIRMATION.value);
  };

  const handleClosePopup = () => {
    const statusSize = Object.keys(TRACKER_STATES).length;

    setTrackerVal(Object.values(TRACKER_STATES)[statusSize - 2].value);
  };

  // if the user is on the first step and decided to cancel, she will get navigated to the previous page
  // else the user shall go back by one stage
  const onCancel = () => {
    setIsUploadDeferred(false);

    if (trackerVal === Object.values(TRACKER_STATES)[0].value) {
      cancelHandler();
      return;
    }

    const currIdx = Object.values(TRACKER_STATES).findIndex(
      (status) => status.value === trackerVal,
    );

    setTrackerVal(Object.values(TRACKER_STATES)[currIdx - 1].value);
  };

  const openConfirmation = trackerVal === TRACKER_STATES.CONFIRMATION.value;

  // since confirmation is a popup and open up in the upload page
  // so both values are considered in determining upload page
  const isUploadPage = [
    TRACKER_STATES.UPLOAD.value,
    TRACKER_STATES.CONFIRMATION.value,
  ].includes(trackerVal);

  const trackerComponent = (
    <Tracker currentValue={trackerVal} TRACKER_STATES={TRACKER_STATES} />
  );

  const TABLE_COLUMN =
    trackerVal === Object.values(TRACKER_STATES)[0].value
      ? columns
      : uploadColumns;

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={nextHandler}
    >
      {({ handleSubmit, values, setFieldValue }) =>
        isApiInProgress ? (
          <AppLoader />
        ) : (
          <PageLayout
            title={title}
            otherInfo={trackerComponent}
            titleComponent={
              isUploadPage && <PrintButton clickHandler={printHandler} />
            }
          >
            <PageLayout.Body className="no-padding">
              <form className={formWrapper}>
                <Header
                  showVendors={showVendors}
                  showCustomers={showCustomers}
                  disableHeader={disableHeader || isUploadPage}
                  disableVendors={disableVendors}
                  disableCustomer={disableCustomer}
                  showSource={showSource}
                  sourceLabel={sourceLabel}
                  banner={banner}
                />
                <main>
                  <TransactionRecorder
                    columns={TABLE_COLUMN}
                    defaultStructure={
                      (formStructure || initialValues).material_info[0]
                    }
                    packagingOptions={packagingOptions}
                    filterFilledRows={isUploadPage}
                  />
                  {isUploadPage && (
                    <UploadFooter
                      values={values}
                      setFieldValue={setFieldValue}
                      isUploadMandatory={!isUploadDeferred}
                    />
                  )}
                </main>
                {!!isUploadPage && (
                  <footer className={footerWrapper}>
                    <LibraryText variant="body2" mb={1}>
                      Kindly fill your comments (if any)
                    </LibraryText>
                    <FieldInput
                      name="remark"
                      label="Comment"
                      placeholder="Comment..."
                      multiline
                      rows={4}
                      maxRows={6}
                      classes={{ root: commentField }}
                    />
                  </footer>
                )}
              </form>
            </PageLayout.Body>
            <PageLayout.Footer>
              <AppButton
                color="inherit"
                className="margin-horizontal"
                onClick={onCancel}
              >
                Cancel
              </AppButton>
              {canSaveAndUploadLater && isUploadPage && !values.ma_upload && (
                <AppButton
                  variant="outlined"
                  className="margin-horizontal"
                  onClick={uploadLaterHandler}
                >
                  Save & Upload Later
                </AppButton>
              )}
              <AppButton onClick={handleSubmit}>Next</AppButton>
            </PageLayout.Footer>
            {!!openConfirmation && (
              <ConfirmationPopup
                open={openConfirmation}
                handleClosePopup={handleClosePopup}
                bodyContent={confirmationMssg}
                handleConfirm={submitHandler}
              />
            )}
          </PageLayout>
        )
      }
    </Formik>
  );
};

export default AddEdit;
