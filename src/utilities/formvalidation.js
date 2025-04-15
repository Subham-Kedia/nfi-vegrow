export const validateRequired = (value) => {
  if (!(value || value?.toString()?.length)) {
    return 'Required';
  }
  return undefined;
};

export const validateArrayRequired = (value) => {
  return Array.isArray(value) && value.length > 0 ? undefined : 'Required';
};

export const validateEquals = (equalVal) => (value) => {
  if (equalVal && value && value !== equalVal) {
    return `value should be equal to ${equalVal}`;
  }
  return undefined;
};

export const validateUrl = (value) => {
  if (value) {
    const urlRegEx = /^(?:\w+:)?\/\/([^\s\\.]+\.\S{2}|localhost[\\:?\d]*)\S*$/;
    return urlRegEx.test(value) ? undefined : 'Url is not valid';
  }
  return undefined;
};

export const validateMax = (maxVal) => (value) => {
  if (maxVal && value && value > maxVal) {
    return `value should be less than or equal to ${maxVal}`;
  }
  return undefined;
};

export const validateMin = (minVal) => (value) => {
  if (!isNaN(minVal) && (value || value === 0) && value <= minVal) {
    return `Value should be greater than ${minVal}`;
  }
  return undefined;
};

export const validateMinEqual = (minVal) => (value) => {
  if (!isNaN(minVal) && (value || value === 0) && value < minVal) {
    return `Value should be greater than or equal to ${minVal}`;
  }
  return undefined;
};

export const validatePhone = (value) => {
  if (value) {
    const phoneNumber = value.toString();
    if (phoneNumber.length !== 10) {
      return 'Phone number must be 10 digit';
    }

    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber)
      ? undefined
      : 'Phone number is not valid';
  }
  return undefined;
};

export const validVehicleNumber = (value) => {
  if (value) {
    const vehicleRegex =
      /^[A-Z]{2}[- ]?\d{1,6}([ -]?[A-Z]{1,3}[- ]?\d{1,4})?$/i;
    return vehicleRegex.test(value)
      ? undefined
      : 'Vehicle number must be in format Ex: TS07EX8889 OR TS 07 EX 8889';
  }

  return undefined;
};

export const validateTransportationCost = (value) => {
  if (!value || value <= 0) {
    return 'Please enter Actual Transportation Cost';
  }
  return undefined;
};

// File upload validation
// Handles case when file is selected and removed
export const validateFileUpload = (value = []) => {
  if (!value || !value.length) {
    return 'Required';
  }
  return undefined;
};

export const minMaxCharacter = (value, min = 20, max = 100) => {
  const inputValue = value?.split(' ')?.join('')?.length;
  if (!inputValue) {
    return 'Required';
  }
  if (inputValue < min || inputValue > max) {
    return `Minimum characters should be ${min} and Maximum should be ${max}`;
  }
  return undefined;
};

export const maxFloatAllowed = (value, allowed = 2) => {
  const [, float = ''] = String(value).split('.');
  if (float.length > allowed) {
    return 'Two decimal places allowed';
  }
  return undefined;
};

export const validateMaxOrEquals = (maxVal) => (value) => {
  if (maxVal && value && value > maxVal) {
    return `value should be less than ${maxVal}`;
  }
  return undefined;
};

export const validatePositiveInteger = (val) => {
  const [, float = ''] = String(val).split('.');
  if (float.length) return 'No Decimal Allowed';
  return undefined;
};

export const validateNoDecimal = (value) => {
  if (value) {
    const reg = /^-?[0-9]*$/;
    return reg.test(+value) ? undefined : 'Decimal value not allowed';
  }
  return undefined;
};

export const validateDecimal = (isDecimal) => (value) => {
  if (isDecimal !== undefined && !isDecimal) {
    return validateNoDecimal(value);
  }
  return undefined;
};
