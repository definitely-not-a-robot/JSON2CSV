
import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  tooltip?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children, className, tooltip, ...props }) => {
  return (
    <div className="relative group flex items-center">
      <button
        {...props}
        className={`flex items-center justify-center px-4 py-2 rounded-md font-semibold text-white transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed ${className || 'bg-gray-700 hover:bg-gray-600 focus:ring-gray-500'}`}
      >
        {children}
      </button>
      {tooltip && (
        <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          {tooltip}
        </div>
      )}
    </div>
  );
};
