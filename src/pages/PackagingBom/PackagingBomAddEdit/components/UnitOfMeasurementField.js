import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import FieldInput from 'Components/FormFields/TextInput';

const UnitOfMeasurementField = (props) => {
  const {
    values: { packaging_bom_items },
    setFieldValue,
  } = useFormikContext();
  useEffect(() => {
    let isCurrent = true;
    if (packaging_bom_items?.[props?.index]?.packaging_item) {
      setFieldValue(
        props?.name,
        packaging_bom_items?.[props?.index]?.packaging_item
          ?.unit_of_measurement_label,
      );
    }
    return () => {
      isCurrent = false;
    };
  }, [
    packaging_bom_items?.[props?.index]?.packaging_item,
    setFieldValue,
    props?.name,
  ]);

  return <FieldInput {...props} />;
};

export default UnitOfMeasurementField;
