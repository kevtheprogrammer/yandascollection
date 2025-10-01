// import { getOrders } from '@/data'
import type { Metadata } from 'next'
import PaymentListComp from './components/PaymentListComp'

export const metadata: Metadata = {
  title: 'Payments',
}

export default async function Customers() {
  
     

  return (
    <>
       <PaymentListComp  />
    </>
  )
}
 
