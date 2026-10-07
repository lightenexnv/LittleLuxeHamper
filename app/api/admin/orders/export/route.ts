import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  // Build CSV string
  const headers = [
    "Order Number",
    "Date",
    "Status",
    "Payment Status",
    "Payment Method",
    "Customer Name",
    "Phone",
    "Email",
    "Total (INR)",
    "Shipping (INR)",
    "AWB",
    "Items Count",
  ];

  const rows = orders.map((o) => {
    return [
      `"${o.number}"`,
      `"${new Date(o.createdAt).toISOString().slice(0, 10)}"`,
      `"${o.status}"`,
      `"${o.paymentStatus}"`,
      `"${o.paymentMethod}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      `"${o.customerEmail}"`,
      (o.total / 100).toFixed(2),
      (o.shipping / 100).toFixed(2),
      `"${o.awb || ""}"`,
      o.items.reduce((sum, item) => sum + item.qty, 0),
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=little_luxe_orders_${new Date().toISOString().slice(0, 10)}.csv`,
    },
  });
}
