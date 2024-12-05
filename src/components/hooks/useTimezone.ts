import { TimeRange } from '@embeddable.com/core';
import { addMinutes, subMinutes, parseJSON } from 'date-fns';

/**
 * Parses a date string into a timestamp in milliseconds (adjusted for UTC offset).
 * @param dateStr - The date string to parse.
 * @returns The timestamp in milliseconds adjusted to UTC.
 */
export function parseTime(dateStr: string): number {
  const date: Date = parseJSON(dateStr);
  return date.valueOf() + date.getTimezoneOffset() * 60000; // Adjust for the timezone offset
}

/**
 * Converts a time range's `from` and `to` dates to UTC.
 * @param range - The time range to convert.
 * @returns The time range with UTC `from` and `to` dates.
 */
export function timeRangeToUTC(range?: TimeRange): TimeRange | undefined {
  if (!range?.to || !range?.from) return range;

  return {
    ...range,
    to: toUTC(range.to),
    from: toUTC(range.from),
  };
}

/**
 * Converts a time range's `from` and `to` dates to local time.
 * @param range - The time range to convert.
 * @returns The time range with local `from` and `to` dates.
 */
export function timeRangeToLocal(range?: TimeRange): TimeRange | undefined {
  if (!range?.to || !range?.from) return range;

  return {
    ...range,
    to: toLocal(range.to),
    from: toLocal(range.from),
  };
}

/**
 * Converts a date to UTC by subtracting the timezone offset.
 * @param date - The date to convert.
 * @returns The UTC-adjusted date.
 */
export function toUTC(date: string | Date): Date | undefined {
  const parsedDate = date instanceof Date ? date : new Date(date);
  return parsedDate ? subMinutes(parsedDate, parsedDate.getTimezoneOffset()) : undefined;
}

/**
 * Converts a date to local time by adding the timezone offset.
 * @param date - The date to convert.
 * @returns The local time-adjusted date.
 */
export function toLocal(date: string | Date): Date | undefined {
  const parsedDate = date instanceof Date ? date : new Date(date);
  return parsedDate ? addMinutes(parsedDate, parsedDate.getTimezoneOffset()) : undefined;
}
