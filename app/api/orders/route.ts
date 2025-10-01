import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Get all orders (or customize this to return only user-specific ones)
export async function GET() {
	try {
		const session = await auth();
		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const userId = parseInt(session.user.id);

		const orders = await prisma.order.findMany({
			where: {
				userId: userId,
			},
			include: {
				orderItems: {
					include: {
						cartItem: {
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
										range: true,
									},
								},
							},
						},
					},
				},
				payment: true,
			},
		});

		return NextResponse.json(orders, { status: 200 });
	} catch (error) {
		console.error("GET /api/public/order error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	const session = await auth();
	const user = session?.user;
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const body = await req.json();
	const {
		email,
		firstName,
		lastName,
		phone,
		address,
		city,
		country,
		province,
		postalAdd,
		shipping,
		tax,
		total,
		cartItems,
	} = body;

	try {
		// Create the order
		const order = await prisma.order.create({
			data: {
				userId: parseInt(user.id),
				email,
				firstName,
				lastName,
				phone,
				address,
				city,
				country,
				province,
				postalAdd,
				shipping,
				tax,
				total,
				orderItems: {
					create: cartItems.map((item: any) => ({
						cartItem: {
							connect: { id: item.id },
						},
					})),
				},
			},
			include: {
				orderItems: true,
			},
		});

		return NextResponse.json(order, { status: 201 });
	} catch (error) {
		console.error("POST /api/orders error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
