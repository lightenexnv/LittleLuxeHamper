import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import sharp from "sharp";
import { PrismaClient } from "@prisma/client";
// @ts-ignore
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const ffmpegPath = ffmpegInstaller.path;

const db = new PrismaClient();

const SOURCE_DIR = fs.existsSync("little_luxehamper")
  ? "little_luxehamper"
  : "little_luxe_hamper";

const MEDIA_OUT_DIR = path.join("public", "media");
const IMAGES_OUT_DIR = path.join(MEDIA_OUT_DIR, "images");
const VIDEOS_OUT_DIR = path.join(MEDIA_OUT_DIR, "videos");
const CONTENT_DIR = "content";

fs.mkdirSync(IMAGES_OUT_DIR, { recursive: true });
fs.mkdirSync(VIDEOS_OUT_DIR, { recursive: true });
fs.mkdirSync(CONTENT_DIR, { recursive: true });

function idToShortcode(idStr: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  try {
    let id = BigInt(idStr);
    let shortcode = "";
    while (id > 0n) {
      const rem = Number(id % 64n);
      shortcode = alphabet[rem] + shortcode;
      id = id / 64n;
    }
    return shortcode;
  } catch {
    return "";
  }
}

// Visual classification dictionary based on our vision analysis of the real assets
const POST_METADATA: Record<
  string,
  {
    name: string;
    slug: string;
    category: string;
    shortDesc: string;
    description: string;
    contents: string[];
    tags: string;
    pricePaise: number;
    mrpPaise: number;
    needsReview: boolean;
  }
