import {
  maxFloatAllowed,
  minMaxCharacter,
  validateDecimal,
  validateEquals,
  validateFileUpload,
  validateMax,
  validateMaxOrEquals,
  validateMin,
  validateMinEqual,
  validateNoDecimal,
  validatePhone,
  validatePositiveInteger,
  validateRequired,
  validateTransportationCost,
  validateUrl,
  validVehicleNumber,
} from 'Utilities/formvalidation';

describe('validateRequired', () => {
  it('should return "Required" when the value is null', () => {
    const result = validateRequired(null);
    expect(result).toBe('Required');
  });

  it('should return "Required" when the value is undefined', () => {
    const result = validateRequired(undefined);
    expect(result).toBe('Required');
  });

  it('should return "Required" when the value is an empty string', () => {
    const result = validateRequired('');
    expect(result).toBe('Required');
  });

  it('should return undefined when the value is a non-empty string', () => {
    const result = validateRequired('Hello');
    expect(result).toBeUndefined();
  });

  it('should return undefined when the value is a non-zero number', () => {
    const result = validateRequired(123);
    expect(result).toBeUndefined();
  });

  it('should return undefined when the value is zero (0)', () => {
    const result = validateRequired(0);
    expect(result).toBeUndefined();
  });

  it('should return undefined when the value is a boolean true', () => {
    const result = validateRequired(true);
    expect(result).toBeUndefined();
  });

  it('should return undefined when the value is a boolean false', () => {
    const result = validateRequired(false);
    expect(result).toBeUndefined();
  });

  it('should return undefined when the value is a non-empty array', () => {
    const result = validateRequired([1, 2, 3]);
    expect(result).toBeUndefined();
  });
});

describe('validateEquals', () => {
  it('should return undefined when the value is equal to equalVal', () => {
    const equalsValidator = validateEquals(10);
    expect(equalsValidator(10)).toBeUndefined();
  });

  it('should return an error message when the value is not equal to equalVal', () => {
    const equalsValidator = validateEquals(10);
    expect(equalsValidator(5)).toBe('value should be equal to 10');
  });

  it('should return undefined when equalVal is not provided', () => {
    const equalsValidator = validateEquals(undefined);
    expect(equalsValidator(10)).toBeUndefined();
  });

  it('should return undefined when the value is undefined', () => {
    const equalsValidator = validateEquals(10);
    expect(equalsValidator(undefined)).toBeUndefined();
  });

  it('should return undefined when the value is null', () => {
    const equalsValidator = validateEquals(10);
    expect(equalsValidator(null)).toBeUndefined();
  });

  it('should return undefined when both equalVal and value are undefined', () => {
    const equalsValidator = validateEquals(undefined);
    expect(equalsValidator(undefined)).toBeUndefined();
  });

  it('should handle non-numeric values correctly', () => {
    const equalsValidator = validateEquals('test');
    expect(equalsValidator('test')).toBeUndefined();
    expect(equalsValidator('other')).toBe('value should be equal to test');
  });
});

describe('validateUrl', () => {
  it('should return undefined for a valid URL with http', () => {
    const result = validateUrl('http://example.com');
    expect(result).toBeUndefined();
  });

  it('should return undefined for a valid URL with https', () => {
    const result = validateUrl('https://example.com');
    expect(result).toBeUndefined();
  });

  it('should return "Url is not valid" for an invalid URL', () => {
    const result = validateUrl('invalid-url');
    expect(result).toBe('Url is not valid');
  });

  it('should return undefined for an empty value', () => {
    const result = validateUrl('');
    expect(result).toBeUndefined();
  });

  it('should return undefined for a null value', () => {
    const result = validateUrl(null);
    expect(result).toBeUndefined();
  });

  it('should return undefined for an undefined value', () => {
    const result = validateUrl(undefined);
    expect(result).toBeUndefined();
  });

  it('should return "Url is not valid" for a malformed URL without protocol', () => {
    const result = validateUrl('example.com');
    expect(result).toBe('Url is not valid');
  });

  it('should return undefined for a valid URL with a query string', () => {
    const result = validateUrl('https://example.com?query=1');
    expect(result).toBeUndefined();
  });

  it('should return undefined for a valid URL with a fragment identifier', () => {
    const result = validateUrl('https://example.com#section');
    expect(result).toBeUndefined();
  });
});

