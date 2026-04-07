import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Input({ 
  label, 
  error, 
  className, 
  wrapperClassName,
  id,
  ...props 
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={twMerge('field', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={twMerge(
          'w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20',
          'transition-all duration-200',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function TextArea({ 
  label, 
  error, 
  className, 
  wrapperClassName,
  id,
  rows = 3,
  ...props 
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={twMerge('field', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={twMerge(
          'w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20',
          'transition-all duration-200 resize-none',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Select({ 
  label, 
  error, 
  className, 
  wrapperClassName,
  id,
  children,
  ...props 
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={twMerge('field', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={twMerge(
          'w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900',
          'focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20',
          'transition-all duration-200 cursor-pointer',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
