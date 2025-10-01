import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

 

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    
    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: { select: { name: true } }, // Include category name
        images: {
          select: {
            id: true,
            colorCode:true,
            name:true,
            media:{
              select:{
                id:true,
                url:true
              }
            },
            stock:{
              select:{
                stock:true,
                size: {
                  select:
                  { 
                    id:true,
                    size:true,
                    range:true,
                  }
                }
              }
            } 
          },
        },
      },
    });
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      product,
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
