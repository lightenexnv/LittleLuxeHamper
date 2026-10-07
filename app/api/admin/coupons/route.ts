import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { CouponSchema } from "@/lib/validators";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const coupons = await db.coupon.findMany({
    orderBy: { code: "asc" },
  });

  return NextResponse.json(coupons);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const result = CouponSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid coupon data", details: result.error.flatten() }, { status: 400 });
    }

    const { code, type, value, minOrder, expiresAt, usageLimit, isActive } = result.data;

    const coupon = await db.coupon.create({
      data: {
        code,
        type,
        value,
        minOrder,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        usageLimit,
        isActive,
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error("Coupon create error:", error);
    return NextResponse.json({ error: "Failed to create coupon (may already exist)" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
