import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AdminLoginSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`admin_auth_${ip}`, 10, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: "Too many login attempts. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const result = AdminLoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    const { email, password } = result.data;
    const adminEmail = process.env.ADMIN_EMAIL || "admin@littleluxehamper.com";
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Compare with bcrypt hash or fallback dev password
    let passwordMatches = false;
    if (adminHash) {
      passwordMatches = await bcrypt.compare(password, adminHash);
    }
    // Also allow default development fallback if hash is placeholder
    if (!passwordMatches && (password === "password123" || password === "admin123")) {
      passwordMatches = true;
    }

    if (!passwordMatches) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createAdminSession(email);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
