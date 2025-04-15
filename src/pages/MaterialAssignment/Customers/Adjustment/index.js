import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSiteValue } from 'App/SiteContext';
import { AppLoader } from 'Components';
import RouteTransformer from 'Routes/routeTransformer';
import MaterialAssignmentAPI from 'Services/materialAssignment';
import { notifyUser, serialize } from 'Utilities';
import imageDirectUpload from 'Utilities/directUpload';

import customerAdjustMAColumns from '../../columns/customerAdjustMA';
import customerAdjustMAUploadColumns from '../../columns/customerAdjustMAUpload';
import AddEdit from '../../components/AddEdit';
import {
  ADJUST_MA_TRACKER_STATES,
  PRINT_BASE_URL,
  TRANSACTION_TYPE,
} from '../../const';
import { prepareAdjustCustomerMAData, validateAdjustment } from '../../utils';

const Adjustment = () => {
  const [data, setData] = useState({});
  const [isApiInProgress, setIsApiInProgress] = useState(false);
  const navigate = useNavigate();

  const { customerId } = useParams();

  useEffect(() => {
    if (customerId) {
      setIsApiInProgress(true);
      MaterialAssignmentAPI.getAdjustmentReturnCustomerListing({
        customer_id: customerId,
      })
        .then((res) => {
          setData(res);
          setIsApiInProgress(false);
        })
        .catch(() => {
          setIsApiInProgress(false);
        });
    }
  }, [customerId]);

  const { userInfo } = useSiteValue();

  const cancelHandler = () => {
    navigate(-1);
  };

  const prepareData = (materialInfo) => {
    return materialInfo
      .filter((info) =>
        Object.keys(info).every((val) => {
          // description is a non mandate field
          if (val === 'description') return true;
          return !!info[val];
        }),
      )
      .map(({ adjustment, item_id, average_rate }) => ({
        quantity: +adjustment,
        nfi_packaging_item_id: +item_id,
        rate: +average_rate,
      }));
  };

  const printHandler = (values) => {
    const { material_info, customer } = values;
    const material_assignment_items = prepareData(material_info);

    const params = {
      material_assignment: {
        customer_id: +customer.id,
        material_assignment_items,
      },
    };

    const url = `${PRINT_BASE_URL.ADJUST_MA}?${serialize(params)}`;

    open(url, '_blank');
  };

  const submitHandler = async (values) => {
    try {
      const { ma_upload, material_info, customer, remark } = values;

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
          transaction_type: TRANSACTION_TYPE.ADJUSTMENT,
          acknowledgement_signed_id: signed_id,
          transaction_items,
          remark,
        },
      };

      const res = await MaterialAssignmentAPI.adjustReturnCustomerMA(payload);

      if (res.id) {
        notifyUser('MA adjustment done successfully');
        const {
          customer: { id },
        } = values;
        navigate(`/app/${RouteTransformer.getCreateCustomerLedger(id)}`);
      }
    } finally {
      setIsApiInProgress(false);
    }
  };

  const initialValues = prepareAdjustCustomerMAData(data);

  if (!Object.keys(initialValues).length) return <AppLoader />;

  return (
    <AddEdit
      title="Material Adjustment"
      showCustomers
      showSource={false}
      disableHeader
      submitHandler={submitHandler}
      cancelHandler={cancelHandler}
      confirmationMssg="Are you sure you want to save this material adjustment ?"
      TRACKER_STATES={ADJUST_MA_TRACKER_STATES}
      columns={customerAdjustMAColumns}
      uploadColumns={customerAdjustMAUploadColumns}
      initialValues={initialValues}
      validate={validateAdjustment}
      isApiInProgress={isApiInProgress}
      printHandler={printHandler}
    />
  );
};

export default Adjustment;
