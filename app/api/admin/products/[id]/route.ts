import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const product = await db.product.delete({
      where: { id: params.id },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/product/${product.slug}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const updated = await db.product.update({
      where: { id: params.id },
      data: {
        ...(body.name ? { name: body.name } : {}),
        ...(body.pricePaise ? { pricePaise: body.pricePaise } : {}),
        ...(body.mrpPaise ? { mrpPaise: body.mrpPaise } : {}),
        ...(body.stock !== undefined ? { stock: body.stock } : {}),
        ...(body.isSample !== undefined ? { isSample: body.isSample } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      },
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/product/${updated.slug}`);

    return NextResponse.json({ success: true, product: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
