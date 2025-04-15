import { getTrimmedMA } from '../utils';

describe('getTrimmedMA', () => {
  const mockClickHandler = jest.fn();
  const mockMAItems = [
    {
      item_name: 'ABC 3',
      total_value: 2.0,
      total_quantity: 2.0,
    },
    {
      item_name: 'ABC 4',
      total_value: 22.0,
      total_quantity: 11.0,
    },
    {
      item_name: 'Airpad Box-7kg',
      total_value: 2000.0,
      total_quantity: 100.0,
    },
    {
      item_name: 'Pricing 3',
      total_value: 20.0,
      total_quantity: 10.0,
    },
  ];
  it('should return all the ma items when vendor_id is in the expanded state', () => {
    const expandedItems = new Set([66412]);
    const result = getTrimmedMA({
      items: mockMAItems,
      id: 66412,
      expandedItems,
      keyName: 'total_quantity',
    });
    expect(result).toEqual(mockMAItems);
  });
  it('should return sliced ma items when vendor_id is not in expandedItems', () => {
    const expandedItems = new Set([66412]);
    const result = getTrimmedMA({
      items: mockMAItems,
      id: 66411,
      expandedItems,
      keyName: 'total_value',
    });
    expect(result).toEqual(mockMAItems.slice(0, 3));
  });
  it('should return sliced ma items with "Show More..." button when addExpansionBtn is true and items are not expanded', () => {
    const expandedItems = new Set([66412]);
    const result = getTrimmedMA({
      items: mockMAItems,
      id: 66411,
      expandedItems,
      keyName: 'item_name',
      handleShowMore: mockClickHandler,
      addExpansionBtn: true,
      defaultItemCount: 2,
    });

    expect(result).toHaveLength(3);
    const button = result[result.length - 1].item_name;
    expect(button.props.children).toEqual('Show More...');
  });

  it('should add "Show Less..." button when addExpansionBtn is true and items are expanded', () => {
    const expandedItems = new Set([66412]);
    const result = getTrimmedMA({
      items: mockMAItems,
      id: 66412,
      expandedItems,
      keyName: 'item_name',
      handleShowMore: mockClickHandler,
      addExpansionBtn: true,
    });

    expect(result).toHaveLength(5);
    const button = result[result.length - 1].item_name;
    expect(button.props.children).toBe('Show Less...');
  });

  it('should handle when defaultItemCount is larger than ma items array length', () => {
    const expandedItems = new Set();
    const result = getTrimmedMA({
      items: mockMAItems,
      id: 66412,
      expandedItems,
      keyName: 'item_name',
      handleShowMore: mockClickHandler,
      defaultItemCount: 5,
    });
    expect(result).toEqual(mockMAItems);
  });
});
