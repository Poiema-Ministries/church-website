// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { useState, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { HONEYPOT_FIELD_NAME } from '@/lib/spam-validation';
import { UpcomingEvent } from '@/app/common/types/models';
import Form from '@/app/common/components/form/form';
import Input from '@/app/common/components/input/input';
import Textarea from '@/app/common/components/textarea/textarea';
import Select from '@/app/common/components/select/select';
import AlertModal from '@/app/common/components/alert-modal/alert-modal';

interface EventRegistrationFormProps {
  event: UpcomingEvent;
}

/**
 * Formats a date string (YYYY-MM-DD) into a readable format.
 * e.g. "2025-07-15" -> "July 15, 2025"
 */
function formatEventDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Converts a field label to a safe form field name.
 * e.g. "First Name" -> "first-name", "Phone Number" -> "phone-number"
 */
function labelToFieldName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
}

export default function EventRegistrationForm({
  event,
}: EventRegistrationFormProps) {
  const [formLoadedAt, setFormLoadedAt] = useState<number | null>(null);
  useEffect(() => {
    const id = setTimeout(() => setFormLoadedAt(Date.now()), 0);
    return () => clearTimeout(id);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const onFormSubmit = async (data: FieldValues) => {
    try {
      // Build a clean submission object with labels as keys
      const fields: Record<string, string> = {};
      for (const field of event.fields) {
        const fieldName = labelToFieldName(field.label);
        fields[field.label] = data[fieldName] || '';
      }

      const formData = {
        eventTitle: event.title,
        eventId: event._id,
        fields,
        formLoadedAt: formLoadedAt ?? 0,
        [HONEYPOT_FIELD_NAME]: data[HONEYPOT_FIELD_NAME],
      };

      const response = await fetch('/api/upcoming-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      await response.json();

      if (!response.ok) {
        setAlertModal({
          isOpen: true,
          type: 'error',
          title: 'Registration Not Sent',
          message:
            'We apologize, but we encountered an issue sending your registration. Please try again, or feel free to reach out to us directly. Thank you for your patience!',
        });
      } else {
        reset();
        setAlertModal({
          isOpen: true,
          type: 'success',
          title: 'Registration Received!',
          message: `Thank you for registering for ${event.title}! We have received your information and look forward to seeing you there. God bless you!`,
        });
      }
    } catch {
      setAlertModal({
        isOpen: true,
        type: 'error',
        title: 'Connection Issue',
        message:
          'We apologize, but we are having trouble connecting right now. Please check your internet connection and try again. Thank you for your patience!',
      });
    }
  };

  return (
    <Form
      headerConfig={{
        title: event.title,
        description:
          event.description ||
          'Please fill out the form below to register for this event.',
      }}
      onFormSubmit={handleSubmit(onFormSubmit)}
    >
      {/* Event date and deadline info */}
      <div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mt-4 mb-2 text-sm text-primary-black/70'>
        <span>
          <strong className='text-primary-black'>Event Date:</strong>{' '}
          {formatEventDate(event.eventDate)}
        </span>
        <span className='hidden sm:inline text-primary-black/30'>|</span>
        <span>
          <strong className='text-primary-black'>Register By:</strong>{' '}
          {formatEventDate(event.registrationDeadline)}
        </span>
      </div>

      {/* Honeypot - hidden from users, bots fill it */}
      <div
        className='absolute -left-[9999px] w-px h-px overflow-hidden'
        aria-hidden='true'
      >
        <label htmlFor={HONEYPOT_FIELD_NAME}>Leave this field empty</label>
        <input
          type='text'
          id={HONEYPOT_FIELD_NAME}
          tabIndex={-1}
          autoComplete='off'
          {...register(HONEYPOT_FIELD_NAME)}
        />
      </div>

      <div className='flex flex-col gap-4 w-full mt-5 mb-5'>
        {event.fields.map((field, index) => {
          const fieldName = labelToFieldName(field.label);
          const errorMessage = errors[fieldName]?.message as string;

          // Group consecutive text fields in pairs for side-by-side layout
          const nextField = event.fields[index + 1];
          const isTextField = field.inputType === 'text';
          const nextIsTextField = nextField?.inputType === 'text';

          // Pair logic: group text inputs in rows of 2 when consecutive
          const shouldStartRow =
            isTextField &&
            nextIsTextField &&
            !isSecondInConsecutiveGroup(event.fields, index);
          const isSecondInRow =
            isTextField && isSecondInConsecutiveGroup(event.fields, index);

          if (field.inputType === 'textarea') {
            return (
              <div key={field._key} className='flex flex-col gap-4 w-full mt-1'>
                <Textarea
                  label={field.label}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  error={errorMessage}
                  {...register(fieldName, {
                    required: `${field.label} is required`,
                  })}
                />
              </div>
            );
          }

          if (field.inputType === 'dropdown' && field.dropdownOptions) {
            const options = field.dropdownOptions.map((option) => ({
              label: option,
              value: option,
            }));

            return (
              <div key={field._key} className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
                <div className='flex-1'>
                  <Select
                    label={field.label}
                    placeholder={`Select ${field.label.toLowerCase()}`}
                    options={options}
                    error={errorMessage}
                    {...register(fieldName, {
                      required: `${field.label} is required`,
                    })}
                  />
                </div>
              </div>
            );
          }

          // Text input field
          if (shouldStartRow) {
            // Start a row with two text fields side by side
            const nextFieldName = labelToFieldName(nextField.label);
            const nextErrorMessage = errors[nextFieldName]?.message as string;

            return (
              <div
                key={field._key}
                className='flex flex-col sm:flex-row gap-4 sm:gap-2'
              >
                <div className='flex-1'>
                  <Input
                    label={field.label}
                    type='text'
                    error={errorMessage}
                    {...register(fieldName, {
                      required: `${field.label} is required`,
                    })}
                  />
                </div>
                <div className='flex-1'>
                  <Input
                    label={nextField.label}
                    type='text'
                    error={nextErrorMessage}
                    {...register(nextFieldName, {
                      required: `${nextField.label} is required`,
                    })}
                  />
                </div>
              </div>
            );
          }

          if (isSecondInRow) {
            // Already rendered as part of the previous pair
            return null;
          }

          // Single text field (odd one out or standalone)
          return (
            <div key={field._key} className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
              <div className='flex-1'>
                <Input
                  label={field.label}
                  type='text'
                  error={errorMessage}
                  {...register(fieldName, {
                    required: `${field.label} is required`,
                  })}
                />
              </div>
            </div>
          );
        })}
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onClose={() =>
          setAlertModal({
            ...alertModal,
            isOpen: false,
          })
        }
        autoClose={alertModal.type === 'success'}
        autoCloseDelay={7000}
      />
    </Form>
  );
}

/**
 * Determines if the field at the given index is the second in a consecutive
 * group of text fields. Used for pairing text inputs side by side.
 */
function isSecondInConsecutiveGroup(
  fields: { inputType: string }[],
  index: number,
): boolean {
  if (index === 0) return false;

  const current = fields[index];
  const prev = fields[index - 1];

  if (current.inputType !== 'text' || prev.inputType !== 'text') return false;

  // Count how many consecutive text fields precede this one (including current)
  let consecutiveCount = 0;
  for (let i = index; i >= 0 && fields[i].inputType === 'text'; i--) {
    consecutiveCount++;
  }

  // If the consecutive count (from start of group to current) is even,
  // this is the second of a pair
  return consecutiveCount % 2 === 0;
}