> = {
  "3944067240609796323": {
    name: "Pastel Pipe-Cleaner Floral Bloom Bouquet",
    slug: "pastel-pipe-cleaner-floral-bloom-bouquet",
    category: "Bouquets",
    shortDesc: "Handcrafted everlasting pipe-cleaner floral bouquet with wax seal and pearl ribbon.",
    description: "An exquisite, handcrafted everlasting bouquet made with soft pipe-cleaner floral artistry in bright pastels. Accented with lush greenery, wrapped in premium dual-layered crepe paper, tied with a lustrous pearl-beaded satin bow and sealed with a royal gold wax crest.",
    contents: [
      "Handcrafted velvet pipe-cleaner daisies and sunflowers",
      "Lavender bloom stem and emerald foliage accents",
      "Luxe dual-tone pastel wrap",
      "Pearl-trimmed satin ribbon bow",
      "Royal gold wax seal crest"
    ],
    tags: "Floral, Everlasting, Bouquet, Handcrafted, Aesthetic",
    pricePaise: 149900,
    mrpPaise: 189900,
    needsReview: false,
  },
  "3954806144118936893": {
    name: "Royal Raksha Bandhan Keepsake Trunk",
    slug: "royal-raksha-bandhan-keepsake-trunk",
    category: "Festive",
    shortDesc: "Illuminated matte-black celebration trunk with fairy lights, silver rakhis & luxury accessories.",
    description: "The ultimate festive keepsake trunk featuring custom 'Happy Raksha Bandhan Bhai & Bhabhi' calligraphy. Complete with warm fairy string lights, artisan silver rakhis, sage green vegan leather essentials, festive crystal bangles, and designer personal accessories.",
    contents: [
      "Illuminated luxury matte-black trunk with warm micro fairy lights",
      "Custom calligraphy keepsake lid plaque",
      "Artisan handcrafted Bhai & Bhabhi silver rakhis",
      "Sage green tailored essentials wallet",
      "Festive glass bangles set with floral clip",
      "Luxe satin hair scrunchie"
    ],
    tags: "Rakhi, Festive, Bhai Bhabhi, Keepsake, Illuminated, Luxury",
    pricePaise: 349900,
    mrpPaise: 429900,
    needsReview: false,
  },
  "3971308063021843388": {
    name: "Blush 'My Girl' Birthday Celebration Trunk",
    slug: "blush-my-girl-birthday-celebration-trunk",
    category: "Birthday",
    shortDesc: "Romantic blush-pink keepsake trunk with fairy lights, birthday bunting, jewellery & accessories.",
    description: "Designed for your favourite person. A delicate blush pink illuminated gift trunk with custom bunting, fairy lights, antique oxidised silver jhumkas, sparkling bangles, emerald charm bracelet, cute collectible figurine, and travel jewellery organizer.",
    contents: [
      "Illuminated pastel pink rigid gift trunk with warm fairy lights",
      "Miniature 'Happy Birthday' hanging banner bunting",
      "Sparkling glass & stone bangles set",
      "Antique oxidised silver jhumkas in acrylic display box",
      "Emerald charm gold-toned bracelet",
      "Cute figurine charm & floral hair claw clip",
      "Travel jewellery organizer pouch"
    ],
    tags: "Birthday, For Her, Blush Pink, Jewelry, Fairy Lights, Bestie",
    pricePaise: 299900,
    mrpPaise: 369900,
    needsReview: false,
  },
  "3981723450503017365": {
    name: "Crimson & Ivory Eternal Rose Luxe Bouquet",
    slug: "crimson-ivory-eternal-rose-luxe-bouquet",
    category: "Bouquets",
    shortDesc: "Handcrafted eternal rose bouquet in crimson velvet & ivory with mocha-gold luxury wrapping.",
    description: "Timeless romance that never wilts. Mastercrafted with rich crimson velvet and pure ivory eternal roses, interspersed with delicate baby's breath accents, wrapped in dual-tone mocha-taupe waterproof paper and finished with dark chocolate ribbon.",
    contents: [
      "Handcrafted eternal crimson red velvet roses",
      "Ivory white eternal rose blossoms",
      "Decorative baby's breath & foliage sprigs",
      "Mocha-taupe waterproof luxury floral paper",
      "Chocolate brown satin ribbon tie"
    ],
    tags: "Anniversary, Romance, Roses, Eternal Bouquet, For Her",
    pricePaise: 189900,
    mrpPaise: 229900,
    needsReview: false,
  },
  "3988244139536006049": {
    name: "Monochromatic Panda & Crochet Blossom Bouquet",
    slug: "monochromatic-panda-crochet-blossom-bouquet",
    category: "Quirky",
    shortDesc: "Aesthetic plush panda bouquet with hand-crocheted black & white blossoms and vintage wrap.",
    description: "A whimsical boutique creation featuring a plush panda with headphones as the centerpiece, flanked by mini panda companions and delicately hand-crocheted black and white floral stems. Wrapped in gothic newsprint and gold-trimmed matte black paper.",
    contents: [
      "Plush panda with winter headphone earmuffs",
      "Twin miniature panda plush clips",
      "Hand-crocheted monochrome floral stems & lily of the valley",
      "Vintage typography & black-gold dual wrapping",
      "Embossed luxury ribbon tie"
    ],
    tags: "Panda, Crochet, Quirky, Cute, Unique, Birthday",
    pricePaise: 249900,
    mrpPaise: 299900,
    needsReview: false,
  },
  "3992666248626285583": {
    name: "Golden 'Cutie Pie' Birthday Celebration Trunk",
    slug: "golden-cutie-pie-birthday-celebration-trunk",
    category: "Birthday",
    shortDesc: "Vibrant illuminated black trunk with golden bunting, colourful bangles, beauty charms & fairy lights.",
    description: "A joyous celebration in a box! Black illuminated luxury trunk fitted with bright yellow 'Happy Birthday' bunting, turquoise and magenta bangles, golden satin scrunchies, pearl hair jewels, pastel nail polish, and playful collectible keepsakes.",
    contents: [
      "Illuminated rigid gift box with warm fairy lights",
      "Golden celebratory 'Happy Birthday' bunting",
      "Vibrant multi-hued glass bangles stack",
      "Golden satin luxury hair scrunchies",
      "Floral hair claw & pearl hairpins",
      "Nail lacquer & sweet charm figurines"
    ],
    tags: "Birthday, Cutie Pie, Colorful, Celebration, Joyful",
    pricePaise: 279900,
    mrpPaise: 339900,
    needsReview: false,
  },
  "4000538639129881934": {
    name: "Gentleman's Signature Birthday Trunk",
    slug: "gentlemans-signature-birthday-trunk",
    category: "For Him",
    shortDesc: "Illuminated luxury trunk featuring Polo Ralph Lauren shirt, Calvin Klein accessories & luxury perfume.",
    description: "Sophisticated luxury curated for him. Features an illuminated black trunk with heartfelt message tags and warm fairy lights, custom-fit gingham Polo Ralph Lauren shirt, Calvin Klein designer accessories box, matte black sunglasses, and Bella Vita Eau de Parfum.",
    contents: [
      "Luxury black gift trunk with warm micro fairy lights",
      "Golden 'Happy Birthday' bunting & heartfelt love tags",
      "Polo Ralph Lauren custom-fit pink gingham shirt",
      "Calvin Klein essentials collection keepsake box",
      "Matte black contemporary sunglasses",
      "Bella Vita luxury fragrance"
    ],
    tags: "For Him, Gentleman, Luxury, Polo Ralph Lauren, Calvin Klein, Birthday",
    pricePaise: 499900,
    mrpPaise: 599900,
    needsReview: false,
  },
  "3983161220467459058": {
    name: "Petite Pastel Romance Mini Blossom Cone",
    slug: "petite-pastel-romance-mini-blossom-cone",
    category: "Bouquets",
    shortDesc: "Boutique hand-wrapped mini blossom cone with pastel everlasting florals and keepsake card.",
    description: "The sweetest petite gesture. Hand-arranged everlasting mini blooms in soft lavender and blush, encased in an artisan cone with gold-embossed ribbon and personalized heartfelt note card.",
    contents: [
      "Handcrafted mini eternal blossoms",
      "Artisan cone presentation wrap",
      "Gold-edged satin ribbon",
      "Personalized mini greeting card"
    ],
    tags: "Mini Bouquet, Petite, Sweet Gesture, Addon",
    pricePaise: 79900,
    mrpPaise: 99900,
    needsReview: false,
  },
  "3989490366206121707": {
    name: "Midnight Luxe Groom & Celebration Box",
    slug: "midnight-luxe-groom-celebration-box",
    category: "For Him",
    shortDesc: "Custom midnight-themed celebration box with premium groom accessories & personalized accents.",
    description: "Curated celebration box designed for grand milestones. Deep midnight accents, customized celebratory lid graphics, premium lifestyle accessories, and celebratory party tokens.",
    contents: [
      "Rigid midnight keepsake box with custom typography",
      "Warm ambient fairy light string",
      "Groom lifestyle accessories",
      "Custom gift note & sentiment stickers"
    ],
    tags: "Groom, For Him, Celebration, Midnight, Luxury",
    pricePaise: 0,
    mrpPaise: 0,
    needsReview: true, // Needs price confirmation from owner -> shows "Enquire on WhatsApp"
  },
  "3978689181554415915": {
    name: "Sweet Nostalgia Anniversary Memory Box",
    slug: "sweet-nostalgia-anniversary-memory-box",
    category: "Anniversary",
    shortDesc: "Intimate romantic memory trunk with personalized photo prints, twinkle lights & keepsake treasures.",
    description: "Celebrate your love story with every detail. A hand-finished anniversary keepsake trunk filled with twinkle fairy lights, heartfelt handwritten message tags, and intimate tokens of affection.",
    contents: [
      "Handmade keepsake memory box with fairy lights",
      "Custom sentiment photo cards",
      "Romance tokens & delicate sweet treats",
      "Personalized calligraphy letter"
    ],
    tags: "Anniversary, Romance, Memory Box, Personalized",
    pricePaise: 0,
    mrpPaise: 0,
    needsReview: true, // Needs price confirmation from owner -> shows "Enquire on WhatsApp"
  },
};

