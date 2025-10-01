import { NextResponse } from "next/server";
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
		const orders = await prisma.order.findFirst({
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

// Create a new order
export async function POST(req: Request) {
	try {
		const session = await auth();
		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = parseInt(session.user.id);

		const body = await req.json();

		const {
			email,
			firstName,
			lastName,
			address,
			company,
			city,
			country,
			province,
			postalAdd,
			phone,
			shipping,
			tax,
			total,
			cartItems,
		} = body;

		const newOrder = await prisma.order.create({
			data: {
				userId,
				email,
				firstName,
				lastName,
				address,
				company,
				city,
				country,
				province,
				postalAdd,
				phone,
				shipping: parseFloat(shipping),
				tax: parseInt(tax),
				total: parseFloat(total),
			},
		});

		if (!newOrder) {
			console.error("Order creation returned null");
			return NextResponse.json(
				{ error: "Order creation failed" },
				{ status: 500 }
			);
		}

		const orderItemData = cartItems.map((item: { id: number }) => ({
			orderId: newOrder.id,
			cartItemId: item.id,
		}));

		await prisma.orderItem.createMany({ data: orderItemData });
		return NextResponse.json({ order: newOrder }, { status: 201 }); // ✅ wrap result in object
	} catch (error: any) {
		console.log(error);
		return NextResponse.json(
			{ error: error?.message || "Failed to create order" },
			{ status: 500 }
		); // ✅ this always passes a valid object
	}
}

// // Update order status or other fields
// export async function PATCH(req: Request) {
//     try {
//         const session = await auth();
//         if (!session || !session.user) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         const { orderId, dataToUpdate } = await req.json();

//         const updatedOrder = await prisma.order.update({
//             where: { id: orderId },
//             data: dataToUpdate
//         });

//         return NextResponse.json(updatedOrder, { status: 200 });
//     } catch (error) {
//         console.error("PATCH /api/public/order error:", error);
//         return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
//     }
// }
