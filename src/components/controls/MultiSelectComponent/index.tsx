import React, { useState } from 'react';

type Change = (selected: string[]) => void;

type Props = {
  options: string[]; // Array of available options
  onChange: Change; // Callback function to handle selection changes
};

const MultiSelect = ({ options = [], onChange }: Props) => {
  const [selected, setSelected] = useState<string[]>([]); // State to keep track of selected options

  /**
   * Toggles the selection of an option.
   * If the option is already selected, it removes it; otherwise, it adds it.
   * Updates the local state and invokes the onChange callback.
   */
  const handleChange = (option: string) => {
    const updatedSelection = selected.includes(option)
      ? selected.filter((el) => el !== option) // Remove if already selected
      : [...selected, option]; // Add if not selected

    setSelected(updatedSelection);
    onChange(updatedSelection);
  };

  return (
    <div className="multi-select">
      {options.map((option, index) => (
        <div key={index} className="multi-select-item">
          <label>
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleChange(option)}
            />
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default MultiSelect;
