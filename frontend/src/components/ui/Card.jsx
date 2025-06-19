// src/components/ui/card.jsx
import React from 'react';
import classNames from 'classnames';

export function Card({ children, className, ...props }) {
  return (
    <div
      className={classNames('bg-white rounded-2xl shadow p-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={classNames('border-b pb-2 mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={classNames('p-2', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={classNames('text-xl font-semibold', className)} {...props}>
      {children}
    </h3>
  );
}
