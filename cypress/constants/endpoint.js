export const ROUTES = {
  editPurchaseOrderUrl: '/app/purchase-order/edit/',
  poApproval: '/app/po-approvals/view/',
};

export const API_ENDPOINT = {
  createPurchaseOrder: '/nfi/purchase_orders/create_with_purchase_items.json',
  approvePO: (poId) => `/nfi/purchase_orders/${poId}/approve_po`,
  getInventory: (dcId) => `/nfi/packaging_items/inventory.json?dc_id=${dcId}`,
  directUpload: '//rails/active_storage/direct_uploads',
};
