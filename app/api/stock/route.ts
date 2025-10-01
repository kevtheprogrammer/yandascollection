import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data = JSON.parse(formData.get('data') as string);
    const files = formData.getAll('files') as File[];

    const { productId, productImages } = data;

    let fileIndex = 0;
    const createdImages = [];

    for (const imageGroup of productImages) {
      const { colorCode, name, stocks } = imageGroup;

      // 1. Create ProductImage
      const productImage = await prisma.productImage.create({
        data: {
          colorCode,
          name,
          productId,
        },
      });

      // 2. Upload all files belonging to this imageGroup
      // You’ll assume each image group corresponds to N images
      // If you want to set how many images belong to each imageGroup,
      // consider sending that in the JSON too. For now we assume 2 per group.
      const numMediaFiles = 2; // <-- adjust if dynamic per group

      for (let i = 0; i < numMediaFiles; i++) {
        const file = files[fileIndex++];
        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadRes = await new Promise<{ secure_url: string }>((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'products' }, (err, result) => {
            if (err || !result) return reject(err);
            resolve(result);
          }).end(buffer);
        });

        await prisma.media.create({
          data: {
            url: uploadRes.secure_url,
            productImageId: productImage.id,
          },
        });
      }

      // 3. Save stock data
      for (const stock of stocks) {
        await prisma.productStock.create({
          data: {
            productImageId: productImage.id,
            sizeId: parseInt(stock.sizeId),
            stock: stock.stock,
          },
        });
      }

      createdImages.push(productImage);
    }

    return NextResponse.json({ success: true, productImages: createdImages });
  } catch (err) {
    console.error('[PRODUCT_IMAGE_POST_ERROR]', err);
    return NextResponse.json({ error: 'Failed to save product images' }, { status: 500 });
  }
}
