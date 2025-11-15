// Copyright 2025 Poiema Ministries. All Rights Reserved.

interface FormHeaderProps {
  title: string;
  description: string;
}

export default function FormHeader({ title, description }: FormHeaderProps) {
  return (
    <div className='flex flex-col items-center justify-center w-full px-4 md:px-0'>
      <h1 className='text-2xl sm:text-3xl font-bold underline text-center'>
        {title}
      </h1>
      <p className='text-xs sm:text-sm font-semibold text-center mt-3 sm:mt-4 leading-relaxed px-2 sm:px-0 max-w-xl'>
        {description}
      </p>
    </div>
  );
}
