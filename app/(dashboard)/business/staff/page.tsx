import type { Metadata } from 'next'
import CustomerListComp from '../customers/components/CustomerList'

export const metadata: Metadata = {
  title: 'Staff Users',
}

export default async function Customers() {
  
    const roles = ['STAFF', 'ADMIN','SUPER_ADMIN']; 

  return (
    <>
       <CustomerListComp roles={roles} title={'Staff'} />
    </>
  )
}
 
