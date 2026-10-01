// Copyright 2026 Poiema Ministries. All Rights Reserved.

'use client';

import { useEffect, useRef, useState } from 'react';
import { type FieldValues, useForm } from 'react-hook-form';

import AlertModal from '../common/components/alert-modal/alert-modal';
import Form from '../common/components/form/form';
import Input from '../common/components/input/input';
import Select from '../common/components/select/select';
import { HONEYPOT_FIELD_NAME } from '@/lib/spam-validation';

export default function BibleStudyForm() {
  const [formLoadedAt, setFormLoadedAt] = useState<number | null>(null);
  const submittingRef = useRef(false);
  useEffect(() => {
    const id = setTimeout(() => setFormLoadedAt(Date.now()), 0);
    return () => clearTimeout(id);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      format: '',
      [HONEYPOT_FIELD_NAME]: '',
    },
  });

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
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      const response = await fetch('/api/bible-study/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          formLoadedAt: formLoadedAt ?? 0,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const serverMessage =
        payload &&
        typeof payload === 'object' &&
        'error' in payload &&
        typeof payload.error === 'string'
          ? payload.error
          : '';

      if (!response.ok) {
        setAlertModal({
          isOpen: true,
          type: 'error',
          title: 'Signup Not Saved',
          message:
            serverMessage ||
            'We could not save your signup. Please try again in a little while.',
        });
        return;
      }

      reset();
      setAlertModal({
        isOpen: true,
        type: 'success',
        title: 'You Are Signed Up',
        message:
          'Thank you. We will email you Bible Study details at the address you entered. Every email includes a link to opt out.',
      });
    } catch {
      setAlertModal({
        isOpen: true,
        type: 'error',
        title: 'Connection Issue',
        message:
          'We are having trouble connecting right now. Please check your internet connection and try again.',
      });
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <Form
      headerConfig={{
        title: 'Bible Study',
        description:
          'Our Bible study is hybrid. Join us in person at 45-60 211th St, Bayside, NY 11361, or online. Leave your name and email, and tell us how you plan to attend. We will email the study details to everyone who signs up, and you can opt out of those emails at any time.',
      }}
      onFormSubmit={handleSubmit(onFormSubmit)}
    >
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
        <Input
          label='Name'
          type='text'
          error={errors.name?.message as string}
          {...register('name', { required: 'Name is required' })}
        />
        <Input
          label='Email'
          type='email'
          error={errors.email?.message as string}
          {...register('email', { required: 'Email is required' })}
        />
        <Select
          label='How will you join?'
          placeholder='Select one'
          options={[
            { label: 'In Person', value: 'in-person' },
            { label: 'Online', value: 'online' },
          ]}
          error={errors.format?.message as string}
          {...register('format', {
            required: 'Please choose how you will join',
          })}
        />
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
        autoCloseDelay={6000}
      />
    </Form>
  );
}
