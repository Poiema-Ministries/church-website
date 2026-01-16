// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

interface TextareaProps {
  label?: string;
  placeholder?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  ...props
}: TextareaProps) {
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
      <textarea
        id={label}
        className={`w-full border ${
          error ? 'border-red-500' : 'border-black'
        } bg-white px-3 py-2 text-primary-black focus:outline-none focus:ring-1 ${
          error ? 'focus:ring-red-500' : 'focus:ring-black'
        }`}
        {...props}
      />
      {error && <span className='text-sm text-red-500'>{error}</span>}
    </div>
  );
}
