import { useEmbeddableState } from '@embeddable.com/react';
import { DataResponse } from '@embeddable.com/core';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { twMerge } from 'tailwind-merge';

import Container from '../../Container';
import Spinner from '../../Spinner';
import { ChevronDown, ClearIcon } from '../../icons';
import useDarkMode from '../../util/useDarkMode.js';

export type Props = {
  icon?: ReactNode;
  className?: string;
  options: DataResponse;
  unclearable?: boolean;
  inputClassName?: string;
  onChange: (v: string) => void;
  searchProperty?: string;
  filterName: string;
  minDropdownWidth?: number;
  property?: { name: string; title: string; nativeType: string; __type__: string };
  title?: string;
  defaultValue?: string;
  placeholder?: string;
  ds?: { embeddableId: string; datasetId: string; variableValues: Record<string, unknown> };
  rightNotRounded?: boolean;
};

type Record = { [key: string]: string };

let debounce: number | undefined = undefined;

export default (props: Props = { rightNotRounded: false }) => {
  const [focus, setFocus] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const [triggerBlur, setTriggerBlur] = useState(false);
  const [value, setValue] = useState(props.defaultValue);
  const [search, setSearch] = useState('');
  const [, setServerSearch] = useEmbeddableState({
    [props.searchProperty || 'search']: ''
  }) as [Record, (update: (state: Record) => Record) => void];
  const { isDarkMode, containerRef } = useDarkMode();

  // Initialize value from localStorage or fallback to default
  useEffect(() => {
    const storedValue = localStorage.getItem(props.filterName);
    setValue(storedValue && storedValue !== 'null' ? storedValue : props.defaultValue);
  }, [props.filterName, props.defaultValue]);

  // Save value to localStorage and trigger a custom event
  useEffect(() => {
    localStorage.setItem(props.filterName, value || '');
    window.dispatchEvent(new Event('localStorageUpdated'));
  }, [value, props.filterName]);

  // Reset value when defaultValue changes
  useEffect(() => {
    setValue(props.defaultValue || '');
  }, [props.defaultValue]);

  // Debounced search update
  const performSearch = useCallback(
    (newSearch: string) => {
      setSearch(newSearch);
      clearTimeout(debounce);
      debounce = window.setTimeout(() => {
        setServerSearch((state) => ({
          ...state,
          [props.searchProperty || 'search']: newSearch
        }));
      }, 500);
    },
    [setServerSearch, props.searchProperty]
  );

  // Update selected value and reset search
  const setDropdownValue = useCallback(
    (newValue: string) => {
      performSearch('');
      setValue(newValue);
      props.onChange(newValue);
    },
    [performSearch, props]
  );

  // Handle blur with a slight delay
  useLayoutEffect(() => {
    if (!triggerBlur) return;
    const timeout = setTimeout(() => {
      setFocus(false);
      setTriggerBlur(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [triggerBlur]);

  // Render dropdown items
  const list = useMemo(() => {
    return props.options?.data?.map((item, index) => {
      const itemValue = item[props.property?.name || ''] || '';
      const isSelected = value === itemValue;
      return (
        <div
          key={index}
          onClick={() => {
            setFocus(false);
            setTriggerBlur(false);
            setDropdownValue(itemValue);
          }}
          className={twMerge(
            'min-h-[36px] px-3 py-2 cursor-pointer rounded-md whitespace-nowrap overflow-hidden text-ellipsis font-normal p-transition',
            isSelected
              ? 'bg-gray-200 dark:bg-gray-600 text-secondary-500'
              : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          )}
        >
          {itemValue}
          {item.note && (
            <span className="ml-auto pl-3 text-xs opacity-70">{item.note}</span>
          )}
        </div>
      );
    }) || [];
  }, [props.options, props.property, value, setDropdownValue]);

  return (
    <div ref={containerRef}>
      <Container title={props.title} results={props.options}>
        <div
          className={twMerge(
            'relative w-full h-10 bg-white border flex items-center rounded-l-md dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300',
            props.className,
            props.rightNotRounded ? '' : 'rounded-r-md'
          )}
        >
          {/* Input for searching */}
          <input
            ref={ref}
            value={search}
            placeholder={props.placeholder}
            onFocus={() => setFocus(true)}
            onBlur={() => setTriggerBlur(true)}
            onChange={(e) => performSearch(e.target.value)}
            className={twMerge(
              'outline-none w-full h-9 px-3 text-sm leading-9 cursor-pointer bg-white border-0 rounded-md dark:bg-gray-700',
              props.inputClassName
            )}
          />

          {/* Display selected value */}
          {value && !focus && (
            <span className="absolute left-3 top-1 block w-[calc(100%-2rem)] h-8 pointer-events-none text-sm bg-white rounded-md dark:bg-gray-700">
                            {value}
                        </span>
          )}

          {/* Dropdown list */}
          {focus && (
            <div className="absolute z-50 top-11 w-full max-h-[400px] overflow-y-auto bg-white rounded-md shadow-md dark:bg-gray-700 dark:border-gray-700">
              {list}
              {list.length === 0 && search && (
                <div className="px-3 py-2 italic text-gray-300 dark:text-gray-850">
                  No results
                </div>
              )}
            </div>
          )}

          {/* Loading spinner or Chevron */}
          {props.options.isLoading ? (
            <Spinner show className="absolute right-2.5 top-2.5 w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <ChevronDown className="absolute right-2.5 top-2.5 w-5 h-5 text-gray-500 dark:text-gray-300" />
          )}

          {/* Clear button */}
          {!props.unclearable && value && (
            <div
              onClick={() => setDropdownValue('')}
              className="absolute right-10 top-0 h-10 flex items-center z-10 cursor-pointer"
            >
              <ClearIcon className="w-3 h-3 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200" />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
