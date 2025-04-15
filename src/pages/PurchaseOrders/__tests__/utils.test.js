import { getCostHeadId } from '../utils';

describe('Test the getCostHeadId function', () => {
  it('should return the ID of "NonFruit" cost head when isServicePo is false', () => {
    const costHeadsList = [
      { name: 'Fruit', id: 1 },
      { name: 'NonFruit', id: 2 },
    ];
    const selectedCostHead = { name: 'Fruit', id: 1 };
    const result = getCostHeadId(false, costHeadsList, selectedCostHead);
    expect(result).toBe(2);
  });

  it('should return the ID of selectedCostHead when isServicePo is true', () => {
    const costHeadsList = [
      { name: 'Fruit', id: 1 },
      { name: 'NonFruit', id: 2 },
    ];
    const selectedCostHead = { name: 'Service', id: 3 };
    const result = getCostHeadId(true, costHeadsList, selectedCostHead);
    expect(result).toBe(3);
  });

  it('should throw an error if selectedCostHead is undefined when isServicePo is true', () => {
    const costHeadsList = [
      { name: 'Fruit', id: 1 },
      { name: 'NonFruit', id: 2 },
    ];
    expect(() => getCostHeadId(true, costHeadsList, undefined)).toThrow();
  });

  it('should throw an error if "NonFruit" cost head is not found when isServicePo is false', () => {
    const costHeadsList = [{ name: 'Fruit', id: 1 }];
    const selectedCostHead = { name: 'Fruit', id: 1 };
    expect(() => getCostHeadId(false, costHeadsList, selectedCostHead)).toThrow();
  });
});
