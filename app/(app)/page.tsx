

import React from 'react'
import { Metadata } from 'next';
 
 
import HomeBodyProducts from '@/components/app/TrendingProducts';
 


export const metadata: Metadata = {
  title: "Yanda's Collection",
  description: "find the best clothes",
};


export default function LoginPage() {

  return  <HomeBodyProducts />
    
}

