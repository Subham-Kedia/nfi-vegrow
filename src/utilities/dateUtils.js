import { parseISO } from 'date-fns';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import endOfDay from 'date-fns/endOfDay';
import endOfMonth from 'date-fns/endOfMonth';
import format from 'date-fns/format';
import getTime from 'date-fns/getTime';
import getYear from 'date-fns/getYear';
import intervalToDuration from 'date-fns/intervalToDuration';
import isPast from 'date-fns/isPast';
import isSameDay from 'date-fns/isSameDay';
import isValid from 'date-fns/isValid';
import startOfDay from 'date-fns/startOfDay';
import startOfMonth from 'date-fns/startOfMonth';

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const convertUTCDateToLocalDate = (date) => {
  const dateObj = new Date(date);
  const utcDate = new Date(`${dateObj.toString()} UTC`);
  return utcDate.getTime();
};

export const getDateTimeStamp = getTime;

export const isSameDayDates = (date1, date2) => {
  return isSameDay(date1, date2);
};

export const isPastDate = (date) => {
  return isPast(parseISO(date));
};

export const addDaysToDate = (dateTime, days) => {
  return addDays(dateTime, days);
};
export function getFormattedDateTimeWithSecond(dateTime) {
  return isValid(dateTime) ? format(dateTime, 'dd MMM yyyy, hh:mm:ss a') : '';
}

export function getFormattedDate(dateTime) {
  return isValid(dateTime) ? format(dateTime, 'dd MMM yyyy') : '';
}

export function getDateFormatted(dateTime) {
  return isValid(dateTime) ? format(dateTime, 'dd MMM, hh:mma') : '';
}

export function getDateMonthFormat(dateTime) {
  return isValid(dateTime) ? format(dateTime, 'dd MMM') : '';
}

export function getMonthYearFormat(dateTime) {
  return isValid(dateTime) ? format(dateTime, 'MMM-yyyy') : '';
}

export function getFormattedDateTime(dateTime) {
  return isValid(dateTime) ? format(dateTime, 'dd MMM yyyy, hh:mm a') : '';
}

export function getDate(dateTime) {
  return isValid(dateTime) ? format(dateTime, 'dd/MM/yyyy') : '';
}

export function getCurrentDate() {
  return getFormattedDate(new Date());
}

export function getCurrentDateTimestamp() {
  return getDateTimeStamp(new Date());
}

export function getFormattedTime(dateTime) {
  return isValid(dateTime) ? format(dateTime, 'h:mm a') : '';
}

export function getCurrentNextMonthDate() {
  return addMonths(new Date(), 1);
}

export function getTodayDateTimeStamp() {
  return {
    startDate: getDateTimeStamp(startOfDay(new Date())),
    endDate: getDateTimeStamp(new Date()),
  };
}

export function getTodayDateTime() {
  return { startDate: startOfDay(new Date()), endDate: new Date() };
}
export function getStartDayTimestamp(date) {
  return getDateTimeStamp(startOfDay(new Date(date)));
}
export function getEndDayTimestamp(date) {
  return getDateTimeStamp(endOfDay(new Date(date)));
}

export function getStartOfMonth(date) {
  return getDateTimeStamp(startOfMonth(new Date(date)));
}
export function getEndOfMonth(date) {
  return getDateTimeStamp(endOfMonth(new Date(date)));
}

export function getThisMonthRange() {
  return { startDate: startOfMonth(new Date()), endDate: new Date() };
}

export function getYearByDate(date) {
  return getYear(date);
}

export function getDiffInHours(start, end) {
  if (!isValid(start) || !isValid(end)) {
    return '';
  }
  return intervalToDuration({
    start,
    end,
  });
}

export function getFormattedDateTimeForCSVFile(dateTime) {
  return isValid(dateTime) ? format(dateTime, 'dd MMM yyyy hh:mm a') : '';
}
export const getDateTimeInYYYYMMDD = (dateTime) => {
  return isValid(dateTime) ? format(dateTime, 'yyyy-MM-dd hh:mm a') : '';
};