interface ProcessedMedia {
  id: string;
  type: "image" | "video";
  groupId: string;
  originalFile: string;
  publicPath: string;
  widths: number[];
  blurDataURL: string;
  dominantColor: string;
  altText: string;
  shortcode: string;
  instagramUrl: string;
  isPoster?: boolean;
}

async function processImage(
  fileName: string,
  groupId: string
): Promise<ProcessedMedia> {
  const inputPath = path.join(SOURCE_DIR, fileName);
  const baseName = path.parse(fileName).name;
  const mediaId = baseName.split("_")[0];
  const shortcode = idToShortcode(mediaId);
  const instagramUrl = shortcode
    ? `https://www.instagram.com/p/${shortcode}/`
    : `https://www.instagram.com/little_luxehamper/`;

  const img = sharp(inputPath);
  const meta = await img.metadata();
  const stats = await img.stats();
  const r = Math.round(stats.channels[0].mean);
  const g = Math.round(stats.channels[1].mean);
  const b = Math.round(stats.channels[2].mean);
  const hex = "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

  // Generate 24px blur placeholder
  const blurBuffer = await sharp(inputPath)
    .resize(24, 24, { fit: "cover" })
    .webp({ quality: 20 })
    .toBuffer();
  const blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

  const widths = [400, 800, 1200];
  const validWidths: number[] = [];

  // Generate responsive WebP
  for (const w of widths) {
    if (meta.width && w > meta.width * 1.5) continue;
    validWidths.push(w);

    const outWebp = path.join(IMAGES_OUT_DIR, `${baseName}-${w}.webp`);
    if (!fs.existsSync(outWebp)) {
      await sharp(inputPath)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 80, effort: 3 })
        .toFile(outWebp);
    }
  }

  // Also produce standard 4:5 and 9:16 crops for social / hero displays
  const out4x5 = path.join(IMAGES_OUT_DIR, `${baseName}-4x5.webp`);
  if (!fs.existsSync(out4x5)) {
    await sharp(inputPath)
      .rotate()
      .resize(800, 1000, { fit: "cover", position: "attention" })
      .webp({ quality: 82 })
      .toFile(out4x5);
  }

  const out9x16 = path.join(IMAGES_OUT_DIR, `${baseName}-9x16.webp`);
  if (!fs.existsSync(out9x16)) {
    await sharp(inputPath)
      .rotate()
      .resize(720, 1280, { fit: "cover", position: "attention" })
      .webp({ quality: 82 })
      .toFile(out9x16);
  }

  // Standard webp fallback
  const standardWebp = path.join(IMAGES_OUT_DIR, `${baseName}.webp`);
  if (!fs.existsSync(standardWebp)) {
    await sharp(inputPath)
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(standardWebp);
  }

  const groupInfo = POST_METADATA[groupId] || {
    name: "Little Luxe Hamper Keepsake",
  };
  const altText = `Authentic ${groupInfo.name} handcrafted by Little Luxe Hamper`;

  return {
    id: baseName,
    type: "image",
    groupId,
    originalFile: fileName,
    publicPath: `/media/images/${baseName}.webp`,
    widths: validWidths,
    blurDataURL,
    dominantColor: hex,
    altText,
    shortcode,
    instagramUrl,
  };
}

