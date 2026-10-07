import fs from "fs";
import path from "path";

function idToShortcode(id: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let big = BigInt(id);
  let shortcode = "";
  while (big > 0n) {
    const rem = Number(big % 64n);
    shortcode = alphabet[rem] + shortcode;
    big = big / 64n;
  }
  return shortcode;
}

const sourceDir = path.resolve(process.cwd(), "little_luxehamper");
const destImagesDir = path.resolve(process.cwd(), "public/images/products/real");
const destVideosDir = path.resolve(process.cwd(), "public/videos/reels");

fs.mkdirSync(destImagesDir, { recursive: true });
fs.mkdirSync(destVideosDir, { recursive: true });

// Read all files
const files = fs.readdirSync(sourceDir);

// Define curated real products from the photos
export const realProductsData = [
  {
    name: "Handmade Pipe-Cleaner Pastel Floral Bouquet",
    slug: "handmade-pipe-cleaner-pastel-floral-bouquet",
    shortcode: "Da8JEI-zVDj",
    caption: "Artisan handcrafted pipe-cleaner sunflowers, lavender stalks & wild blossoms finished with wax seal & pearl lace ribbon.",
    pricePaise: 149900, // ₹1,499
    mrpPaise: 199900,
    occasions: "Birthday, Anniversary, Graduation, Thank You",
    collections: ["Pamper & Self-Care", "Birthday Gifts"],
    coverImage: "3944067240609796323_23802205442.jpg",
    galleryImages: ["3944067240609796323_23802205442.jpg"],
    tags: ["Handmade", "Bouquet", "Floral", "Keepsake"],
  },
  {
    name: "Bhai & Bhabhi Raksha Bandhan Luxe Gift Trunk",
    slug: "bhai-bhabhi-raksha-bandhan-luxe-gift-trunk",
    shortcode: "DbiSzwPvdU9",
    caption: "Signature magnetic keepsake box with personalized gold-foil lid lettering, designer bangles, silk scrunchie, premium rakhis & ambient fairy lights.",
    pricePaise: 389900, // ₹3,899
    mrpPaise: 449900,
    occasions: "Festive, Raksha Bandhan, Family Celebrations",
    collections: ["Festive Gifting", "Anniversary Specials"],
    coverImage: "3954806144118936893_25237603949.jpg",
    galleryImages: ["3954806144118936893_25237603949.jpg"],
    tags: ["Rakhi", "Bhai & Bhabhi", "Luxe Trunk", "Fairy Lights"],
  },
  {
    name: "Birthday Princess Pink Keepsake Gift Trunk",
    slug: "birthday-princess-pink-keepsake-gift-trunk",
    shortcode: "Dcc66R2D8O8",
    caption: "Curated in delicate pastel pink with custom birthday bunting, handcrafted bangles, oxidized silver jhumkas, emerald bracelet, floral claw clips & warm fairy lights.",
    pricePaise: 329900, // ₹3,299
    mrpPaise: 399900,
    occasions: "Birthday, Celebrations, For Her",
    collections: ["Birthday Gifts", "Pamper & Self-Care"],
    coverImage: "3971308063021843388_25237603949_1.jpg",
    galleryImages: [
      "3971308063021843388_25237603949_1.jpg",
      "3971308063021843388_25237603949_6.jpg",
      "3971308063021843388_25237603949_9.jpg",
    ],
    videoFile: "3971308063021843388_25237603949_7.mp4",
    tags: ["Birthday", "Jewellery", "Fairy Lights", "For Her"],
  },
  {
    name: "Classic Crimson & Ivory Velvet Rose Bouquet",
    slug: "classic-crimson-ivory-velvet-rose-bouquet",
    shortcode: "DdB7GHVEzOV",
    caption: "Forever-blooming handcrafted velvet roses in royal crimson and ivory white, enveloped in double-faced matte kraft wrap and silk ribbon.",
    pricePaise: 189900, // ₹1,899
    mrpPaise: 249900,
    occasions: "Anniversary, Romance, Birthday, Proposal",
    collections: ["Anniversary Specials", "Birthday Gifts"],
    coverImage: "3981723450503017365_23802205442_1.jpg",
    galleryImages: [
      "3981723450503017365_23802205442_1.jpg",
      "3981723450503017365_23802205442_2.jpg",
      "3981723450503017365_23802205442_3.jpg",
      "3981723450503017365_23802205442_5.jpg",
    ],
    tags: ["Roses", "Bouquet", "Romance", "Velvet"],
  },
  {
    name: "Cadbury & Red Rose Sweet Indulgence Bouquet",
    slug: "cadbury-red-rose-sweet-indulgence-bouquet",
    shortcode: "DdHCAa9EwPy",
    caption: "A delectable confectionery bouquet featuring Cadbury Dairy Milk, KitKat & BarOne nestled among velvety red roses and tied with hot-pink ribbon.",
    pricePaise: 169900, // ₹1,699
    mrpPaise: 219900,
    occasions: "Birthday, Thank You, Festive, Congratulatory",
    collections: ["Birthday Gifts", "Festive Gifting"],
    coverImage: "3983161220467459058_23802205442_1.jpg",
    galleryImages: [
      "3983161220467459058_23802205442_1.jpg",
      "3983161220467459058_23802205442_2.jpg",
      "3983161220467459058_23802205442_3.jpg",
    ],
    tags: ["Chocolates", "Bouquet", "Cadbury", "Roses"],
  },
  {
    name: "Adorable Panda Bear Plush Floral Bouquet",
    slug: "adorable-panda-bear-plush-floral-bouquet",
    shortcode: "DdZFuoOk7uh",
    caption: "Whimsical headphone-wearing panda plush surrounded by miniature companion bears, monochrome handcrafted flowers, and newspaper wrapping.",
    pricePaise: 229900, // ₹2,299
    mrpPaise: 289900,
    occasions: "Birthday, Kids, Graduation, Just Because",
    collections: ["Birthday Gifts", "Newborn & Baby Shower"],
    coverImage: "3988244139536006049_23802205442_1.jpg",
    galleryImages: [
      "3988244139536006049_23802205442_1.jpg",
      "3988244139536006049_23802205442_2.jpg",
      "3988244139536006049_23802205442_3.jpg",
    ],
    tags: ["Panda", "Plushie", "Bouquet", "Cute"],
  },
  {
    name: "The Gentleman's Custom Birthday Gift Trunk",
    slug: "gentlemans-custom-birthday-gift-trunk",
    shortcode: "DddhFnQjxbr",
    caption: "Sophisticated black trunk with custom celebratory bunting, Ralph Lauren custom-fit apparel, hand-embroidered personalized monogram handkerchief & fairy lights.",
    pricePaise: 499900, // ₹4,999
    mrpPaise: 599900,
    occasions: "Birthday, Anniversary, For Him, Corporate",
    collections: ["Birthday Gifts", "Corporate Gifting", "Anniversary Specials"],
    coverImage: "3989490366206121707_25237603949_1.jpg",
    galleryImages: [
      "3989490366206121707_25237603949_1.jpg",
      "3989490366206121707_25237603949_2.jpg",
      "3989490366206121707_25237603949_5.jpg",
    ],
    videoFile: "3989490366206121707_25237603949_3.mp4",
    tags: ["For Him", "Luxury Apparel", "Personalized", "Fairy Lights"],
  },
  {
    name: "Golden Sunshine Birthday Delight Trunk",
    slug: "golden-sunshine-birthday-delight-trunk",
    shortcode: "DdozMyQD6wP",
    caption: "Joyous golden-themed gift box featuring cheerful birthday bunting, premium satin hair scrunchies, multicolored bangles, jewelry boxes & fairy lights.",
    pricePaise: 299900, // ₹2,999
    mrpPaise: 359900,
    occasions: "Birthday, Festivities, For Her",
    collections: ["Birthday Gifts", "Pamper & Self-Care"],
    coverImage: "3992666248626285583_25237603949_1.jpg",
    galleryImages: [
      "3992666248626285583_25237603949_1.jpg",
      "3992666248626285583_25237603949_2.jpg",
      "3992666248626285583_25237603949_3.jpg",
    ],
    tags: ["Birthday", "Golden Theme", "Scrunchies", "Jewellery"],
  },
];

