
import React from 'react'
import { Metadata } from 'next'; 
import ProductDetails from '../components/ProductDetails';
import { auth } from '@/auth';


export const metadata: Metadata = {
  title: "Yanda's Collection",
  description: "find the best clothes",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product_id = parseInt(id, 10);
  const session = await auth();
  
  return (
    <> 
        <ProductDetails id={product_id} session={session} /> 
    </>

  )
}

