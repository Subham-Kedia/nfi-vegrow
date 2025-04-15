import FieldCombo from 'Components/FormFields/FieldCombo';
import useCustomersList from 'Hooks/useCustomersList';
import { validateRequired } from 'Utilities/formvalidation';

const CustomerSelection = ({
  name,
  required = true,
  label = 'Customer',
  placeholder = 'Select Customer',
  ...props
}) => {
  const [customers, getUpdatedCustomersList] = useCustomersList();

  return (
    <FieldCombo
      name={name}
      label={label}
      placeholder={placeholder}
      variant="outlined"
      options={customers}
      onChangeInput={(query) => getUpdatedCustomersList(query)}
      required={required}
      validate={required ? validateRequired : null}
      {...props}
    />
  );
};

export default CustomerSelection;
