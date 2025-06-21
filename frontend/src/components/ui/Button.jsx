// src/components/ui/Button.jsx
import React from 'react';
import classnames from 'classnames';

export function Button({ children, className, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className={classnames(
        'px-4 py-2 rounded-2xl shadow-md hover:shadow-lg focus:outline-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
