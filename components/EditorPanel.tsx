
import React from 'react';

interface EditorPanelProps {
  title: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  readOnly?: boolean;
  error?: string | null;
  actions?: React.ReactNode;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  title,
  value,
  onChange,
  placeholder,
  readOnly = false,
  error = null,
  actions,
}) => {
  const borderColor = error ? 'border-red-500' : 'border-gray-700';

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg">
      <div className="flex justify-between items-center p-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-300">{title}</h2>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
      <div className="flex flex-col flex-grow p-1 relative">
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full h-full flex-grow bg-transparent text-gray-200 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 font-mono text-sm ${readOnly ? 'cursor-default' : ''} ${borderColor}`}
          spellCheck="false"
          style={{ minHeight: '300px' }}
        />
        {error && (
          <div className="absolute bottom-2 left-4 text-xs text-red-400 bg-red-900/50 px-2 py-1 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
