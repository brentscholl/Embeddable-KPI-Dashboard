import React, { useRef, useState, useMemo, useEffect } from 'react';
import Spinner from '../../Spinner';
import { Dimension, DataResponse } from '@embeddable.com/core';
import useDarkMode from '../../util/useDarkMode.js';
import Container from '../../Container';

type Props = {
  options: DataResponse; // Data for available statuses
  onChange: (selectedStatuses: string[]) => void; // Callback for selected statuses
  property: Dimension; // Property to access status names
  title?: string; // Optional title for the component
};

// The colors associated with a status
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'In Transit':
      return 'secondary-600';
    case 'Out for Delivery':
    case 'Out For Delivery':
      return 'indigo-600';
    case 'Delivered':
      return 'green-600';
    case 'Delayed':
      return 'yellow-600';
    case 'Weather Delay':
      return 'orange-600';
    case 'Exception':
      return 'red-600';
    case 'Voided':
      return 'pink-600';
    default:
      return 'gray-500';
  }
};

const TrackingNumberStatus = (props: Props) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const { isDarkMode, containerRef } = useDarkMode();

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => {
    // Retrieve saved statuses from localStorage, or initialize as empty
    const savedStatuses = localStorage.getItem('selectedStatuses');
    return savedStatuses ? JSON.parse(savedStatuses) : [];
  });

  // Update localStorage and trigger `onChange` when selectedStatuses changes
  useEffect(() => {
    localStorage.setItem('selectedStatuses', JSON.stringify(selectedStatuses));
    const event = new Event('localStorageUpdated');
    window.dispatchEvent(event);
    props.onChange(selectedStatuses);
  }, [selectedStatuses]);

  // Initialize selectedStatuses based on available options if not already set
  useEffect(() => {
    if (!localStorage.getItem('selectedStatuses') && props.options?.data) {
      const allStatuses = props.options.data.map(option => option[props.property?.name || '']);
      setSelectedStatuses(allStatuses);
      props.onChange(allStatuses);
    }
  }, [props.options, props.property]);

  // Handle checkbox changes
  const handleChange = (status: string) => {
    setSelectedStatuses(prevStatuses =>
      prevStatuses.includes(status)
        ? prevStatuses.filter(s => s !== status) // Remove if already selected
        : [...prevStatuses, status] // Add if not selected
    );
  };

  // Generate the list of status checkboxes
  const statusList = useMemo(() => {
    return props.options?.data
      ?.filter(option => option[props.property?.name || ''] !== null)
      .map((option, index) => {
        const status = option[props.property?.name || ''];
        const color = getStatusColor(status);
        const isChecked = selectedStatuses.includes(status);

        return (
          <label
            key={index}
            className={`rounded-full border ${
              isChecked ? 'opacity-100' : 'opacity-80'
            } border-${color} hover:opacity-100 cursor-pointer pl-0.5 pr-2 py-0.5 mr-2 mb-2 text-xs flex flex-row items-center space-x-2 dark:text-${color}`}
          >
            <input
              type="checkbox"
              value={status}
              checked={isChecked}
              onChange={() => handleChange(status)}
              className={`cursor-pointer focus:ring-${color} h-5 w-5 text-${color} border-gray-300 rounded-full dark:text-${color} dark:focus:ring-${color}`}
            />
            <span>{status}</span>
          </label>
        );
      });
  }, [props.options, props.property, selectedStatuses]);

  return (
    <div ref={containerRef}>
      <Container title={props.title} showSpinner={false}>
        {props.options?.isLoading ? (
          <div className="w-full">
            <div className="flex justify-start items-center w-full animate-pulse pt-2">
              {/* Skeleton loaders for loading state */}
              {Array.from({ length: 7 }).map((_, index) => (
                <label
                  key={index}
                  className="rounded-full h-6 w-28 bg-gray-200 dark:bg-gray-700 inline-block pl-0.5 pr-2 mr-2 mb-2"
                ></label>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-row pt-2 flex-wrap items-center relative w-full">
            <label className="flex space-x-1.5 items-center pr-2 mb-2 text-gray-400 dark:text-gray-500">
              <span>Statuses:</span>
            </label>
            {statusList}
          </div>
        )}
      </Container>
    </div>
  );
};

export default TrackingNumberStatus;
