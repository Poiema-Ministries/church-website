// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Form from '../common/components/form/form';
import Input from '../common/components/input/input';
import Textarea from '../common/components/textarea/textarea';
import AlertModal from '../common/components/alert-modal/alert-modal';

export default function PrayerRequestsForm() {
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
      const formData = {
        name: `${data.firstName} ${data.lastName}`,
        prayerRequest: data.prayerRequest,
      };

      const response = await fetch('/api/prayer-request', {
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
          title: 'Prayer Request Not Sent',
          message:
            'We apologize, but we encountered an issue sending your prayer request. Please try again, and know that we are still here to pray for you. You can also reach out to us directly. God bless you!',
        });
      } else {
        // Success - reset form and show success message
        reset();
        setAlertModal({
          isOpen: true,
          type: 'success',
          title: 'Prayer Request Received',
          message:
            'Thank you for sharing your prayer request with us. Our church community will lift you up in prayer. We believe in the power of prayer through our Lord and Savior Jesus Christ. May God bless you and provide you with peace!',
        });
      }
    } catch (error) {
      // Network or other errors
      setAlertModal({
        isOpen: true,
        type: 'error',
        title: 'Connection Issue',
        message:
          'We apologize, but we are having trouble connecting right now. Please check your internet connection and try again. Know that we are still praying for you. Thank you for your patience!',
      });
    }
  };

  return (
    <Form
      headerConfig={{
        title: 'Prayer Requests',
        description:
          'We believe in the power of prayer through our Lord and Savior Jesus Christ. Please share your prayer request below, and we will lift it up to the Lord in faith, trusting in His perfect will and timing.',
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
                required: 'First Name is required in order to send',
              })}
            />
          </div>
          <div className='flex-1'>
            <Input
              label='Last Name'
              type='text'
              error={errors.lastName?.message as string}
              {...register('lastName', {
                required: 'Last Name is required in order to send',
              })}
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4 w-full mt-3 mb-5'>
        <Textarea
          label='Prayer Request'
          placeholder='Enter your prayer request'
          error={errors.prayerRequest?.message as string}
          {...register('prayerRequest', {
            required: 'Prayer Request is required in order to send',
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
        autoCloseDelay={7000}
      />
    </Form>
  );
}
