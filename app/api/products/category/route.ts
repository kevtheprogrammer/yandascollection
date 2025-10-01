import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
// Singleton Prisma client

export async function GET(req: Request) {
    try {
        const category = await prisma.category.findMany();
        return NextResponse.json( category, { status: 201 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

 

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name } = body;
        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        const category = await prisma.category.create({
            data: { name },
        });
        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}
