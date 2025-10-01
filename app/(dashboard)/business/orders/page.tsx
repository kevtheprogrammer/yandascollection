import React from 'react'
import OrderListComp from './components/OrderListComp'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Orders',
}


export default function page() {
  return (
    <> 
      <OrderListComp />
    </>
  )
}