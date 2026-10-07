import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database with SAMPLE data...");

  // 1. Collections
  const collectionsData = [
    {
      slug: "festive-gifting",
      name: "Festive & Diwali",
      type: "occasion",
      intro: "Curated luxury hampers to celebrate Diwali, Bhai Dooj, and joyous Indian festivities with light, sweetness, and elegance.",
      imageUrl: "/images/products/golden-festive-diwali-hamper-1.svg",
      sort: 1,
    },
    {
      slug: "birthday-hampers",
      name: "Birthdays",
      type: "occasion",
      intro: "Make their special day unforgettable with hand-tied satin ribbons, gourmet delights, and scented soy candles.",
      imageUrl: "/images/products/blush-elegance-birthday-hamper-1.svg",
      sort: 2,
    },
    {
      slug: "anniversary-celebration",
      name: "Anniversary & Romance",
      type: "occasion",
      intro: "Express enduring romance with opulent keepsake boxes, artisan chocolates, and personalized keepsake cards.",
      imageUrl: "/images/products/royal-velvet-anniversary-hamper-1.svg",
      sort: 3,
    },
    {
      slug: "self-care-pamper",
      name: "Pamper & Self-Care",
      type: "category",
      intro: "Relaxing artisanal spa treatments, soothing botanicals, and handcrafted bath essentials for mindful rejuvenation.",
      imageUrl: "/images/products/celestial-pamper-self-care-hamper-1.svg",
      sort: 4,
    },
    {
      slug: "corporate-delight",
      name: "Corporate & Executive",
      type: "category",
      intro: "Distinguished executive gifting with custom branding, premium coffee, leather journals, and refined elegance.",
      imageUrl: "/images/products/executive-luxe-corporate-hamper-1.svg",
      sort: 5,
    },
    {
      slug: "baby-shower-newborn",
      name: "Newborn & Baby Shower",
      type: "occasion",
      intro: "Welcome precious arrivals with baby-safe organic textiles, plush keepsake toys, and heartfelt tokens of blessings.",
      imageUrl: "/images/products/sweet-beginnings-newborn-hamper-1.svg",
      sort: 6,
    },
    {
      slug: "wedding-hampers",
      name: "Weddings & Trousseau",
      type: "occasion",
      intro: "Opulent wedding return gifts, bridal trousseau trunks, and shagun hampers crafted with heirloom-grade craftsmanship.",
      imageUrl: "/images/products/blooming-love-wedding-hamper-1.svg",
      sort: 7,
    },
    {
      slug: "under-1999",
      name: "Hampers Under ₹1,999",
      type: "budget",
      intro: "Thoughtful boutique gifting that delights without compromise. Handpacked with our signature luxury aesthetic.",
      imageUrl: "/images/products/pocket-delight-mini-hamper-1.svg",
      sort: 8,
    },
    {
      slug: "luxury-premiere",
      name: "Signature Luxury Trousseau",
      type: "budget",
      intro: "Our most grand, heirloom-grade hampers crafted with velvet trunks, brass brassieres, and gourmet confectionery.",
      imageUrl: "/images/products/grand-celebration-trousseau-trunk-1.svg",
      sort: 9,
    },
  ];

  for (const col of collectionsData) {
    await db.collection.upsert({
      where: { slug: col.slug },
      update: col,
      create: col,
    });
  }

  // 2. Add-Ons
  const addOnsData = [
    {
      id: "addon-card",
      name: "Calligraphy Gold Foil Greeting Card",
      pricePaise: 15000,
      imageUrl: "/images/addons/gold-foil-card.svg",
      isActive: true,
    },
    {
      id: "addon-chocolate",
      name: "Ferrero Rocher Hazelnut Treats (Pack of 4)",
      pricePaise: 24900,
      imageUrl: "/images/addons/ferrero-rocher-pack.svg",
      isActive: true,
    },
    {
      id: "addon-candle",
      name: "Handmade Rose Petal Soy Wax Candle",
      pricePaise: 34900,
      imageUrl: "/images/addons/fragrant-rose-candle.svg",
      isActive: true,
    },
    {
      id: "addon-scrunchie",
      name: "Pure Silk Satin Scrunchie (Blush Pink)",
      pricePaise: 19900,
      imageUrl: "/images/addons/satin-hair-scrunchie.svg",
      isActive: true,
    },
  ];

  for (const addon of addOnsData) {
    await db.addOn.upsert({
      where: { id: addon.id },
      update: addon,
      create: addon,
    });
  }

  // 3. Products
  const productsData = [
    {
      slug: "royal-velvet-anniversary-hamper",
      name: "Royal Velvet Anniversary Hamper",
      shortDesc: "Opulent anniversary curation in a plush wine velvet box with Belgian truffles & brass keepsake frame.",
      description: "Celebrate milestones of love with our signature Royal Velvet Anniversary Hamper. Designed in deep royal burgundy with double-faced satin ribbons, this bespoke gift box features rich Belgian chocolate truffles, an aromatic vanilla bourbon candle, a custom brass memory frame, and our letterpress gold foil greeting card.",
      pricePaise: 349900,
      mrpPaise: 429900,
      sku: "LLH-ANN-001",
      stock: 18,
      isCustomizable: true,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Belgian Dark Chocolate Truffles (150g)",
        "Handmade Bourbon Vanilla Soy Candle in Amber Jar",
        "Vintage Brass Keepsake Photo Frame (4x6)",
        "Satin Ribbon & Gold Wax Seal Personalized Envelope",
        "Rigid Velvet Keepsake Hamper Trunk"
      ]),
      tags: "anniversary,velvet,romantic,luxury,bestseller",
      seoTitle: "Royal Velvet Anniversary Gift Hamper | Little Luxe Hamper",
      seoDesc: "Order the Royal Velvet Anniversary Hamper online in India. Handpacked with Belgian truffles, brass frame & scented candle.",
      collections: ["anniversary-celebration", "luxury-premiere"],
      images: [
        { url: "/images/products/royal-velvet-anniversary-hamper-1.svg", alt: "Royal Velvet Anniversary Hamper Front View", sort: 0 },
        { url: "/images/products/royal-velvet-anniversary-hamper-2.svg", alt: "Royal Velvet Anniversary Hamper Open Details", sort: 1 },
      ],
      reel: {
        instagramUrl: "https://www.instagram.com/reel/C8xyz1/",
        shortcode: "C8xyz1",
        posterUrl: "/images/reels/poster-C8xyz1.svg",
        caption: "Unboxing the Royal Velvet anniversary gift set — look at that satin sheen! ✨",
        showOnHome: true,
        sort: 1,
      },
    },
    {
      slug: "blush-elegance-birthday-hamper",
      name: "Blush Elegance Birthday Hamper",
      shortDesc: "Delicate blush pink gift box with artisanal soy candle, rose quartz roller, and gourmet macarons.",
      description: "Infused with warmth and feminine grace, the Blush Elegance Birthday Hamper is crafted to make birthdays feel magical. Encased in pastel blush packaging adorned with champagne ribbon, it includes delicate French almond macarons, a botanical face mist, pure rose quartz roller, and sweet vanilla matches.",
      pricePaise: 249900,
      mrpPaise: 299900,
      sku: "LLH-BDY-002",
      stock: 24,
      isCustomizable: true,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Artisanal French Almond Macarons (Box of 4)",
        "Natural Rose Quartz Facial Roller",
        "Organic Damask Rose Hydrating Face Mist (50ml)",
        "Blush Soy Wax Candle with Golden Match Vial",
        "Foil-stamped 'Happiest Birthday' Luxe Note Card"
      ]),
      tags: "birthday,blush,pamper,women,bestseller",
      seoTitle: "Blush Elegance Birthday Hamper | Little Luxe Hamper India",
      seoDesc: "Send the Blush Elegance Birthday Hamper across India. Features artisanal macarons, facial roller, and luxury scented candle.",
      collections: ["birthday-hampers", "self-care-pamper"],
      images: [
        { url: "/images/products/blush-elegance-birthday-hamper-1.svg", alt: "Blush Elegance Birthday Hamper", sort: 0 },
        { url: "/images/products/blush-elegance-birthday-hamper-2.svg", alt: "Blush Elegance Unboxed Presentation", sort: 1 },
      ],
      reel: {
        instagramUrl: "https://www.instagram.com/reel/C8xyz2/",
        shortcode: "C8xyz2",
        posterUrl: "/images/reels/poster-C8xyz2.svg",
        caption: "Packing the Blush Elegance birthday box with fresh satin ribbon. Which colour is your favourite? 🎀",
        showOnHome: true,
        sort: 2,
      },
    },
    {
      slug: "golden-festive-diwali-hamper",
      name: "Golden Radiance Festive Hamper",
      shortDesc: "Celebratory festive hamper featuring brass diya, gourmet roasted dry fruits, and saffron almond brittle.",
      description: "Celebrate the festival of lights with warmth and grandeur. The Golden Radiance Festive Hamper combines sacred tradition with modern boutique flair, including handcrafted brass diyas, gold-foiled dry fruit jars, artisanal saffron almond brittle, and incense sticks crafted from temple flowers.",
      pricePaise: 289900,
      mrpPaise: 349900,
      sku: "LLH-FST-003",
      stock: 35,
      isCustomizable: false,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Hand-cast Pure Brass Lotus Diya Pair",
        "Kashmiri Roasted Mamra Almonds & Cashews (200g)",
        "Artisanal Saffron Caramel Almond Brittle (120g)",
        "Organic Temple Flower Incense Dhoop Cones",
        "Festive Gold Foil Blessing Card & Brocade Box"
      ]),
      tags: "diwali,festive,brass,dryfruits,tradition",
      seoTitle: "Golden Radiance Diwali & Festive Hamper | Little Luxe Hamper",
      seoDesc: "Grand Diwali gift hampers with pure brass diyas and gourmet nuts. Pan-India fast shipping for Diwali & Bhai Dooj.",
      collections: ["festive-gifting"],
      images: [
        { url: "/images/products/golden-festive-diwali-hamper-1.svg", alt: "Golden Radiance Festive Hamper", sort: 0 },
        { url: "/images/products/golden-festive-diwali-hamper-2.svg", alt: "Golden Radiance Festive Hamper Opened", sort: 1 },
      ],
      reel: {
        instagramUrl: "https://www.instagram.com/reel/C8xyz3/",
        shortcode: "C8xyz3",
        posterUrl: "/images/reels/poster-C8xyz3.svg",
        caption: "Diwali pre-orders are open! Watch our team pack the Golden Radiance hampers 🪔✨",
        showOnHome: true,
        sort: 3,
      },
    },
    {
      slug: "executive-luxe-corporate-hamper",
      name: "Executive Luxe Corporate Gift Set",
      shortDesc: "Sophisticated corporate gift with single-origin coffee, matte black thermal tumbler, and premium journal.",
      description: "Designed for discerning executives, leadership appreciation, and corporate celebrations. Features premium dark tones, matte black finishes, artisanal Arabica pour-over coffee, and high-grade stationery.",
      pricePaise: 229900,
      mrpPaise: 279900,
      sku: "LLH-CRP-004",
      stock: 50,
      isCustomizable: true,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Single Origin Chikmagalur Medium Dark Roast (150g)",
        "Matte Black Double-Walled Stainless Tumbler (350ml)",
        "Vegan Leather Hardbound Executive Notebook (A5)",
        "Gunmetal Rollerball Precision Pen",
        "Dark Chocolate Espresso Beans (75g)"
      ]),
      tags: "corporate,executive,coffee,office,luxury",
      seoTitle: "Executive Corporate Gift Hampers India | Little Luxe Hamper",
      seoDesc: "Premium corporate gifting sets with custom logo engraving and pan-India desk delivery.",
      collections: ["corporate-delight"],
      images: [
        { url: "/images/products/executive-luxe-corporate-hamper-1.svg", alt: "Executive Luxe Corporate Gift Set", sort: 0 },
        { url: "/images/products/executive-luxe-corporate-hamper-2.svg", alt: "Executive Luxe Desk Arrangement", sort: 1 },
      ],
      reel: {
        instagramUrl: "https://www.instagram.com/reel/C8xyz4/",
        shortcode: "C8xyz4",
        posterUrl: "/images/reels/poster-C8xyz4.svg",
        caption: "Curating 200 corporate onboarding hampers for a tech firm in Bangalore! 💼☕",
        showOnHome: true,
        sort: 4,
      },
    },
    {
      slug: "celestial-pamper-self-care-hamper",
      name: "Celestial Pamper Spa & Bath Hamper",
      shortDesc: "Indulgent self-care ritual box with Himalayan bath salts, body butter, and mulberry silk eye mask.",
      description: "A sanctuary of peace in a box. The Celestial Pamper Hamper invites you to disconnect and renew with pure Himalayan pink bath soak, whipped shea body butter, calming chamomile floral tea, and an ultra-soft mulberry silk sleep mask.",
      pricePaise: 269900,
      mrpPaise: 319900,
      sku: "LLH-PAM-005",
      stock: 20,
      isCustomizable: false,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Himalayan Pink Rock Bath Soak with Dried Lavender (200g)",
        "Whipped French Shea & Rosehip Body Butter (100g)",
        "100% Pure Mulberry Silk Sleep Eye Mask",
        "Whole Chamomile Herbal Infusion Tea (50g)",
        "Lavender Essential Oil Pillow Mist"
      ]),
      tags: "selfcare,spa,bath,relaxation,pamper",
      seoTitle: "Celestial Pamper Self-Care Gift Hamper | Little Luxe Hamper",
      seoDesc: "Luxury spa & bath gift hampers online in India. Delivered with personal handwritten note.",
      collections: ["self-care-pamper", "birthday-hampers"],
      images: [
        { url: "/images/products/celestial-pamper-self-care-hamper-1.svg", alt: "Celestial Pamper Spa Box", sort: 0 },
        { url: "/images/products/celestial-pamper-self-care-hamper-2.svg", alt: "Celestial Pamper Contents Display", sort: 1 },
      ],
    },
    {
      slug: "sweet-beginnings-newborn-hamper",
      name: "Sweet Beginnings Newborn Gift Basket",
      shortDesc: "Cherished baby welcome hamper with organic muslin swaddle, plush rattle, and milestone wooden disks.",
      description: "Welcome little miracles with tender care. Handcrafted with GOTS certified organic muslin swaddles, crochet knit heirloom rattle, wooden monthly milestone cards, and organic chamomile baby balm.",
      pricePaise: 299900,
      mrpPaise: 369900,
      sku: "LLH-BAB-006",
      stock: 15,
      isCustomizable: true,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Organic Cotton Muslin Swaddle Blanket (Breathable)",
        "Handmade Knitted Organic Cotton Bear Rattle",
        "Set of 12 Laser-Engraved Wooden Milestone Discs",
        "Gentle Chamomile & Calendula Baby Massage Balm",
        "Keepsake Canvas Keepsake Basket with Name Tag"
      ]),
      tags: "newborn,babyshower,organic,keepsake",
      seoTitle: "Sweet Beginnings Newborn Gift Basket | Little Luxe Hamper",
      seoDesc: "Send sweet newborn and baby shower gift baskets across India. Organic cotton and heirloom toys.",
      collections: ["baby-shower-newborn"],
      images: [
        { url: "/images/products/sweet-beginnings-newborn-hamper-1.svg", alt: "Sweet Beginnings Newborn Hamper", sort: 0 },
        { url: "/images/products/sweet-beginnings-newborn-hamper-2.svg", alt: "Sweet Beginnings Baby Essentials", sort: 1 },
      ],
    },
    {
      slug: "midnight-truffle-indulgence",
      name: "Midnight Truffle Gourmet Box",
      shortDesc: "Rich cocoa lovers dream with handmade dark chocolate rochers and hazelnut spread.",
      description: "For true cocoa purists. This hamper curates 70% dark single-origin chocolate bars, decadent dark rochers, Belgian hot cocoa mix, and ceramic mug in midnight grey.",
      pricePaise: 189900,
      mrpPaise: 229900,
      sku: "LLH-CHK-007",
      stock: 30,
      isCustomizable: false,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Artisanal Single-Origin 70% Dark Chocolate Bar (80g)",
        "Belgian Dark Hazelnut Rochers (Pack of 6)",
        "Gourmet Spiced Hot Cocoa Blend (150g)",
        "Hand-glazed Ceramic Bistro Mug"
      ]),
      tags: "chocolate,gourmet,truffle,budget",
      seoTitle: "Midnight Truffle Gourmet Chocolate Gift Box | Little Luxe",
      seoDesc: "Decadent gourmet dark chocolate gift hamper delivered pan-India with cold-insulated packaging.",
      collections: ["under-1999", "birthday-hampers"],
      images: [
        { url: "/images/products/midnight-truffle-indulgence-1.svg", alt: "Midnight Truffle Gourmet Box", sort: 0 },
        { url: "/images/products/midnight-truffle-indulgence-2.svg", alt: "Midnight Truffle Open Box", sort: 1 },
      ],
    },
    {
      slug: "blooming-love-wedding-hamper",
      name: "Blooming Love Wedding Trousseau Hamper",
      shortDesc: "Splendid wedding trousseau hamper with embroidered silk pouches, pure brass bowls, and scented wax tablets.",
      description: "An unforgettable tribute for brides and newly-wed couples. Featuring raw silk shagun envelopes, scented soy wardrobe medallions, brass dry-fruit katoris, and damask rose bath oil.",
      pricePaise: 499900,
      mrpPaise: 599900,
      sku: "LLH-WED-008",
      stock: 10,
      isCustomizable: true,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Pair of Hand-hammered Brass Lotus Bowls with Spoons",
        "Zari Embroidered Raw Silk Keepsake Pouch",
        "Scented Wax Floral Tablets for Wardrobe",
        "Pure Damask Rose Bath & Body Elixir (100ml)",
        "Handmade Ivory & Gold Rigid Gift Trunk"
      ]),
      tags: "wedding,trousseau,shagun,luxury",
      seoTitle: "Blooming Love Wedding Gift Hamper | Little Luxe Hamper",
      seoDesc: "Magnificent bridal trousseau and wedding gift hampers online. Customization and pan-India shipping.",
      collections: ["luxury-premiere", "anniversary-celebration"],
      images: [
        { url: "/images/products/blooming-love-wedding-hamper-1.svg", alt: "Blooming Love Wedding Hamper", sort: 0 },
        { url: "/images/products/blooming-love-wedding-hamper-2.svg", alt: "Wedding Hamper Open View", sort: 1 },
      ],
    },
    {
      slug: "artisan-tea-tranquility-box",
      name: "Artisan Tea & Tranquility Crate",
      shortDesc: "Serene wellness hamper with whole leaf Kashmiri Kahwa, acacia honey jar, and wooden dipper.",
      description: "Infuse calm into someone's morning routine with slow-steeped loose leaves, whole spices, and raw acacia forest honey.",
      pricePaise: 179900,
      mrpPaise: 219900,
      sku: "LLH-TEA-009",
      stock: 22,
      isCustomizable: false,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Authentic Kashmiri Saffron Kahwa Whole Leaves (100g)",
        "Raw Forest Acacia Honey in Glass Jar (150g)",
        "Natural Teakwood Honey Dipper",
        "Gold Mesh Tea Infuser Ball"
      ]),
      tags: "tea,wellness,relax,under1999",
      seoTitle: "Artisan Tea & Tranquility Gift Box | Little Luxe Hamper",
      seoDesc: "Relaxing tea gift hamper with Kashmiri Kahwa and raw honey. Handcrafted gifting across India.",
      collections: ["under-1999", "self-care-pamper"],
      images: [
        { url: "/images/products/artisan-tea-tranquility-box-1.svg", alt: "Artisan Tea Tranquility Box", sort: 0 },
        { url: "/images/products/artisan-tea-tranquility-box-2.svg", alt: "Tea Hamper Opened", sort: 1 },
      ],
    },
    {
      slug: "gourmet-snack-delight-hamper",
      name: "Gourmet Snack Fiesta Hamper",
      shortDesc: "Crowd-pleaser curation with peri-peri roasted makhana, caramel popcorn, and salsa dip jar.",
      description: "Crunchy, sweet, and savoury delights packed together for housewarmings, game nights, and casual celebrations.",
      pricePaise: 149900,
      mrpPaise: 189900,
      sku: "LLH-SNK-010",
      stock: 40,
      isCustomizable: false,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Roasted Peri-Peri Water Lily Seeds / Makhana (80g)",
        "Artisanal English Toffee & Caramel Popcorn (100g)",
        "Smoked Paprika Mexican Salsa in Jar (150g)",
        "Herbed Sourdough Crispbread Flatbreads"
      ]),
      tags: "snack,food,budget,party",
      seoTitle: "Gourmet Snack Fiesta Gift Box | Little Luxe Hamper",
      seoDesc: "Tasty and aesthetic snack hampers for friends and team parties under 1500.",
      collections: ["under-1999", "festive-gifting"],
      images: [
        { url: "/images/products/gourmet-snack-delight-hamper-1.svg", alt: "Gourmet Snack Fiesta Hamper", sort: 0 },
        { url: "/images/products/gourmet-snack-delight-hamper-2.svg", alt: "Snack Box Arrangement", sort: 1 },
      ],
    },
    {
      slug: "coffee-connoisseur-gift-crate",
      name: "Coffee Connoisseur Gift Crate",
      shortDesc: "Boutique coffee curation with estate roast, handheld frother, and artisanal biscotti.",
      description: "Wake up to bliss. Curated for serious caffeine aficionados who love the aroma of freshly roasted beans and frothy cappuccinos.",
      pricePaise: 239900,
      mrpPaise: 289900,
      sku: "LLH-COF-011",
      stock: 18,
      isCustomizable: true,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Estate Roasted Arabica Filter Grind (200g)",
        "Electric Handheld Stainless Milk Frother",
        "Almond & Cranberry Twice-Baked Biscotti (120g)",
        "Ceramic Ribbed Mug in Ivory Warmth"
      ]),
      tags: "coffee,gourmet,corporate,birthday",
      seoTitle: "Coffee Connoisseur Gift Hamper | Little Luxe Hamper",
      seoDesc: "Premium coffee gift hamper in India with freshly roasted estate blend and milk frother.",
      collections: ["corporate-delight", "birthday-hampers"],
      images: [
        { url: "/images/products/coffee-connoisseur-gift-crate-1.svg", alt: "Coffee Connoisseur Gift Crate", sort: 0 },
        { url: "/images/products/coffee-connoisseur-gift-crate-2.svg", alt: "Coffee Set Detail", sort: 1 },
      ],
    },
    {
      slug: "lavender-dream-spa-hamper",
      name: "Lavender Dream Aromatherapy Hamper",
      shortDesc: "Calming purple lavender mist, organic soap bar, and plush cotton hand towel.",
      description: "Wash away the fatigue of the day with pure French lavender extracts, goat milk moisturising soap, and spun Turkish cotton hand towels.",
      pricePaise: 169900,
      mrpPaise: 209900,
      sku: "LLH-LAV-012",
      stock: 25,
      isCustomizable: false,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Organic Cold-Pressed Lavender Goat Milk Soap",
        "Lavender & Ylang Ylang Pillow Mist (100ml)",
        "100% Cotton Turkish Waffle Hand Towel (Blush Purple)",
        "Scented Wardrobe Soy Sachet"
      ]),
      tags: "lavender,spa,aromatherapy,wellness",
      seoTitle: "Lavender Dream Spa Gift Hamper | Little Luxe Hamper",
      seoDesc: "Calming lavender spa and body gift hamper for women and self-care lovers.",
      collections: ["self-care-pamper", "under-1999"],
      images: [
        { url: "/images/products/lavender-dream-spa-hamper-1.svg", alt: "Lavender Dream Spa Hamper", sort: 0 },
        { url: "/images/products/lavender-dream-spa-hamper-2.svg", alt: "Lavender Set Elements", sort: 1 },
      ],
    },
    {
      slug: "pocket-delight-mini-hamper",
      name: "Pocket Delight Mini Gift Box",
      shortDesc: "Affordable luxury under ₹999 with candle, artisanal chocolates, and warm message card.",
      description: "Great gifts don't need giant price tags. Our Pocket Delight Mini packs heartwarming sentiment into an adorable satin-tied keepsake box.",
      pricePaise: 89900,
      mrpPaise: 119900,
      sku: "LLH-MIN-013",
      stock: 60,
      isCustomizable: false,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Mini Travel Soy Candle in Gold Tin",
        "Belgian Dark Praline Chocolate Duo",
        "Calligraphy 'Thinking of You' Mini Note Card"
      ]),
      tags: "budget,under999,mini,token",
      seoTitle: "Pocket Delight Mini Hamper Under 999 | Little Luxe Hamper",
      seoDesc: "Affordable luxury gift hampers under ₹999 in India. Perfect return gifts and sweet surprises.",
      collections: ["under-1999", "festive-gifting"],
      images: [
        { url: "/images/products/pocket-delight-mini-hamper-1.svg", alt: "Pocket Delight Mini Gift Box", sort: 0 },
        { url: "/images/products/pocket-delight-mini-hamper-2.svg", alt: "Pocket Delight Mini Contents", sort: 1 },
      ],
    },
    {
      slug: "grand-celebration-trousseau-trunk",
      name: "Grand Heirloom Celebration Trunk",
      shortDesc: "Our most grand keepsake trunk with embroidered lid, dry fruits, silver-plated coin, and brass bell.",
      description: "Crafted for once-in-a-lifetime celebrations, weddings, and milestone anniversaries. An heirloom wooden chest lined with velvet, brass accents, and opulent gourmet provisions.",
      pricePaise: 799900,
      mrpPaise: 949900,
      sku: "LLH-GRD-014",
      stock: 8,
      isCustomizable: true,
      isActive: true,
      isSample: true,
      contents: JSON.stringify([
        "Solid Teakwood & Velvet Handcrafted Keepsake Chest",
        "Pure Brass Temple Bell with Carved Handle",
        "Silver-Plated Auspicious Coin in Velvet Box",
        "Gourmet Roasted Iranian Pistachios & Walnuts (300g)",
        "Artisanal Rose-Infused Wild Honey Jar (250g)",
        "Double Satin Ribbon & Custom Wax Monogram Seal"
      ]),
      tags: "trunk,trousseau,grand,luxury,wedding",
      seoTitle: "Grand Heirloom Celebration Trunk | Little Luxe Hamper",
      seoDesc: "Ultra-luxury gifting trunks for weddings and milestone celebrations. Handcrafted in India.",
      collections: ["luxury-premiere", "wedding-hampers", "festive-gifting"],
      images: [
        { url: "/images/products/grand-celebration-trousseau-trunk-1.svg", alt: "Grand Heirloom Celebration Trunk", sort: 0 },
        { url: "/images/products/grand-celebration-trousseau-trunk-2.svg", alt: "Grand Trunk Interior Luxury", sort: 1 },
      ],
    },
  ];

  for (const prod of productsData) {
    const { collections, images, reel, ...prodData } = prod;

    const createdProduct = await db.product.upsert({
      where: { slug: prodData.slug },
      update: {
        ...prodData,
        collections: {
          connect: collections.map((slug) => ({ slug })),
        },
      },
      create: {
        ...prodData,
        collections: {
          connect: collections.map((slug) => ({ slug })),
        },
      },
    });

    // Delete existing images & reels for idempotent re-seed
    await db.productImage.deleteMany({ where: { productId: createdProduct.id } });
    for (const img of images) {
      await db.productImage.create({
        data: {
          productId: createdProduct.id,
          url: img.url,
          alt: img.alt,
          sort: img.sort,
        },
      });
    }

    if (reel) {
      await db.reel.deleteMany({ where: { productId: createdProduct.id } });
      await db.reel.create({
        data: {
          productId: createdProduct.id,
          instagramUrl: reel.instagramUrl,
          shortcode: reel.shortcode,
          posterUrl: reel.posterUrl,
          caption: reel.caption,
          showOnHome: reel.showOnHome,
          sort: reel.sort,
        },
      });
    }

    // Add sample review
    await db.review.deleteMany({ where: { productId: createdProduct.id } });
    await db.review.create({
      data: {
        productId: createdProduct.id,
        name: "Ananya Sharma",
        rating: 5,
        body: "The packaging quality was beyond what I imagined! The satin ribbon and the handwritten note card made my sister tear up with joy.",
        isSample: true,
        approved: true,
      },
    });
  }

  // 4. Coupons
  const couponsData = [
    {
      code: "WELCOME10",
      type: "PERCENT",
      value: 10,
      minOrder: 99900,
      isActive: true,
    },
    {
      code: "FREESHIP",
      type: "FLAT",
      value: 9900,
      minOrder: 129900,
      isActive: true,
    },
    {
      code: "DIWALI15",
      type: "PERCENT",
      value: 15,
      minOrder: 249900,
      isActive: true,
    },
  ];

  for (const c of couponsData) {
    await db.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }

  // 5. Sample Pincodes (65+ major Indian cities & metro hubs)
  const pincodesData = [
    // Delhi-NCR
    { pin: "110001", city: "New Delhi", state: "Delhi", serviceable: true, etaDays: 2 },
    { pin: "110019", city: "New Delhi (Nehru Place)", state: "Delhi", serviceable: true, etaDays: 2 },
    { pin: "110070", city: "New Delhi (Vasant Kunj)", state: "Delhi", serviceable: true, etaDays: 2 },
    { pin: "122001", city: "Gurugram", state: "Haryana", serviceable: true, etaDays: 2 },
    { pin: "122002", city: "Gurugram (DLF)", state: "Haryana", serviceable: true, etaDays: 2 },
    { pin: "201301", city: "Noida", state: "Uttar Pradesh", serviceable: true, etaDays: 2 },
    // Mumbai & MMR
    { pin: "400001", city: "Mumbai (Fort)", state: "Maharashtra", serviceable: true, etaDays: 2 },
    { pin: "400050", city: "Mumbai (Bandra)", state: "Maharashtra", serviceable: true, etaDays: 2 },
    { pin: "400053", city: "Mumbai (Andheri West)", state: "Maharashtra", serviceable: true, etaDays: 2 },
    { pin: "400076", city: "Mumbai (Powai)", state: "Maharashtra", serviceable: true, etaDays: 2 },
    { pin: "400601", city: "Thane", state: "Maharashtra", serviceable: true, etaDays: 3 },
    { pin: "411001", city: "Pune", state: "Maharashtra", serviceable: true, etaDays: 2 },
    { pin: "411038", city: "Pune (Kothrud)", state: "Maharashtra", serviceable: true, etaDays: 2 },
    // Bengaluru (Atelier Hub)
    { pin: "560001", city: "Bengaluru (MG Road)", state: "Karnataka", serviceable: true, etaDays: 1 },
    { pin: "560034", city: "Bengaluru (Koramangala)", state: "Karnataka", serviceable: true, etaDays: 1 },
    { pin: "560038", city: "Bengaluru (Indiranagar)", state: "Karnataka", serviceable: true, etaDays: 1 },
    { pin: "560100", city: "Bengaluru (Electronic City)", state: "Karnataka", serviceable: true, etaDays: 1 },
    { pin: "560103", city: "Bengaluru (Bellandur)", state: "Karnataka", serviceable: true, etaDays: 1 },
    { pin: "570001", city: "Mysuru", state: "Karnataka", serviceable: true, etaDays: 2 },
    // Hyderabad
    { pin: "500001", city: "Hyderabad (Abids)", state: "Telangana", serviceable: true, etaDays: 2 },
    { pin: "500033", city: "Hyderabad (Jubilee Hills)", state: "Telangana", serviceable: true, etaDays: 2 },
    { pin: "500081", city: "Hyderabad (Hitec City)", state: "Telangana", serviceable: true, etaDays: 2 },
    // Chennai
    { pin: "600001", city: "Chennai (George Town)", state: "Tamil Nadu", serviceable: true, etaDays: 2 },
    { pin: "600018", city: "Chennai (Alwarpet)", state: "Tamil Nadu", serviceable: true, etaDays: 2 },
    { pin: "600028", city: "Chennai (R.A. Puram)", state: "Tamil Nadu", serviceable: true, etaDays: 2 },
    { pin: "641001", city: "Coimbatore", state: "Tamil Nadu", serviceable: true, etaDays: 3 },
    // Kolkata
    { pin: "700001", city: "Kolkata (BBD Bagh)", state: "West Bengal", serviceable: true, etaDays: 3 },
    { pin: "700019", city: "Kolkata (Ballygunge)", state: "West Bengal", serviceable: true, etaDays: 3 },
    { pin: "700091", city: "Kolkata (Salt Lake)", state: "West Bengal", serviceable: true, etaDays: 3 },
    // Ahmedabad & Gujarat
    { pin: "380001", city: "Ahmedabad", state: "Gujarat", serviceable: true, etaDays: 3 },
    { pin: "380015", city: "Ahmedabad (Satellite)", state: "Gujarat", serviceable: true, etaDays: 3 },
    { pin: "395001", city: "Surat", state: "Gujarat", serviceable: true, etaDays: 3 },
    { pin: "390001", city: "Vadodara", state: "Gujarat", serviceable: true, etaDays: 3 },
    // Rajasthan
    { pin: "302001", city: "Jaipur (MI Road)", state: "Rajasthan", serviceable: true, etaDays: 3 },
    { pin: "302015", city: "Jaipur (Mansarovar)", state: "Rajasthan", serviceable: true, etaDays: 3 },
    { pin: "313001", city: "Udaipur", state: "Rajasthan", serviceable: true, etaDays: 3 },
    { pin: "342001", city: "Jodhpur", state: "Rajasthan", serviceable: true, etaDays: 3 },
    // Punjab & Chandigarh
    { pin: "160017", city: "Chandigarh", state: "Chandigarh", serviceable: true, etaDays: 3 },
    { pin: "141001", city: "Ludhiana", state: "Punjab", serviceable: true, etaDays: 3 },
    { pin: "143001", city: "Amritsar", state: "Punjab", serviceable: true, etaDays: 3 },
    // Madhya Pradesh & Central
    { pin: "452001", city: "Indore", state: "Madhya Pradesh", serviceable: true, etaDays: 3 },
    { pin: "462001", city: "Bhopal", state: "Madhya Pradesh", serviceable: true, etaDays: 3 },
    // Kerala
    { pin: "682001", city: "Kochi", state: "Kerala", serviceable: true, etaDays: 2 },
    { pin: "695001", city: "Thiruvananthapuram", state: "Kerala", serviceable: true, etaDays: 3 },
    // Uttar Pradesh & North
    { pin: "226001", city: "Lucknow (Hazratganj)", state: "Uttar Pradesh", serviceable: true, etaDays: 3 },
    { pin: "208001", city: "Kanpur", state: "Uttar Pradesh", serviceable: true, etaDays: 3 },
    { pin: "221001", city: "Varanasi", state: "Uttar Pradesh", serviceable: true, etaDays: 3 },
    { pin: "248001", city: "Dehradun", state: "Uttarakhand", serviceable: true, etaDays: 3 },
    // Goa
    { pin: "403001", city: "Panaji", state: "Goa", serviceable: true, etaDays: 3 },
    // Non-serviceable test PIN
    { pin: "190001", city: "Srinagar (Restricted Postal Zone)", state: "Jammu and Kashmir", serviceable: false, etaDays: 0 },
  ];

  for (const p of pincodesData) {
    await db.pincode.upsert({
      where: { pin: p.pin },
      update: p,
      create: p,
    });
  }

  // 6. Settings
  await db.settings.upsert({
    where: { key: "FREE_SHIPPING_THRESHOLD" },
    update: { value: "149900" },
    create: { key: "FREE_SHIPPING_THRESHOLD", value: "149900" },
  });

  await db.settings.upsert({
    where: { key: "STORE_NAME" },
    update: { value: "Little Luxe Hamper" },
    create: { key: "STORE_NAME", value: "Little Luxe Hamper" },
  });

  console.log("Database seeded successfully with SAMPLE boutique hampers!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
