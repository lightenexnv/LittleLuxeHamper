# architecture.md

## Principles
Server-first, static where possible (ISR), minimal client JS, pluggable providers, no runtime dependency on Instagram.

## Stack
Next.js App Router + TypeScript • Tailwind • Framer Motion (limited) • Prisma (SQLite dev, Postgres prod) • Zustand • Zod • React Hook Form • bcrypt + signed session cookie (or Auth.js) • nodemailer • Vitest + Playwright.

## Folder structure
```
/app
  (site)/layout.tsx, page.tsx
  (site)/shop, collections/[slug], gifts/[occasion], send-gifts-to/[city]
  (site)/product/[slug], build-your-hamper, corporate-gifting
  (site)/cart, checkout, order/[id]/confirmation, track-order
  (site)/about, reels, blog/[slug], contact, faq, policies/[slug]
  admin/(auth)/login, admin/(dash)/products|reels|orders|coupons|collections|enquiries
  api/pincode, api/cart/price, api/checkout, api/payments/{create,verify,webhook,dummy}
  api/orders/[id], api/enquiry, api/newsletter, api/admin/*
  sitemap.ts, robots.ts, not-found.tsx, opengraph-image.tsx
/components  ui/, layout/, product/(Gallery, ReelSlide, InstagramButton, PriceBlock), home/(ReelsStrip, Hero...), checkout/, admin/
/lib  db.ts, money.ts, pricing.ts, seo.ts(jsonld), instagram.ts(parse shortcode), analytics.ts, validators/
/lib/payments  provider.ts, dummy.ts, razorpay.ts, index.ts(factory)
/lib/shipping  provider.ts, mock.ts, shiprocket.ts, index.ts
/prisma  schema.prisma, seed.ts
/public  images/, reels/(poster+mp4), fonts?
/content  blog/*.mdx, faq.json, policies/*.md
/tests  unit/, e2e/
/docs  decisions.md
```

## Provider interfaces
```ts
interface PaymentProvider {
  createPayment(order: OrderDTO): Promise<{ providerOrderId: string; clientPayload: unknown }>;
  verifyPayment(payload: unknown): Promise<{ ok: boolean; paymentId?: string }>;
  handleWebhook(req: Request): Promise<WebhookResult>;   // signature verified
  refund?(paymentId: string, amountPaise: number): Promise<void>;
}
interface ShippingProvider {
  checkServiceability(pin: string): Promise<{ serviceable: boolean; etaDays: number; cost: number }>;
  createShipment(order: OrderDTO): Promise<{ awb: string; labelUrl?: string; trackingUrl: string }>;
  getTracking(awb: string): Promise<TrackingEvent[]>;
}
```
Factory selects by `PAYMENT_PROVIDER` / `SHIPPING_PROVIDER`. Razorpay implementation: create order via Orders API → Standard Checkout on client → verify HMAC signature server-side → webhook (`payment.captured`, `payment.failed`) updates order idempotently. Shiprocket: token auth → serviceability → order create → AWB → webhook for tracking.

## Order flow
Cart (client) → `POST /api/cart/price` (server recomputes) → `POST /api/checkout` (validates, creates Order `PENDING`, snapshots prices) → `createPayment` → client pays (dummy modal / Razorpay) → `verifyPayment` + webhook → Order `CONFIRMED` + stock decrement (transaction) → email + admin notification → admin ships → status updates.

## Reels architecture
`Reel` rows hold URL/shortcode/poster/optional mp4. Components: `ReelCard` (facade), `ReelModal`, `ReelSlide`. Embed iframe URL: `https://www.instagram.com/reel/{shortcode}/embed` (mounted on click only). If Instagram blocks/slow → fallback to poster + "Watch on Instagram" link. Posters/clips are uploaded in admin (client downloads their own content) and optimised on upload.

## Rendering strategy
Home/shop/collections/PDP: ISR (`revalidate` 300–3600) + on-demand revalidate from admin. Cart/checkout/admin: dynamic, `noindex`. Product list uses cursor pagination. Search index JSON built at revalidate.

## Caching & delivery
CDN for static/images, immutable hashed assets, `stale-while-revalidate` for API reads, Brotli, HTTP/2, preconnect only to needed origins (fonts self-hosted via next/font).

## SEO implementation
`lib/seo.ts` builds metadata + JSON-LD per page type; `sitemap.ts` generates from DB (products, collections, gifts, cities, blog); `robots.ts` blocks `/admin`, `/cart`, `/checkout`, `/api`.

## Observability
Error boundary, Sentry-ready hook, request logging, order audit log, health endpoint `/api/health`.

## Security
Zod at boundaries, rate limiting (in-memory/Upstash), CSP allowing `frame-src https://www.instagram.com`, httpOnly cookies, bcrypt, env validation at boot, webhook signature verification, no PII in logs.

## Testing
Unit: pricing, coupons, pincode, shortcode parser. Integration: checkout + dummy payment. E2E (Playwright): home → PDP → gallery swipe to reel → Instagram button → add to cart → checkout → success. Lighthouse CI budget gate.
