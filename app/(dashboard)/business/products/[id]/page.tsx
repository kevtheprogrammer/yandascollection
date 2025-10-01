import React from 'react'
import ProductActionComp from '../action/component/ProductActionPage';

interface PageProps {
  params: Promise<{ id: string }>;
}


export default async function page({ params }: PageProps) {
  const { id } = await params;
  const product_id = parseInt(id, 10);
  return <ProductActionComp  id={product_id} />;
}
 