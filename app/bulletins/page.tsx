// Copyright 2025 Poiema Ministries. All Rights Reserved.

export default function Bulletins() {
  return (
    <div className='flex flex-col w-full gap-4 sm:gap-5 md:gap-7'>
      <div className='flex flex-col items-center md:items-start w-full max-w-xl mx-auto md:mx-0'>
        <h1 className='text-4xl font-bold text-center mt-10 px-4 md:px-0 md:ml-5'>
          Bulletins
        </h1>
      </div>
      <div className='flex flex-col items-center justify-center gap-4 px-4'>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-semibold'>Praise</span>
          <span className='font-medium'>
            I Worship You, Almighty God - Charity Gayle
          </span>
          <span className='font-medium'>Old For New - Bethel</span>
          <span className='font-medium'>I Give You My Heart - Hillsong</span>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-semibold'>Worship Presider</span>
          <span className='font-medium'>Alice Lee</span>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-semibold'>Call to Worship</span>
          <span className='font-medium'>Psalm 7:17</span>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-semibold'>Apostles Creed</span>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-semibold'>Sermon - Pastor Methab</span>
          <span className='font-medium'>Cleaning the Inside Windshield</span>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-semibold'>Scripture Reading</span>
          <span className='font-medium'>Matthew 7:3-5</span>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-semibold'>Relfection Song</span>
          <span className='font-medium'>Pure - Upper Room</span>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-semibold'>Announcements</span>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-semibold'>Offering</span>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-semibold'>Benidiction</span>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-semibold text-center'>Lord's Prayer</span>
          <span className='font-medium text-center'>
            Our Father in Heaven hallowed be your name
          </span>
          <span className='font-medium text-center'>
            Your kingdom come Your will be done on earth as it is in Heaven
          </span>
          <span className='font-medium text-center'>
            Give us this day our daily bread and forgive us our sins{' '}
          </span>
          <span className='font-medium text-center'>
            as we forgive those who sin against us
          </span>
          <span className='font-medium text-center'>
            And lead us not into temptation but deliver us from the evil one
          </span>
          <span className='font-medium text-center'>
            For Yours is the kingdom, the power, and the glory, forever{' '}
          </span>
          <span className='font-medium text-center'>Amen</span>
        </div>
      </div>
      <div className='flex flex-col items-center md:items-start w-full max-w-xl mx-auto md:mx-0'>
        <h1 className='text-4xl font-bold text-center mt-10 px-4 md:px-0 md:ml-5'>
          Announcements
        </h1>
      </div>
      <div className='flex flex-col items-center justify-center gap-4 px-4'></div>
    </div>
  );
}
