export const validateNumbers = (val) => {
  return typeof val === 'number' && !Number.isNaN(val);
};