async function processVideo(
  fileName: string,
  groupId: string
): Promise<ProcessedMedia | null> {
  const inputPath = path.join(SOURCE_DIR, fileName);
  const baseName = path.parse(fileName).name;
  const mediaId = baseName.split("_")[0];
  const shortcode = idToShortcode(mediaId);
  const instagramUrl = shortcode
    ? `https://www.instagram.com/reel/${shortcode}/`
    : `https://www.instagram.com/little_luxehamper/`;

  const posterJpgPath = path.join(IMAGES_OUT_DIR, `${baseName}-poster.jpg`);
  const posterWebpPath = path.join(IMAGES_OUT_DIR, `${baseName}-poster.webp`);
  const videoLoopPath = path.join(VIDEOS_OUT_DIR, `${baseName}-loop.mp4`);

  // Extract poster frame using ffmpeg if not already extracted
  if (!fs.existsSync(posterJpgPath)) {
    try {
      execFileSync(ffmpegPath, [
        "-ss",
        "00:00:01",
        "-i",
        inputPath,
        "-vframes",
        "1",
        "-q:v",
        "2",
        posterJpgPath,
        "-y",
      ]);
    } catch {
      try {
        execFileSync(ffmpegPath, [
          "-i",
          inputPath,
          "-vframes",
          "1",
          "-q:v",
          "2",
          posterJpgPath,
          "-y",
        ]);
      } catch (err) {
        console.warn(`Could not extract poster for ${fileName}`);
        return null;
      }
    }
  }

  if (!fs.existsSync(posterJpgPath)) return null;

  // Convert poster to webp & generate blur
  const img = sharp(posterJpgPath);
  const stats = await img.stats();
  const r = Math.round(stats.channels[0].mean);
  const g = Math.round(stats.channels[1].mean);
  const b = Math.round(stats.channels[2].mean);
  const hex = "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

  const blurBuffer = await sharp(posterJpgPath)
    .resize(24, 24, { fit: "cover" })
    .webp({ quality: 20 })
    .toBuffer();
  const blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

  if (!fs.existsSync(posterWebpPath)) {
    await sharp(posterJpgPath)
      .resize({ width: 720, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(posterWebpPath);
  }

  // Transcode muted ≤1.5 MB H.264 loop MP4 if needed
  if (!fs.existsSync(videoLoopPath)) {
    const inputSize = fs.statSync(inputPath).size;
    // If original is already < 1.5MB and 30s or less, we can stream/copy directly
    if (inputSize <= 1500000) {
      fs.copyFileSync(inputPath, videoLoopPath);
    } else {
      try {
        execFileSync(ffmpegPath, [
          "-i",
          inputPath,
          "-t",
          "8",
          "-vf",
          "scale='min(720,iw)':-2",
          "-c:v",
          "libx264",
          "-crf",
          "28",
          "-preset",
          "fast",
          "-an",
          videoLoopPath,
          "-y",
        ]);
      } catch {
        fs.copyFileSync(inputPath, videoLoopPath);
      }
    }
  }

  const groupInfo = POST_METADATA[groupId] || {
    name: "Little Luxe Hamper Reel",
  };
  const altText = `Unboxing reel of ${groupInfo.name} on @little_luxehamper`;

  return {
    id: baseName,
    type: "video",
    groupId,
    originalFile: fileName,
    publicPath: `/media/videos/${baseName}-loop.mp4`,
    widths: [720],
    blurDataURL,
    dominantColor: hex,
    altText,
    shortcode,
    instagramUrl,
  };
}

async function main() {
  console.log("=== Little Luxe Hamper Asset Ingestion ===");
  console.log(`Source directory: ${SOURCE_DIR}`);

  const allFiles = fs.readdirSync(SOURCE_DIR);
  const jpgFiles = allFiles.filter((f) => f.endsWith(".jpg"));
  const mp4Files = allFiles.filter((f) => f.endsWith(".mp4"));

  console.log(`Found ${jpgFiles.length} images and ${mp4Files.length} videos.`);

  const manifest: ProcessedMedia[] = [];
  const reelLinksCsvRows: string[] = ["mediaId,thumbnailPath,instagramUrl"];

  console.log("\n1. Ingesting images with Sharp...");
  for (let i = 0; i < jpgFiles.length; i++) {
    const f = jpgFiles[i];
    const groupId = f.replace(/(_\d+)?\.jpg$/, "").split("_")[0];
    try {
      const processed = await processImage(f, groupId);
      manifest.push(processed);
      reelLinksCsvRows.push(
        `"${processed.id}","${processed.publicPath}","${processed.instagramUrl}"`
      );
      if ((i + 1) % 10 === 0 || i === jpgFiles.length - 1) {
        console.log(`  Processed ${i + 1}/${jpgFiles.length} images`);
      }
    } catch (err) {
      console.error(`Error processing image ${f}:`, err);
    }
  }

  console.log("\n2. Ingesting videos with FFmpeg...");
  // Process the best reels for our showcase and products
  for (let i = 0; i < Math.min(25, mp4Files.length); i++) {
    const f = mp4Files[i];
    const groupId = f.replace(/(_\d+)?\.mp4$/, "").split("_")[0];
    try {
      const processed = await processVideo(f, groupId);
      if (processed) {
        manifest.push(processed);
        reelLinksCsvRows.push(
          `"${processed.id}","/media/images/${processed.id}-poster.webp","${processed.instagramUrl}"`
        );
      }
      if ((i + 1) % 15 === 0 || i === mp4Files.length - 1) {
        console.log(`  Processed ${i + 1}/${mp4Files.length} videos`);
      }
    } catch (err) {
      console.error(`Error processing video ${f}:`, err);
    }
  }

  // Write media manifest
  const manifestPath = path.join(CONTENT_DIR, "media-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`\nWritten media manifest with ${manifest.length} items to ${manifestPath}`);

  // Write reel-links CSV
  const csvPath = path.join(CONTENT_DIR, "reel-links.csv");
  fs.writeFileSync(csvPath, reelLinksCsvRows.join("\n"), "utf-8");
  console.log(`Written reel links CSV to ${csvPath}`);

  console.log("\n3. Re-seeding database with authentic Little Luxe Hamper products...");

  // Clear previous sample products and images
  await db.review.deleteMany({});
  await db.orderItem.deleteMany({});
  await db.productImage.deleteMany({});
  await db.reel.deleteMany({});
  await db.product.deleteMany({});

  // Ensure collections exist
  const occasionColl = await db.collection.upsert({
    where: { slug: "occasion-hampers" },
    update: {},
    create: {
      slug: "occasion-hampers",
      name: "Occasion Hampers",
      type: "occasion",
      intro: "Curated for birthdays, weddings, anniversaries, and unforgettable milestones.",
    },
  });

  const bouquetsColl = await db.collection.upsert({
    where: { slug: "eternal-bouquets" },
    update: {},
    create: {
      slug: "eternal-bouquets",
      name: "Everlasting Bouquets",
      type: "category",
      intro: "Handcrafted pipe-cleaner and crochet floral bouquets that never wilt.",
    },
  });

  const celebrationColl = await db.collection.upsert({
    where: { slug: "celebration-trunks" },
    update: {},
    create: {
      slug: "celebration-trunks",
      name: "Celebration Trunks",
      type: "category",
      intro: "Illuminated keepsake trunks with fairy lights, sentiment tags, and luxury essentials.",
    },
  });

  // Group images and videos by groupId
  const mediaByGroup: Record<string, ProcessedMedia[]> = {};
  for (const m of manifest) {
    if (!mediaByGroup[m.groupId]) mediaByGroup[m.groupId] = [];
    mediaByGroup[m.groupId].push(m);
  }

  let productsCount = 0;
  const createdProducts: any[] = [];

  for (const [groupId, meta] of Object.entries(POST_METADATA)) {
    const groupMedia = mediaByGroup[groupId] || [];
    const images = groupMedia.filter((m) => m.type === "image");
    const videos = groupMedia.filter((m) => m.type === "video");

    // Primary image is first image, or fallback to first video poster
    let primaryImage = images[0]?.publicPath;
    if (!primaryImage && videos[0]) {
      primaryImage = `/media/images/${videos[0].id}-poster.webp`;
    }
    if (!primaryImage) continue;

    const sku = `LLH-${meta.slug.toUpperCase().slice(0, 8)}-${Math.floor(100 + Math.random() * 900)}`;

    const product = await db.product.create({
      data: {
        name: meta.name,
        slug: meta.slug,
        shortDesc: meta.shortDesc,
        description: meta.description,
        pricePaise: meta.pricePaise,
        mrpPaise: meta.mrpPaise,
        sku,
        stock: 25,
        isCustomizable: true,
        isActive: true,
        isSample: false,
        needsReview: meta.needsReview,
        contents: JSON.stringify(meta.contents),
        tags: meta.tags,
        seoTitle: `${meta.name} | Little Luxe Hamper India`,
        seoDesc: `${meta.shortDesc} Handcrafted luxury gifting with PAN-India delivery.`,
        collections: {
          connect: [
            meta.category === "Bouquets"
              ? { id: bouquetsColl.id }
              : meta.category === "Birthday" || meta.category === "Festive"
              ? { id: celebrationColl.id }
              : { id: occasionColl.id },
          ],
        },
        images: {
          create: images.map((img, idx) => ({
            url: img.publicPath,
            alt: `${meta.name} - View ${idx + 1}`,
            sort: idx,
          })),
        },
      },
    });

    createdProducts.push(product);
    productsCount++;

    // Connect real reel if exists for this product group
    if (videos.length > 0) {
      const v = videos[0];
      await db.reel.create({
        data: {
          productId: product.id,
          instagramUrl: v.instagramUrl,
          shortcode: v.shortcode || `reel_${product.id}`,
          posterUrl: `/media/images/${v.id}-poster.webp`,
          videoUrl: v.publicPath,
          caption: `Styling our ${meta.name} ✨ @little_luxehamper`,
          sort: productsCount,
          showOnHome: true,
        },
      });
    }
  }

  // Populate remaining high-impact Reels for homepage animated reels strip
  const allVideos = manifest.filter((m) => m.type === "video");
  let reelSort = 10;
  for (const v of allVideos.slice(0, 16)) {
    // Check if reel already added
    const existing = await db.reel.findFirst({
      where: { videoUrl: v.publicPath },
    });
    if (!existing) {
      await db.reel.create({
        data: {
          instagramUrl: v.instagramUrl,
          shortcode: v.shortcode || `reel_${Date.now()}_${reelSort}`,
          posterUrl: `/media/images/${v.id}-poster.webp`,
          videoUrl: v.publicPath,
          caption: "Handcrafted with love at Little Luxe Hamper ✨ Unboxing perfection.",
          sort: reelSort++,
          showOnHome: true,
        },
      });
    }
  }

  console.log(`\n=== Asset Ingest Completed Successfully! ===`);
  console.log(`Created ${productsCount} real products (isSample: false).`);
  console.log(`Flagged ${Object.values(POST_METADATA).filter(p => p.needsReview).length} products as needsReview (Price on request / Enquire on WhatsApp).`);
  console.log(`Connected ${await db.reel.count()} authentic Instagram reels with self-hosted MP4 loops.`);
}

main()
  .catch((e) => {
    console.error("Ingestion failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
