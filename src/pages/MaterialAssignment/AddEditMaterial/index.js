import RouteTransformer from 'Routes/routeTransformer';
import MaterialAssignmentAPI from 'Services/materialAssignment';
import { getDcMandiPackagingItems } from 'Services/packagingItem';
import { DC_TYPE } from 'Utilities/constants';
import { LOCAL_STORAGE_KEYS } from 'Utilities/constants/MaterialAssignment';
import { validateRequired } from 'Utilities/formvalidation';

import columnsConfig, {
  COLUMN_KEY_NAME,
  EMPTY_ROW_VALUES,
  ITEM_KEY_NAME,
} from './columnsConfig';

const initialValues = {
  partner: null,
  [COLUMN_KEY_NAME]: [EMPTY_ROW_VALUES],
};

const LISTING_URL = `/app/${RouteTransformer.getMaterialAssignmentListingLink()}`;

const getInitialValues = (id) => async () => {
  try {
    const [ma_response, { items = [] }] = await Promise.all([
      MaterialAssignmentAPI.getMaterialAssignmentById(id),
      getDcMandiPackagingItems(),
    ]);
    const result = {
      ...ma_response,
      [COLUMN_KEY_NAME]: ma_response[COLUMN_KEY_NAME].map((ma_items) => {
        const index = items.findIndex(
          (item) => item.id === ma_items[ITEM_KEY_NAME].id,
        );
        if (index > -1) return { ...ma_items, [ITEM_KEY_NAME]: items[index] };
        return { quantity: ma_items.quantity };
      }),
    };
    return result;
  } catch (err) {
    window.open(LISTING_URL, '_self');
    localStorage.setItem(LOCAL_STORAGE_KEYS.HIDE_POPUP_SUMMARY, true);
  }
};

const handleSubmit = (id, data, setSubmitting) => {
  if (id) {
    const payload = {
      material_assignment: {
        partner_id: data.partner.id,
        [COLUMN_KEY_NAME]: data[COLUMN_KEY_NAME].map((ma_items) => ({
          ...(ma_items.id
            ? { id: ma_items.id, nfi_material_assignment_id: data.id }
            : {}),
          quantity: ma_items.quantity,
          nfi_packaging_item_id: ma_items[ITEM_KEY_NAME].id,
          rate: ma_items[ITEM_KEY_NAME].rate,
          gst: ma_items[ITEM_KEY_NAME].gst,
        })),
      },
    };
    MaterialAssignmentAPI.updateMaterialAssignment(id, payload)
      .then(() => {
        window.open(LISTING_URL, '_self');
        localStorage.setItem(LOCAL_STORAGE_KEYS.HIDE_POPUP_SUMMARY, true);
      })
      .finally(() => {
        setSubmitting(false);
      });
  } else {
    const payload = {
      material_assignment: {
        partner_id: data.partner.id,
        [COLUMN_KEY_NAME]: data[COLUMN_KEY_NAME].map((ma_items) => ({
          quantity: ma_items.quantity,
          nfi_packaging_item_id: ma_items[ITEM_KEY_NAME].id,
          rate: ma_items[ITEM_KEY_NAME].rate,
          gst: ma_items[ITEM_KEY_NAME].gst,
        })),
      },
    };
    MaterialAssignmentAPI.createMaterialAssignment(payload)
      .then(() => {
        window.open(LISTING_URL, '_self');
        localStorage.setItem(LOCAL_STORAGE_KEYS.HIDE_POPUP_SUMMARY, true);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }
};

const handleDeleteMA = (id, callback, setLoader) => {
  if (callback) callback();
  MaterialAssignmentAPI.deleteMaterialAssignmentById(id)
    .then(() => {
      window.open(LISTING_URL, '_self');
      localStorage.setItem(LOCAL_STORAGE_KEYS.HIDE_POPUP_SUMMARY, true);
    })
    .finally(() => {
      if (setLoader) setLoader(false);
    });
};

export const configuration = (id) => ({
  header: {
    title: id ? 'Edit Material Assignment' : 'Add Material Assignment',
    ...(id ? {} : { isLoading: false, showSelectDC: true }),
    dcFilterFn: ({ dc_type }) =>
      [DC_TYPE.MANDI, DC_TYPE.SATELLITE_CC].includes(dc_type),
  },
  fields: [
    {
      id: '1',
      type: 'vendorSelection',
      fieldProps: {
        name: 'partner',
        required: true,
        validate: validateRequired,
      },
      showButton: true,
      buttonTxt: 'Add Vendor',
      buttonProps: {
        href: `${API.CRMUrl}partners/new?role=Supplier&show_kyc=true`,
        target: '_blank',
      },
    },
    ...(id
      ? [
          {
            id: '2',
            type: 'button',
            fieldProps: {
              variant: 'contained',
              size: 'small',
            },
            buttonTxt: 'Delete',
            showConfirmation: true,
            confirmationProps: {
              title: 'Save Recieving',
              bodyContent:
                'Once saved, you will not be able to edit this receiving. Are you sure you want to continue?',
              handleOnConfirm: (callback, setLoader) =>
                handleDeleteMA(id, callback, setLoader),
            },
          },
        ]
      : []),
  ],
  columns: columnsConfig,
  columnsAdditionalConfig: {
    getItems: true,
    columnKeyName: COLUMN_KEY_NAME,
    itemKeyName: ITEM_KEY_NAME,
  },
  buttons: [
    {
      id: '1',
      text: 'cancel',
      props: {
        color: 'inherit',
        onClick: () => {
          window.open(LISTING_URL, '_self');
          localStorage.setItem(LOCAL_STORAGE_KEYS.HIDE_POPUP_SUMMARY, true);
        },
      },
    },
    {
      id: '2',
      text: 'save & close',
      type: 'submit',
    },
  ],
  onSubmit: (values, { setSubmitting }) => {
    handleSubmit(id, values, setSubmitting);
  },
  initialValues,
  ...(id ? { getInitialValues: getInitialValues(id) } : {}),
});
