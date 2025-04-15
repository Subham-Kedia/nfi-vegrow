import { RouteTransformer } from 'Routes';
import MaterialAssignmentAPI from 'Services/materialAssignment';
import { notifyUser, serialize } from 'Utilities';
import imageDirectUpload from 'Utilities/directUpload';

import customerAddMAColumns from './columns/customerAddMA';
import customerUploadMAColumns from './columns/customerUploadMA';
import vendorAddMAColumns from './columns/vendorAddMA';
import vendorUploadMAColumns from './columns/vendorUploadMA';
import { StyledButton } from './Vendors/style';
import {
  CUSTOMER_ADD_EDIT_MA_STRUCTURE,
  MA_TYPES,
  PRINT_BASE_URL,
  TRANSACTION_TYPE,
  VENDOR_ADD_EDIT_MA_STRUCTURE,
} from './const';

export const validateAddEdit = (values) => {
  // check if there are no rows which are partially filled
  // returns true if the row is completely filled or nothing is filled
  // also atleast one row has to be completely filled
  return (
    values.filter(
      (val) =>
        !(
          Object.values(val).every((res) => !!res) ||
          Object.values(val).every((res) => !res)
        ),
    ).length === 0 &&
    values.filter((val) => Object.values(val).every((res) => !!res)).length > 0
  );
};

export const validateAdjustment = (values) => {
  return values.filter(({ adjustment }) => !!adjustment).length > 0;
};

export const validateReturn = (values) => {
  if (values[0].hasOwnProperty('pickup_quantity')) {
    return (
      values.filter(
        ({ quantity, pickup_quantity }) =>
          typeof quantity === 'number' && !!pickup_quantity,
      ).length > 0
    );
  }

  return values.filter(({ quantity }) => !!quantity).length > 0;
};

export const prepareEditMAInitialData = (data) => {
  if (!Object.keys(data).length) return {};

  const {
    dc,
    acknowledgement_doc,
    partner,
    material_assignment_items,
    remark,
  } = data;

  const material_info = material_assignment_items.map((ma) => {
    const { quantity, rate, nfi_packaging_item } = ma;
    return {
      quantity,
      rate,
      packaging_item: nfi_packaging_item,
    };
  });

  return {
    vendor: partner,
    source: dc,
    ma_upload: acknowledgement_doc,
    material_info,
    ...(remark ? { remark } : {}),
  };
};

export const prepareAdjustVendorMAData = (data) => {
  if (!Object.keys(data).length) return {};

  const { items, vendor_details } = data;

  return {
    vendor: {
      ...vendor_details,
      phone: vendor_details.phone_number,
    },
    material_info: items.map((item) => {
      const {
        pending_quantity,
        item_name,
        item_code,
        description,
        average_rate,
        item_id,
      } = item;

      return {
        pending_quantity,
        item_name,
        item_code,
        description,
        average_rate,
        item_id,
        adjustment: '',
      };
    }),
  };
};

export const prepareAdjustCustomerMAData = (data) => {
  if (!Object.keys(data).length) return {};

  const { items, customer_details } = data;

  return {
    customer: {
      ...customer_details,
    },
    material_info: items.map(
      ({
        pending_quantity,
        item_name,
        item_code,
        description,
        item_id,
        average_rate,
      }) => ({
        pending_quantity,
        average_rate,
        item_name,
        item_code,
        description,
        item_id,
        adjustment: '',
      }),
    ),
  };
};

export const prepareReturnVendorMAData = (data) => {
  if (!Object.keys(data).length) return {};

  const { items, vendor_details } = data;

  return {
    vendor: {
      ...vendor_details,
      phone: vendor_details.phone_number,
    },
    material_info: items.map((item) => {
      const {
        pending_quantity,
        item_name,
        item_code,
        description,
        unit_of_measurement,
        item_id,
        average_rate,
      } = item;

      return {
        pending_quantity,
        item_name,
        item_code,
        description,
        unit_of_measurement,
        item_id,
        average_rate,
        quantity: '',
      };
    }),
  };
};

