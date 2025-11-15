// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import FormHeader from './header';
import Button from '../button/button';

interface FormProps {
  headerConfig: {
    title: string;
    description: string;
  };
  children: React.ReactNode;
  onFormSubmit: () => void;
}

export default function Form({
  headerConfig,
  children,
  onFormSubmit,
}: FormProps) {
  return (
    <form
      className='flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8'
      onSubmit={onFormSubmit}
    >
      <FormHeader
        title={headerConfig.title}
        description={headerConfig.description}
      />
      <div className='w-full flex flex-col'>{children}</div>
      <div className='flex justify-center w-full'>
        <Button
          label='Submit'
          type='submit'
          disabled={false}
          className='mt-4'
        />
      </div>
    </form>
  );
}
