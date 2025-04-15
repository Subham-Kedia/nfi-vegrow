import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RouteTransformer from 'Routes/routeTransformer';
import MaterialAssignmentAPI from 'Services/materialAssignment';
import { notifyUser, serialize } from 'Utilities';
import imageDirectUpload from 'Utilities/directUpload';

import customerAddMAColumns from '../../columns/customerAddMA';
import customerUploadMAColumns from '../../columns/customerUploadMA';
import AddEdit from '../../components/AddEdit';
import { CUSTOMER_ADD_EDIT_MA_STRUCTURE, PRINT_BASE_URL } from '../../const';

const AddMA = () => {
  const [isApiInProgress, setIsApiInProgress] = useState(false);
  const navigation = useNavigate();
  const location = useLocation();

  let initialData = CUSTOMER_ADD_EDIT_MA_STRUCTURE;
  if (location.state) {
    initialData = {
      ...initialData,
      customer: location.state,
    };
  }

  const cancelHandler = () => {
    navigation(-1);
  };

  const prepareData = (materialInfo) => {
    // ignore the empty rows and only take the row that has data
    return materialInfo
      .filter((info) => Object.values(info).every((val) => !!val))
      .map(({ quantity, packaging_item, rate }) => ({
        quantity: +quantity,
        nfi_packaging_item_id: +packaging_item.id,
        hsn_code: packaging_item.hsn_code,
        rate: +rate,
      }));
  };

  const printHandler = (values) => {
    const { material_info, customer, source } = values;
    const material_assignment_items = prepareData(material_info);

    const params = {
      material_assignment: {
        customer_id: +customer.id,
        material_assignment_items,
        dc_id: +source.id,
      },
    };

    const url = `${PRINT_BASE_URL.ADD_EDIT_MA}?${serialize(params)}`;

    open(url, '_blank');
  };

  const submitHandler = async (values) => {
    try {
      const { ma_upload, source, customer, material_info, remark } = values;

      setIsApiInProgress(true);

      const {
        data: { signed_id },
      } = await imageDirectUpload(ma_upload[0]);

      const material_assignment_items = prepareData(material_info);

      const payload = {
        material_assignment: {
          customer_id: +customer.id,
          source_dc_id: +source.id,
          acknowledgement_signed_id: signed_id,
          material_assignment_items,
          remark,
        },
      };

      const res = await MaterialAssignmentAPI.createCustomerMA(payload);

      if (res.id) {
        notifyUser('MA created successfully');
        const {
          customer: { id },
        } = values;
        navigation(`/app/${RouteTransformer.getCreateCustomerLedger(id)}`);
      }
    } finally {
      setIsApiInProgress(false);
    }
  };

  return (
    <AddEdit
      title="ADD Material Assignment"
      columns={customerAddMAColumns}
      uploadColumns={customerUploadMAColumns}
      initialValues={initialData}
      submitHandler={submitHandler}
      cancelHandler={cancelHandler}
      confirmationMssg="Are you sure you want to add this MA ?"
      isApiInProgress={isApiInProgress}
      showCustomers
      disableCustomer={!!location.state}
      printHandler={printHandler}
    />
  );
};

export default AddMA;
