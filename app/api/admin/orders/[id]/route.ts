import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const updated = await db.order.update({
      where: { id: params.id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.paymentStatus ? { paymentStatus: body.paymentStatus } : {}),
        ...(body.trackingUrl ? { trackingUrl: body.trackingUrl } : {}),
        ...(body.awb ? { awb: body.awb } : {}),
        ...(body.notes ? { notes: body.notes } : {}),
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
