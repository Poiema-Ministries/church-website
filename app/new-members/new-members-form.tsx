// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { useForm } from 'react-hook-form';
import Form from '../common/components/form/form';
import Input from '../common/components/input/input';

export default function NewMembersForm() {
  const { register, handleSubmit } = useForm();
  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('TODO: Implement form submission');
  };

  return (
    <Form
      headerConfig={{
        title: 'New Members',
        description:
          'Thank you for deciding to become a new member of our ministry! If you have any questions regarding our ministry please feel free to reach out to our Pastor or our leaders! God bless you and we hope to grow in Christ together!',
      }}
      onFormSubmit={onFormSubmit}
    >
      <Input label='Name' type='text' placeholder='Enter your name' {...register('name')} />
    </Form>
  );
}
