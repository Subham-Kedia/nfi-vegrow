import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSiteValue } from 'App/SiteContext';
import { AppLoader } from 'Components';
import RouteTransformer from 'Routes/routeTransformer';
import MaterialAssignmentAPI from 'Services/materialAssignment';
import { notifyUser, serialize } from 'Utilities';
import imageDirectUpload from 'Utilities/directUpload';

import customerReturnMAColumns from '../../columns/customerReturnMA';
import customerReturnMAUploadColumns from '../../columns/customerReturnMAUpload';
import AddEdit from '../../components/AddEdit';
import {
  PRINT_BASE_URL,
  RETURN_MA_TRACKER_STATES,
  TRANSACTION_TYPE,
} from '../../const';
import { prepareReturnCustomerMAData, validateReturn } from '../../utils';

const Return = () => {
  const [data, setData] = useState({});
  const [isApiInProgress, setIsApiInProgress] = useState(false);
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSiteValue();

  useEffect(() => {
    if (customerId) {
      MaterialAssignmentAPI.getAdjustmentReturnCustomerListing({
        customer_id: customerId,
      }).then((res) => {
        setData(res);
      });
    }
  }, [customerId]);

  const cancelHandler = () => {
    navigate(-1);
  };

  const prepareData = (materialInfo) => {
    // ignore the empty rows and only take the row that has data
    return materialInfo
      .filter((info) =>
        Object.keys(info).every((val) => {
          // description is a non mandate field
          if (val === 'description') return true;
          // val === 0 is used as quantity can be zero
          return !!info[val] || info[val] === 0;
        }),
      )
      .map(({ quantity, item_id, pickup_quantity, average_rate }) => ({
        quantity: +quantity,
        nfi_packaging_item_id: +item_id,
        pickup_quantity: +pickup_quantity,
        gap: +pickup_quantity - +quantity,
        rate: +average_rate,
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

    const url = `${PRINT_BASE_URL.RETURN_MA}?${serialize(params)}`;

    open(url, '_blank');
  };

  const submitHandler = async (values) => {
    try {
      const { ma_upload, material_info, customer, source, remark } = values;

      setIsApiInProgress(true);

      const {
        data: { signed_id },
      } = ma_upload
        ? await imageDirectUpload(ma_upload[0])
        : { data: { signed_id: '' } };

      const transaction_items = prepareData(material_info);

      const payload = {
        material_assignments_customer: {
          customer_id: +customer.id,
          user_id: +userInfo.id,
          source_dc_id: +source.id,
          transaction_type: TRANSACTION_TYPE.RETURN,
          acknowledgement_signed_id: signed_id,
          transaction_items,
          remark,
        },
      };

      const res = await MaterialAssignmentAPI.adjustReturnCustomerMA(payload);

      if (res.id) {
        notifyUser('MA return done successfully');
        const {
          customer: { id },
        } = values;
        navigate(`/app/${RouteTransformer.getCreateCustomerLedger(id)}`);
      }
    } finally {
      setIsApiInProgress(false);
    }
  };

  const initialValues = prepareReturnCustomerMAData(data);

  if (!Object.keys(initialValues).length) return <AppLoader />;

  return (
    <AddEdit
      title="Material Return"
      showCustomers
      disableCustomer
      sourceLabel="Inward DC"
      submitHandler={submitHandler}
      cancelHandler={cancelHandler}
      confirmationMssg="Are you sure you want to save this material return ?"
      TRACKER_STATES={RETURN_MA_TRACKER_STATES}
      columns={customerReturnMAColumns}
      uploadColumns={customerReturnMAUploadColumns}
      initialValues={initialValues}
      validate={validateReturn}
      isApiInProgress={isApiInProgress}
      printHandler={printHandler}
    />
  );
};

export default Return;
