import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { RootState } from '@/store'
// import { getOrders } from '@/data'
import type { Metadata } from 'next'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import CustomerListComp from './customers/components/CustomerList'

export const metadata: Metadata = {
  title: 'Staff Users',
}

export default async function Customers() {
  
  const roles = ['STAFF', 'ADMIN','SUPER_ADMIN']; 

  return (
    <>
       <CustomerListComp roles={roles} title={"All Users"} />
    </>
  )
}
 
