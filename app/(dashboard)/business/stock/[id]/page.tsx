import React from 'react'
import { Metadata } from 'next';
import StockDetailsComp from './component/DetailsProdFormComp';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Stock Details',
}

export default async function page({ params }: PageProps) {
  const { id } = await params;
  const product_id = parseInt(id, 10);
  return (
    <>
     <StockDetailsComp  id={product_id} />
    </ >
  )
}
 