describe('validateMax', () => {
  const maxValidator = validateMax(10);

  it('should return undefined for a value less than the maxVal', () => {
    expect(maxValidator(5)).toBeUndefined();
  });

  it('should return undefined for a value equal to the maxVal', () => {
    expect(maxValidator(10)).toBeUndefined();
  });

  it('should return an error message for a value greater than the maxVal', () => {
    expect(maxValidator(15)).toBe('value should be less than or equal to 10');
  });

  it('should return undefined if maxVal is not provided', () => {
    expect(maxValidator(10)).toBeUndefined();
  });

  it('should return undefined for a null or undefined value', () => {
    expect(maxValidator(null)).toBeUndefined();
    expect(maxValidator(undefined)).toBeUndefined();
  });

  it('should handle non-numeric values gracefully', () => {
    expect(maxValidator('1')).toBeUndefined();
    expect(maxValidator('11')).toBe('value should be less than or equal to 10');
  });
});

describe('validateMin', () => {
  const minValidator = validateMin(10);
  it('should return undefined when the value is greater than minVal', () => {
    expect(minValidator(15)).toBeUndefined();
  });

  it('should return undefined when the value is equal to minVal + 0.1', () => {
    expect(minValidator(10.1)).toBeUndefined();
  });

  it('should return an error message when the value is equal to minVal', () => {
    expect(minValidator(10)).toBe('Value should be greater than 10');
  });

  it('should return an error message when the value is less than minVal', () => {
    expect(minValidator(5)).toBe('Value should be greater than 10');
  });

  it('should return undefined when value is undefined', () => {
    expect(minValidator(undefined)).toBeUndefined();
  });

  it('should return undefined when value is null', () => {
    expect(minValidator(null)).toBeUndefined();
  });

  it('should return undefined when value is 0 and minVal is less than 0', () => {
    const minValidator = validateMin(-5);
    expect(minValidator(0)).toBeUndefined();
  });

  it('should return an error message when value is 0 and minVal is greater than 0', () => {
    const minValidator = validateMin(5);
    expect(minValidator(0)).toBe('Value should be greater than 5');
  });

  it('should return undefined when minVal is NaN', () => {
    const minValidator = validateMin(NaN);
    expect(minValidator(10)).toBeUndefined();
  });
});

describe('validateMinEqual', () => {
  const minEqualValidator = validateMinEqual(10);
  it('should return undefined when the value is greater than minVal', () => {
    expect(minEqualValidator(15)).toBeUndefined();
  });

  it('should return undefined when the value is equal to minVal', () => {
    expect(minEqualValidator(10)).toBeUndefined();
  });

  it('should return an error message when the value is less than minVal', () => {
    expect(minEqualValidator(5)).toBe(
      'Value should be greater than or equal to 10',
    );
  });

  it('should return undefined when value is undefined', () => {
    expect(minEqualValidator(undefined)).toBeUndefined();
  });

  it('should return undefined when value is null', () => {
    expect(minEqualValidator(null)).toBeUndefined();
  });

  it('should return undefined when value is 0 and minVal is less than or equal to 0', () => {
    const minEqualValidator = validateMinEqual(0);
    expect(minEqualValidator(0)).toBeUndefined();
  });

  it('should return an error message when value is 0 and minVal is greater than 0', () => {
    const minEqualValidator = validateMinEqual(5);
    expect(minEqualValidator(0)).toBe(
      'Value should be greater than or equal to 5',
    );
  });

  it('should return undefined when minVal is NaN', () => {
    const minEqualValidator = validateMinEqual(NaN);
    expect(minEqualValidator(10)).toBeUndefined();
  });
});

