// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

interface ButtonProps {
  label: string;
  type: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Button({
  label,
  onClick = () => {},
  type,
  disabled,
  className,
}: ButtonProps) {
  return (
    <button
      className={`border-2 border-primary-black text-primary-black px-4 py-1.5 text-sm font-semibold rounded-md ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
