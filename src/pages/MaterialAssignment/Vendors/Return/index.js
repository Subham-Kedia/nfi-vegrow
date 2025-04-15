import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSiteValue } from 'App/SiteContext';
import { AppLoader } from 'Components';
import RouteTransformer from 'Routes/routeTransformer';
import MaterialAssignmentAPI from 'Services/materialAssignment';
import { notifyUser, serialize } from 'Utilities';
import imageDirectUpload from 'Utilities/directUpload';

import vendorReturnMAColumns from '../../columns/vendorReturnMA';
import vendorReturnMAUploadColumns from '../../columns/vendorReturnMAUpload';
import AddEdit from '../../components/AddEdit';
import {
  PRINT_BASE_URL,
  RETURN_MA_TRACKER_STATES,
  TRANSACTION_TYPE,
} from '../../const';
import { prepareReturnVendorMAData, validateReturn } from '../../utils';

const Return = () => {
  const [data, setData] = useState({});
  const [isApiInProgress, setIsApiInProgress] = useState(false);
  const { vendorId } = useParams();
  const navigate = useNavigate();

  const { userInfo } = useSiteValue();

  useEffect(() => {
    if (vendorId) {
      MaterialAssignmentAPI.getAdjustmentReturnDcVendorListing({
        vendor_id: vendorId,
      }).then((res) => {
        setData(res);
      });
    }
  }, [vendorId]);

  const cancelHandler = () => {
    navigate(-1);
  };

  const prepareData = (materialInfo) => {
    // ignore the empty rows and only take the row that has data
    return materialInfo
      .filter((info) =>
        Object.keys(info).every((val) => {
          // description is non mandatory
          if (val === 'description') return true;
          return !!info[val];
        }),
      )
      .map(({ quantity, item_id, average_rate }) => ({
        quantity: +quantity,
        nfi_packaging_item_id: +item_id,
        rate: average_rate,
      }));
  };

  const printHandler = (values) => {
    const { material_info, vendor, source } = values;
    const material_assignment_items = prepareData(material_info);

    const params = {
      material_assignment: {
        partner_id: +vendor.id,
        material_assignment_items,
        dc_id: +source.id,
      },
    };

    const url = `${PRINT_BASE_URL.RETURN_MA}?${serialize(params)}`;

    open(url, '_blank');
  };

  const submitHandler = async (values) => {
    try {
      const { ma_upload, material_info, vendor, source, remark } = values;

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
          source_dc_id: +source.id,
          transaction_type: TRANSACTION_TYPE.RETURN,
          acknowledgement_signed_id: signed_id,
          transaction_items,
          remark,
        },
      };

      const res = await MaterialAssignmentAPI.adjustReturnDcVendorMA(payload);

      if (res.id) {
        notifyUser('MA return done successfully');
        const {
          vendor: { id },
        } = values;
        navigate(`/app/${RouteTransformer.getCreateVendorDetails(id)}`);
      }
    } finally {
      setIsApiInProgress(false);
    }
  };

  const initialValues = prepareReturnVendorMAData(data);

  if (!Object.keys(initialValues).length) return <AppLoader />;

  return (
    <AddEdit
      title="Material Return"
      showVendors
      disableVendors
      sourceLabel="Inward DC"
      submitHandler={submitHandler}
      cancelHandler={cancelHandler}
      confirmationMssg="Are you sure you want to save this material return ?"
      TRACKER_STATES={RETURN_MA_TRACKER_STATES}
      columns={vendorReturnMAColumns}
      uploadColumns={vendorReturnMAUploadColumns}
      initialValues={initialValues}
      validate={validateReturn}
      isApiInProgress={isApiInProgress}
      printHandler={printHandler}
    />
  );
};

export default Return;
