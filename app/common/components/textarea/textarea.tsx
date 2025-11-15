// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

interface TextareaProps {
  label?: string;
  placeholder?: string;
}

export default function Textarea({
  label,
  placeholder,
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
        className='w-full border border-black bg-white px-3 py-2 text-primary-black focus:outline-none focus:ring-1 focus:ring-black'
        {...props}
      />
    </div>
  );
}
