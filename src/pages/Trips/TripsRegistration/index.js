import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import { FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import PageLayout from 'App/PageLayout';
import AppButton from 'Components/AppButton';
import { Formik } from 'formik';
import useTripsAccess from 'Hooks/useRoleBasedAccess';
import RouteTransformer from 'Routes/routeTransformer';
import { addNfiTrips, editNfiTrips, getShipmentsList } from 'Services/trips';
import { notifyUser } from 'Utilities';
import {
  ACCESS_RESTRICTION_MSSG,
  DELIVERY_DETAILS_CARD,
  TRIP_CATEGORY_TYPES,
} from 'Utilities/constants/trips';
import {
  generateAddTripsPostData,
  generateEditTripsData,
  getPreSelectedShiments,
} from 'Utilities/trips';

import DeliveryDetailsCard from '../components/DeliveryDetailsCard';
import SelectShipmentPopup from '../components/SelectShipmentPopup';
import { classes } from '../style';

import VehicleDetails from './VehicleDetails';

const TripsButton = ({ btnText, hanldeClick = () => {}, ...otherProps }) => {
  return (
    <AppButton variant="contained" onClick={hanldeClick} {...otherProps}>
      {btnText}
    </AppButton>
  );
};

const TripsRegistration = ({
  initialFormData = {},
  toShipmentData = {},
  shipmentIds = [],
  tripId,
  header = 'Add Trip',
  backHandlerLink = RouteTransformer.getTripsListingLink(),
}) => {
  const { FULL_LOAD, MONTHLY_VEHICLE } = TRIP_CATEGORY_TYPES;
  const { SENDER, RECIEVER } = DELIVERY_DETAILS_CARD;

  const [tripCategory, setTripCategory] = useState(FULL_LOAD.value);
  const [openShipmentPopup, setOpenShipmentPopup] = useState(false);
  const [selectedShipments, setSelectedShipments] = useState(toShipmentData);

  const [initialValues, setInitialValues] = useState({
    category: tripCategory,
    partner: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const shouldDisableFormFields = useTripsAccess();
  const isEditPage = !!tripId;

  const { shouldDisableCategory = false, id, category } = initialFormData;

  const backHandler = () => {
    navigate(`/app/${backHandlerLink}`);
  };

  useEffect(() => {
    if (id) {
      setTripCategory(category);
      setInitialValues(initialFormData);
    }
  }, [id]);

  useEffect(() => {
    if (shipmentIds.length) {
      getShipmentsList(tripId).then((res) => {
        const { items = [] } = res || {};
        const preSelectedShipments = getPreSelectedShiments(items, shipmentIds);
        setSelectedShipments(preSelectedShipments);
      });
    }
  }, [shipmentIds]);

  useEffect(() => {
    if (!isEditPage && shouldDisableFormFields) {
      notifyUser(ACCESS_RESTRICTION_MSSG, 'error');
      setTimeout(backHandler, 1500);
    }
  }, [isEditPage, shouldDisableFormFields]);

  const {
    tripsRegistationFooterBtn,
    selectShipment,
    mainSectionWrapper,
    radioLabel,
    disable,
    radioGroupWrapper,
  } = classes();

  const toggleAddShipmentPopup = () => {
    setOpenShipmentPopup(!openShipmentPopup);
  };

  const addTripsHandler = (values) => {
    setIsSubmitting(true);
    const data = generateAddTripsPostData(values, selectedShipments);
    addNfiTrips(data)
      .then(() => {
        notifyUser('Trips added successfully');
        // set Timeout is introduced so that user is able to view the notifier message
        // before redirecting
        setTimeout(() => {
          backHandler();
        }, 1000);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const editTripsHandler = (values) => {
    setIsSubmitting(true);
    const data = generateEditTripsData(values, selectedShipments);
    editNfiTrips(data, tripId)
      .then(() => {
        notifyUser('Trips edited successfully');
        // set Timeout is introduced so that user is able to view the notifier message
        // before redirecting
        setTimeout(() => {
          backHandler();
        }, 1000);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleTripRegistration = (values) => {
    if (!Object.keys(selectedShipments).length)
      return notifyUser('Please select a shipment', 'error');

    return initialFormData.id
      ? editTripsHandler(values)
      : addTripsHandler(values);
  };

  const selectShipmentButton = (
    <TripsButton
      btnText="Select Shipment"
      className={selectShipment}
      hanldeClick={toggleAddShipmentPopup}
      disabled={shouldDisableFormFields}
    />
  );

  return (
    <>
      <PageLayout title={header} showBackHandler={backHandler}>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleTripRegistration}
        >
          {({ handleSubmit, values, handleChange }) => (
            <>
              <PageLayout.Body>
                <header>
                  <b>Trip Details</b>
                </header>
                <section className={mainSectionWrapper}>
                  <main>
                    {selectShipmentButton}
                    {!!Object.keys(selectedShipments).length && (
                      <>
                        <DeliveryDetailsCard
                          selectedShipments={selectedShipments}
                          cardInfoConstant={SENDER}
                        />
                        <DeliveryDetailsCard
                          selectedShipments={selectedShipments}
                          cardInfoConstant={RECIEVER}
                        />
                      </>
                    )}
                    <form>
                      <div className={radioGroupWrapper}>
                        <Typography variant="subtitle1" className={radioLabel}>
                          <b>Trips Category</b>
                        </Typography>
                        <RadioGroup
                          name="category"
                          defaultValue={FULL_LOAD.value}
                          value={values.category}
                          onChange={(e) => {
                            handleChange(e);
                            setTripCategory(e.target.value);
                          }}
                          className={
                            shouldDisableCategory || shouldDisableFormFields
                              ? disable
                              : ''
                          }
                        >
                          <FormControlLabel
                            value={FULL_LOAD.value}
                            control={<Radio color="primary" size="small" />}
                            label={FULL_LOAD.label}
                          />
                          <FormControlLabel
                            value={MONTHLY_VEHICLE.value}
                            control={<Radio color="primary" size="small" />}
                            label={MONTHLY_VEHICLE.label}
                          />
                        </RadioGroup>
                      </div>
                      <VehicleDetails
                        tripCategory={tripCategory}
                        disableFormFields={shouldDisableFormFields}
                      />
                    </form>
                  </main>
                </section>
              </PageLayout.Body>
              <PageLayout.Footer>
                <TripsButton
                  btnText="Cancel"
                  className={tripsRegistationFooterBtn}
                  color="inherit"
                  hanldeClick={backHandler}
                />
                <TripsButton
                  btnText="Submit"
                  startIcon={<SaveIcon />}
                  hanldeClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={shouldDisableFormFields}
                />
              </PageLayout.Footer>
            </>
          )}
        </Formik>
      </PageLayout>
      {openShipmentPopup && (
        <SelectShipmentPopup
          onClose={toggleAddShipmentPopup}
          setSelectedShipments={setSelectedShipments}
          selectedShipments={selectedShipments}
          tripId={tripId}
        />
      )}
    </>
  );
};

export default TripsRegistration;
