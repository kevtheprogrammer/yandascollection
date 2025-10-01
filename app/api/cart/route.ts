import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    // Extract userId from request query params
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Please login to access cart' }, { status: 401 });
    }

    const myId = parseInt(session?.user?.id)
    // Fetch the cart with required details
    const cart = await prisma.cart.findFirst({
      where: { userId: myId },
      include: {
        items: {
          include: {
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
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Transform response to only return the first image URL
    const formattedCart = {
      ...cart,
      items: cart.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        size: item.size.size,
        product: {
          name: item.product.name,
          price: item.product.price,
          imageUrl: item.productImage?.media?.[0]?.url ?? null,
        },
      })),
    };

    return NextResponse.json(formattedCart, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, productImageId, sizeId, quantity } = await req.json();
    if (!productId || !productImageId || !sizeId || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let cart = await prisma.cart.findFirst({
      where: { userId: parseInt(session?.user?.id) },
      include: { items: true },
    });
    console.log('cart found ===', cart)

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: parseInt(session?.user?.id) },
        include: { items: true },
      });
      console.log('cart created', cart)
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart?.id,
        productId: parseInt(productId), sizeId: parseInt(sizeId)
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity) },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart?.id,
          productId: parseInt(productId),
          productImageId: parseInt(productImageId),
          sizeId: parseInt(sizeId),
          quantity: parseInt(quantity)
        },
      });
    }

    return NextResponse.json({ message: 'Item added to cart' }, { status: 200 });
  } catch (error) {
    console.error('error @CART:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}


export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartItemId, quantity } = await req.json();
    if (!cartItemId || typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json({ error: 'Invalid or missing fields' }, { status: 400 });
    }

    console.log(cartItemId, quantity)

    // Check if the cart item belongs to the authenticated user
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(cartItemId) },
      include: { cart: true },
    });

    if (!cartItem || !cartItem.cart || cartItem.cart.userId !== parseInt(session?.user?.id)) {
      return NextResponse.json({ error: 'Cart item not found or unauthorized' }, { status: 403 });
    }

    // Update cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItem?.id },
      data: { quantity: quantity },
    });

    return NextResponse.json(updatedCartItem, { status: 200 });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

