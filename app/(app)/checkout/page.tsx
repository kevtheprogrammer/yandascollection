  
import React from 'react' 
import CheckOutComp from './components/checkoutComp'
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: "Checkout | Yanda's Collection",
  description: "My checkout page for Yanda's Collection",
};

export default function CheckOutPage() { 
  return (
    <>
      <CheckOutComp />
    </>
  )
}
