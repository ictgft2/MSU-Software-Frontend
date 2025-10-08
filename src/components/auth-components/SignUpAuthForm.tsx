'use client';

import React, { FormEvent, useRef, useState } from 'react';
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
import { UserSignUp } from '@src/lib/auth.actions';
import { checkPasswordStrength } from '@src/lib/utils';

const authFormSchema = () => {
  return z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    phone: z.string().max(10),
    address: z.string().min(5),
    email: z.string().email(),
    // password: z.string().min(3),
    // department: z.string().min(3) : z.string().optional(),
  });
};

function SignUpAuthForm() {
  const formSchema = authFormSchema();
  const countryCodeRef = useRef<string | null | any>(null)
  const [strength, setStrength] = useState({ score: 0, label: '' });
  const [passwordData, setPasswordData] = useState<string>("")
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: '',
      address: '',
      email: '',
    },
  });
  

    const handlePasswordChange = (e: any) => {
      const newPassword = e.target.value;
      setPasswordData(newPassword);
      setStrength(checkPasswordStrength(newPassword));
    };

        // A sub-component for the visual strength bar
    const PasswordStrengthMeter = ({ score }: any) => {
      const getBarColor = () => {
        switch (score) {
          case 0:
            return 'bg-gray-300'; // No input
          case 1:
            return 'bg-red-500'; // Weak
          case 2:
            return 'bg-orange-500'; // Medium
          case 3:
            return 'bg-yellow-500'; // Strong
          case 4:
          case 5:
            return 'bg-green-500'; // Very Strong
          default:
            return 'bg-gray-300';
        }
      };

      // Width is 20% for each point of score
      const barWidth = `${score * 20}%`;

      return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ease-in-out ${getBarColor()}`}
            style={{ width: barWidth }}
          ></div>
        </div>
      );
    };

  const onSubmitHandler: any = async (data: { firstName: string; lastName: string; email: string; phone: string; address: string; }, event?: FormEvent<object> | undefined ) => {
    event?.preventDefault();

    const payLoad = {
      firstName: data.firstName,
      lastName: data.lastName,
      countryCode: countryCodeRef.current.value,
      phone: data.phone,
      address: data.address,
      email: data.email,
      password: passwordData,
    }

    if (/[A-Z]/.test(passwordData) && /[0-9]/.test(passwordData) && /[^A-Za-z0-9]/.test(passwordData)) {
      console.log("✅ The string meets all criteria.");
    } else {
      console.log("❌ The string is missing a required character type.");
      return toast.error("❌ Your password is missing the required character(s).");
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
                className="mt-1 w-full h-[38px] px-2 border-l border-t border-b border-gray-300 rounded-tl-md rounded-bl-md focus:outline-none"
              >
                <option value="">Select Code</option>
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
          
           <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className='flex justify-center items-center px-2 py-1 focus:ring-purple-700 focus:border-purple-700 border border-gray-300'>
                <input
                  type={isPasswordShown ? "text" : "password"} 
                  onChange={(e: any) => handlePasswordChange(e)} 
                  className=" block w-full h-full p-1 rounded-md shadow-sm focus:outline-none" 
                  required
                />
                <div onClick={() => setIsPasswordShown(!isPasswordShown)}>
                  {
                    !isPasswordShown
                    ?
                    <Eye className='scale-75-'/>
                    :
                    <EyeOff className='scale-75-'/>
                  }
                </div>
              </div>
              {/* Password Strength Indicator */}
                {passwordData.length > 0 && (
                  <div className="mt-2">
                    <p className='my-2'>Password must be <i className='text-red-600'>atleast 8 characters</i>, including <i className='text-red-600'>uppercase</i>, <i className='text-red-600'>special characters</i> and <i className='text-red-600'>numbers</i></p>
                    <PasswordStrengthMeter score={strength.score} />
                    <p className="text-sm text-right font-medium mt-1 text-gray-600">
                      Strength: <span className="font-bold">{strength.label}</span>
                    </p>
                  </div>
                )}
                
            </div>
          {/* <div>
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

              {form.getValues.name (
                <div className="mt-2">
                  <PasswordStrengthMeter score={strength.score} />
                  <p className="text-sm text-right font-medium mt-1 text-gray-600">
                    Strength: <span className="font-bold">{strength.label}</span>
                  </p>
                </div>
              )}
              <p className='text-red-500 mt-2'>Password must be atleast 8 characters, including Uppercase, special characters and numbers</p>
          </div> */}

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
