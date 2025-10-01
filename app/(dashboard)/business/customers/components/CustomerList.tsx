'use client'
import LoadingComp from '@/components/app/LoadingComp'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { RootState } from '@/store'
import { fetchUsers } from '@/store/actions/userActions'
import { NoSymbolIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect } from 'react'
// import { getOrders } from '@/data'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
 
export default function CustomerListComp({roles, title}:{
  roles:any,
  title:any
}) {
 
   const dispatch = useAppDispatch();
   const { profile, users }  = useAppSelector((state: RootState) => state.user)

  useEffect(() => {
    dispatch(fetchUsers({roles:roles.join(',')}));
  }, [dispatch, roles])
  
   if (!users)  <LoadingComp />
  
   return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>{title}</Heading>
        <Link href={'/business/staff/create'} className="flex items-center gap-2">
          <Button className="-my-0.5">Create New Staff user</Button>
        </Link>
      </div>
      <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>User Id</TableHeader>
            <TableHeader>Username</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader >Role</TableHeader>
            <TableHeader >Active</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.length === 0 || users === undefined && (
            <TableRow className="h-24 text-start" >
              <TableCell className='text-lg text-pink-500 flex items-center flex-row gap-2'><span>No users found</span> <NoSymbolIcon className='size-4'/></TableCell>
            </TableRow> )
          }
          {users?.map((user:any) => (
            <TableRow key={user?.id} href={`/business/customers/${user?.id}`} title={`Order #${user?.id}`}>
              <TableCell>{user?.id}</TableCell>
              <TableCell className="text-zinc-500">{user?.firstName} {user?.lastName}</TableCell>
              <TableCell>{user?.email}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {/* <Avatar src={user?.event.thumbUrl} className="size-6" /> */}
                  <span>{user?.role}</span>
                </div>
              </TableCell>
              <TableCell>{user?.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
 
