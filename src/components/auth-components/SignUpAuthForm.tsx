"use client"

import React, { BaseSyntheticEvent, useState } from 'react'
import FormField from '../FormField'
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Eye, EyeClosed, EyeOff, Home } from 'lucide-react';
import Link from 'next/link';

const authFormSchema = () => {
  return z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3),
    // department: z.string().min(3) : z.string().optional(),
    // programme: z.string().optional(),
    // degree: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    // pin: type === "sign-up" ? z.string().min(6) : z.string().optional(),
  });
};

function SignUpAuthForm() {

  const [isPassword, setIsPassword] = useState(true)
  const formSchema = authFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    //   name: "",
      email: "",
      password: "",
    //   department: "",
    //   degree: "",
    //   pin: ""
    },
  });

    function onSubmitHandler(data: { email: string; password: string; }, event?: BaseSyntheticEvent<object, any, any> | undefined): unknown {
        event?.preventDefault()
        throw new Error('Function not implemented.');
    }

  return (
    <div className='flex flex-col gap-3 p-5'>
        <h1 className='text-2xl font-bold'>Welcome. Create Your account!</h1>
        <Form {...form} >
            <form
                onSubmit={form.handleSubmit(onSubmitHandler)}
                className="w-full space-y-6 mt-4 form"
            >
            <FormField
                label='Name'
                type='text'
                name='name'
                placeholder='Enter your fullname'
                cStyle=''
                control={form.control}
            />

            <FormField
                label='Email'
                type='email'
                name='email'
                placeholder='Enter your email'
                cStyle=''
                control={form.control}
            />
            
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
              

            <Button className='w-full bg-blue-950 hover:bg-blue-950/80'>Submit</Button>
            <div className='flex flex-col justify-center items-center gap-2'>
              <div className='flex justify-center items-center space-x-2'>
                <p>Already have an account?</p><Link href={"/sign-in"} className='text-blue-600'>Sign In</Link>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Link href={"/"} className='flex flex-col justify-center items-center text-blue-600'>
                  <Home className='size-7'/>
                  <p>Homepage</p>
                </Link>
              </div>
            </div>
        </form>
      </Form>
    </div>
  )
}

export default SignUpAuthForm
