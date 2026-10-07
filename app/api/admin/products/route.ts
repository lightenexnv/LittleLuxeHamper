import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { ProductSchema } from "@/lib/validators";
import { extractInstagramShortcode } from "@/lib/instagram";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await db.product.findMany({
    include: {
      images: { orderBy: { sort: "asc" } },
      reels: true,
      collections: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const result = ProductSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid product data", details: result.error.flatten() }, { status: 400 });
    }

    const {
      name,
      slug,
      shortDesc,
      description,
      pricePaise,
      mrpPaise,
      sku,
      stock,
      isCustomizable,
      isActive,
      isSample,
      contents,
      tags,
      collectionIds = [],
      seoTitle,
      seoDesc,
      images = [],
    } = result.data;

    const created = await db.product.create({
      data: {
        name,
        slug,
        shortDesc,
        description,
        pricePaise,
        mrpPaise,
        sku,
        stock,
        isCustomizable,
        isActive,
        isSample,
        contents: JSON.stringify(contents),
        tags,
        seoTitle,
        seoDesc,
        collections: {
          connect: collectionIds.map((id) => ({ id })),
        },
        images: {
          create: images.map((img, idx) => ({
            url: img.url,
            alt: img.alt || name,
            sort: img.sort ?? idx,
          })),
        },
      },
    });

    // If reel metadata provided in body
    if (body.reelUrl && body.reelPosterUrl) {
      const shortcode = extractInstagramShortcode(body.reelUrl);
      await db.reel.create({
        data: {
          productId: created.id,
          instagramUrl: body.reelUrl,
          shortcode: shortcode || `reel_${created.id}`,
          posterUrl: body.reelPosterUrl,
          caption: body.reelCaption || `Styling our ${name} gift hamper ✨`,
          showOnHome: !!body.reelShowOnHome,
          sort: 0,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/product/${slug}`);
    revalidatePath("/reels");

    return NextResponse.json({ success: true, product: created });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
