import { format as formatDate, parseJSON } from 'date-fns';

type Type = 'number' | 'date' | 'string';

type Options = {
  type?: Type; // The type of the value to format: 'number', 'date', or 'string'.
  truncate?: number; // Maximum length for truncation.
  dateFormat?: string; // Format string for date values.
  meta?: { prefix?: string; suffix?: string }; // Optional prefix and suffix to wrap the value.
};

const numberFormatter = new Intl.NumberFormat();
const dateFormatter = new Intl.DateTimeFormat();

/**
 * Formats a string based on the provided type and options.
 * @param str - The string to format.
 * @param opt - Options or type to specify how the string should be formatted.
 * @returns The formatted string.
 */
export default function format(str: string = '', opt: Type | Options = 'string'): string {
  const { type, dateFormat, meta, truncate }: Options =
    typeof opt === 'string' ? { type: opt } : opt;

  str = str || ''; // Fallback to an empty string if no value is provided.

  if (type === 'number') {
    // Format as a number.
    return wrap(numberFormatter.format(parseFloat(str)));
  }

  if (type === 'date') {
    // Handle ISO date strings ending at midnight.
    if (str.endsWith('T00:00:00.000')) {
      return wrap(dateFormatter.format(new Date(str)));
    }
    // Fallback for general date strings.
    return wrap(new Date(str).toLocaleString());
  }

  if (truncate) {
    // Truncate the string if it exceeds the specified length.
    return str.length > truncate
      ? `${meta?.prefix || ''}${str.substring(0, truncate)}...`
      : wrap(str);
  }

  if (dateFormat) {
    // Custom date formatting using date-fns.
    return wrap(formatDate(parseJSON(str), dateFormat));
  }

  // Default case: Return the string as-is.
  return wrap(str);

  /**
   * Wraps the value with optional prefix and suffix from meta.
   * @param value - The value to wrap.
   * @returns The wrapped value.
   */
  function wrap(value: string): string {
    return `${meta?.prefix || ''}${value}${meta?.suffix || ''}`;
  }
}
