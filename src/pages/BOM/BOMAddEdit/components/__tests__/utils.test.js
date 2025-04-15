import filterCloneData from '../utils';

describe('filterCloneData', () => {
  it('should be a defined function', () => {
    expect(typeof filterCloneData).toBe('function');
  });

  it('should filter and map primary and secondary items correctly', () => {
    const data = {
      primary_items: [
        {
          composition: 'comp1',
          is_flexible: true,
          nfi_packaging_item: { id: 1 },
        },
      ],
      secondary_items: [
        {
          composition: 'comp2',
          is_flexible: false,
          nfi_packaging_item: { id: 2 },
        },
      ],
      bom_name: 'BOM Name',
      bom_short_code: '123TRH',
      bom_id: 'bom/id/123',
    };

    const result = filterCloneData(data);

    expect(result).toEqual({
      primary_items: [
        { composition: 'comp1', is_flexible: true, nfi_packaging_item_id: 1 },
      ],
      secondary_items: [
        { composition: 'comp2', is_flexible: false, nfi_packaging_item_id: 2 },
      ],
      bom: {
        bom_name: 'BOM Name',
        bom_short_code: 'TRH',
        bom_id: 'bom/id/123',
      },
    });
  });

  it('should handle empty primary and secondary items', () => {
    const data = {
      primary_items: [],
      secondary_items: [],
      bom_name: 'BOM Name',
      bom_short_code: '123456',
      bom_id: 'bom-id-123',
    };

    const result = filterCloneData(data);

    expect(result).toEqual({
      primary_items: [],
      secondary_items: [],
      bom: {
        bom_name: 'BOM Name',
        bom_short_code: '456',
        bom_id: 'bom-id-123',
      },
    });
  });

  it('should handle missing bom_short_code gracefully', () => {
    const data = {
      primary_items: [
        {
          composition: 'comp1',
          is_flexible: true,
          nfi_packaging_item: { id: 1 },
        },
      ],
      secondary_items: [
        {
          composition: 'comp2',
          is_flexible: false,
          nfi_packaging_item: { id: 2 },
        },
      ],
      bom_name: 'BOM Name',
      bom_short_code: '',
      bom_id: 'bom-id-123',
    };

    const result = filterCloneData(data);

    expect(result).toEqual({
      primary_items: [
        { composition: 'comp1', is_flexible: true, nfi_packaging_item_id: 1 },
      ],
      secondary_items: [
        { composition: 'comp2', is_flexible: false, nfi_packaging_item_id: 2 },
      ],
      bom: { bom_name: 'BOM Name', bom_short_code: '', bom_id: 'bom-id-123' },
    });
  });
});
