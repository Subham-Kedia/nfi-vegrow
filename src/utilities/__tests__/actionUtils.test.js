import { onFilterbyIdTabChange } from '../actionUtils';

describe('onFilterbyIdTabChange', () => {
  it('should return the value of the first matching object from objConst based on counts', () => {
    const counts = { pending: 100, completed: 1 };
    const objConst = {
      PENDING: { value: 'pending' },
      COMPLETED: { value: 'completed' },
    };

    const res = onFilterbyIdTabChange(counts, objConst);
    expect(res).toBe('pending');
  });

  it('should return undefined if no obj in objConst has a truthy count in counts', () => {
    const counts = { pending: 0, completed: 0 };
    const objConst = {
      PENDING: { value: 'pending' },
      COMPLETED: { value: 'completed' },
    };

    const result = onFilterbyIdTabChange(counts, objConst);
    expect(result).toBeUndefined();
  });

  it('should handle empty objConst and return undefined', () => {
    const counts = { pending: 0, completed: 0 };
    const objConst = {};

    const result = onFilterbyIdTabChange(counts, objConst);
    expect(result).toBeUndefined();
  });

  it('should handle empty counts and return undefined', () => {
    const counts = {};
    const objConst = {
      PENDING: { value: 'pending' },
      COMPLETED: { value: 'completed' },
    };

    const result = onFilterbyIdTabChange(counts, objConst);
    expect(result).toBeUndefined();
  });
});
