'use client';

import React, { useRef, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import FormField from '../FormField';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Eye, EyeOff, Home } from 'lucide-react';
import Link from 'next/link';
import { countryCodes } from '../../constants';
import { toast } from 'react-toastify';
import { checkPasswordStrength } from '@src/lib/utils';
import authService from '@src/services/auth.service';
import { useAuth } from '@src/context/auth-context';
import { getApiErrorMessage } from '@src/utils/api-error';

const authFormSchema = () => {
  return z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    phone: z.string().max(10),
    address: z.string().min(5),
    email: z.string().email(),
  });
};

function SignUpAuthForm() {
  const formSchema = authFormSchema();
  const countryCodeRef = useRef<HTMLSelectElement | null>(null);
  const [strength, setStrength] = useState({ score: 0, label: '' });
  const [passwordData, setPasswordData] = useState<string>('');
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      email: '',
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPasswordData(newPassword);
    setStrength(checkPasswordStrength(newPassword));
  };

  const PasswordStrengthMeter = ({ score }: { score: number }) => {
    const getBarColor = () => {
      switch (score) {
        case 0:
          return 'bg-gray-300';
        case 1:
          return 'bg-red-500';
        case 2:
          return 'bg-orange-500';
        case 3:
          return 'bg-yellow-500';
        case 4:
        case 5:
          return 'bg-green-500';
        default:
          return 'bg-gray-300';
      }
    };

    const barWidth = `${score * 20}%`;

    return (
      <div className='w-full bg-gray-200 rounded-full h-2.5 mt-2'>
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ease-in-out ${getBarColor()}`}
          style={{ width: barWidth }}
        ></div>
      </div>
    );
  };

  const onSubmitHandler: SubmitHandler<z.infer<typeof formSchema>> = async (
    data
  ) => {
    const countryCode = countryCodeRef.current?.value;
    if (!countryCode) {
      toast.error('Please select a country code');
      return;
    }

    if (
      !(
        /[A-Z]/.test(passwordData) &&
        /[0-9]/.test(passwordData) &&
        /[^A-Za-z0-9]/.test(passwordData) &&
        passwordData.length >= 8
      )
    ) {
      toast.error('Your password is missing the required character(s).');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        countryCode,
        phone: data.phone,
        address: data.address,
        email: data.email,
        password: passwordData,
      });

      if (authService.getStoredToken()) {
        await refreshUser();
        toast.success('Account created successfully');
        router.replace('/in');
      } else {
        toast.success('Account created. Please sign in.');
        router.replace('/sign-in');
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to create account'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col gap-3 p-6 sm:p-8'>
      <div className='space-y-1'>
        <p className='text-[11px] font-semibold uppercase tracking-wide text-brand-red'>
          Staff Access
        </p>
        <h1 className='text-2xl font-bold text-ink'>Welcome. Create Your account!</h1>
        <p className='text-xs text-surface-muted'>
          Auth endpoints are optional while clinical APIs are under test.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className='w-full space-y-6 mt-4 form'
        >
          <div className='grid grid-cols-2 max-sm:grid-cols-1 gap-3'>
            <FormField
              label='FirstName'
              type='text'
              name='firstName'
              placeholder='Enter your firstname'
              cStyle=''
              control={form.control}
            />
            <FormField
              label='LastName'
              type='text'
              name='lastName'
              placeholder='Enter your lastname'
              cStyle=''
              control={form.control}
            />
          </div>

          <div className='grid grid-cols-2 max-sm:grid-cols-1 gap-3'>
            <FormField
              label='Email Address'
              type='email'
              name='email'
              placeholder='Enter your email'
              cStyle=''
              control={form.control}
            />

            <FormField
              label='Home Address'
              type='text'
              name='address'
              placeholder='Enter your residential address'
              cStyle=''
              control={form.control}
            />
          </div>

          <div className='flex justify-start items-center '>
            <div className='w-1/3 pt-2'>
              <label htmlFor='countryCode' className='block text-sm font-medium'>
                Country Code
              </label>
              <select
                id='countryCode'
                name='countryCode'
                ref={countryCodeRef}
                required
                className='mt-1 w-full h-[38px] px-2 border-l border-t border-b border-gray-300 rounded-tl-md rounded-bl-md focus:outline-none'
              >
                <option value=''>Select Code</option>
                {countryCodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.code} ({country.name})
                  </option>
                ))}
              </select>
            </div>
            <div className='w-2/3'>
              <FormField
                label='Mobile Phone'
                type='text'
                name='phone'
                placeholder='Enter your mobile phone'
                cStyle=''
                control={form.control}
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <div className='flex justify-center items-center px-2 py-1 focus:ring-purple-700 focus:border-purple-700 border border-gray-300'>
              <input
                type={isPasswordShown ? 'text' : 'password'}
                onChange={handlePasswordChange}
                className=' block w-full h-full p-1 rounded-md shadow-sm focus:outline-none'
                required
              />
              <div onClick={() => setIsPasswordShown(!isPasswordShown)}>
                {!isPasswordShown ? (
                  <Eye className='scale-75-' />
                ) : (
                  <EyeOff className='scale-75-' />
                )}
              </div>
            </div>
            {passwordData.length > 0 && (
              <div className='mt-2'>
                <p className='my-2'>
                  Password must be <i className='text-red-600'>atleast 8 characters</i>,
                  including <i className='text-red-600'>uppercase</i>,{' '}
                  <i className='text-red-600'>special characters</i> and{' '}
                  <i className='text-red-600'>numbers</i>
                </p>
                <PasswordStrengthMeter score={strength.score} />
                <p className='text-sm text-right font-medium mt-1 text-gray-600'>
                  Strength: <span className='font-bold'>{strength.label}</span>
                </p>
              </div>
            )}
          </div>

          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full h-10 bg-[#172554] hover:bg-[#1e3a8a] text-white'
          >
            {isSubmitting ? 'Creating account...' : 'Submit'}
          </Button>
          <Button
            type='button'
            variant='outline'
            className='w-full h-10'
            onClick={() => router.push('/in')}
          >
            Continue without auth
          </Button>
          <div className='flex flex-col justify-center items-center gap-2'>
            <div className='flex justify-center items-center space-x-2'>
              <p>Already have an account?</p>
              <Link href={'/sign-in'} className='text-blue-600'>
                Sign In
              </Link>
            </div>
            <div className='flex flex-col justify-center items-center'>
              <Link
                href={'/'}
                className='flex flex-col justify-center items-center text-blue-600'
              >
                <Home className='size-7' />
                <p>Homepage</p>
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default SignUpAuthForm;
