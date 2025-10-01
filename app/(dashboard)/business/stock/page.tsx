// import { getOrders } from '@/data'
import type { Metadata } from 'next'
import StockListComp from './components/StockListComp'

export const metadata: Metadata = {
  title: 'Stock',
}

export default async function Customers() { 
  return (
    <>
       <StockListComp  />
    </>
  )
}
 
