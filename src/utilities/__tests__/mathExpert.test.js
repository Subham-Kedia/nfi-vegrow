import { validateNumbers } from '../mathExpert';

describe('validateNumbers', () => {
  it('should return true for valid numbers', () => {
    expect(validateNumbers(0)).toBe(true);
    expect(validateNumbers(42)).toBe(true);
    expect(validateNumbers(-42)).toBe(true);
    expect(validateNumbers(3.14)).toBe(true);
    expect(validateNumbers(-3.14)).toBe(true);
    expect(validateNumbers(+'-3.14')).toBe(true);
  });

  it('should return false for invalid numbers', () => {
    expect(validateNumbers(NaN)).toBe(false);
    expect(validateNumbers(undefined)).toBe(false);
    expect(validateNumbers(null)).toBe(false);
    expect(validateNumbers('42')).toBe(false);
    expect(validateNumbers({})).toBe(false);
    expect(validateNumbers([])).toBe(false);
    expect(validateNumbers(() => {})).toBe(false);
  });

  it('should return true for special cases', () => {
    expect(validateNumbers(Infinity)).toBe(true);
    expect(validateNumbers(-Infinity)).toBe(true);
  });
});