// Curated Real Reels
export const realReelsData = [
  {
    title: "Handpacking The Birthday Princess Keepsake Trunk",
    shortcode: "Dcc66R2D8O8",
    videoFile: "3971308063021843388_25237603949_7.mp4",
    posterImage: "3971308063021843388_25237603949_1.jpg",
    viewsCount: "18.4K",
    likesCount: "1.2K",
    associatedSlug: "birthday-princess-pink-keepsake-gift-trunk",
  },
  {
    title: "Unboxing Real Emotions — Bhai & Bhabhi Raksha Bandhan Trunk",
    shortcode: "DbiSzwPvdU9",
    videoFile: "3943887624683383646_28218332959.mp4",
    posterImage: "3954806144118936893_25237603949.jpg",
    viewsCount: "25.1K",
    likesCount: "2.4K",
    associatedSlug: "bhai-bhabhi-raksha-bandhan-luxe-gift-trunk",
  },
  {
    title: "Curating The Gentleman's Birthday Hamper",
    shortcode: "DddhFnQjxbr",
    videoFile: "3989490366206121707_25237603949_3.mp4",
    posterImage: "3989490366206121707_25237603949_1.jpg",
    viewsCount: "14.9K",
    likesCount: "980",
    associatedSlug: "gentlemans-custom-birthday-gift-trunk",
  },
  {
    title: "Artisan Silk Ribbon & Wax Seal Finishing",
    shortcode: "Da7gOYnT-te",
    videoFile: "3943988211449991527_28218332959.mp4",
    posterImage: "3944067240609796323_23802205442.jpg",
    viewsCount: "31.2K",
    likesCount: "3.1K",
    associatedSlug: "handmade-pipe-cleaner-pastel-floral-bouquet",
  },
];

export function copyRealMediaFiles() {
  console.log("Copying real photos and lightweight reel videos...");

  // Copy images
  for (const prod of realProductsData) {
    for (const img of prod.galleryImages) {
      const src = path.join(sourceDir, img);
      const dst = path.join(destImagesDir, img);
      if (fs.existsSync(src) && !fs.existsSync(dst)) {
        fs.copyFileSync(src, dst);
        console.log(`Copied image: ${img}`);
      }
    }
  }

  // Copy reel videos
  for (const reel of realReelsData) {
    if (reel.videoFile) {
      const src = path.join(sourceDir, reel.videoFile);
      const dst = path.join(destVideosDir, reel.videoFile);
      if (fs.existsSync(src) && !fs.existsSync(dst)) {
        fs.copyFileSync(src, dst);
        console.log(`Copied video: ${reel.videoFile}`);
      }
    }
  }
}

if (require.main === module) {
  copyRealMediaFiles();
}
