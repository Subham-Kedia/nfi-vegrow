import { InputAdornment, Typography } from '@mui/material';
import { FieldCombo, FieldInput, FieldSelect } from 'Components/FormFields';
import useTransportersList from 'Hooks/useTransportersList';
import { mergeValidator } from 'Utilities';
import { TRIP_CATEGORY_TYPES, VEHICLE_TYPE } from 'Utilities/constants/trips';
import {
  validateMin,
  validatePhone,
  validateRequired,
  validVehicleNumber,
} from 'Utilities/formvalidation';
import { generateVehicleTonnageList } from 'Utilities/trips';

import { classes } from '../style';

const CustomTextField = ({
  name,
  label,
  validate = validateRequired,
  ...otherProps
}) => {
  const { inputBox } = classes();
  return (
    <FieldInput
      name={name}
      label={label}
      size="small"
      variant="outlined"
      className={inputBox}
      required
      validate={validate}
      InputLabelProps={{
        shrink: true,
        required: true,
      }}
      {...otherProps}
    />
  );
};

const CustomSelect = ({ name, label, options, ...otherProps }) => {
  return (
    <FieldSelect
      name={name}
      label={label}
      variant="outlined"
      size="small"
      required
      validate={validateRequired}
      options={options}
      showNone={false}
      InputLabelProps={{
        shrink: true,
        required: true,
      }}
      {...otherProps}
    />
  );
};

const VehicleDetails = ({ tripCategory, disableFormFields }) => {
  const [transporters, getTransporters] = useTransportersList();

  const {
    vehicleDetailsWrapper,
    headerWrapper,
    addTransporter,
    inputBox,
    vehicleDetailsHeader,
    fieldCombo,
  } = classes();

  const addTransporterUrl = `${API.CRMUrl}partners/new?role=Transporter`;

  let vehicleDetailsUI = (
    <>
      <header className={headerWrapper}>
        <b>Partner Details</b>
      </header>
      <CustomTextField
        name="vehicleNumber"
        label="Vehicle Number"
        validate={mergeValidator(validVehicleNumber, validateRequired)}
        disabled={disableFormFields}
      />
    </>
  );

  if (tripCategory === TRIP_CATEGORY_TYPES.FULL_LOAD.value) {
    vehicleDetailsUI = (
      <>
        <section>
          <header className={headerWrapper}>
            <b>Partner Details</b>
          </header>
          <FieldCombo
            name="partner"
            label="Partner"
            variant="outlined"
            validate={validateRequired}
            options={transporters}
            className={fieldCombo}
            optionLabel={(partner) =>
              `${partner.name}-${partner.area}${`-${partner.phone_number}`}`
            }
            onChangeInput={(query) => getTransporters(query)}
            groupBy={(value) => value.type}
            multiple={false}
            required
            disabled={disableFormFields}
          />
          <Typography
            color="primary"
            component="a"
            className={addTransporter}
            href={addTransporterUrl}
            target="_blank"
          >
            <b>ADD TRANSPORTER</b>
          </Typography>
        </section>
        <section>
          <header className={headerWrapper}>
            <b>Driver Details</b>
          </header>
          <div>
            <CustomTextField
              name="driverName"
              label="Driver Name"
              disabled={disableFormFields}
            />
            <CustomTextField
              name="driverPhone"
              label="Driver Phone"
              type="number"
              validate={mergeValidator(validateRequired, validatePhone)}
              disabled={disableFormFields}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+91</InputAdornment>
                ),
              }}
              inputProps={{
                maxLength: 10,
              }}
            />
          </div>
        </section>
        <section>
          <header className={vehicleDetailsHeader}>
            <b>Vehicle Details</b>
          </header>
          <div>
            <div className={inputBox}>
              <CustomSelect
                label="Vehicle Tonnage"
                name="vehicleTonnage"
                options={generateVehicleTonnageList()}
                disabled={disableFormFields}
              />
            </div>
            <div className={inputBox}>
              <CustomSelect
                label="Vehicle Type"
                name="vehicleType"
                options={VEHICLE_TYPE}
                disabled={disableFormFields}
              />
            </div>
            <CustomTextField
              name="transportationCost"
              label="TransportationCost"
              type="number"
              validate={mergeValidator(validateMin(0), validateRequired)}
              disabled={disableFormFields}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Rs.</InputAdornment>
                ),
              }}
            />
            <Typography component="body1">
              Total cost to be paid inclusive of GST
            </Typography>
            <div className={inputBox}>
              <CustomTextField
                name="vehicleNumber"
                label="Vehicle Number"
                validate={mergeValidator(validVehicleNumber, validateRequired)}
                disabled={disableFormFields}
              />
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <section className={vehicleDetailsWrapper}>{vehicleDetailsUI}</section>
  );
};

export default VehicleDetails;
