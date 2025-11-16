// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  error?: string;
  options: SelectOption[];
}

const Select = forwardRef<
  HTMLSelectElement,
  SelectProps & React.SelectHTMLAttributes<HTMLSelectElement>
>(({ label, placeholder, error, options, ...props }, ref) => {
  return (
    <div className='flex flex-col gap-2'>
      {label && (
        <label
          htmlFor={label}
          className='text-sm font-semibold text-primary-black'
        >
          {label}
        </label>
      )}
      <div className='relative'>
        <select
          id={label}
          ref={ref}
          className={`w-full border ${
            error ? 'border-red-500' : 'border-black'
          } bg-white pl-3 pr-10 py-2 text-primary-black focus:outline-none focus:ring-1 ${
            error ? 'focus:ring-red-500' : 'focus:ring-black'
          } appearance-none`}
          {...props}
        >
          {placeholder && (
            <option value='' disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
          <svg
            className='w-4 h-4 text-primary-black'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </div>
      </div>
      {error && <span className='text-sm text-red-500'>{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
