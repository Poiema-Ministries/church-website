// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { CORE_VALUES } from '../common/constants/core-values';
import { CoreValue } from '../common/types/models';

export default function CoreValues() {
  const renderCoreValues = () => {
    return CORE_VALUES.map((value: CoreValue, index: number) => {
      const secondaryBackgroundColor = index % 2 === 0 && 'bg-secondary';
      return (
        <div
          key={value.id}
          className={`flex flex-col md:flex-row items-stretch w-full p-4 sm:p-5 md:p-7 gap-3 sm:gap-4 md:h-[275px] ${secondaryBackgroundColor}`}
        >
          <div className='flex flex-1 items-center md:items-center h-full md:self-stretch'>
            <div className='flex items-center w-full max-w-prose mx-auto md:max-w-xl md:mx-0'>
              <span className='text-3xl sm:text-4xl md:text-7xl font-bold mr-3 sm:mr-4'>
                {value.id}
              </span>
              <div className='flex-1 text-center md:text-left text-lg sm:text-xl md:text-2xl font-semibold'>
                <span>{value.title}</span>
              </div>
            </div>
          </div>
          <div className='flex-1 flex items-center justify-center text-center md:text-left w-full max-w-prose mx-auto md:max-w-xl md:mx-0 h-full md:self-stretch'>
            <span className='text-xs sm:text-base lg:text-lg leading-relaxed'>
              {value.description}
            </span>
          </div>
        </div>
      );
    });
  };
  return (
    <div className='flex flex-col min-h-screen w-full gap-4 sm:gap-5 md:gap-7'>
      <div className='flex flex-col items-start w-full max-w-xl'>
        <h1 className='text-4xl font-bold text-center mt-10 ml-5'>
          Core Values
        </h1>
      </div>
      {renderCoreValues()}
    </div>
  );
}
