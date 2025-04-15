import { PO_STATUS } from 'Utilities/constants';

import {
  isDraft,
  isGrnClosed,
  isPendingApproval,
  isRejected,
} from '../../utils';

const { getPOAddEditPageTitle } = require('Pages/PurchaseOrders/utils');

describe('Test the getPOAddEditPageTitle function', () => {
  it('should return "Purchase Order - id" in read only mode', () => {
    const title = getPOAddEditPageTitle(true, 1111);
    expect(title).toBe('Purchase Order - 1111');
  });

  it('should return "Edit Purchase Order - id" in edit mode', () => {
    const title = getPOAddEditPageTitle(false, 1111);
    expect(title).toBe('Edit Purchase Order - 1111');
  });

  // in create mode isReadOnly will be false and id wont be available
  it('should return "Add Purchase Order" in create mode', () => {
    const title = getPOAddEditPageTitle(false, undefined);
    expect(title).toBe('Add Purchase Order');
  });
});

describe('PO Status Utility Functions', () => {
  describe('isPendingApproval', () => {
    it('should return true when status is PENDING_APPROVAL', () => {
      expect(isPendingApproval(PO_STATUS.PENDING_APPROVAL.value)).toBe(true);
    });

    it('should return false when status is not PENDING_APPROVAL', () => {
      expect(isPendingApproval(PO_STATUS.REJECTED.value)).toBe(false);
    });
  });

  describe('isRejected', () => {
    it('should return true when status is REJECTED', () => {
      expect(isRejected(PO_STATUS.REJECTED.value)).toBe(true);
    });

    it('should return false when status is not REJECTED', () => {
      expect(isRejected(PO_STATUS.PENDING_APPROVAL.value)).toBe(false);
    });
  });

  describe('isGrnClosed', () => {
    it('should return true when status is GRN_CLOSED', () => {
      expect(isGrnClosed(PO_STATUS.GRN_CLOSED.value)).toBe(true);
    });

    it('should return false when status is not GRN_CLOSED', () => {
      expect(isGrnClosed(PO_STATUS.DRAFT.value)).toBe(false);
    });
  });

  describe('isDraft', () => {
    it('should return true when status is DRAFT', () => {
      expect(isDraft(PO_STATUS.DRAFT.value)).toBe(true);
    });

    it('should return false when status is not DRAFT', () => {
      expect(isDraft(PO_STATUS.GRN_CLOSED.value)).toBe(false);
    });
  });
});
