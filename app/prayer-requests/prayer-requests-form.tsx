// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Form from '../common/components/form/form';
import Input from '../common/components/input/input';
import Textarea from '../common/components/textarea/textarea';

export default function PrayerRequestsForm() {
  const { register, handleSubmit } = useForm();

  const onFormSubmit = (data: FieldValues) => {
    console.log(data);
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
            <Input label='First Name' type='text' {...register('firstName')} />
          </div>
          <div className='flex-1'>
            <Input label='Last Name' type='text' {...register('lastName')} />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4 w-full mt-3 mb-5'>
        <Textarea
          label='Prayer Request'
          placeholder='Enter your prayer request'
          {...register('prayerRequest')}
        />
      </div>
    </Form>
  );
}
