import { notifyUser } from 'Utilities';

const findIntersection = (list1, list2) => {
  return list1.intersection(list2);
};

export const generateBomID = (values, setFieldValue, packagingTypes, bomId) => {
  if (bomId) return;
  const packTypeMap = new Map();
  const allValidItems = [];
  const totalItems = [...values.primary_items, ...values.secondary_items];
  packagingTypes.forEach((packType) => {
    packTypeMap.set(packType.id, packType);
  });

  totalItems.forEach((item) => {
    if (item.nfi_packaging_item?.id) allValidItems.push(item);
  });

  let tempArr = new Set(
    packTypeMap
      .get(allValidItems[0].nfi_packaging_item?.id)
      ?.product_category.map((item) => item.short_code),
  );

  for (
    let i = 0;
    i < allValidItems.length - 1 && allValidItems.length > 1;
    i += 1
  ) {
    tempArr = findIntersection(
      tempArr,
      new Set(
        packTypeMap
          .get(allValidItems[i + 1].nfi_packaging_item?.id)
          ?.product_category.map((item) => item.short_code),
      ),
    );
  }

  if (tempArr.size < 1) {
    notifyUser(
      'Product categories do not match between the items added',
      'error',
    );
  }

  const itemCodes = ['BOM'];

  if (tempArr.size === 1) {
    itemCodes.push([...tempArr][0]);
  } else {
    itemCodes.push('MUL');
  }

  itemCodes.push(values?.bom_name.slice(0, 40));
  setFieldValue('bom_id', itemCodes.join('/'));
};
