import { Typography } from '@mui/material';
import ConfirmationDialog from 'Components/ConfirmationDialog';
import FieldDateTimepicker from 'Components/FormFields/FieldDateTimepicker';
import { Formik } from 'formik';

import { classes } from '../style';

const UndoPopup = ({ setUndoPopupId, tripId, endTripHandler }) => {
  const { datePickerWrapper } = classes();
  const title = 'Confirm End Trip';

  const handleCancel = () => {
    setUndoPopupId(-1);
  };

  const handleConfirm = (values) => {
    endTripHandler(values.endTime);
  };

  const shouldPopupOpen = tripId !== -1;

  return (
    <Formik initialValues={{ endTime: new Date() }}>
      {({ values }) => (
        <ConfirmationDialog
          title={title}
          open={shouldPopupOpen}
          onCancel={handleCancel}
          cancelButtonColor="inherit"
          autoFocus={false}
          onConfirm={() => handleConfirm(values)}
        >
          <Typography component="body1">
            Are you sure you want to end trip (TRIP/{tripId}) now ?
          </Typography>
          <div className={datePickerWrapper}>
            <FieldDateTimepicker label="End Time" name="endTime" />
          </div>
        </ConfirmationDialog>
      )}
    </Formik>
  );
};

export default UndoPopup;
