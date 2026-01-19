'use client';

// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { useEffect, useRef } from 'react';

export type AlertType = 'success' | 'error';

interface AlertModalProps {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number; // in milliseconds
}

export default function AlertModal({
  isOpen,
  type,
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 4500,
}: AlertModalProps) {
  const notificationRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle auto-close
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const borderColor =
    type === 'success'
      ? 'border-l-green-500'
      : 'border-l-red-500';
  const bgColor =
    type === 'success'
      ? 'bg-green-50/50'
      : 'bg-red-50/50';

  return (
    <div
      className='fixed top-4 right-4 z-50 w-full max-w-sm sm:max-w-md animate-slide-in-from-top'
      role='alert'
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-labelledby='alert-title'
      aria-describedby='alert-message'
    >
      {/* Notification Card */}
      <div
        ref={notificationRef}
        className={`relative bg-background rounded-lg shadow-lg border-l-4 ${borderColor} border border-primary-black/10 overflow-hidden transition-all duration-300 ease-out`}
      >
        {/* Background accent */}
        <div
          className={`absolute inset-0 ${bgColor} opacity-30 pointer-events-none`}
          aria-hidden='true'
        />

        {/* Content */}
        <div className='relative p-4 sm:p-5'>
          {/* Close button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className='absolute top-3 right-3 text-primary-black/50 hover:text-primary-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-black/20 rounded-full p-1'
            aria-label='Close notification'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>

          {/* Title */}
          <h3
            id='alert-title'
            className='text-lg sm:text-xl font-bold text-primary-black mb-1.5 pr-6'
          >
            {title}
          </h3>

          {/* Message */}
          <p
            id='alert-message'
            className='text-sm sm:text-base text-primary-black/80 leading-relaxed pr-6'
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
