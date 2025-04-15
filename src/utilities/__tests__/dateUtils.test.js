import {
  addDaysToDate,
  convertUTCDateToLocalDate,
  getCurrentDate,
  getCurrentDateTimestamp,
  getCurrentNextMonthDate,
  getDate,
  getDateFormatted,
  getDateMonthFormat,
  getDateTimeInYYYYMMDD,
  getDateTimeStamp,
  getDiffInHours,
  getEndDayTimestamp,
  getEndOfMonth,
  getFormattedDate,
  getFormattedDateTime,
  getFormattedDateTimeForCSVFile,
  getFormattedDateTimeWithSecond,
  getFormattedTime,
  getMonthYearFormat,
  getStartDayTimestamp,
  getStartOfMonth,
  getThisMonthRange,
  getTodayDateTime,
  getTodayDateTimeStamp,
  getYearByDate,
  isPastDate,
  isSameDayDates,
} from '../dateUtils';

describe('dateUtils.js', () => {
  const invalidDateStr = 'invalid date string';
  const utcDate = '1970-01-01T00:00:00Z';
  let currentDate;

  beforeEach(() => {
    currentDate = new Date();
  });

  describe('convertUTCDateToLocalDate', () => {
    it('should handle invalid date string', () => {
      const localDate = convertUTCDateToLocalDate(invalidDateStr);
      expect(localDate).toBeNaN();
    });

    it('should convert valid UTC date to local date', () => {
      const localDate = convertUTCDateToLocalDate(utcDate);

      // In IST as there is a gap of 5hrs 30 mins
      // 5hrs 30 secs = 19800000 ms.
      expect(localDate).toBe(19800000);
    });
  });

  describe('getDateTimeStamp', () => {
    it('should return the correct timestamp for a given date', () => {
      const date = new Date(utcDate);
      const expectedTimestamp = date.getTime();

      const result = getDateTimeStamp(date);

      expect(result).toBe(expectedTimestamp);
    });

    it('should return NaN for an invalid date', () => {
      const invalidDate = new Date(invalidDateStr);

      const result = getDateTimeStamp(invalidDate);

      expect(result).toBeNaN();
    });
  });

  describe('isSameDayDates', () => {
    it('should return true for dates that are on the same day', () => {
      const date1 = new Date(utcDate);
      const date2 = new Date(utcDate);

      const result = isSameDayDates(date1, date2);

      expect(result).toBe(true);
    });

    it('should return false for dates that are on different days', () => {
      const date1 = new Date('2023-10-30T10:00:00Z');
      const date2 = new Date('2023-10-31T10:00:00Z');

      const result = isSameDayDates(date1, date2);

      expect(result).toBe(false);
    });

    it('should return false if one or both dates are invalid', () => {
      const date1 = new Date(utcDate);
      const invalidDate = new Date(invalidDateStr);

      expect(isSameDayDates(date1, invalidDate)).toBe(false);
      expect(isSameDayDates(invalidDate, invalidDate)).toBe(false);
    });
  });

  describe('isPastDate', () => {
    it('should return true for a date in the past', () => {
      const result = isPastDate(utcDate);
      expect(result).toBe(true);
    });

    it('should return false for a date in the future', () => {
      const result = isPastDate('2050-01-01T00:00:00Z');
      expect(result).toBe(false);
    });

    it('should return false for the current date and time', () => {
      const result = isPastDate(Date.now());
      expect(result).toBe(false);
    });

    it('should return false for an invalid date', () => {
      const result = isPastDate(invalidDateStr);
      expect(result).toBe(false);
    });
  });

  describe('addDaysToDate', () => {
    const initialDate = new Date('2024-10-30T00:00:00Z');
    it('should correctly add days to a date', () => {
      const daysToAdd = 5;
      const result = addDaysToDate(initialDate, daysToAdd);
      const expectedDate = new Date('2024-11-04T00:00:00Z');

      expect(result.toISOString()).toBe(expectedDate.toISOString());
    });

    it('should return the same date when adding zero days', () => {
      const daysToAdd = 0;
      const result = addDaysToDate(initialDate, daysToAdd);

      expect(result.toISOString()).toBe(initialDate.toISOString());
    });

    it('should correctly subtract days when adding negative days', () => {
      const daysToAdd = -10;
      const result = addDaysToDate(initialDate, daysToAdd);
      const expectedDate = new Date('2024-10-20T00:00:00Z');

      expect(result.toISOString()).toBe(expectedDate.toISOString());
    });

    it('should return "Invalid Date" for an invalid date input', () => {
      const invalidDate = new Date(invalidDateStr);
      const result = addDaysToDate(invalidDate, 5);

      expect(result.toString()).toBe('Invalid Date');
    });
  });

  describe('getFormattedDateTimeWithSecond', () => {
    it('should format a valid date correctly', () => {
      const validDate = new Date(utcDate);
      const result = getFormattedDateTimeWithSecond(validDate);

      expect(result).toBe('01 Jan 1970, 05:30:00 AM');
    });

    it('should return an empty string for an invalid date', () => {
      const invalidDate = new Date(invalidDateStr);
      const result = getFormattedDateTimeWithSecond(invalidDate);

      expect(result).toBe('');
    });

    it('should return an empty string when no date is provided', () => {
      const result = getFormattedDateTimeWithSecond();

      expect(result).toBe('');
    });
  });

  describe('getFormattedDate', () => {
    it('should format a valid date correctly', () => {
      const validDate = new Date(utcDate);
      const result = getFormattedDate(validDate);

      expect(result).toBe('01 Jan 1970');
    });

    it('should return an empty string for an invalid date', () => {
      const result = getFormattedDate(invalidDateStr);
      expect(result).toBe('');
    });

    it('should return an empty string when the input is null', () => {
      const result = getFormattedDate(null);
      expect(result).toBe('');
    });
  });

  describe('getDateFormatted', () => {
    it('should format a valid date correctly', () => {
      const validDate = new Date(utcDate);
      const result = getDateFormatted(validDate);

      expect(result).toBe('01 Jan, 05:30AM');
    });

    it('should return an empty string for an invalid date', () => {
      const result = getDateFormatted(invalidDateStr);

      expect(result).toBe('');
    });

    it('should return an empty string when the input is undefined', () => {
      const result = getDateFormatted(undefined);

      expect(result).toBe('');
    });
  });

  describe('getDateMonthFormat', () => {
    it('should format a valid date correctly', () => {
      const validDate = new Date(utcDate);
      const result = getDateMonthFormat(validDate);

      expect(result).toBe('01 Jan');
    });

    it('should return an empty string for an invalid date', () => {
      const result = getDateMonthFormat(invalidDateStr);
      expect(result).toBe('');
    });

    it('should return an empty string when the input is null', () => {
      const result = getDateMonthFormat(null);
      expect(result).toBe('');
    });
  });

  describe('getMonthYearFormat', () => {
    it('should format a valid date correctly', () => {
      const validDate = new Date(utcDate);
      const result = getMonthYearFormat(validDate);

      expect(result).toBe('Jan-1970');
    });

    it('should return an empty string for an invalid date', () => {
      const invalidDate = new Date(invalidDateStr);
      const result = getMonthYearFormat(invalidDate);

      expect(result).toBe('');
    });

    it('should return an empty string when the input is undefined', () => {
      const result = getMonthYearFormat(undefined);
      expect(result).toBe('');
    });

    it('should return an empty string when the input is null', () => {
      const result = getMonthYearFormat(null);
      expect(result).toBe('');
    });

    it('should format the current date correctly', () => {
      const result = getMonthYearFormat(currentDate);

      const year = currentDate.getFullYear();
      const month = currentDate.toLocaleString('default', { month: 'short' });

      expect(result).toBe(`${month}-${year}`);
    });
  });

  describe('getFormattedDateTime', () => {
    it('should format a valid date correctly', () => {
      const validDate = new Date(utcDate);
      const result = getFormattedDateTime(validDate);

      expect(result).toBe('01 Jan 1970, 05:30 AM');
    });

    it('should return an empty string for an invalid date', () => {
      const invalidDate = new Date(invalidDateStr);
      const result = getFormattedDateTime(invalidDate);

      expect(result).toBe('');
    });

    it('should return an empty string when the input is undefined', () => {
      const result = getFormattedDateTime(undefined);

      expect(result).toBe('');
    });

    it('should return an empty string when the input is null', () => {
      const result = getFormattedDateTime(null);

      expect(result).toBe('');
    });
  });

  describe('getDate', () => {
    it('should format a valid date correctly', () => {
      const validDate = new Date(utcDate);
      const result = getDate(validDate);

      expect(result).toBe('01/01/1970');
    });

    it('should return an empty string for an invalid date', () => {
      const invalidDate = new Date(invalidDateStr);
      const result = getDate(invalidDate);

      expect(result).toBe('');
    });

    it('should return an empty string when the input is undefined', () => {
      const result = getDate(undefined);
      expect(result).toBe('');
    });

    it('should return an empty string when the input is null', () => {
      const result = getDate(null);
      expect(result).toBe('');
    });

    it('should format the current date correctly', () => {
      const result = getDate(currentDate);

      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();

      const expectedFormat = `${day}/${month}/${year}`;

      expect(result).toBe(expectedFormat);
    });
  });

  describe('getCurrentDate', () => {
    it('should return the current date formatted as "dd MMM yyyy"', () => {
      const result = getCurrentDate();

      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = currentDate.toLocaleString('default', { month: 'short' });
      const year = currentDate.getFullYear();

      const expectedFormat = `${day} ${month} ${year}`;

      expect(result).toBe(expectedFormat);
    });
  });

  describe('getCurrentDateTimestamp', () => {
    it('should return thr current timestamp', () => {
      const result = getCurrentDateTimestamp();
      expect(result).toBe(Date.now());
    });
  });

  describe('getFormattedTime', () => {
    it('should format a valid date to "h:mm a"', () => {
      const validDate = new Date(utcDate);
      const result = getFormattedTime(validDate);

      expect(result).toBe('5:30 AM');
    });

    it('should return an empty string for an invalid date', () => {
      const result = getFormattedTime(invalidDateStr);
      expect(result).toBe('');
    });
  });

  describe('getCurrentNextMonthDate', () => {
    it('should return the date exactly one month from the current date', () => {
      const result = getCurrentNextMonthDate();

      const date = currentDate;
      date.setMonth(date.getMonth() + 1);

      expect(result.toDateString()).toBe(date.toDateString());
    });
  });

  describe('getTodayDateTimeStamp', () => {
    it('should return the correct start and end timestamps for today', () => {
      const result = getTodayDateTimeStamp();

      const expectedStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      ).getTime();

      const expectedEndDate = currentDate.getTime();

      expect(result.startDate).toBe(expectedStartDate);
      expect(result.endDate).toBe(expectedEndDate);
    });
  });

  describe('getTodayDateTime', () => {
    it('should return the correct start and end dates for today', () => {
      const result = getTodayDateTime();

      const expectedStartDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      ).getTime();

      const expectedEndDate = currentDate.getTime();

      expect(result.startDate.getTime()).toBe(expectedStartDate);
      expect(result.endDate.getTime()).toBe(expectedEndDate);
    });
  });

  describe('getStartDayTimestamp', () => {
    it('should handle dates with local time zones correctly', () => {
      const inputDate = new Date(utcDate);
      const result = getStartDayTimestamp(inputDate);

      const expectedStartOfDay = new Date(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate(),
      ).getTime();

      expect(result).toBe(expectedStartOfDay);
    });
  });

  describe('getEndDayTimestamp', () => {
    it('should return the correct timestamp for the end of the day', () => {
      const inputDate = new Date(utcDate);
      const result = getEndDayTimestamp(inputDate);

      const endOfDay = new Date(inputDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      // 19800000 is the time gap (5hrs 30 mins) between IST and UTC
      const expectedEndOfDay = endOfDay.getTime() - 19800000;

      expect(result).toBe(expectedEndOfDay);
    });
  });

  describe('getStartOfMonth', () => {
    it('should return the correct timestamp for the start of the month', () => {
      const inputDate = new Date(utcDate);
      const result = getStartOfMonth(inputDate);

      const expectedStartOfMonth = new Date(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        1,
      ).getTime();

      expect(result).toBe(expectedStartOfMonth);
    });
  });

  describe('getEndOfMonth', () => {
    it('should return the correct timestamp for the end of the month', () => {
      const inputDate = new Date(utcDate);
      const result = getEndOfMonth(inputDate);

      const endOfMonth = new Date(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        32,
      );

      endOfMonth.setUTCHours(23, 59, 59, 999);

      // 19800000 is the time gap (5hrs 30 mins) between IST and UTC
      const expectedEndOfMonth = endOfMonth.getTime() - 19800000;

      expect(result).toBe(expectedEndOfMonth);
    });
  });

  describe('getThisMonthRange', () => {
    it('should return the correct start and end dates for the current month', () => {
      const { startDate, endDate } = getThisMonthRange();

      expect(startDate.getDate()).toBe(1);
      expect(startDate.getMonth()).toBe(currentDate.getMonth());
      expect(startDate.getFullYear()).toBe(currentDate.getFullYear());

      expect(endDate).toEqual(currentDate);
    });
  });

  describe('getYearByDate', () => {
    it('should return the current year of the input date', () => {
      const result = getYearByDate(currentDate);
      expect(result).toBe(currentDate.getFullYear());
    });
  });

  describe('getDiffInHours', () => {
    it('should return empty string if either or both of start or end is invalid', () => {
      expect(getDiffInHours(invalidDateStr, currentDate)).toBe('');
      expect(getDiffInHours(invalidDateStr, invalidDateStr)).toBe('');
    });

    it('should return zero hours for the same start and end date', () => {
      const result = getDiffInHours(currentDate, currentDate);
      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        months: 0,
        seconds: 0,
        years: 0,
      });
    });

    it('should return the correct difference in hours for valid dates', () => {
      const start = new Date('2024-11-01T00:00:00Z');
      const end = new Date('2024-11-01T02:30:00Z');

      const result = getDiffInHours(start, end);

      expect(result).toEqual({
        days: 0,
        hours: 2,
        minutes: 30,
        months: 0,
        seconds: 0,
        years: 0,
      });
    });

    // I was expecting the function to give me -2 hrs
    // although the func getDiffInHours is not used today, we might need to handle where end is before start
    // currently its giving absolute diff
    it('should handle cases where the end date is before the start date', () => {
      const start = new Date('2024-11-01T02:30:00Z');
      const end = new Date('2024-11-01T00:00:00Z');

      const result = getDiffInHours(start, end);
      expect(result).toEqual({
        days: 0,
        hours: 2,
        minutes: 30,
        months: 0,
        seconds: 0,
        years: 0,
      });
    });
  });

  describe('getFormattedDateTimeForCSVFile', () => {
    it('should return formatted date string for a valid date', () => {
      const formattedDate = getFormattedDateTimeForCSVFile(new Date(utcDate));
      expect(formattedDate).toBe('01 Jan 1970 05:30 AM');
    });

    it('should return an empty string for an invalid date', () => {
      const invalidDate = new Date(invalidDateStr);
      const formattedDate = getFormattedDateTimeForCSVFile(invalidDate);
      expect(formattedDate).toBe('');
    });

    it('should return an empty string for a non-date value', () => {
      const nonDateValue = null;
      const formattedDate = getFormattedDateTimeForCSVFile(nonDateValue);
      expect(formattedDate).toBe('');
    });

    it('should return an empty string for an empty date', () => {
      const emptyDate = '';
      const formattedDate = getFormattedDateTimeForCSVFile(emptyDate);
      expect(formattedDate).toBe('');
    });
  });

  describe('getDateTimeInYYYYMMDD', () => {
    it('should return formatted date string for a valid date', () => {
      const validDate = new Date(utcDate);
      const formattedDate = getDateTimeInYYYYMMDD(validDate);
      expect(formattedDate).toBe('1970-01-01 05:30 AM');
    });

    it('should return an empty string for an invalid date', () => {
      const formattedDate = getDateTimeInYYYYMMDD(invalidDateStr);
      expect(formattedDate).toBe('');
    });

    it('should return an empty string for a non-date value', () => {
      const nonDateValue = null;
      const formattedDate = getDateTimeInYYYYMMDD(nonDateValue);
      expect(formattedDate).toBe('');
    });

    it('should return an empty string for an empty date', () => {
      const emptyDate = '';
      const formattedDate = getDateTimeInYYYYMMDD(emptyDate);
      expect(formattedDate).toBe('');
    });
  });
});
