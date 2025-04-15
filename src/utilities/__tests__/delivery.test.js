import { getFormattedDateTime } from '../dateUtils';
import {
  getModifiedShipmentsLots,
  getShipmentsCreatedAt,
  getShipmentsSourceName,
} from '../delivery';

jest.mock('../dateUtils', () => ({
  getFormattedDateTime: jest.fn(),
}));

describe('delivery.js', () => {
  const delivery = {
    shipments: [
      {
        id: 1,
        sender_name: 'Gokul',
        created_at: '2024-01-01T12:00:00Z',
        non_fruit_lots: [
          {
            id: 'lot1',
            current_quantity: 100,
            packaging_item: { item_code: 'P1', item_name: 'Packaging 1' },
          },
          {
            id: 'lot2',
            current_quantity: 50,
            packaging_item: { item_code: 'P2', item_name: 'Packaging 2' },
            purchase_item: { uom_name: 'kg' },
          },
        ],
        non_fruit_dc_lots: [
          {
            id: 'dcLot1',
            parent_id: 'lot1',
            initial_quantity: 100,
          },
          {
            id: 'dcLot2',
            parent_id: 'lot2',
            initial_quantity: 50,
          },
        ],
        identifier: 'SHIP/APPLE/1',
      },
      {
        id: 1,
        sender_name: 'Kiran',
        created_at: '2024-02-01T15:30:00Z',
        non_fruit_lots: [
          {
            id: 'lot3',
            current_quantity: 200,
            packaging_item: { item_code: 'P3', item_name: 'Packaging 3' },
            purchase_item: { uom_name: 'units' },
          },
        ],
        non_fruit_dc_lots: [],
        identifier: 'SHIP/GRAPES/1',
      },
    ],
  };

  describe('getShipmentsSourceName', () => {
    it('should concat all the sender_names of the shipments', () => {
      const res = getShipmentsSourceName(delivery.shipments);
      expect(res).toEqual('Gokul, Kiran');
    });

    it('should handle when delivery has no shipments', () => {
      const res = getShipmentsSourceName([]);
      expect(res).toEqual('');
    });
  });

  describe('getShipmentsCreatedAt', () => {
    it('should handle when delivery has no shipments', () => {
      const res = getShipmentsCreatedAt([]);
      expect(res).toEqual('');
    });

    it('should concat all the created time of the shipments', () => {
      getFormattedDateTime
        .mockReturnValueOnce('01 Jan 2024, 12:00 PM')
        .mockReturnValueOnce('01 Feb 2024, 03:30 PM');

      const res = getShipmentsCreatedAt(delivery.shipments);

      expect(getFormattedDateTime).toHaveBeenCalledTimes(
        delivery.shipments.length,
      );
      expect(getFormattedDateTime).toHaveBeenCalledWith('2024-01-01T12:00:00Z');
      expect(getFormattedDateTime).toHaveBeenCalledWith('2024-02-01T15:30:00Z');

      expect(res).toEqual('01 Jan 2024, 12:00 PM, 01 Feb 2024, 03:30 PM');
    });
  });

  describe('getModifiedShipmentsLots', () => {
    it('should return an array of lots with correct data when delivery has shipments', () => {
      const result = getModifiedShipmentsLots(delivery);
      expect(result).toEqual([
        {
          id: 'dcLot1',
          current_quantity: 100,
          item_code: 'P1',
          item_name: 'Packaging 1',
          uom_name: '',
          shipment_identifier: 'SHIP/APPLE/1',
        },
        {
          id: 'dcLot2',
          current_quantity: 50,
          item_code: 'P2',
          item_name: 'Packaging 2',
          uom_name: 'kg',
          shipment_identifier: 'SHIP/APPLE/1',
        },
        {
          id: null,
          current_quantity: 200,
          item_code: 'P3',
          item_name: 'Packaging 3',
          uom_name: 'units',
          shipment_identifier: 'SHIP/GRAPES/1',
        },
      ]);
    });

    it('should return an empty array when delivery has no shipments', () => {
      const result = getModifiedShipmentsLots({});
      expect(result).toEqual([]);
    });

    it('should return an empty array when delivery is null', () => {
      const result = getModifiedShipmentsLots(null);
      expect(result).toEqual([]);
    });
  });
});
