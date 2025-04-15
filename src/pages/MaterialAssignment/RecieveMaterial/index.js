import MaterialAssignmentAPI from 'Services/materialAssignment';
import { LOCAL_STORAGE_KEYS } from 'Utilities/constants/MaterialAssignment';
import RouteTransformer from 'Routes/routeTransformer';

import columnsConfig, { COLUMN_KEY_NAME, ITEM_KEY_NAME } from './columnsConfig';

const LISTING_URL = `/app/${RouteTransformer.getMaterialAssignmentListingLink()}`;

const getInitialValues = async (id) => {
  try {
    const response = await MaterialAssignmentAPI.getMaterialAssignmentById(id);
    return response;
  } catch (err) {
    window.open(LISTING_URL, '_self');
    localStorage.setItem(LOCAL_STORAGE_KEYS.HIDE_POPUP_SUMMARY, true);
  }
};

const onSubmit = (values, { setSubmitting }, callback) => {
  const payload = {
    receiving: {
      partner_id: values.partner.id,
      nfi_material_assignment_id: values.id,
      dc_id: values.dc.id,
      receiving_items: values[COLUMN_KEY_NAME].map((ma_items) => ({
        quantity: ma_items.received,
        nfi_packaging_item_id: ma_items[ITEM_KEY_NAME].id,
        dc_id: ma_items.dc.id,
        nfi_material_assignment_item_id: ma_items.id,
      })),
    },
  };
  MaterialAssignmentAPI.recieveMaterialById(payload)
    .then(() => {
      window.open(LISTING_URL, '_self');
      localStorage.setItem(LOCAL_STORAGE_KEYS.HIDE_POPUP_SUMMARY, true);
    })
    .finally(() => {
      setSubmitting(false);
    });
  if (callback) callback();
};

export const configuration = (id) => ({
  header: {
    title: 'Recieve Material Assignment',
  },
  fields: [
    {
      id: '1',
      type: 'vendorSelection',
      fieldProps: {
        name: 'partner',
        required: true,
        disabled: true,
      },
    },
  ],
  columns: columnsConfig,
  columnsAdditionalConfig: {
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
  onSubmit,
  getInitialValues: () => getInitialValues(id),
  showConfirmationOnSubmit: true,
  confirmationProps: {
    title: 'Save Recieving',
    bodyContent:
      'Once saved, you will not be able to edit this receiving. Are you sure you want to continue?',
  },
});
