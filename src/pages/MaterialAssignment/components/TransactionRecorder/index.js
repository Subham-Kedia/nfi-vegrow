import { GridListView } from 'Components';
import { FieldArray, useFormikContext } from 'formik';

const TransactionRecorder = ({
  columns,
  defaultStructure,
  packagingOptions,
  filterFilledRows,
}) => {
  const { values } = useFormikContext();

  const data = values.material_info || [];

  // if there are empty rows, ignore them
  // res === 0 is used because the user can enter zero in few fields
  const filteredData = !filterFilledRows
    ? data
    : data.filter((val) =>
        Object.keys(val).every((res) => {
          // description is optional
          if (res === 'description') return true;
          return !!val[res] || val[res] === 0;
        }),
      );

  return (
    <FieldArray
      name="material_info"
      render={(arrayHelpers) => (
        <GridListView
          isHeaderSticky
          data={filteredData}
          columns={columns}
          cellProps={{
            arrayHelpers,
            defaultStructure,
            materialInfo: values.material_info,
            packagingOptions,
          }}
        />
      )}
    />
  );
};

export default TransactionRecorder;
