import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RouteTransformer from 'Routes/routeTransformer';
import MaterialAssignmentAPI from 'Services/materialAssignment';
import { notifyUser, serialize } from 'Utilities';
import imageDirectUpload from 'Utilities/directUpload';

import vendorAddMAColumns from '../../columns/vendorAddMA';
import vendorUploadMAColumns from '../../columns/vendorUploadMA';
import AddEdit from '../../components/AddEdit';
import { PRINT_BASE_URL, VENDOR_ADD_EDIT_MA_STRUCTURE } from '../../const';

const AddMA = () => {
  const [isApiInProgress, setIsApiInProgress] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  let initialData = VENDOR_ADD_EDIT_MA_STRUCTURE;
  if (location.state) {
    initialData = {
      ...initialData,
      vendor: location.state,
    };
  }

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

      const res = await MaterialAssignmentAPI.createDcVendorMA(payload);

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

  return (
    <AddEdit
      title="ADD Material Assignment"
      columns={vendorAddMAColumns}
      uploadColumns={vendorUploadMAColumns}
      initialValues={initialData}
      submitHandler={submitHandler}
      cancelHandler={cancelHandler}
      confirmationMssg="Are you sure you want to add this MA ?"
      canSaveAndUploadLater
      isApiInProgress={isApiInProgress}
      showVendors
      disableVendors={!!location.state}
      printHandler={printHandler}
    />
  );
};

export default AddMA;
