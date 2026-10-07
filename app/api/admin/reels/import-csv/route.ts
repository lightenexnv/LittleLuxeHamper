import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { extractInstagramShortcode } from "@/lib/instagram";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { csvContent } = await req.json();
    if (!csvContent || typeof csvContent !== "string") {
      return NextResponse.json({ error: "Invalid CSV content" }, { status: 400 });
    }

    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    // Expect header: mediaId,thumbnailPath,instagramUrl
    let updatedCount = 0;
    let createdCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // match comma-separated tokens, handling quotes
      const match = line.match(/^"?([^",]*)"?,\s*"?([^",]*)"?,\s*"?([^"]*)"?$/);
      if (!match) continue;

      const mediaId = match[1]?.trim();
      const thumbnailPath = match[2]?.trim();
      const instagramUrl = match[3]?.trim();

      if (!instagramUrl || !instagramUrl.startsWith("http")) continue;

      const shortcode = extractInstagramShortcode(instagramUrl) || `reel_${mediaId}`;

      // Check if reel exists by shortcode or posterUrl
      const existing = await db.reel.findFirst({
        where: {
          OR: [{ shortcode }, { posterUrl: thumbnailPath }],
        },
      });

      if (existing) {
        await db.reel.update({
          where: { id: existing.id },
          data: { instagramUrl, shortcode },
        });
        updatedCount++;
      } else {
        await db.reel.create({
          data: {
            instagramUrl,
            shortcode,
            posterUrl: thumbnailPath || "/media/images/3944067240609796323_23802205442.webp",
            caption: `Little Luxe Hamper Reel @${shortcode}`,
            showOnHome: true,
            sort: 0,
          },
        });
        createdCount++;
      }
    }

    revalidatePath("/");
    revalidatePath("/reels");
    revalidatePath("/admin/reels");

    return NextResponse.json({ success: true, updatedCount, createdCount });
  } catch (error) {
    console.error("CSV import error:", error);
    return NextResponse.json({ error: "Failed to process CSV" }, { status: 500 });
  }
}
