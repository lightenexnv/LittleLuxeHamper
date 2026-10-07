import fs from "fs";
import path from "path";

const dirs = [
  "public/images/products",
  "public/images/reels",
  "public/images/collections",
  "public/images/addons",
  "public/images/hero",
];

for (const dir of dirs) {
  fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true });
}

function createProductSvg(title: string, subtitle: string, color1: string, color2: string, ribbonColor: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.1"/>
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#4e1f2b" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="800" height="1000" fill="url(#bg)"/>
  <rect width="800" height="1000" fill="url(#glow)"/>

  <!-- Hamper Box Illustration -->
  <g filter="url(#shadow)">
    <!-- Main Box Body -->
    <rect x="160" y="280" width="480" height="460" rx="24" fill="#FFFFFF" fill-opacity="0.95"/>
    <!-- Lid border -->
    <rect x="140" y="250" width="520" height="80" rx="16" fill="#FBF6F1" stroke="#E3ABA2" stroke-width="2"/>
    
    <!-- Satin Ribbon Vertical -->
    <rect x="375" y="250" width="50" height="490" fill="${ribbonColor}"/>
    <line x1="385" y1="250" x2="385" y2="740" stroke="#FFF" stroke-opacity="0.3" stroke-width="2"/>

    <!-- Satin Ribbon Horizontal -->
    <rect x="140" y="470" width="520" height="50" fill="${ribbonColor}"/>
    <line x1="140" y1="480" x2="660" y2="480" stroke="#FFF" stroke-opacity="0.3" stroke-width="2"/>

    <!-- Bow Accent in Gold -->
    <circle cx="400" cy="495" r="32" fill="#B8935A"/>
    <circle cx="400" cy="495" r="24" fill="#96743E"/>
    <circle cx="400" cy="495" r="14" fill="#D4B27C"/>
    
    <!-- Ribbon tails -->
    <path d="M 385 520 Q 350 600 330 660 L 370 660 Q 395 610 405 525 Z" fill="${ribbonColor}"/>
    <path d="M 415 520 Q 450 600 470 660 L 430 660 Q 405 610 395 525 Z" fill="${ribbonColor}"/>
  </g>

  <!-- Tag Sample Overlay -->
  <rect x="280" y="140" width="240" height="44" rx="22" fill="#6B2D3C" fill-opacity="0.9"/>
  <text x="400" y="168" font-family="Georgia, serif" font-size="16" font-weight="600" fill="#FBF6F1" text-anchor="middle" letter-spacing="3">LITTLE LUXE ATELIER</text>

  <!-- Typography -->
  <text x="400" y="820" font-family="Georgia, serif" font-size="34" font-weight="bold" fill="#2A2024" text-anchor="middle">${title}</text>
  <text x="400" y="865" font-family="sans-serif" font-size="18" font-weight="500" fill="#7A6A6E" text-anchor="middle" letter-spacing="1">${subtitle}</text>

  <!-- SAMPLE Badge -->
  <rect x="630" y="40" width="130" height="34" rx="6" fill="#B8935A"/>
  <text x="695" y="62" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">SAMPLE</text>
</svg>`;
}

function createReelSvg(title: string, subtitle: string, bgGradient: [string, string]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" width="540" height="960">
  <defs>
    <linearGradient id="reelBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGradient[0]}"/>
      <stop offset="100%" stop-color="${bgGradient[1]}"/>
    </linearGradient>
    <radialGradient id="centerLight" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.4"/>
    </radialGradient>
  </defs>
  <rect width="540" height="960" fill="url(#reelBg)"/>
  <rect width="540" height="960" fill="url(#centerLight)"/>

  <!-- Reel Top Badge -->
  <rect x="36" y="48" width="160" height="36" rx="18" fill="rgba(42,32,36,0.6)"/>
  <text x="116" y="72" font-family="sans-serif" font-size="13" font-weight="600" fill="#FFFFFF" text-anchor="middle">@little_luxehamper</text>

  <!-- Play Circle Overlay -->
  <circle cx="270" cy="460" r="48" fill="rgba(255,255,255,0.85)"/>
  <polygon points="258,435 295,460 258,485" fill="#6B2D3C"/>

  <!-- Bottom Captions -->
  <rect x="0" y="720" width="540" height="240" fill="linear-gradient(to top, rgba(0,0,0,0.8), transparent)"/>
  <text x="40" y="800" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#FFFFFF">${title}</text>
  <text x="40" y="840" font-family="sans-serif" font-size="16" fill="#F3DDD6">${subtitle}</text>
  <text x="40" y="880" font-family="sans-serif" font-size="14" font-weight="bold" fill="#B8935A">Watch Reel on Instagram &#8599;</text>

  <!-- SAMPLE Badge -->
  <rect x="420" y="48" width="84" height="28" rx="6" fill="#B8935A"/>
  <text x="462" y="67" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SAMPLE</text>
</svg>`;
}

function createHeroSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBF6F1"/>
      <stop offset="50%" stop-color="#F3DDD6"/>
      <stop offset="100%" stop-color="#E8C7BC"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="80"/>
    </filter>
  </defs>
  <rect width="1600" height="900" fill="url(#heroBg)"/>
  
  <!-- Subtle decorative blooms -->
  <circle cx="1200" cy="300" r="300" fill="#B8935A" fill-opacity="0.12" filter="url(#soft)"/>
  <circle cx="400" cy="700" r="350" fill="#6B2D3C" fill-opacity="0.08" filter="url(#soft)"/>

  <!-- Atelier Gift Hamper Silhouette -->
  <g transform="translate(850, 180)">
    <rect x="60" y="120" width="520" height="420" rx="32" fill="#FFFFFF" fill-opacity="0.95" stroke="#F3DDD6" stroke-width="4"/>
    <rect x="40" y="90" width="560" height="70" rx="20" fill="#FBF6F1" stroke="#C9877C" stroke-width="2"/>
    <rect x="290" y="90" width="60" height="450" fill="#6B2D3C"/>
    <rect x="40" y="270" width="560" height="60" fill="#6B2D3C"/>
    <circle cx="320" cy="300" r="44" fill="#B8935A"/>
    <circle cx="320" cy="300" r="32" fill="#96743E"/>
  </g>

  <!-- SAMPLE Marker -->
  <rect x="1450" y="40" width="110" height="32" rx="6" fill="#B8935A"/>
  <text x="1505" y="62" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SAMPLE</text>
