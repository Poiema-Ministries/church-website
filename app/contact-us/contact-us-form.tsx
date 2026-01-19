// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Form from '../common/components/form/form';
import Select from '../common/components/select/select';
import Input from '../common/components/input/input';
import Textarea from '../common/components/textarea/textarea';
import AlertModal from '../common/components/alert-modal/alert-modal';

export default function ContactUsForm() {
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
      const formData = { ...data };
      const response = await fetch('/api/contact-us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      await response.json();

      if (!response.ok) {
        // Show user-friendly error message
        setAlertModal({
          isOpen: true,
          type: 'error',
          title: 'Message Not Sent',
          message:
            'We apologize, but we encountered an issue sending your message. Please try again later, or feel free to reach out to us directly. We look forward to hearing from you soon!',
        });
      } else {
        // Success - reset form and show success message
        reset();
        setAlertModal({
          isOpen: true,
          type: 'success',
          title: 'Message Received!',
          message:
            'Thank you for reaching out to us! Your message has been received and we will get back to you as soon as possible. We appreciate your patience and look forward to connecting with you. God bless you!',
        });
      }
    } catch {
      // Network or other errors
      setAlertModal({
        isOpen: true,
        type: 'error',
        title: 'Connection Issue',
        message:
          'We apologize, but we are having trouble connecting right now. Please check your internet connection and try again. Thank you for your understanding!',
      });
    }
  };

  return (
    <Form
      headerConfig={{
        title: 'Contact Us',
        description:
          'We would love to hear from you! Please fill out the form below and we will get back to you as soon as possible.',
      }}
      onFormSubmit={handleSubmit(onFormSubmit)}
    >
      <div className='flex flex-col gap-4 w-full mt-5 mb-5'>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
          <div className='flex-1'>
            <Input
              label='First Name'
              type='text'
              error={errors.firstName?.message as string}
              {...register('firstName', {
                required: 'First Name is required',
              })}
            />
          </div>
          <div className='flex-1'>
            <Input
              label='Last Name'
              type='text'
              error={errors.lastName?.message as string}
              {...register('lastName', {
                required: 'Last Name is required',
              })}
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4 w-full mt-5 mb-5'>
        <Input
          label='Email'
          type='email'
          error={errors.email?.message as string}
          {...register('email', {
            required: 'Email is required',
          })}
        />
      </div>
      <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
        <div className='flex-1'>
          <Select
            label='Age Group'
            options={[
              { label: '18-24', value: '18-24' },
              { label: '25-29', value: '25-29' },
              { label: '30-35+', value: '30-35+' },
            ]}
            error={errors.ageGroup?.message as string}
            {...register('ageGroup', {
              required: 'Age Group is required',
            })}
          />
        </div>
      </div>
      <div className='flex flex-col gap-4 w-full mt-5 mb-5'>
        <Textarea
          label='Message'
          placeholder='Enter your message'
          error={errors.message?.message as string}
          {...register('message', {
            required: 'Message is required',
          })}
        />
      </div>

      {/* Alert Modal */}
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
