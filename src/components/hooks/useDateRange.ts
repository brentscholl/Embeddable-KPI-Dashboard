import { useState, useEffect } from 'react';

const DATE_RANGE_EVENT = 'dateRangeUpdated';

export const useDateRange = (initialValue) => {
  // Initialize date range with value from localStorage or the provided initial value
  const [dateRange, setDateRange] = useState(() => {
    const saved = localStorage.getItem('dateRange');
    return saved ? JSON.parse(saved) : initialValue;
  });

  // Update localStorage and dispatch custom event whenever dateRange changes
  useEffect(() => {
    const saved = localStorage.getItem('dateRange');
    const current = JSON.stringify(dateRange);
    if (current !== saved) {
      localStorage.setItem('dateRange', current);
      window.dispatchEvent(new CustomEvent(DATE_RANGE_EVENT, { detail: dateRange }));
    }
  }, [dateRange]);

  // Listen for external date range updates via the custom event
  useEffect(() => {
    const handleDateRangeUpdate = (event) => {
      if (event.detail) {
        setDateRange(event.detail);
      }
    };

    window.addEventListener(DATE_RANGE_EVENT, handleDateRangeUpdate);
    return () => window.removeEventListener(DATE_RANGE_EVENT, handleDateRangeUpdate);
  }, []);

  return [dateRange, setDateRange];
};
