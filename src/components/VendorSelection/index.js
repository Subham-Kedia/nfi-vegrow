import FieldCombo from 'Components/FormFields/FieldCombo';
import usePartnersList from 'Hooks/usePartnersList';
import { validateRequired } from 'Utilities/formvalidation';

const VendorSelection = ({ name, required = true, ...props }) => {
  const [partners, getUpdatedPartnersList] = usePartnersList();

  const filterOptions = (options = [], state = {}) => {
    return options
      .filter(
        (item) =>
          item.name
            ?.replace(',', '')
            .toLowerCase()
            ?.includes(state?.inputValue?.toLowerCase()) ||
          item.phone_number?.includes(state?.inputValue),
      )
      .map((opt) => {
        const { name, phone_number } = opt;
        return {
          ...opt,
          name: `${name}-${phone_number}`,
        };
      });
  };

  return (
    <FieldCombo
      name={name}
      label="Vendor"
      placeholder="Select a vendor"
      variant="outlined"
      options={partners}
      onChangeInput={(query) => getUpdatedPartnersList(query)}
      filterOptions={filterOptions}
      required={required}
      validate={required ? validateRequired : null}
      {...props}
    />
  );
};

export default VendorSelection;
