import { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react';
import { endOfDay, getYear } from 'date-fns';
import { CaptionProps, DayPicker, useNavigation } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { dateParser } from '@cubejs-backend/api-gateway/dist/src/dateParser.js';

import formatValue from '../../util/format';
import Container from '../../Container';
import Dropdown from '../Dropdown';
import { CalendarIcon, ChevronLeft, ChevronRight } from '../../icons';
import { toUTC, toLocal } from '../../hooks/useTimezone';
import useDarkMode from '../../util/useDarkMode.js';

// Predefined time ranges for dropdown
const ranges = [
  'Today',
  'Yesterday',
  'This week',
  'Last week',
  'Last 7 days',
  'This month',
  'Last 30 days',
  'This quarter',
  'This year',
  'Last year',
  'Custom'
];

type TimeRange = {
  to?: Date;
  from?: Date;
  relativeTimeString?: string;
};

type Props = {
  placeholder?: string;
  onChange: (v?: TimeRange) => void;
  title?: string;
  value?: TimeRange;
  hideDate?: boolean;
};

const DateRangePicker = (props: Props) => {
  const { placeholder, onChange, title, value, hideDate } = props;
  const [focus, setFocus] = useState(false); // Determines if the calendar is open
  const ref = useRef<HTMLInputElement | null>(null); // Reference to the invisible input
  const [triggerBlur, setTriggerBlur] = useState(false); // Used to manage delayed blur
  const { isDarkMode, containerRef } = useDarkMode(); // Dark mode state
  const [dropdownValue, setDropdownValue] = useState("Last 7 days"); // Selected dropdown value

  // Initialize date range based on localStorage or props
  const initRange = (): TimeRange | undefined => {
    const savedRange = localStorage.getItem('dateRange');
    const savedRangeDropdown = localStorage.getItem('dateRangeDropdown');
    let initialFrom = new Date();
    let initialTo = new Date();
    let initialRelativeTimeString = "Last 7 days";

    if (savedRange) {
      const { from, to, relativeTimeString } = JSON.parse(savedRange);
      initialFrom = toLocal(new Date(from));
      initialTo = toLocal(new Date(to));
      initialRelativeTimeString = savedRangeDropdown || relativeTimeString;
    } else if (value?.relativeTimeString) {
      const [from, to] = dateParser(value.relativeTimeString, 'UTC');
      if (from && to) {
        initialFrom = new Date(from);
        initialTo = new Date(to);
        initialRelativeTimeString = value.relativeTimeString;
      }
    }

    return { from: initialFrom, to: initialTo, relativeTimeString: initialRelativeTimeString };
  };

  const [range, setRange] = useState<TimeRange | undefined>(initRange);

  // Format the "from" and "to" dates for display
  const formatFrom = useMemo(
    () => (getYear(range?.from || new Date()) === getYear(new Date()) ? 'd MMM' : 'd MMM yyyy'),
    [range?.from]
  );

  const formatTo = useMemo(
    () => (getYear(range?.to || new Date()) === getYear(new Date()) ? 'd MMM' : 'd MMM yyyy'),
    [range?.to]
  );

  // Save the selected range to localStorage
  const updateLocalStorage = (from: Date, to: Date, relativeTimeString: string) => {
    const utcFrom = toUTC(new Date(from));
    const utcTo = toUTC(new Date(to));
    localStorage.setItem(
      'dateRange',
      JSON.stringify({
        from: utcFrom.toISOString().substring(0, 10),
        to: utcTo.toISOString().substring(0, 10),
        relativeTimeString
      })
    );
    window.dispatchEvent(new Event('localStorageUpdated'));
  };

  // Sync localStorage and dropdown value with the current range
  useEffect(() => {
    setDropdownValue(range?.relativeTimeString || "Custom");
    if (range) {
      updateLocalStorage(range.from, range.to, range.relativeTimeString || "Custom");
    }
  }, [range]);

  // Handle blur effect for dropdown with a delay
  useLayoutEffect(() => {
    if (!triggerBlur) return;

    const timeout = setTimeout(() => {
      setFocus(false);
      setTriggerBlur(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [triggerBlur]);

  return (
    <div ref={containerRef}>
      <Container title={title}>
        <div className="relative inline-flex h-10 w-full text-gray-500 text-sm dark:text-gray-300">
          {/* Dropdown for predefined ranges */}
          <Dropdown
            filterName={'dateRangeDropdown'}
            rightNotRounded
            unclearable
            placeholder={placeholder}
            className="relative w-full max-w-[120px] sm:max-w-[140px]"
            inputClassName="relative rounded-l-md w-full h-10 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 flex items-center"
            defaultValue={dropdownValue}
            onChange={(relativeTimeString) => {
              if (relativeTimeString === "Custom") {
                onChange(range);
              } else {
                const [from, to] = dateParser(relativeTimeString, 'UTC');
                if (from && to) {
                  const newRange = {
                    relativeTimeString,
                    from: new Date(from),
                    to: new Date(to)
                  };
                  setRange(newRange);
                  onChange(newRange);
                }
              }
            }}
            options={{
              isLoading: false,
              data: ranges.map((value) => ({ value }))
            }}
            property={{ name: 'value', title: '', nativeType: 'string', __type__: 'dimension' }}
          />

          {/* Calendar for custom range selection */}
          <div className="grow flex items-center p-4 bg-white p-transition hover:bg-secondary-200 cursor-pointer relative text-sm border-y border-r rounded-r-md border-gray-300 dark:bg-gray-700 dark:border-gray-700">
            <input
              ref={ref}
              onFocus={() => setFocus(true)}
              onBlur={() => setTriggerBlur(true)}
              className="absolute left-0 top-0 h-full w-full opacity-0 cursor-pointer"
            />
            <CalendarIcon className="w-5 h-5 mr-2 hidden sm:block text-gray-500 dark:text-gray-300" />
            {!hideDate && (
              <span className="overflow-hidden truncate">
                {!!range?.from && !!range?.to
                  ? `${formatValue(range.from.toJSON(), { dateFormat: formatFrom })} - ${formatValue(range.to.toJSON(), { dateFormat: formatTo })}`
                  : 'Select'}
              </span>
            )}
            {focus && (
              <DayPicker
                showOutsideDays
                className="absolute top-8 right-0 sm:right-auto sm:left-0 z-50 border bg-white rounded-md shadow px-4 py-3 text-gray-400 dark:border-gray-700 dark:bg-gray-700"
                components={{ Caption: CustomCaption }}
                weekStartsOn={1}
                mode="range"
                selected={{ from: range?.from, to: range?.to }}
                onSelect={(newRange) => {
                  if (newRange?.from && newRange?.to) {
                    newRange.to = endOfDay(newRange.to);
                    setRange({ ...newRange, relativeTimeString: 'Custom' });
                    onChange(newRange);
                  }
                  setFocus(false);
                  setTriggerBlur(false);
                }}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

// Custom calendar header for month navigation
const CustomCaption = ({ displayMonth }: CaptionProps) => {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();

  return (
    <h2 className="flex items-center">
      <button
        className="w-7 h-7 bg-white rounded border dark:bg-gray-700 dark:border-gray-700"
        disabled={!previousMonth}
        onClick={() => goToMonth(previousMonth!)}
      >
        <ChevronLeft />
      </button>
      <span className="mx-auto text-sm">
        {formatValue(displayMonth.toJSON(), { dateFormat: 'MMMM yyyy' })}
      </span>
      <button
        className="w-7 h-7 bg-white rounded border dark:bg-gray-700 dark:border-gray-700"
        disabled={!nextMonth}
        onClick={() => goToMonth(nextMonth!)}
      >
        <ChevronRight />
      </button>
    </h2>
  );
};

export default DateRangePicker;