</svg>`;
}

// Write Hero Image
fs.writeFileSync(path.join(process.cwd(), "public/images/hero/luxe-banner.svg"), createHeroSvg());

// Sample Products
const products = [
  { slug: "royal-velvet-anniversary-hamper", title: "Royal Velvet", sub: "Signature Anniversary Curation", c1: "#FBF6F1", c2: "#F3DDD6", ribbon: "#6B2D3C" },
  { slug: "blush-elegance-birthday-hamper", title: "Blush Elegance", sub: "Handmade Soy & Treats", c1: "#FBF6F1", c2: "#F6E4DE", ribbon: "#C9877C" },
  { slug: "golden-festive-diwali-hamper", title: "Golden Radiance", sub: "Festive Bell & Almond Brittle", c1: "#FFF8E7", c2: "#F5E2B8", ribbon: "#B8935A" },
  { slug: "executive-luxe-corporate-hamper", title: "Executive Luxe", sub: "Artisanal Coffee & Pen", c1: "#F5F5F7", c2: "#E5E5EB", ribbon: "#2A2024" },
  { slug: "celestial-pamper-self-care-hamper", title: "Celestial Pamper", sub: "Rose Bath Salts & Satin Mask", c1: "#FCF5F5", c2: "#F7DFDF", ribbon: "#6B2D3C" },
  { slug: "sweet-beginnings-newborn-hamper", title: "Sweet Beginnings", sub: "Organic Swaddle & Milestone Tag", c1: "#F7F9FB", c2: "#E3ECF5", ribbon: "#C9877C" },
  { slug: "midnight-truffle-indulgence", title: "Midnight Truffle", sub: "Belgian Dark Truffles & Mug", c1: "#F8F4F0", c2: "#ECDCCE", ribbon: "#6B2D3C" },
  { slug: "blooming-love-wedding-hamper", title: "Blooming Love", sub: "Trousseau Keepsake & Scented Mist", c1: "#FDF8F5", c2: "#F5E4DC", ribbon: "#B8935A" },
  { slug: "artisan-tea-tranquility-box", title: "Artisan Tea & Peace", sub: "Kashmiri Kahwa & Honey Dipper", c1: "#F6FBF6", c2: "#E0EFE0", ribbon: "#2E7D5B" },
  { slug: "gourmet-snack-delight-hamper", title: "Gourmet Snack Fiesta", sub: "Peri-peri Makhana & Caramel Nut", c1: "#FFFDF5", c2: "#FAEDCB", ribbon: "#B8935A" },
  { slug: "coffee-connoisseur-gift-crate", title: "Coffee Connoisseur", sub: "Single Origin Brew & Frother", c1: "#F7F3EE", c2: "#E9DFD3", ribbon: "#6B2D3C" },
  { slug: "lavender-dream-spa-hamper", title: "Lavender Dream Spa", sub: "Body Butter & Calming Mist", c1: "#FAF6FC", c2: "#EDE1F7", ribbon: "#8134AF" },
  { slug: "pocket-delight-mini-hamper", title: "Pocket Delight Mini", sub: "Petite Luxe Gifting Under ₹999", c1: "#FBF7F2", c2: "#F1E4D6", ribbon: "#C9877C" },
  { slug: "grand-celebration-trousseau-trunk", title: "Grand Trousseau", sub: "Embroidered Trunk & Premium Dry Fruits", c1: "#FFF9F0", c2: "#F8ECCF", ribbon: "#6B2D3C" },
];

for (const p of products) {
  // Main image
  fs.writeFileSync(
    path.join(process.cwd(), `public/images/products/${p.slug}-1.svg`),
    createProductSvg(p.title, p.sub, p.c1, p.c2, p.ribbon)
  );
  // Secondary image (angle / unboxing shot)
  fs.writeFileSync(
    path.join(process.cwd(), `public/images/products/${p.slug}-2.svg`),
    createProductSvg(`${p.title} (Open Box)`, "Handpacked with Satin Ribbon", p.c2, p.c1, p.ribbon)
  );
}

// Sample Reels
const reels = [
  { code: "C8xyz1", title: "Unboxing Royal Velvet", sub: "The ultimate anniversary celebration gift", grad: ["#6B2D3C", "#C9877C"] as [string, string] },
  { code: "C8xyz2", title: "Packing Golden Radiance", sub: "How we tie every silk satin bow by hand", grad: ["#B8935A", "#96743E"] as [string, string] },
  { code: "C8xyz3", title: "Behind The Scenes", sub: "Curating our bestselling pamper boxes", grad: ["#DD2A7B", "#515BD4"] as [string, string] },
  { code: "C8xyz4", title: "Diwali Corporate Orders", sub: "Custom engraved wooden luxury keepsake trunks", grad: ["#2A2024", "#6B2D3C"] as [string, string] },
];

for (const r of reels) {
  fs.writeFileSync(
    path.join(process.cwd(), `public/images/reels/poster-${r.code}.svg`),
    createReelSvg(r.title, r.sub, r.grad)
  );
}

// Addons
const addons = [
  { name: "gold-foil-card", title: "Gold Foil Greeting Card", price: "₹150", c: "#B8935A" },
  { name: "ferrero-rocher-pack", title: "Ferrero Rocher (Pack of 4)", price: "₹249", c: "#96743E" },
  { name: "fragrant-rose-candle", title: "Fragrant Rose Soy Candle", price: "₹349", c: "#C9877C" },
  { name: "satin-hair-scrunchie", title: "Silk Satin Scrunchie", price: "₹199", c: "#F3DDD6" },
];

for (const a of addons) {
  fs.writeFileSync(
    path.join(process.cwd(), `public/images/addons/${a.name}.svg`),
    createProductSvg(a.title, a.price, "#FBF6F1", "#F3DDD6", a.c)
  );
}

console.log("Successfully generated all sample vector assets!");
