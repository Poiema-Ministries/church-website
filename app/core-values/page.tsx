// Copyright 2025 Poiema Ministries. All Rights Reserved.

import { CoreValue } from '../common/types/models';

const CORE_VALUES: CoreValue[] = [
  {
    id: 1,
    title: 'Experience God Through Worship',
    description:
      "We believe that worship is the foundation of our faith. It is through worship that we experience God's presence and love. We believe that worship is the foundation of our faith. It is through worship that we experience God's presence and love.",
  },
  {
    id: 2,
    title: 'Evangelism By Introducting Jesus Christ As Lord',
    description:
      'We take the call from Jesus to make disciples of all nations seriously and thus reach out to our local and international neighbors to spread the Good News. We hope to be a city on a hill and a light in the darkness so that those who see Christ in us would be compelled to take His message seriously.',
  },
  {
    id: 3,
    title: 'Encourage One Another Through Fellowship',
    description:
      'We hope to create a familial environment that is modeled after Christ’s own relationship to the church, His Body. By placing Him at the Head we are united in building a church that is focused on genuine love and care for its members.',
  },
  {
    id: 4,
    title: 'Equip People For Ministry And Maturity',
    description:
      'We know that God has called us to be spiritually mature and humble at all times. We continue to strive to becoming more like Christ in all aspects of our lives.',
  },
];

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
              <span className='text-3xl sm:text-4xl md:text-7xl font-bold mr-3 sm:mr-4 opacity-70 md:opacity-100'>
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
