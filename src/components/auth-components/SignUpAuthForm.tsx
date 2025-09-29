'use client';

import React, { FormEvent, useRef, useState } from 'react';
import FormField from '../FormField';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { countryCodes } from '../../constants';
import { toast } from 'react-toastify';
import { UserSignUp } from '@src/lib/auth.actions';

const authFormSchema = () => {
  return z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    phone: z.string().max(10),
    address: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(3),
    // department: z.string().min(3) : z.string().optional(),
  });
};

function SignUpAuthForm() {
  const [isPassword, setIsPassword] = useState(true);
  const formSchema = authFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: '',
      address: '',
      email: '',
      password: '',
    },
  });
  const countryCodeRef = useRef<string | null | any>(null)

  const onSubmitHandler = async (data: { firstName: string; lastName: string; email: string; phone: string; address: string; password: string, }, event?: FormEvent<object> | undefined ) => {
    event?.preventDefault();

    const payLoad = {
      firstName: data.firstName,
      lastName: data.lastName,
      countryCode: countryCodeRef.current.value,
      phone: data.phone,
      address: data.address,
      email: data.email,
      password: data.password,
    }

    const res = await UserSignUp(payLoad)
    console.log(res);
    
    toast.error('Function not implemented.');
  }

  return (
    <div className='flex flex-col gap-3 p-5 shadow-xl rounded-br-xl rounded-bl-xl'>
      <h1 className='text-2xl font-bold'>Welcome. Create Your account!</h1>
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

          <div className="flex justify-start items-center ">
            <div className="w-1/3 pt-2">
              <label htmlFor="countryCode" className="block text-sm font-medium">Country Code</label>
              <select
                id="countryCode"
                name="countryCode"
                ref={countryCodeRef}
                required
                className="mt-1 w-full p-2 border-l border-t border-b border-gray-300 rounded-md focus:outline-none"
              >
                <option value="">Select</option>
                {countryCodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.code} ({country.name})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-2/3">
              {/* <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number *</label> */}
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

          <FormField
            label='Password'
            type={isPassword ? 'password' : 'text'}
            name='password'
            isPassword={isPassword}
            handlePasswordView={() => setIsPassword(!isPassword)}
            placeholder='Enter your password'
            cStyle='w-full focus:outline-none'
            control={form.control}
          />

          <Button className='w-full bg-blue-950 hover:bg-blue-950/80'>
            Submit
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
