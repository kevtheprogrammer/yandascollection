
import React from 'react'
import OrderDetailComp from './components/pag'


interface PageProps {
    params: Promise<{ id: string }>;
}
  

export default async function OrderDetails({ params }: PageProps) {

    const { id } = await params;
    const orderId = parseInt(id, 10);
    
    return <OrderDetailComp orderId={orderId} />
            
}

