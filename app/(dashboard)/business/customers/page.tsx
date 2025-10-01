import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { RootState } from '@/store'
// import { getOrders } from '@/data'
import type { Metadata } from 'next'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import CustomerListComp from './components/CustomerList'

export const metadata: Metadata = {
  title: 'Customers',
}

export default async function Customers() {
  
    const roles = ['CUSTOMER']; 

  return (
    <>
       <CustomerListComp roles={roles} title={'Customers'} />
    </>
  )
}
 
