// Copyright 2025 Poiema Ministries. All Rights Reserved.

'use client';

import { useState } from 'react';
import { FieldValues, useForm, useWatch } from 'react-hook-form';
import Form from '../common/components/form/form';
import Input from '../common/components/input/input';
import Select from '../common/components/select/select';
import Textarea from '../common/components/textarea/textarea';
import AlertModal from '../common/components/alert-modal/alert-modal';

export default function NewMembersForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const attendedOtherChurches = useWatch({
    control,
    name: 'attendedOtherChurches',
  });

  const onFormSubmit = async (data: FieldValues) => {
    try {
      const formData = { ...data, message: data.message || '' };
      const response = await fetch('/api/new-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      await response.json();

      if (!response.ok) {
        // Show user-friendly error message
        setAlertModal({
          isOpen: true,
          type: 'error',
          title: 'Submission Not Sent',
          message:
            'We apologize, but we encountered an issue sending your new member information. Please try again later, or feel free to reach out to us directly. We appreciate your patience!',
        });
      } else {
        // Success - reset form and show success message
        reset();
        setAlertModal({
          isOpen: true,
          type: 'success',
          title: 'Thank You!',
          message:
            'Your new member information has been received successfully. We are excited to welcome you to our ministry family! Someone will be in touch with you soon. God bless you!',
        });
      }
    } catch {
      // Network or other errors
      setAlertModal({
        isOpen: true,
        type: 'error',
        title: 'Connection Issue',
        message:
          'We apologize, but we are having trouble connecting right now. Please check your internet connection and try again. Thank you for your understanding!',
      });
    }
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
            <Input
              label='First Name'
              type='text'
              error={errors.firstName?.message as string}
              {...register('firstName', {
                required: 'First Name is required',
              })}
            />
          </div>
          <div className='flex-1'>
            <Input
              label='Last Name'
              type='text'
              error={errors.lastName?.message as string}
              {...register('lastName', {
                required: 'Last Name is required',
              })}
            />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
          <div className='flex-1'>
            <Input
              label='Date Of Birth'
              type='date'
              error={errors.dateOfBirth?.message as string}
              {...register('dateOfBirth', {
                required: 'Date Of Birth is required',
              })}
            />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
          <div className='flex-1'>
            <Input
              label='Phone Number'
              type='tel'
              error={errors.phoneNumber?.message as string}
              {...register('phoneNumber', {
                required: 'Phone Number is required',
              })}
            />
          </div>
          <div className='flex-1'>
            <Input
              label='Email'
              type='email'
              error={errors.email?.message as string}
              {...register('email', {
                required: 'Email is required',
              })}
            />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
          <div className='flex-1'>
            <Input
              label='Address'
              type='text'
              error={errors.address?.message as string}
              {...register('address', {
                required: 'Address is required',
              })}
            />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
          <Input
            label='City'
            type='text'
            error={errors.city?.message as string}
            {...register('city', {
              required: 'City is required',
            })}
          />
          <Input
            label='State'
            type='text'
            error={errors.state?.message as string}
            {...register('state', {
              required: 'State is required',
            })}
          />
          <Input
            label='Zip Code'
            type='text'
            error={errors.zipCode?.message as string}
            {...register('zipCode', {
              required: 'Zip Code is required',
            })}
          />
        </div>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
          <div className='flex-1'>
            <Select
              label='Occupation'
              options={[
                { label: 'Student', value: 'Student' },
                { label: 'Employed', value: 'Employed' },
                { label: 'Other', value: 'Other' },
              ]}
              error={errors.occupation?.message as string}
              {...register('occupation', {
                required: 'Occupation is required',
              })}
            />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
          <div className='flex-1'>
            <Select
              label='Age Group'
              options={[
                { label: '18-24', value: '18-24' },
                { label: '25-29', value: '25-29' },
                { label: '30-35+', value: '30-35+' },
              ]}
              error={errors.ageGroup?.message as string}
              {...register('ageGroup', {
                required: 'Age Group is required',
              })}
            />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
          <div className='flex-1'>
            <Select
              label='Have you attended other churches before our church?'
              options={[
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
              ]}
              error={errors.attendedOtherChurches?.message as string}
              {...register('attendedOtherChurches', {
                required: 'This field is required',
              })}
            />
          </div>
        </div>
        {attendedOtherChurches === 'Yes' && (
          <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
            <div className='flex-1'>
              <Input
                label='If yes, where did you attend?'
                type='text'
                error={errors.otherChurches?.message as string}
                {...register('otherChurches', {
                  required: 'Please specify where you attended',
                })}
              />
            </div>
          </div>
        )}
        <div className='flex flex-col sm:flex-row gap-4 sm:gap-2'>
          <div className='flex-1'>
            <Select
              label='How did you hear about our church?'
              options={[
                { label: 'From a Friend', value: 'From a Friend' },
                { label: 'Online Search', value: 'Online Search' },
                { label: 'Physical Location', value: 'Physical Location' },
                { label: 'Other', value: 'Other' },
              ]}
              error={errors.howDidYouHearAboutUs?.message as string}
              {...register('howDidYouHearAboutUs', {
                required: 'This field is required',
              })}
            />
          </div>
        </div>
        <div className='flex flex-col gap-4 w-full mt-3 mb-5'>
          <Textarea label='Message' {...register('message')} />
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onClose={() =>
          setAlertModal({
            ...alertModal,
            isOpen: false,
          })
        }
        autoClose={alertModal.type === 'success'}
        autoCloseDelay={6000}
      />
    </Form>
  );
}
