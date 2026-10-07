import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { ReelSchema } from "@/lib/validators";
import { extractInstagramShortcode } from "@/lib/instagram";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reels = await db.reel.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { sort: "asc" },
  });

  return NextResponse.json(reels);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const result = ReelSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid reel details", details: result.error.flatten() }, { status: 400 });
    }

    const { productId, instagramUrl, posterUrl, videoUrl, caption, sort, showOnHome } = result.data;
    const shortcode = extractInstagramShortcode(instagramUrl) || `reel_${Date.now()}`;

    const created = await db.reel.create({
      data: {
        productId: productId || null,
        instagramUrl,
        shortcode,
        posterUrl,
        videoUrl: videoUrl || null,
        caption,
        sort,
        showOnHome,
      },
    });

    revalidatePath("/");
    revalidatePath("/reels");
    if (productId) {
      const prod = await db.product.findUnique({ where: { id: productId }, select: { slug: true } });
      if (prod) revalidatePath(`/product/${prod.slug}`);
    }

    return NextResponse.json({ success: true, reel: created });
  } catch (error) {
    console.error("Reel create error:", error);
    return NextResponse.json({ error: "Failed to create reel" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    await db.reel.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/reels");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete reel" }, { status: 500 });
  }
}
