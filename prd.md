# prd.md — Product Requirements

## 1. Goal
Convert Instagram-driven traffic into orders across India with a fast, beautiful, trustworthy gifting store. Success: Lighthouse targets (`rules.md`), checkout completion, AOV growth, organic search traffic.

## 2. Users
Aesthetic Gifter, Occasion Planner, Long-Distance Gifter, Corporate Buyer, Wedding Host (see `business-report.md` §3). Admin = business owner (non-technical).

## 3. Sitemap & pages
| Route | Purpose | Key content |
|---|---|---|
| `/` | Landing | Announcement bar; sticky header; hero (LCP image + CTA); occasion tiles; **Reels strip**; bestsellers; budget shortcuts; "How it works" (choose → personalise → we deliver); custom hamper CTA; delivery promise; testimonials (SAMPLE-flagged); Instagram follow block; FAQ; newsletter; footer |
| `/shop` | All products | Filters (occasion, budget, category, customisable), sort, pagination/infinite load, search |
| `/collections/[slug]` | Category | Intro copy (SEO), grid, FAQ |
| `/gifts/[occasion]` , `/gifts/under-[amount]` | SEO landing | Unique copy + products + FAQ |
| `/send-gifts-to/[city]` | SEO city pages | Delivery info, products, pincode checker |
| `/product/[slug]` | PDP | **Gallery**: images → swipe → reel slide(s) (poster+play); **"View on Instagram" button** under gallery; title, price, MRP, discount, rating, contents list, pincode checker + ETA, delivery date picker, gift message/card option, add-ons, add to cart / Buy now, WhatsApp enquiry, accordion (details, care, delivery, returns), reviews, related, JSON-LD |
| `/build-your-hamper` | Custom builder | Pick box → items → message → price live → add to cart |
| `/corporate-gifting` | B2B | Benefits, tiers, logo-branding, enquiry form |
| `/cart` (and slide-over mini-cart) | Cart | Items, add-ons, coupon, free-shipping progress, totals |
| `/checkout` | 3-step: Contact → Address+Delivery → Payment | Guest checkout, saved fields, validation, COD toggle, dummy payment |
| `/order/[id]/confirmation` | Success | Summary, ETA, share, Instagram CTA |
| `/track-order` | Tracking | Order ID + phone → status timeline |
| `/about` | Story | Brand, process, packing |
| `/reels` | Reel gallery | Grid of all reels (facade), links to products |
| `/blog`, `/blog/[slug]` | SEO content | Gift guides (MDX) |
| `/contact` | Support | Form, WhatsApp, Instagram |
| `/faq`, `/policies/{terms,privacy,shipping,refund}` | Legal | Required footer links |
| `/account` (optional P2) | Orders, saved occasions | Email OTP/magic link |
| `/admin/*` | Back office | Login, dashboard, products CRUD, reels CRUD, orders, coupons, collections, enquiries |
| `/404`, `/sitemap.xml`, `/robots.txt` | System | |

## 4. Key features (acceptance criteria)

### F1. Product gallery with reels
- Swipe/arrow/keyboard through images (pinch-zoom optional), thumbnails below on desktop, dots on mobile.
- After last image, reel slide(s) appear (if `reels[]` non-empty). Reel slide shows self-hosted poster + play icon. Tap: plays self-hosted `mp4` inline if provided; else mounts Instagram embed iframe (`/reel/{shortcode}/embed`) inside slide. Only one reel active at a time; stops when swiping away.
- Below gallery: **"View on Instagram"** button (gradient Instagram-style, icon) → opens `instagramUrl` in new tab with `utm` params; fires analytics event `instagram_click`.
- If no reel: gallery shows images only; button links to profile.

### F2. Landing reels strip
- Horizontally scrolling scroll-snap carousel of 6–12 reel cards (9:16 posters), gentle CSS auto-scroll that pauses on hover/touch and is disabled for reduced-motion. Inline muted preview loops only for the card in viewport (if mp4 available).
- Tap → fullscreen modal with embed (facade). Each card: product link chip + "Watch on Instagram" button.

