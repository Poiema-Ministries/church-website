// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { FieldValues, useForm } from 'react-hook-form';
import Form from '../common/components/form/form';
import Input from '../common/components/input/input';

export default function NewMembersForm() {
  const { register, handleSubmit } = useForm();

  const onFormSubmit = (data: FieldValues) => {
    console.log(data);
  };

  return (
    <Form
      headerConfig={{
        title: 'New Members',
        description:
          'Thank you for deciding to become a new member of our ministry! If you have any questions regarding our ministry please feel free to reach out to our Pastor or our leaders! God bless you and we hope to grow in Christ together!',
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
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
          <div className='flex-1'>
            <Input
              label='Date Of Birth'
              type='date'
              {...register('dateOfBirth')}
            />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
          <div className='flex-1'>
            <Input
              label='Phone Number'
              type='tel'
              {...register('phoneNumber')}
            />
          </div>
          <div className='flex-1'>
            <Input label='Email' type='email' {...register('email')} />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
          <div className='flex-1'>
            <Input label='Address' type='text' {...register('address')} />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
          <Input label='City' type='text' {...register('city')} />
          <Input label='State' type='text' {...register('state')} />
          <Input label='Zip Code' type='text' {...register('zipCode')} />
        </div>
      </div>
    </Form>
  );
}
