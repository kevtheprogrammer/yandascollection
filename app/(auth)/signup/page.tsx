
 

import React from 'react'
import { Metadata } from 'next';
import SignUpComp from './Components/SignUpComp';

export const metadata: Metadata = {
  title: "Sign-in Yandascollection",
  description: "find the best clothes",
};


export default function RegisterPage() {

  return (
    <>
      <SignUpComp /> 
    </>
  )
}

