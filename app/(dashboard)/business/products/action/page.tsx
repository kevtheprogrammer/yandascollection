import React from 'react' 
import { Metadata } from 'next'
import ProductActionComp from './component/ProductActionPage'



export const metadata: Metadata = {
  title: 'Create Product',
}

export default function page() {
  return (
    < >
        <ProductActionComp />
    </ >
  )
}