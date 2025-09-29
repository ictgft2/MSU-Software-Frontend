import Properties from '../components/AllProperties';
import { Alert } from 'react-native';
import { Button } from '@/components/ui/button';
import React from 'react';
import { LinkProps } from 'next/link';
import value from '../../../reactive/ichatly/types/image';
import { data } from '../../../reactive/iryde/constants/index';
import profile from '@/assets/icons/profile.png';
/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  type: String;
  // searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type SignUpParams = {
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  address: string;
  email: string;
  password: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
    whoId: string;
    client_sc_id: number | string;
    vendor_sc_id: number | string;
    photo: string;
    name: string;
    email: string;
    isSubscribed: string;
    plan: string;
    complete: string;
    refund_plocy: string;
    terms_and_conditions: string
};
