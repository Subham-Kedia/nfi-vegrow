import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLoader } from 'Components';
import RouteTransformer from 'Routes/routeTransformer';
import MaterialAssignmentAPI from 'Services/materialAssignment';
import { notifyUser, serialize } from 'Utilities';
import imageDirectUpload from 'Utilities/directUpload';

import vendorAddMAColumns from '../../columns/vendorAddMA';
import vendorUploadMAColumns from '../../columns/vendorUploadMA';
import AddEdit from '../../components/AddEdit';
import {
  EDIT_MA_TRACKER_STATES,
  PRINT_BASE_URL,
  VENDOR_ADD_EDIT_MA_STRUCTURE,
} from '../../const';
import { prepareEditMAInitialData } from '../../utils';

const EditMA = () => {
  const [data, setData] = useState({});
  const [isApiInProgress, setIsApiInProgress] = useState(false);
  const navigate = useNavigate();

  const { maId } = useParams();

  useEffect(() => {
    if (maId) {
      const res = MaterialAssignmentAPI.getMAVendorDetails(+maId);

      res.then((val) => {
        setData(val);
        setIsApiInProgress(false);
      });

      res.catch(() => {
        setIsApiInProgress(false);
      });
    }
  }, [maId]);

  const cancelHandler = () => {
    navigate(-1);
  };

  const prepareData = (materialInfo) => {
    // ignore the empty rows and only take the row that has data
    return materialInfo
      .filter((info) => Object.values(info).every((val) => !!val))
      .map(({ quantity, rate, packaging_item }) => ({
        quantity: +quantity,
        nfi_packaging_item_id: +packaging_item.id,
        rate: +rate,
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

    const url = `${PRINT_BASE_URL.ADD_EDIT_MA}?${serialize(params)}`;

    open(url, '_blank');
  };

  const submitHandler = async (values) => {
    try {
      const { ma_upload, source, vendor, material_info, remark } = values;

      setIsApiInProgress(true);

      const {
        data: { signed_id },
      } = ma_upload
        ? await imageDirectUpload(ma_upload[0])
        : { data: { signed_id: '' } };

      const material_assignment_items = prepareData(material_info);

      const payload = {
        material_assignment: {
          partner_id: +vendor.id,
          source_dc_id: +source.id,
          ...(signed_id ? { acknowledgement_signed_id: signed_id } : {}),
          material_assignment_items,
          remark,
        },
      };

      const res = await MaterialAssignmentAPI.editDcVendorMA(maId, payload);

      if (res.id) {
        notifyUser('MA created successfully');
        const {
          vendor: { id },
        } = values;
        navigate(`/app/${RouteTransformer.getCreateVendorDetails(id)}`);
      }
    } finally {
      setIsApiInProgress(false);
    }
  };

  const initialValues = prepareEditMAInitialData(data);

  if (!Object.keys(initialValues).length) return <AppLoader />;

  return (
    <AddEdit
      title="Edit Material Assignment"
      columns={vendorAddMAColumns}
      uploadColumns={vendorUploadMAColumns}
      initialValues={initialValues}
      formStructure={VENDOR_ADD_EDIT_MA_STRUCTURE}
      submitHandler={submitHandler}
      cancelHandler={cancelHandler}
      confirmationMssg="Are you sure you want to edit this MA ?"
      canSaveAndUploadLater
      isApiInProgress={isApiInProgress}
      showVendors
      disableHeader
      TRACKER_STATES={EDIT_MA_TRACKER_STATES}
      printHandler={printHandler}
    />
  );
};

export default EditMA;
