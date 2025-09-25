
import React from 'react';
import { FileJsonIcon } from './Icons';

export const Header: React.FC = () => (
  <header className="text-center">
    <div className="flex items-center justify-center gap-3">
      <FileJsonIcon />
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
        JSON to CSV Converter
      </h1>
    </div>
    <p className="mt-2 text-md md:text-lg text-gray-400">
      A fast and simple tool to transform your JSON data into a downloadable CSV file.
    </p>
  </header>
);
