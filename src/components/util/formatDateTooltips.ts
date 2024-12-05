import { format } from 'date-fns';
import { DATE_DISPLAY_FORMATS } from '../constants';

/**
 * Formats dates for tooltips based on granularity.
 * @param lines - An array of line data containing parsed dates.
 * @param granularity - The granularity used to determine the date format.
 * @returns An array of formatted dates or an empty array if formatting fails.
 */
export default function formatDateTooltips(lines: any[], granularity: string): string[] {
  if (!lines || !granularity) {
    console.warn('Invalid input to formatDateTooltips: lines or granularity is missing.');
    return [];
  }

  // Extract and deduplicate the parsed x-axis values from the lines
  const uniqueDates = [...new Set(lines.map((line) => line?.parsed?.x?.valueOf()))];

  // Log an issue if all values are undefined
  if (uniqueDates.length === 1 && uniqueDates[0] === undefined) {
    console.error('Problem formatting dates in tooltip: all values are undefined.');
    return [];
  }

  // Format each unique date using the provided granularity's date format
  return uniqueDates
    .filter((date) => !!date) // Remove falsy values (e.g., undefined, null)
    .map((date) => format(new Date(date), DATE_DISPLAY_FORMATS[granularity] || 'yyyy-MM-dd')); // Default format if granularity is invalid
}
