import React from 'react';

interface AutoConvertToggleProps {
  autoConvert: boolean;
  onToggle: () => void;
}

export const AutoConvertToggle: React.FC<AutoConvertToggleProps> = ({ autoConvert, onToggle }) => {
  return (
    <div className="flex flex-col items-center gap-2" title="Automatically convert as you type">
      <label htmlFor="auto-convert-toggle" className="text-sm font-medium text-gray-400">
        Auto-Convert
      </label>
      <button
        id="auto-convert-toggle"
        role="switch"
        aria-checked={autoConvert}
        onClick={onToggle}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 ${
          autoConvert ? 'bg-blue-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
            autoConvert ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};
