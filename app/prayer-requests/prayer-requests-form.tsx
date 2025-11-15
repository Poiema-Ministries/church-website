// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Form from '../common/components/form/form';
import Input from '../common/components/input/input';
import Textarea from '../common/components/textarea/textarea';

export default function PrayerRequestsForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  const onFormSubmit = async(data: FieldValues) => {
    console.log(data);
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

    if (!response.ok) {
      throw new Error('Failed to send prayer request');
    } else {
      alert('Prayer request sent successfully');
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
                required: 'First Name is required in order to send' 
              })} 
            />
          </div>
          <div className='flex-1'>
            <Input 
              label='Last Name' 
              type='text' 
              error={errors.lastName?.message as string}
              {...register('lastName', { 
                required: 'Last Name is required in order to send' 
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
            required: 'Prayer Request is required in order to send' 
          })}
        />
      </div>
    </Form>
  );
}
