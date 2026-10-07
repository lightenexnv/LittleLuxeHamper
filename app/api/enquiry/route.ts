import { NextResponse } from "next/server";
import { EnquirySchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { sanitizeText } from "@/lib/sanitize";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`enquiry_${ip}`, 5, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: "Too many enquiries submitted. Please wait a moment." }, { status: 429 });
    }

    const body = await req.json();
    const result = EnquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Please fill in all required fields accurately" }, { status: 400 });
    }

    const { type, name, email, phone, company, quantity, message } = result.data;

    const enquiry = await db.enquiry.create({
      data: {
        type,
        name: sanitizeText(name, 100),
        email: email.trim().toLowerCase(),
        phone: sanitizeText(phone, 20),
        company: company ? sanitizeText(company, 100) : null,
        quantity: quantity || null,
        message: sanitizeText(message, 1000),
      },
    });

    return NextResponse.json({ success: true, id: enquiry.id });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}
