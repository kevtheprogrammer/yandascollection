import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params;
    const productId =  Number(id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const cat = await prisma.category.findUnique({
      where: { id: productId }, 
    });

    if (!cat) {
      return NextResponse.json({ error: "Product category not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: cat.id,
        name: cat.name,
  
      },
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
