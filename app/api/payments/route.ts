import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import cloudinary from "cloudinary";

export async function GET(req: Request) {
	try {
		const payments = await prisma.payment.findMany({
			include: {
        order: true,
        user: true, 
			},
		});
 
		return NextResponse.json( payments, { status: 200 });
	} catch (error) {
		console.error("Error fetching payments:", error);
		return NextResponse.json(
			{ error: "Failed to fetch payments" },
			{ status: 500 }
		);
	}
}

cloudinary.v2.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // safe to expose
	api_key: process.env.CLOUDINARY_API_KEY, // server-only
	api_secret: process.env.CLOUDINARY_API_SECRET, // server-only
});

export async function POST(req: Request) {
	try {
		const session = await auth();
		const formData = await req.formData();

		const data = JSON.parse(formData.get("data") as string);
		const files = formData.getAll("files") as File[];

		const userId = session?.user?.id;
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { orderId, amount, charge, txnId, status, paymentMethod } = data;
		console.log("data", data);
		if (!orderId || !amount) {
			return NextResponse.json(
				{ error: "orderId and amount are required" },
				{ status: 400 }
			);
		}

		// Upload files to Cloudinary
		const uploadedImages = await Promise.all(
			files.map(async (file) => {
				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);

				const uploadResult = await new Promise((resolve, reject) => {
					cloudinary.v2.uploader
						.upload_stream({ folder: "payments" }, (error, result) => {
							if (error) return reject(error);
							resolve(result);
						})
						.end(buffer);
				});

				return uploadResult as { secure_url: string };
			})
		);

		// Save first image URL (or join multiple)
		const photoUrl =
			uploadedImages.length > 0 ? uploadedImages[0].secure_url : null;

		const payment = await prisma.payment.create({
			data: {
				userId: Number(userId),
				orderId: Number(orderId),
				amount: parseFloat(amount),
				charge: charge ? parseFloat(charge) : 0,
				txnId: txnId ?? null,
				photo: photoUrl,
				status: status ?? "PENDING",
				paymentMethod: paymentMethod ?? "CREDITCARD",
			},
		});
		return NextResponse.json(payment, { status: 201 });
	} catch (error: any) {
		console.error("Error creating payment:", error);
		return NextResponse.json(
			{ error: "Failed to create payment", details: error.message },
			{ status: 500 }
		);
	}
}
