// Copyright 2025 Poiema Ministries. All Rights Reserved.

import Image from 'next/image';

export default function Services() {
  return (
    <div className='flex flex-col min-h-screen w-full gap-0'>
      <div className='flex flex-col items-start w-full mb-1 ml-10'>
        <h1 className='text-4xl font-bold text-center md:text-left pl-4 sm:pl-5 md:pl-7'>
          Services
        </h1>
      </div>
      <div className='flex flex-col md:flex-row w-full pl-4 sm:pl-5 md:pl-7 gap-3 sm:gap-4 md:gap-6 items-start'>
        <div className='flex flex-col md:items-start w-full p-10'>
          <div className='flex flex-col w-full max-w-prose mx-auto md:max-w-xl md:mx-0'>
            <span className='text-lg sm:text-xl md:text-3xl font-bold text-center md:text-left md:opacity-100'>
              First Service - 9:30AM
            </span>
            <div className='flex-1 md:text-left text-2xs sm:text-xs md:text-sm mt-2 md:mt-3 space-y-3'>
              <p className='font-semibold'>
                For those who can not make our 11:30AM service, you can come
                join us at our first service at 9:30 AM. We worship in many
                ways, joining together song, sermon, and prayer in an intimate
                and relevant manner.
              </p>
              <p className='font-semibold'>
                At the core of every worship service is an adherence to the
                truth found only in Jesus,{' '}
                <span className='underline'>
                  that all who approach the throne of God may find His grace!
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className='flex flex w-full items-center justify-center p-5'>
          <Image
            src='/imgs/first-service.webp'
            width={400}
            height={270}
            alt='First Service'
            className='w-full h-auto md:w-auto md:h-full object-cover'
          />
        </div>
      </div>
      <div className='flex flex-col md:flex-row w-full pl-4 sm:pl-5 md:pl-7 gap-3 sm:gap-4 md:gap-6 items-start bg-secondary mt-5'>
        <div className='flex w-full items-center justify-center p-5 order-2 md:order-1'>
          <Image
            src='/imgs/second-service.webp'
            width={400}
            height={270}
            alt='Second Service'
            className='w-full h-auto md:w-auto md:h-full object-cover'
          />
        </div>
        <div className='flex flex-col md:items-start w-full p-10 order-1 md:order-2'>
          <div className='flex flex-col w-full max-w-prose mx-auto md:max-w-xl md:mx-0'>
            <span className='text-lg sm:text-xl md:text-3xl font-bold text-center md:text-left md:opacity-100'>
              Second Service - 11:30AM
            </span>
            <div className='flex-1 md:text-left text-2xs sm:text-xs md:text-sm mt-2 md:mt-3 space-y-3'>
              <p className='font-semibold'>
                Our Sunday services are a reflection of the daily offerings we
                give God but in a communal setting. For it is written, "For
                where two or three are gathered in my name, there am I among
                them." and we believe that this day of rest honors the Sabbath
                as more than ritual but one of the steps we take along the
                narrow path.
              </p>
              <p className='font-semibold'>
                We worship in many ways, joining together song, sermon, and
                prayer in an intimate and relevant manner. At the core of every
                worship service is an adherence to the truth found only in
                Jesus, that all who approach the throne of God may find His
                grace!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center mt-10 mb-10'>
        <div className='flex justify-center items-center mb-10'>
          <span className='font-bold text-2xl'>Join Us</span>
        </div>
        <div className='flex flex-row'>
          <div>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d188.88665353211056!2d-73.771167190982!3d40.757923579592216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c261e761ccf2f5%3A0x914d53c41ca96477!2s45-60%20211th%20St%2C%20Bayside%2C%20NY%2011361!5e0!3m2!1sen!2sus!4v1762302108435!5m2!1sen!2sus'
              width='410'
              height='335'
              style={{ border: 0 }}
              loading='lazy'
            ></iframe>
          </div>
          <div className='flex flex-col pl-10 md:pl-25 space-y-3'>
            <p className='font-semibold'>
              Come worship with us
              <span className='block'>and experience God's presence.</span>
            </p>
            <div className='flex flex-col space-y-1'>
              <span className='underline'>Address</span>
              <span>
                45-60 211th Street
                <span className='block'>Bayside, NY 11358</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
