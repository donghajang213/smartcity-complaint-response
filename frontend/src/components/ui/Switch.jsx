// src/components/ui/Switch.jsx
import React from 'react';

export function Switch({ checked, onCheckedChange }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      <div className={`w-11 h-6 bg-gray-300 rounded-full ${checked ? 'bg-green-500' : ''}`}>
        <div
          className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </div>
    </label>
  );
}