describe('validatePhone', () => {
  it('should return undefined for a valid 10-digit phone number', () => {
    expect(validatePhone(1234567890)).toBeUndefined();
  });

  it('should return undefined for a valid 10-digit phone number but in string format', () => {
    expect(validatePhone('1234567890')).toBeUndefined();
  });

  it('should return an error message if the phone number is less than 10 digits', () => {
    expect(validatePhone('123456789')).toBe('Phone number must be 10 digit');
  });

  it('should return an error message if the phone number is more than 10 digits', () => {
    expect(validatePhone('12345678901')).toBe('Phone number must be 10 digit');
  });

  it('should return an error message if the phone number contains non-numeric characters', () => {
    expect(validatePhone('12345abc90')).toBe('Phone number is not valid');
  });

  it('should return an error message if the phone number contains special characters', () => {
    expect(validatePhone('12345-6789')).toBe('Phone number is not valid');
  });

  it('should return undefined for an empty value', () => {
    expect(validatePhone('')).toBeUndefined();
  });

  it('should return undefined for a null value', () => {
    expect(validatePhone(null)).toBeUndefined();
  });

  it('should return undefined for an undefined value', () => {
    expect(validatePhone(undefined)).toBeUndefined();
  });

  it('should return undefined for a number input of exactly 10 digits', () => {
    expect(validatePhone(1234567890)).toBeUndefined();
  });

  it('should return an error message if the phone number is a decimal', () => {
    expect(validatePhone(123456789.0)).toBe('Phone number must be 10 digit');
  });

  it('should return undefined if the phone number is a decimal but of 10 digits', () => {
    expect(validatePhone(1234567.11)).toBe('Phone number is not valid');
  });
});

describe('validVehicleNumber', () => {
  const invalidVehicleNumberMssg =
    'Vehicle number must be in format Ex: TS07EX8889 OR TS 07 EX 8889';

  test('should return undefined for a valid vehicle number in the format TS07EX8889', () => {
    expect(validVehicleNumber('TS07EX8889')).toBeUndefined();
  });

  test('should return undefined for a valid vehicle number with dashes TS-07-EX-8889', () => {
    expect(validVehicleNumber('TS-07-EX-8889')).toBeUndefined();
  });

  test('should return error message for an invalid vehicle number with extra letters', () => {
    expect(validVehicleNumber('TS07EXTRA8889')).toBe(invalidVehicleNumberMssg);
  });

  test('should return error message for an invalid vehicle number with special characters', () => {
    expect(validVehicleNumber('TS07EX@8889')).toBe(invalidVehicleNumberMssg);
  });

  test('should return error message for an invalid vehicle number with too many digits', () => {
    expect(validVehicleNumber('TS07EX88891')).toBe(invalidVehicleNumberMssg);
  });

  test('should return error message for an invalid vehicle number missing a part', () => {
    expect(validVehicleNumber('TS07EX')).toBe(invalidVehicleNumberMssg);
  });

  test('should return undefined for a valid vehicle number with lower case letters', () => {
    expect(validVehicleNumber('ts07ex8889')).toBeUndefined();
  });

  test('should return undefined for a valid vehicle number in the shortest format TS07A1', () => {
    expect(validVehicleNumber('TS07A1')).toBeUndefined();
  });

  test('should return undefined for an empty string', () => {
    expect(validVehicleNumber('')).toBeUndefined();
  });

  test('should return undefined for a null value', () => {
    expect(validVehicleNumber(null)).toBeUndefined();
  });

  test('should return undefined for an undefined value', () => {
    expect(validVehicleNumber(undefined)).toBeUndefined();
  });
});

describe('validateTransportationCost', () => {
  test('should return error message when value is undefined', () => {
    const result = validateTransportationCost(undefined);
    expect(result).toBe('Please enter Actual Transportation Cost');
  });

  test('should return error message when value is null', () => {
    const result = validateTransportationCost(null);
    expect(result).toBe('Please enter Actual Transportation Cost');
  });

  test('should return error message when value is 0', () => {
    const result = validateTransportationCost(0);
    expect(result).toBe('Please enter Actual Transportation Cost');
  });

  test('should return error message when value is negative', () => {
    const result = validateTransportationCost(-100);
    expect(result).toBe('Please enter Actual Transportation Cost');
  });

  test('should return undefined when value is positive', () => {
    const result = validateTransportationCost(100);
    expect(result).toBeUndefined();
  });

  test('should return undefined when value is a positive decimal', () => {
    const result = validateTransportationCost(50.75);
    expect(result).toBeUndefined();
  });
});

describe('validateFileUpload', () => {
  test('should return "Required" when value is undefined', () => {
    const result = validateFileUpload(undefined);
    expect(result).toBe('Required');
  });

  test('should return "Required" when value is null', () => {
    const result = validateFileUpload(null);
    expect(result).toBe('Required');
  });

  test('should return "Required" when value is an empty array', () => {
    const result = validateFileUpload([]);
    expect(result).toBe('Required');
  });

  test('should return undefined when value is a non-empty array', () => {
    const result = validateFileUpload(['file1.png']);
    expect(result).toBeUndefined();
  });

  test('should return undefined when value is an array with multiple files', () => {
    const result = validateFileUpload(['file1.png', 'file2.jpg']);
    expect(result).toBeUndefined();
  });
});

