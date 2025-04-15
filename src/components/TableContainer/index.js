import { useEffect, useState } from 'react';
import { useSiteValue } from 'App/SiteContext';
import { FieldArray } from 'formik';
import { getDcMandiPackagingItems } from 'Services/packagingItem';

import GridListView from '../GridView';

const TableContainer = ({
  values,
  columnConfig,
  columnKeyName,
  itemKeyName,
  getItems,
  handleReset,
}) => {
  const { dcId } = useSiteValue();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (getItems) {
      getDcMandiPackagingItems().then(({ items = [] }) => {
        setItems(items);
      });
    }
    if (handleReset) handleReset();
  }, [getItems, dcId]);

  return (
    <FieldArray
      name={columnKeyName}
      render={(arrayHelpers) => (
        <GridListView
          data={values[columnKeyName] || []}
          columns={columnConfig}
          cellProps={{
            items,
            [columnKeyName]: values[columnKeyName].map(
              (parameters) => parameters[itemKeyName]?.id,
            ),
            arrayHelpers,
          }}
        />
      )}
    />
  );
};

export default TableContainer;
