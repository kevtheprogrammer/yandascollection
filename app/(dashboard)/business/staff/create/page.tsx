// import { getOrders } from '@/data'
import type { Metadata } from 'next'
import CreateStaffUserFormComp from './components/CreateStaffUserFormComp'

export const metadata: Metadata = {
  title: 'Create Staff Users',
}

export default async function Customers() {
  

  return (
    <>
       <CreateStaffUserFormComp  />
    </>
  )
}
 
