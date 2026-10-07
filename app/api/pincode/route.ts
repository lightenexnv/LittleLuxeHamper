import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { getShippingProvider } from "@/lib/shipping";
import { db } from "@/lib/db";

const PincodeQuerySchema = z.object({
  pin: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid 6-digit Indian PIN code"),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pin = searchParams.get("pin");

    const validation = PincodeQuerySchema.safeParse({ pin });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Please enter a valid 6-digit Indian PIN code" },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`pincode_${ip}`, 30, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: "Too many pincode checks. Please wait." }, { status: 429 });
    }

    const shippingProvider = getShippingProvider();
    const serviceability = await shippingProvider.checkServiceability(validation.data.pin);

    // Look up city / state details
    const dbRecord = await db.pincode.findUnique({
      where: { pin: validation.data.pin },
    });

    const etaDays = serviceability.etaDays || 3;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + etaDays);

    const formattedDate = estimatedDate.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    return NextResponse.json({
      pin: validation.data.pin,
      serviceable: serviceability.serviceable,
      etaDays,
      estimatedDeliveryDate: formattedDate,
      city: dbRecord?.city || "Your City",
      state: dbRecord?.state || "India",
    });
  } catch {
    return NextResponse.json({ error: "Unable to verify PIN code" }, { status: 500 });
  }
}
