import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);

		// Pagination
		const page = Number(searchParams.get("page")) || 1;
		const pageSize = Number(searchParams.get("pageSize")) || 10;
		const skip = (page - 1) * pageSize;

		const search = searchParams.get("search");

		// Multi-category support
		const categoryIds = searchParams.getAll("categoryIds"); // ?categoryIds=1&categoryIds=2
		const categories = categoryIds
			.map((id) => Number(id))
			.filter((id) => !isNaN(id));

		// Price filters
		const minPrice = searchParams.get("minPrice");
		const maxPrice = searchParams.get("maxPrice");

		// Multi-size support
		const sizes = searchParams.getAll("sizes"); // ?sizes=M&sizes=L

		// Build filters
		const filters: any = {};

		if (search) {
			filters.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ category: { name: { contains: search, mode: "insensitive" } } },
			];
		}

		if (categories.length > 0) {
			filters.categoryId = { in: categories };
		}

		if (minPrice || maxPrice) {
			filters.price = {};
			if (minPrice && !isNaN(Number(minPrice)))
				filters.price.gte = Number(minPrice);
			if (maxPrice && !isNaN(Number(maxPrice)))
				filters.price.lte = Number(maxPrice);
		}

		if (sizes.length > 0) {
			filters.images = {
				some: {
					stock: {
						some: {
							size: {
								size: { in: sizes }, // <-- correct: ProductStock → ProductSize.size
							},
						},
					},
				},
			};
		}

		// Query products
		const products = await prisma.product.findMany({
			where: filters,
			include: {
				category: { select: { name: true } },
				images: {
					select: {
						id: true,
						colorCode: true,
						name: true,
						stock: {
							select: {
								id: true,
								size: { select: { id: true, size: true, range: true } },
							},
						},
						media: {
							select: {
								id: true,
								url: true,
							},
						},
					},
					orderBy: { id: "asc" },
				},
			},
			skip,
			take: pageSize,
		});

		// Count
		const totalProducts = await prisma.product.count({ where: filters });

		// Format response
		const formattedProducts = products.map((product) => {
			const firstImage = product.images[0];
			return {
				thumb:
					product.images.length > 0 ? product?.images[0]?.media[0]?.url : null,
				id: product.id,
				name: product.name,
				price: product.price,
				categoryId: product.categoryId,
				categoryName: product.category?.name || null,
				images: firstImage
					? {
							id: firstImage.id,
							media: firstImage.media.map((m) => ({
								id: m.id,
								url: m.url,
							})),
					  }
					: null,
			};
		});

		return NextResponse.json(
			{
				total: totalProducts,
				page,
				pageSize,
				totalPages: Math.ceil(totalProducts / pageSize),
				data: formattedProducts,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching products:", error);
		return NextResponse.json(
			{ error: "Failed to fetch products" },
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
			productImages,
		} = data;

		// Basic validation
		if (!name || typeof name !== "string") {
			return NextResponse.json({ error: "Name is required" }, { status: 400 });
		}

		if (!price || isNaN(price)) {
			return NextResponse.json(
				{ error: "Price must be a number" },
				{ status: 400 }
			);
		}

		if (!categoryId) {
			return NextResponse.json(
				{ error: "Category is required" },
				{ status: 400 }
			);
		}

		const uploadedImages = await Promise.all(
			files.map(async (file) => {
				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);

				const uploadResult = await new Promise((resolve, reject) => {
					cloudinary.v2.uploader
						.upload_stream({ folder: "products" }, (error, result) => {
							if (error) return reject(error);
							resolve(result);
						})
						.end(buffer);
				});

				return uploadResult as { secure_url: string };
			})
		);

		// Rebuild structured image data
		const imageData = [];
		let fileIndex = 0;

		for (const img of productImages) {
			const mediaFilesCount = img.mediaFiles.length;
			const media = uploadedImages
				.slice(fileIndex, fileIndex + mediaFilesCount)
				.map((f) => ({
					url: f.secure_url,
				}));
			fileIndex += mediaFilesCount;

			imageData.push({
				name: img.name,
				colorCode: img.colorCode,
				media: {
					createMany: {
						data: media,
					},
				},
				stock: {
					createMany: {
						data: img.stocks.map((s: any) => ({
							sizeId: Number(s.sizeId),
							stock: Number(s.stock),
						})),
					},
				},
			});
		}

		// Update product
		const createdProduct = await prisma.product.create({
			data: {
				name,
				price: parseFloat(price),
				discount: Number(discount) || 0,
				description,
				stock: Number(stock),
				categoryId: Number(categoryId),
				isPublished: isPublished ?? false,
				images: {
					create: imageData, // Create new
				},
			},
			include: {
				images: {
					include: {
						media: true,
						stock: true,
					},
				},
			},
		});

		return NextResponse.json(createdProduct, { status: 201 });
	} catch (error) {
		console.error("Error creating product:", error);
		return NextResponse.json(
			{ error: "Failed to create product" },
			{ status: 500 }
		);
	}
}
