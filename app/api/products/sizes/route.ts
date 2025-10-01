import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Interface } from "readline";
// Singleton Prisma client

export async function GET(req: Request) {
  try { 
    // Query products with filters and pagination
    const sizes = await prisma.productSize.findMany(); 
    return NextResponse.json( sizes, { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
 