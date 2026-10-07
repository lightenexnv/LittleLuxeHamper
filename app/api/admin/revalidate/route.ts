import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { path } = await req.json();
    if (path) {
      revalidatePath(path);
    } else {
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/reels");
    }

    return NextResponse.json({ success: true, revalidated: path || "all" });
  } catch {
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
