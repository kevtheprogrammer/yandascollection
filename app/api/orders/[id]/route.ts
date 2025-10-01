import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Get all orders (or customize this to return only user-specific ones)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { id } = await params;
        const orderId = parseInt(id);
  
        if (isNaN(orderId) || orderId <= 0) {
            return NextResponse.json({ error: 'Invalid Order Id' }, { status: 400 });
        }
      
 
        const orders = await prisma.order.findFirst({ 
            where:{
                id: orderId,
            },
            include:{
                orderItems:{
                   include:{
                        cartItem:{
                            include:{
                                product: {
                                    select: {
                                      name: true,
                                      price: true,
                                    },
                                  },
                                  productImage: {
                                    select: {
                                      media: {
                                        select: {
                                          url: true,
                                        },
                                        take: 1, // Only first image
                                      },
                                    },
                                  },
                                  size: {
                                    select: {
                                      id: true,
                                      size: true,
                                      range: true
                                    }
                                  }
                            }
                        }
                   }
                }
            }
        });

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error("GET /api/public/order error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}



export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid Order ID' }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body;
    const validStatuses = ["PENDING", "SHIPPED", "DELIVERED", "RETURNED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/public/order/[id] error:", error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