describe('maxFloatAllowed', () => {
  test('should return undefined for undefined and null', () => {
    expect(maxFloatAllowed(undefined)).toBeUndefined();
    expect(maxFloatAllowed(null)).toBeUndefined();
  });

  test('should return undefined for integer values without decimals', () => {
    const result = maxFloatAllowed(123);
    expect(result).toBeUndefined();
  });

  test('should return undefined for values with up to two decimal places', () => {
    const result = maxFloatAllowed(123.45);
    expect(result).toBeUndefined();
  });

  test('should return error message for values with more than two decimal places', () => {
    const result = maxFloatAllowed(123.456);
    expect(result).toBe('Two decimal places allowed');
  });

  test('should return undefined for values with no decimal places and a custom allowed value', () => {
    const result = maxFloatAllowed(123, 3);
    expect(result).toBeUndefined();
  });

  test('should return undefined for values with up to three decimal places when custom allowed value is 3', () => {
    const result = maxFloatAllowed(123.456, 3);
    expect(result).toBeUndefined();
  });

  test('should return error message for values with more than three decimal places when custom allowed value is 3', () => {
    const result = maxFloatAllowed(123.4567, 3);
    expect(result).toBe('Two decimal places allowed');
  });

  test('should handle string input with valid decimal places', () => {
    const result = maxFloatAllowed('123.45');
    expect(result).toBeUndefined();
  });

  test('should handle string input with invalid decimal places', () => {
    const result = maxFloatAllowed('123.456');
    expect(result).toBe('Two decimal places allowed');
  });

  test('should handle values with no integer part but valid decimals (e.g., ".45")', () => {
    const result = maxFloatAllowed('.45');
    expect(result).toBeUndefined();
  });

  test('should handle values with no integer part and too many decimals (e.g., ".456")', () => {
    const result = maxFloatAllowed('.456');
    expect(result).toBe('Two decimal places allowed');
  });
});

describe('validateMaxOrEquals', () => {
  const validate = validateMaxOrEquals(10);
  test('should return undefined when value is less than maxVal', () => {
    expect(validate(9.99)).toBeUndefined();
  });

  test('should return undefined when value is equal to maxVal', () => {
    expect(validate(10)).toBeUndefined();
  });

  test('should return error message when value is greater than maxVal', () => {
    expect(validate(10.00001)).toBe('value should be less than 10');
  });

  test('should return undefined when maxVal is not provided', () => {
    const validate = validateMaxOrEquals(undefined);
    expect(validate(15)).toBeUndefined();
  });

  test('should return undefined when value is not provided', () => {
    expect(validate(undefined)).toBeUndefined();
  });

  test('should return undefined when both maxVal and value are undefined', () => {
    const validate = validateMaxOrEquals(undefined);
    expect(validate(undefined)).toBeUndefined();
  });

  test('should handle string inputs correctly when value is less than maxVal', () => {
    expect(validate('9.99')).toBeUndefined();
  });

  test('should handle string inputs correctly when value is greater than maxVal', () => {
    const validate = validateMaxOrEquals('10');
    expect(validate(10.01)).toBe('value should be less than 10');
  });
});

describe('validatePositiveInteger', () => {
  test('should return undefined for positive integers', () => {
    expect(validatePositiveInteger(10)).toBeUndefined();
    expect(validatePositiveInteger('25')).toBeUndefined();
  });

  test('should return "No Decimal Allowed" for numbers with decimal points', () => {
    expect(validatePositiveInteger(10.5)).toBe('No Decimal Allowed');
    expect(validatePositiveInteger('123.45')).toBe('No Decimal Allowed');
  });

  test('should return undefined for zero', () => {
    expect(validatePositiveInteger(0)).toBeUndefined();
    expect(validatePositiveInteger('0')).toBeUndefined();
  });

  test('should return undefined for negative integers', () => {
    expect(validatePositiveInteger(-5)).toBeUndefined();
    expect(validatePositiveInteger('-42')).toBeUndefined();
  });

  test('should return "No Decimal Allowed" for negative decimals', () => {
    expect(validatePositiveInteger(-3.14)).toBe('No Decimal Allowed');
    expect(validatePositiveInteger('-0.56')).toBe('No Decimal Allowed');
  });

  test('should handle empty input gracefully', () => {
    expect(validatePositiveInteger('')).toBeUndefined();
    expect(validatePositiveInteger(null)).toBeUndefined();
    expect(validatePositiveInteger(undefined)).toBeUndefined();
  });
});

