import React, { useMemo, useEffect, useState } from 'react';
import { Measure, DataResponse } from '@embeddable.com/core';

import useFont from '../../hooks/useFont';
import '../../index.css';
import Title from '../../Title';
import Spinner from '../../Spinner';
import { WarningIcon } from '../../icons';
import useDarkMode from '../../util/useDarkMode';

type Props = {
  title?: string;
  value: DataResponse;
  metric: Measure;
  suffix?: string;
  prefix?: string;
  color?: string;
  filterName?: string;
  filterValue?: string;
};

const KPIComponent: React.FC<Props> = (props) => {
  const { isDarkMode, containerRef } = useDarkMode();

  // Load custom fonts
  useFont();

  const [href, setHref] = useState<string>('/packages');

  // Update the href dynamically based on localStorage and props
  useEffect(() => {
    const updateHref = () => {
      const dateRange = localStorage.getItem('dateRange');
      const carrier = localStorage.getItem('carrier');
      let url = '/packages';

      if (dateRange) {
        const { from, to } = JSON.parse(dateRange);
        url += `?from=${from}&to=${to}`;
      }

      if (carrier && carrier !== 'All' && carrier !== 'null' && props.filterName !== 'carrier') {
        url += `${url.includes('?') ? '&' : '?'}carrier=${encodeURIComponent(carrier)}`;
      }

      url += `${url.includes('?') ? '&' : '?'}${encodeURIComponent(props.filterName)}=${encodeURIComponent(props.filterValue)}`;

      setHref(url);
    };

    updateHref();

    const handleLocalStorageUpdate = () => {
      updateHref();
    };

    window.addEventListener('localStorageUpdated', handleLocalStorageUpdate);

    return () => {
      window.removeEventListener('localStorageUpdated', handleLocalStorageUpdate);
    };
  }, [props]);

  // Format the KPI value
  const formattedValue = useMemo(() => {
    if (!props.value?.data?.length || !props.metric?.name) return;

    const rawValue = props.value.data[0][props.metric.name];
    const numericValue = parseFloat(rawValue);

    // Return raw value if parsing fails
    if (rawValue !== `${numericValue}`) return rawValue;

    // Format numeric value
    return new Intl.NumberFormat('en-US', { useGrouping: true }).format(numericValue);
  }, [props]);

  const Wrapper = props.filterName ? 'a' : 'div';
  const wrapperProps = props.filterName ? { href } : {};

  // Handle error state
  if (props.value?.error) {
    return (
      <div className="h-full flex items-center justify-center font-embeddable text-sm">
        <WarningIcon />
        <div className="whitespace-pre-wrap p-4 max-w-sm text-xs">{props.value.error}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full">
      <Wrapper
        {...wrapperProps}
        className="relative h-full flex flex-col justify-start font-embeddable text-sm p-4 rounded-md shadow transition-all ease-in-out duration-150 border bg-white hover:border-secondary-500 hover:shadow-lg dark:bg-gray-800 dark:border-gray-800 dark:hover:border-secondary-600"
      >
        <Title title={props.title} color={props.color} />
        <Spinner
          show={props.value?.isLoading}
          className="absolute right-4 top-4 h-5 w-5 text-gray-300 dark:text-gray-600"
        />
        <div className="relative grow items-center justify-center flex min-h-[40px]">
          <div className="flex items-center justify-center font-embeddable text-gray-500 text-[40px] font-bold dark:text-gray-300">
            {props.prefix}
            {formattedValue || 0}
            {props.suffix}
          </div>
          {props.value?.isLoading && !props.value?.data?.length && (
            <div className="absolute left-0 top-0 w-full h-full z-10 skeleton-box bg-gray-300 overflow-hidden rounded dark:bg-gray-700" />
          )}
        </div>
      </Wrapper>
    </div>
  );
};

export default KPIComponent;
