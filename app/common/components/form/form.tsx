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
  onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function Form({ headerConfig, children, onFormSubmit }: FormProps) {
  return (
    <form className='flex flex-col items-center justify-center' onSubmit={onFormSubmit}>
      <FormHeader
        title={headerConfig.title}
        description={headerConfig.description}
      />
      {children}
      <Button
        label='Submit'
        type='submit'
        disabled={false}
        className='mt-4'
      />
    </form>
  );
}
