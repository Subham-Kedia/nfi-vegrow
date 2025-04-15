export default function filterCloneData(data) {
  return {
    primary_items: data.primary_items.map((item) => ({
      composition: item.composition,
      is_flexible: item.is_flexible,
      nfi_packaging_item_id: item.nfi_packaging_item.id,
    })),
    secondary_items: data.secondary_items.map((item) => ({
      composition: item.composition,
      is_flexible: item.is_flexible,
      nfi_packaging_item_id: item.nfi_packaging_item.id,
    })),
    bom: {
      bom_name: data.bom_name,
      bom_short_code: data.bom_short_code.slice(-3),
      bom_id: data.bom_id,
    },
  };
}
