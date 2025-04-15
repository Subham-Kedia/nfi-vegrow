import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSiteValue } from 'App/SiteContext';
import { AppLoader } from 'Components';
import RouteTransformer from 'Routes/routeTransformer';
import MaterialAssignmentAPI from 'Services/materialAssignment';
import { notifyUser, serialize } from 'Utilities';
import imageDirectUpload from 'Utilities/directUpload';

import vendorAdjustMAColumns from '../../columns/vendorAdjustMA';
import vendorAdjustMAUploadColumns from '../../columns/vendorAdjustMAUpload';
import AddEdit from '../../components/AddEdit';
import {
  ADJUST_MA_TRACKER_STATES,
  PRINT_BASE_URL,
  TRANSACTION_TYPE,
} from '../../const';
import { prepareAdjustVendorMAData, validateAdjustment } from '../../utils';

const Adjustment = () => {
  const [data, setData] = useState({});
  const [isApiInProgress, setIsApiInProgress] = useState(false);
  const navigate = useNavigate();

  const { vendorId } = useParams();

  useEffect(() => {
    if (vendorId) {
      setIsApiInProgress(true);
      MaterialAssignmentAPI.getAdjustmentReturnDcVendorListing({
        vendor_id: vendorId,
      })
        .then((res) => {
          setData(res);
          setIsApiInProgress(false);
        })
        .catch(() => {
          setIsApiInProgress(false);
        });
    }
  }, [vendorId]);

  const { userInfo } = useSiteValue();

  const cancelHandler = () => {
    navigate(-1);
  };

  const prepareData = (materialInfo) => {
    return materialInfo
      .filter((info) =>
        Object.keys(info).every((val) => {
          // description is non mandatory
          if (val === 'description') return true;
          return !!info[val];
        }),
      )
      .map(({ adjustment, average_rate, item_id }) => ({
        quantity: +adjustment,
        nfi_packaging_item_id: +item_id,
        rate: +average_rate,
      }));
  };

  const printHandler = (values) => {
    const { material_info, vendor } = values;
    const material_assignment_items = prepareData(material_info);

    const params = {
      material_assignment: {
        partner_id: +vendor.id,
        material_assignment_items,
      },
    };

    const url = `${PRINT_BASE_URL.ADJUST_MA}?${serialize(params)}`;

    open(url, '_blank');
  };

  const submitHandler = async (values) => {
    try {
      const { ma_upload, material_info, vendor, remark } = values;

      setIsApiInProgress(true);

      const {
        data: { signed_id },
      } = ma_upload
        ? await imageDirectUpload(ma_upload[0])
        : { data: { signed_id: '' } };

      const transaction_items = prepareData(material_info);

      const payload = {
        material_assignments_vendor: {
          partner_id: +vendor.id,
          user_id: +userInfo.id,
          transaction_type: TRANSACTION_TYPE.ADJUSTMENT,
          acknowledgement_signed_id: signed_id,
          transaction_items,
          remark,
        },
      };

      const res = await MaterialAssignmentAPI.adjustReturnDcVendorMA(payload);

      if (res.id) {
        notifyUser('MA adjustment done successfully');
        const {
          vendor: { id },
        } = values;
        navigate(`/app/${RouteTransformer.getCreateVendorDetails(id)}`);
      }
    } finally {
      setIsApiInProgress(false);
    }
  };

  const initialValues = prepareAdjustVendorMAData(data);

  if (!Object.keys(initialValues).length) return <AppLoader />;

  return (
    <AddEdit
      title="Material Adjustment"
      showVendors
      showSource={false}
      disableHeader
      submitHandler={submitHandler}
      cancelHandler={cancelHandler}
      confirmationMssg="Are you sure you want to save this material adjustment ?"
      TRACKER_STATES={ADJUST_MA_TRACKER_STATES}
      columns={vendorAdjustMAColumns}
      uploadColumns={vendorAdjustMAUploadColumns}
      initialValues={initialValues}
      validate={validateAdjustment}
      isApiInProgress={isApiInProgress}
      printHandler={printHandler}
    />
  );
};

export default Adjustment;
