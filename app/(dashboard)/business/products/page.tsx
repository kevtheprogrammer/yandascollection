// import { getOrders } from '@/data'
import type { Metadata } from 'next'
import ProductsListComp from './components/ProductsListComp'

export const metadata: Metadata = {
  title: 'Products',
}

export default async function Customers() {
  
     

  return (
    <>
       <ProductsListComp  />
    </>
  )
}
 
