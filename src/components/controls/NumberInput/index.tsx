import React, { useEffect, useRef, useState } from 'react';

import useFont from '../../hooks/useFont';
import '../../index.css';
import Title from '../../Title';
import { ClearIcon } from '../../icons';

type Props = {
  value: number; // Initial value for the input
  title?: string; // Optional title displayed above the input
  placeholder?: string; // Placeholder text for the input
  onChange: (value: number | string) => void; // Callback for when the value changes
};

const NumberInput = ({ value: initialValue, title, placeholder, onChange }: Props) => {
  const ref = useRef<HTMLInputElement | null>(null); // Reference to the input element
  const [value, setValue] = useState<string>(`${initialValue}`); // Local state for the input value
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null; // Timeout for debounce

  useFont(); // Load custom font

  // Sync local state with props when the initial value changes
  useEffect(() => {
    setValue(`${initialValue}`);
  }, [initialValue]);

  /**
   * Handles input changes with debounce to avoid rapid onChange calls.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(() => {
      onChange(e.target.value);
    }, 1000);
  };

  /**
   * Clears the input value and triggers the onChange callback with an empty string.
   */
  const clearInput = () => {
    setValue('');
    onChange('');
    if (ref.current) {
      ref.current.value = '';
      ref.current.focus();
    }
  };

  return (
    <div className="w-full font-embeddable text-sm">
      {title && <Title title={title} />}

      <div className="w-full relative rounded-md bg-white border border-[#DADCE1] pr-8 h-10">
        <input
          ref={ref}
          type="number"
          placeholder={placeholder}
          className="rounded-md w-full h-full outline-none leading-10 border-0 px-3"
          value={value}
          onChange={handleInputChange}
        />

        {/* Clear button */}
        {value && (
          <div
            onClick={clearInput}
            className="opacity-50 hover:opacity-100 absolute w-10 right-0 top-0 h-full cursor-pointer group flex items-center justify-center"
          >
            <ClearIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberInput;
