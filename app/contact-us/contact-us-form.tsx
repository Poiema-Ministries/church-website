// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Form from '../common/components/form/form';
import Button from '../common/components/button/button';
import Input from '../common/components/input/input';
import Textarea from '../common/components/textarea/textarea';

export default function ContactUsForm() {
  const { register, handleSubmit } = useForm();

  const onFormSubmit = (data: FieldValues) => {
    console.log(data);
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
            <Input label='First Name' type='text' {...register('firstName')} />
          </div>
          <div className='flex-1'>
            <Input label='Last Name' type='text' {...register('lastName')} />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4 w-full mt-5 mb-5'>
        <Input label='Email' type='email' {...register('email')} />
      </div>
      <div className='flex flex-col gap-4 w-full mt-5 mb-5'>
        <Textarea
          label='Message'
          placeholder='Enter your message'
          {...register('message')}
        />
      </div>
    </Form>
  );
}
