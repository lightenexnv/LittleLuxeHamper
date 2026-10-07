import { NextResponse } from "next/server";
import { ReviewSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { sanitizeText } from "@/lib/sanitize";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`review_${ip}`, 5, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: "Too many submissions. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const result = ReviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid review parameters" }, { status: 400 });
    }

    const { productId, name, rating, body: reviewBody, photoUrl } = result.data;

    const review = await db.review.create({
      data: {
        productId,
        name: sanitizeText(name, 50),
        rating,
        body: sanitizeText(reviewBody, 500),
        photoUrl,
        approved: true, // auto-approve for testing or flag for admin
        isSample: false,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
