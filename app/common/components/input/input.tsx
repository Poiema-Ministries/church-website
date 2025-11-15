// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

interface InputProps {
  type: 'text' | 'email' | 'password' | 'tel' | 'date';
  placeholder?: string;
  label?: string;
  error?: string;
}

export default function Input({
  label,
  type,
  placeholder,
  error,
  ...props
}: InputProps) {
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
      <input
        type={type}
        id={label}
        placeholder={placeholder}
        className={`w-full border ${
          error ? 'border-red-500' : 'border-black'
        } bg-white px-3 py-2 text-primary-black focus:outline-none focus:ring-1 ${
          error ? 'focus:ring-red-500' : 'focus:ring-black'
        }`}
        {...props}
      />
      {error && (
        <span className='text-sm text-red-500'>{error}</span>
      )}
    </div>
  );
}
