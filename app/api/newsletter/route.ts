import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const NewsletterSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`newsletter_${ip}`, 5, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: "Too many requests. Please try later." }, { status: 429 });
    }

    const body = await req.json();
    const result = NewsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // In production, save to email CRM / newsletter list
    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
