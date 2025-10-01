import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "cloudinary";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const productId = parseInt(id, 10);
		if (isNaN(productId)) {
			return NextResponse.json(
				{ error: "Invalid product ID" },
				{ status: 400 }
			);
		}

		const product = await prisma.product.findUnique({
			where: { id: productId },
			include: {
				category: { select: { name: true } }, // Include category name
				images: {
					select: {
						id: true,
						colorCode: true,
						name: true,
						media: {
							select: {
								id: true,
								url: true,
							},
						},
						stock: {
							select: {
								id: true,
								stock: true,
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

		if (!product) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		return NextResponse.json(product, { status: 200 });
	} catch (error) {
		console.error("Error fetching product details:", error);
		return NextResponse.json(
			{ error: "Failed to fetch product details" },
			{ status: 500 }
		);
	}
}

cloudinary.v2.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_CLOUDINARY_API_SECRET,
});
 
export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const formData = await req.formData();
		const data = JSON.parse(formData.get("data") as string);
		const files = formData.getAll("files") as File[];

		const {
			name,
			price,
			discount,
			description,
			stock,
			categoryId,
			isPublished,
			productImages, // from frontend: includes existing and new image entries
		} = data;

		const { id } = await params;
		const productId = Number(id);

		if (!productId || isNaN(productId)) {
			return NextResponse.json(
				{ error: "Invalid product ID" },
				{ status: 400 }
			);
		}

		// 1. Upload files to Cloudinary
		const uploadedImages = await Promise.all(
			files.map(async (file) => {
				const buffer = Buffer.from(await file.arrayBuffer());
				return new Promise<{ secure_url: string }>((resolve, reject) => {
					cloudinary.v2.uploader
						.upload_stream({ folder: "products" }, (error, result) => {
							if (error) return reject(error);
							resolve(result as { secure_url: string });
						})
						.end(buffer);
				});
			})
		);

		// 2. Separate existing and new images
		const keepImageIds = productImages
			.filter((img: any) => img.id)
			.map((img: any) => Number(img.id));

		const createImages = [];
		const updateImageOps = [];
		let fileIndex = 0;

		for (const img of productImages) {
			const mediaFiles = uploadedImages.slice(
				fileIndex,
				fileIndex + img.mediaFiles.length
			);
			fileIndex += img.mediaFiles.length;

			const media = mediaFiles.map((file) => ({ url: file.secure_url }));
			const stock = img.stocks.map((s: any) => ({
				sizeId: Number(s.sizeId),
				stock: Number(s.stock),
			}));

			if (img.id) {
				// Update existing image
				updateImageOps.push(
					prisma.productImage.update({
						where: { id: img.id },
						data: {
							name: img.name,
							colorCode: img.colorCode,
							media: {
								deleteMany: {},
								createMany: { data: media },
							},
							stock: {
								deleteMany: {},
								createMany: { data: stock },
							},
						},
					})
				);
			} else {
				// Create new image
				createImages.push({
					name: img.name,
					colorCode: img.colorCode,
					media: {
						createMany: { data: media },
					},
					stock: {
						createMany: { data: stock },
					},
				});
			}
		}

		// 3. Perform transactional operations
		await prisma.$transaction([
			// a. Delete removed productImages
			prisma.productImage.deleteMany({
				where: {
					productId,
					...(keepImageIds.length > 0 && {
						id: { notIn: keepImageIds },
					}),
				},
			}),

			// b. Update product itself
			prisma.product.update({
				where: { id: productId },
				data: {
					name,
					price: parseFloat(price),
					discount: Number(discount) || 0,
					description,
					stock: Number(stock),
					categoryId: Number(categoryId),
					isPublished: Boolean(isPublished),
					images: {
						create: createImages,
					},
				},
			}),

			// c. Update existing product images
			...updateImageOps,
		]);

		// 4. Return updated product
		const updatedProduct = await prisma.product.findUnique({
			where: { id: productId },
			include: {
				images: {
					include: {
						media: true,
						stock: {
							include: { size: true },
						},
					},
				},
				category: true,
			},
		});

		return NextResponse.json(updatedProduct, { status: 200 });
	} catch (error) {
		console.error("Error updating product:", error);
		return NextResponse.json(
			{ error: "Failed to update product" },
			{ status: 500 }
		);
	}
}
