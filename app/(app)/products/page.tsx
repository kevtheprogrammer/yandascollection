
import { Metadata } from 'next'; 
import ProductsList from './components/productsList';
import { auth } from '@/auth';
 

export const metadata: Metadata = {
  title: "Yanda's Collection",
  description: "find the best clothes",
};


export default async function ProductPage() {
  return (
    <>
      <ProductsList  />
    </>
  )
}

