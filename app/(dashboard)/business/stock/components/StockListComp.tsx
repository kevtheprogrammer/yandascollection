'use client'
import LoadingComp from '@/components/app/LoadingComp'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { RootState } from '@/store'
// import { fetchAdminproduct } from '@/store/actions/cartActions'
// import { fetchPublicProductList } from '@/store/actions/productActions'
import { NoSymbolIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'


export default function StockListComp() {



  const [ appLoading, setAppLoading ] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // dispatch(fetchPublicCategoryList())
    // dispatch(fetchPublicProductList()).then(()=>setAppLoading(false)) 
  }, [dispatch])


  const products  = useAppSelector((state:RootState)=>state.products.products)

 
  
  if(appLoading) return <LoadingComp />

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <Heading>Stock</Heading>
        {/* <Button className="-my-0.5">Create product</Button> */}
      </div>
      <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Product Id</TableHeader>
            <TableHeader>Product</TableHeader>
            <TableHeader>Stock</TableHeader>
            <TableHeader>Author</TableHeader>
            <TableHeader>Created At</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
        {products?.length <   1 && (
            <TableRow className="h-24 text-start"  >
                <TableCell className='text-lg text-pink-500 flex items-center flex-row gap-2'><span>No stock found</span> <NoSymbolIcon className='size-4'/></TableCell>
            </TableRow> )
        } 
          {products?.map((product:any) => (
            <TableRow key={product?.id} href={`/business/stock/${product?.id}`} title={`product #${product?.id}`}>
              <TableCell>{product?.id}</TableCell>
              <TableCell className="text-zinc-500">{product?.name}</TableCell>
              <TableCell>{product?.stock}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {/* <Avatar src={product?.event.thumbUrl} className="size-6" /> */}
                  <span>{product?.author}</span>
                </div>
              </TableCell>
              <TableCell>{product?.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