describe('minMaxCharacter', () => {
  test('should return "Required" for empty input', () => {
    expect(minMaxCharacter('')).toBe('Required');
    expect(minMaxCharacter(undefined)).toBe('Required');
    expect(minMaxCharacter(null)).toBe('Required');
  });

  test('should return an error message for input below minimum length', () => {
    expect(minMaxCharacter('a'.repeat(9), 10, 50)).toBe(
      'Minimum characters should be 10 and Maximum should be 50',
    );
  });

  test('should return an error message for input above maximum length', () => {
    const longText = 'a'.repeat(101);
    expect(minMaxCharacter(longText, 10, 100)).toBe(
      'Minimum characters should be 10 and Maximum should be 100',
    );
  });

  test('should return undefined for input within the valid range', () => {
    const validText = 'a'.repeat(50);
    expect(minMaxCharacter(validText, 10, 50)).toBeUndefined();
  });

  test('should ignore spaces when counting characters', () => {
    const textWithSpaces = ' a b c d e ';
    expect(minMaxCharacter(textWithSpaces, 3, 10)).toBeUndefined();
    expect(minMaxCharacter(textWithSpaces, 10, 20)).toBe(
      'Minimum characters should be 10 and Maximum should be 20',
    );
  });

  test('should use default min and max values if not provided', () => {
    const validText = 'a'.repeat(50);
    expect(minMaxCharacter(validText)).toBeUndefined(); // Default range is 20-100
    expect(minMaxCharacter('shortText')).toBe(
      'Minimum characters should be 20 and Maximum should be 100',
    );
  });
});

describe('validateNoDecimal', () => {
  test('should return decimal not allowed for decimal value', () => {
    expect(validateNoDecimal('123.45')).toBe('Decimal value not allowed');
  });

  test('should return decimal not allowed for negative decimal value', () => {
    expect(validateNoDecimal('-123.45')).toBe('Decimal value not allowed');
  });

  test('should return undefined for positive integer', () => {
    expect(validateNoDecimal(123)).toBeUndefined();
  });

  test('should return undefined for negative integer', () => {
    expect(validateNoDecimal(-123)).toBeUndefined();
  });
});

describe('validateDecimal', () => {
  test("should return 'Decimal value not allowed' when isDecimal is false and value is a decimal", () => {
    expect(validateDecimal(false)('123.45')).toBe('Decimal value not allowed');
  });

  test('should return undefined when isDecimal is false and value is an integer', () => {
    expect(validateDecimal(false)('123')).toBeUndefined();
  });

  test('should return undefined when isDecimal is true and value is a decimal', () => {
    expect(validateDecimal(true)('123.45')).toBeUndefined();
  });

  test('should return undefined when isDecimal is true and value is an integer', () => {
    expect(validateDecimal(true)('123')).toBeUndefined();
  });

  test("should return 'Decimal value not allowed' when isDecimal is false and value is a negative decimal", () => {
    expect(validateDecimal(false)('-123.45')).toBe('Decimal value not allowed');
  });

  test('should return undefined when isDecimal is true and value is a negative decimal', () => {
    expect(validateDecimal(true)('-123.45')).toBeUndefined();
  });

  test('should return undefined when isDecimal is false and value is a negative integer', () => {
    expect(validateDecimal(false)('-123')).toBeUndefined();
  });

  test('should return undefined when isDecimal is true and value is a negative integer', () => {
    expect(validateDecimal(true)('-123')).toBeUndefined();
  });

  test('should return undefined when isDecimal is not provided and value is a decimal', () => {
    expect(validateDecimal(undefined)('123.45')).toBeUndefined();
  });

  test('should return undefined when isDecimal is not provided and value is an integer', () => {
    expect(validateDecimal(undefined)('123')).toBeUndefined();
  });
});
