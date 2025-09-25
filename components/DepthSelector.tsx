import React from 'react';

interface DepthSelectorProps {
  depth: number;
  onDepthChange: (depth: number) => void;
}

export const DepthSelector: React.FC<DepthSelectorProps> = ({ depth, onDepthChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      onDepthChange(value);
    } else if (e.target.value === '') {
        // Allow clearing the input, maybe default to 1
        onDepthChange(1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full lg:w-auto" title="Set how many levels of nested objects to expand into columns">
      <label htmlFor="depth-input" className="text-sm font-medium text-gray-400">
        Flatten Depth
      </label>
      <input
        id="depth-input"
        type="number"
        min="1"
        value={depth}
        onChange={handleChange}
        className="w-24 text-center bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2"
        aria-label="Set object flatten depth"
      />
    </div>
  );
};