### F3. Cart & pricing
Server-validated totals: subtotal, add-ons, coupon, shipping (free over threshold, configurable), COD fee, GST-inclusive display. Persisted cart (localStorage + server order at checkout).

### F4. Checkout & dummy payment
- Fields: name, phone (+91), email, address lines, landmark, PIN (auto city/state via local pincode table), state, recipient name/phone if gift, delivery date, gift message, invoice GSTIN (optional).
- Payment methods UI: UPI, Card, Netbanking, COD (if enabled).
- **DummyPaymentProvider**: simulated modal with buttons Success / Failure / Pending; produces fake `payment_id`; order status updates accordingly; webhook simulation endpoint. Banner "TEST MODE — no real money".
- Provider interface identical for Razorpay (see architecture).

### F5. Delivery
Pincode checker → serviceable? + ETA from `ShippingProvider` (mock now). Order statuses: Placed → Confirmed → Packed → Shipped → Out for delivery → Delivered / Cancelled / Failed. Admin can set status and tracking URL; customer sees timeline; email (and WhatsApp deep link) notification.

### F6. Search & filters
Instant client search over lightweight index; filter by occasion, price band, category, "customisable", rating. URL-synced filters (shareable, SEO-safe canonicals).

### F7. Reviews
Customer reviews with optional photo (admin-moderated). Show aggregate in JSON-LD only if real.

### F8. Admin
Auth; product CRUD with multi-image upload (auto-optimised), reels field (Instagram URL → shortcode auto-parsed, poster upload), inventory, collections; order list & status; coupon CRUD; enquiries; CSV export; revalidate cache on save.

### F9. Marketing & analytics
GA4 + Meta Pixel (consent-aware), events: view_item, add_to_cart, begin_checkout, purchase, instagram_click, whatsapp_click. Exit-intent/first-visit coupon (non-intrusive). Newsletter capture.

### F10. WhatsApp
Floating button with prefilled message including product URL; order-via-WhatsApp fallback on PDP.

## 5. Data model (Prisma)
`Product(id, slug, name, shortDesc, description, pricePaise, mrpPaise, sku, stock, isCustomizable, isActive, isSample, contents Json, tags, seoTitle, seoDesc)`
`ProductImage(id, productId, url, alt, sort)`
`Reel(id, productId?, instagramUrl, shortcode, posterUrl, videoUrl?, caption, sort, showOnHome)`
`Collection(id, slug, name, type[occasion|budget|category], intro, productIds)`
`AddOn(id, name, pricePaise, imageUrl)`
`Order(id, number, status, paymentStatus, paymentMethod, subtotal, discount, shipping, codFee, total, customerName/Phone/Email, address Json, deliveryDate, giftMessage, couponCode, trackingUrl, awb, createdAt)`
`OrderItem(id, orderId, productId, nameSnapshot, pricePaise, qty, addOns Json)`
`Payment(id, orderId, provider, providerPaymentId, status, raw Json)`
`Coupon(id, code, type, value, minOrder, expiresAt, usageLimit)`
`Review(id, productId, name, rating, body, photoUrl, approved)`
`Enquiry(id, type[contact|corporate], payload Json)`
`Pincode(pin, city, state, serviceable, etaDays)`
`Settings(key, value)`

## 6. Seed data
12–16 SAMPLE hampers across 6 collections, 4 sample reels (placeholder posters generated locally), 60+ sample pincodes (metros), 3 coupons (`WELCOME10`, `FREESHIP`, `DIWALI15`), add-ons. Everything flagged `isSample=true` and listed in admin as "replace me".

## 7. Content tone
Warm, elegant, concise. Short sentences. No hype claims, no fake stats.

## 8. Out of scope v1
Multi-vendor, subscriptions, mobile app, international shipping, alcohol.
