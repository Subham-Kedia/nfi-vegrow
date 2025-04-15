import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FieldCombo from 'Components/FormFields/FieldCombo';
import { useFormikContext } from 'formik';
import { getPackagingItem } from 'Services/lots';

import { classes } from './styled';

const Filter = ({ loadPageData, handleSelectedPackagingItem }) => {
  const [packagingItems, setpackagingItems] = useState([]);

  const { setFieldValue } = useFormikContext();

  const { filterWrapper, filterSelect } = classes();

  useEffect(() => {
    getPackagingItem({ consumable: true }).then((res) => {
      const { items = [] } = res || {};
      setpackagingItems(items);
    });
  }, []);

  const handleItemChange = (val) => {
    handleSelectedPackagingItem(val);
    setFieldValue('packagingItem', val);
    loadPageData(val?.id || null);
  };

  const fieldLabel = 'Search Packaging Item';

  return (
    <Box className={filterWrapper}>
      <FieldCombo
        name="packagingItem"
        label={fieldLabel}
        placeholder={fieldLabel}
        options={packagingItems}
        optionLabel={(packagingObj) => packagingObj.item_name}
        className={filterSelect}
        onChange={handleItemChange}
        variant="outlined"
      />
    </Box>
  );
};

export default Filter;
