import { Dimension, Granularity } from '@embeddable.com/core';
import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addQuarters,
  addSeconds,
  addWeeks,
  addYears,
  parseJSON,
} from 'date-fns';
import { useCallback } from 'react';

type Record = { [key: string]: string };

// Mapping of granularity to corresponding date-fns add functions
const addTime: { [granularity: string]: (date: Date | number, amount: number) => Date } = {
  second: addSeconds,
  minute: addMinutes,
  hour: addHours,
  day: addDays,
  week: addWeeks,
  month: addMonths,
  quarter: addQuarters,
  year: addYears,
};

/**
 * Hook to fill gaps in time-series data based on granularity.
 * @param xAxis - The dimension representing the time axis.
 * @param granularity - The granularity to fill gaps by (e.g., 'day', 'month').
 * @returns An object containing the `fillGaps` function.
 */
const useFillGaps = ({
                       xAxis,
                       granularity = 'day',
                     }: {
  xAxis?: Dimension;
  granularity?: Granularity;
}) => {
  /**
   * Function to recursively fill gaps in a time-series dataset.
   * @param memo - The accumulated records with gaps filled.
   * @param record - The current record being processed.
   * @returns The updated dataset with gaps filled.
   */
  const fillGaps = useCallback(
    (memo: Record[], record: Record) => {
      const lastRecord = memo[memo.length - 1];

      // If no previous record exists, add the current record and return.
      if (!lastRecord) return [...memo, record];

      const lastDateStr = lastRecord[xAxis?.name || ''];
      const currentDateStr = record[xAxis?.name || ''];

      // If date fields are missing, add the current record and return.
      if (!lastDateStr || !currentDateStr) return [...memo, record];

      const lastDate = parseJSON(lastDateStr);
      const currentDate = parseJSON(currentDateStr);

      // Compute the next expected date based on granularity.
      const nextExpectedDate = addTime[granularity](lastDate, 1);

      // If the current date is within the expected sequence, add the current record.
      if (currentDate <= nextExpectedDate) return [...memo, record];

      // Otherwise, add a placeholder record for the missing date and continue recursively.
      const gapRecord = { [xAxis?.name || '']: nextExpectedDate.toISOString().split('Z')[0] };
      return fillGaps([...memo, gapRecord], record);
    },
    [xAxis, granularity]
  );

  return { fillGaps };
};

export default useFillGaps;
