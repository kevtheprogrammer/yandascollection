import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const { id } = await params;
      const cartItemId = parseInt(id);
  
      if (isNaN(cartItemId) || cartItemId <= 0) {
        return NextResponse.json({ error: 'Invalid cartItemId' }, { status: 400 });
      }
  
      // Delete the cart item in one query (ensures it belongs to the user)
      // const deletedItem = await prisma.cartItem.deleteMany({
      //   where: {
      //     id: cartItemId,
      //     cart: { userId: Number(session.user.id) },
      //   },
      // });
      const removedItem = await prisma.cartItem.update({
        where: { 
          id: cartItemId,
          cart: { 
            userId: parseInt(session.user.id)
          } 
          },
        data: { cartId: null },
      });
  
      if (!removedItem) {
        return NextResponse.json({ error: 'Cart item not found or unauthorized' }, { status: 403 });
      }
  
      return NextResponse.json({ message: 'Cart item removed from cart successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting cart item:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }