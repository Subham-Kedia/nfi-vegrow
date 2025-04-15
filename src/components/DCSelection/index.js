import { useEffect, useState } from 'react';
import FieldCombo from 'Components/FormFields/FieldCombo';
import { getDcs } from 'Services/users';
import { validateRequired } from 'Utilities/formvalidation';

const DCSelection = ({
  name,
  label = 'Dc',
  placeholder = 'Select Dc',
  filterBy = ['Distribution center'],
  required = true,
  ...props
}) => {
  const [dcList, setDcList] = useState([]);

  useEffect(() => {
    getDcs().then((res) => {
      setDcList(res.items.filter(({ dc_type }) => filterBy.includes(dc_type)));
    });
  }, []);

  return (
    <FieldCombo
      name={name}
      label={label}
      placeholder={placeholder}
      options={dcList}
      optionLabel={({ id, name }) => `${id}-${name}`}
      required={required}
      validate={required ? validateRequired : null}
      {...props}
    />
  );
};

export default DCSelection;
