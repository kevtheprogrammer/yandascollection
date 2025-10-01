
import React from 'react'
import { Metadata } from 'next';
import SignInComp from './Components/SignInComp';

export const metadata: Metadata = {
  title: "Sign-in Yandascollection",
  description: "find the best clothes",
};


export default function LoginPage() {

  return (
    <>
      <SignInComp /> 
    </>
  )
}

