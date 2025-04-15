import { notifyUser } from 'Utilities';

import { generateBomID } from '../utils';

jest.mock('Utilities', () => ({
  notifyUser: jest.fn(),
}));

describe('generateBomID', () => {
  let setFieldValue;

  beforeEach(() => {
    setFieldValue = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not modify bom_id if bomId is already provided', () => {
    const values = {
      primary_items: [{ nfi_packaging_item: { id: 1 } }],
      secondary_items: [{ nfi_packaging_item: { id: 2 } }],
      bom_name: 'BOX-FARM-CANDY-BANANA-EXPORT-5KG-3PLY-BOTTOM-PREMIUM',
    };
    const bomId = 'existing-bom-id';
    const packagingTypes = [{ id: 1, product_category: [{ short_code: 'A' }] }];

    generateBomID(values, setFieldValue, packagingTypes, bomId);
    expect(setFieldValue).not.toHaveBeenCalled();
  });

  it('should call notifyUser if product categories do not match', () => {
    const values = {
      primary_items: [{ nfi_packaging_item: { id: 1 } }],
      secondary_items: [{ nfi_packaging_item: { id: 2 } }],
      bom_name: 'BOX-FARM-CANDY-BANANA-EXPORT-5KG-3PLY-BOTTOM-PREMIUM',
    };
    const bomId = '';
    const packagingTypes = [
      { id: 1, product_category: [{ short_code: 'A' }] },
      { id: 2, product_category: [{ short_code: 'B' }] },
    ];

    generateBomID(values, setFieldValue, packagingTypes, bomId);
    expect(notifyUser).toHaveBeenCalledWith(
      'Product categories do not match between the items added',
      'error',
    );
  });

  it('should set bom_id when product categories match and size is 1', () => {
    const values = {
      primary_items: [{ nfi_packaging_item: { id: 1 } }],
      secondary_items: [{ nfi_packaging_item: { id: 1 } }],
      bom_name: 'BOX-FARM-CANDY-BANANA-EXPORT-5KG-3PLY-BOTTOM-PREMIUM',
    };
    const bomId = '';
    const packagingTypes = [{ id: 1, product_category: [{ short_code: 'A' }] }];

    generateBomID(values, setFieldValue, packagingTypes, bomId);
    expect(setFieldValue).toHaveBeenCalledWith(
      'bom_id',
      'BOM/A/BOX-FARM-CANDY-BANANA-EXPORT-5KG-3PLY-BO',
    );
  });

  it('should set bom_id to "MUL" when there are multiple categories', () => {
    const values = {
      primary_items: [{ nfi_packaging_item: { id: 1 } }],
      secondary_items: [{ nfi_packaging_item: { id: 2 } }],
      bom_name: 'BOX-FARM-CANDY-BANANA-EXPORT-5KG-3PLY-BOTTOM-PREMIUM',
    };
    const bomId = '';
    const packagingTypes = [
      { id: 1, product_category: [{ short_code: 'A' }] },
      { id: 2, product_category: [{ short_code: 'B' }] },
    ];

    generateBomID(values, setFieldValue, packagingTypes, bomId);
    expect(setFieldValue).toHaveBeenCalledWith(
      'bom_id',
      'BOM/MUL/BOX-FARM-CANDY-BANANA-EXPORT-5KG-3PLY-BO',
    );
  });

  it('set bom_id to A only when primary item is selected', () => {
    const values = {
      primary_items: [{ nfi_packaging_item: { id: 1 } }],
      secondary_items: [],
      bom_name: 'BOX-FARM-CANDY-BANANA-EXPORT-5KG-3PLY-BOTTOM-PREMIUM',
    };
    const bomId = '';
    const packagingTypes = [{ id: 1, product_category: [{ short_code: 'A' }] }];

    generateBomID(values, setFieldValue, packagingTypes, bomId);

    expect(setFieldValue).toHaveBeenCalledWith(
      'bom_id',
      'BOM/A/BOX-FARM-CANDY-BANANA-EXPORT-5KG-3PLY-BO',
    );
  });
});