export const prepareReturnCustomerMAData = (data) => {
  if (!Object.keys(data).length) return {};

  const { items, customer_details } = data;

  return {
    customer: {
      ...customer_details,
    },
    material_info: items.map(
      ({
        pending_quantity,
        item_name,
        item_code,
        description,
        item_id,
        average_rate,
      }) => ({
        pending_quantity,
        item_name,
        item_code,
        description,
        item_id,
        quantity: '',
        pickup_quantity: '',
        average_rate,
      }),
    ),
  };
};

export const getSourceLabel = (transactionType) => {
  switch (transactionType.toLowerCase()) {
    case TRANSACTION_TYPE.RETURN:
      return 'Inward';
    case TRANSACTION_TYPE.MATERIAL_ASSIGNMENT:
      return 'Source';
    default:
      return '';
  }
};

const getVendorCloneUtils = () => {
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
    const { material_info, vendor } = values;
    const material_assignment_items = prepareData(material_info);

    const params = {
      material_assignment: {
        partner_id: +vendor.id,
        material_assignment_items,
      },
    };

    const url = `${PRINT_BASE_URL.ADD_EDIT_MA}?${serialize(params)}`;

    open(url, '_blank');
  };

  const getData = (id) => {
    return MaterialAssignmentAPI.getMAVendorDetails(id);
  };

  const submitHandler = async (values, setIsApiInProgress, navigate) => {
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

  return {
    printHandler,
    submitHandler,
    getData,
    prepareInitialData: prepareEditMAInitialData,
    formInfo: {
      addColumns: vendorAddMAColumns,
      uploadColumns: vendorUploadMAColumns,
      emptyRowStructure: VENDOR_ADD_EDIT_MA_STRUCTURE,
    },
    showVendors: true,
    showCustomers: false,
    isUploadLaterAllowed: true,
  };
};

const getCustomerCloneUtils = () => {
  const prepareCloneMAInitialData = (data) => {
    if (!Object.keys(data).length) return {};

    const { dc, customer, material_assignment_items } = data;

    const material_info = material_assignment_items.map((ma) => {
      const { quantity, rate, nfi_packaging_item } = ma;
      return {
        quantity,
        rate,
        packaging_item: nfi_packaging_item,
      };
    });

    return {
      customer,
      source: dc,
      material_info,
    };
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
    const { material_info, customer } = values;
    const material_assignment_items = prepareData(material_info);

    const params = {
      material_assignment: {
        customer_id: +customer.id,
        material_assignment_items,
      },
    };

    const url = `${PRINT_BASE_URL.ADD_EDIT_MA}?${serialize(params)}`;

    open(url, '_blank');
  };

  const getData = (id) => {
    return MaterialAssignmentAPI.getMAVendorDetails(id);
  };

  const submitHandler = async (values, setIsApiInProgress, navigate) => {
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
        navigate(`/app/${RouteTransformer.getCreateCustomerLedger(id)}`);
      }
    } finally {
      setIsApiInProgress(false);
    }
  };

  return {
    printHandler,
    submitHandler,
    getData,
    prepareInitialData: prepareCloneMAInitialData,
    formInfo: {
      addColumns: customerAddMAColumns,
      uploadColumns: customerUploadMAColumns,
      emptyRowStructure: CUSTOMER_ADD_EDIT_MA_STRUCTURE,
    },
    showVendors: false,
    showCustomers: true,
    isUploadLaterAllowed: false,
  };
};

export const cloneMA = (type) => {
  const { VENDOR, CUSTOMER } = MA_TYPES;
  const utils = {
    [VENDOR]: getVendorCloneUtils(),
    [CUSTOMER]: getCustomerCloneUtils(),
  };
  return utils[type];
};

export const getTrimmedMA = ({
  items,
  id,
  expandedItems,
  keyName,
  handleShowMore,
  addExpansionBtn = false,
  defaultItemCount = 3,
}) => {
  const maItems = expandedItems.has(id)
    ? items
    : items.slice(0, defaultItemCount);

  if (addExpansionBtn) {
    let text;
    if (expandedItems.has(id)) {
      text = 'Show Less...';
    } else if (maItems.length < items.length) {
      text = 'Show More...';
    }

    if (text) {
      maItems.push({
        [keyName]: (
          <StyledButton onClick={handleShowMore} variant="text">
            {text}
          </StyledButton>
        ),
      });
    }
  }

  return maItems;
};
