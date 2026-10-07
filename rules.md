# rules.md — Non-negotiable rules for the AI agent

## Honesty & data
1. Never invent facts about the brand, reviews, prices, or testimonials. Use seed data marked `SAMPLE` and a visible-in-admin flag. Real data replaces it.
2. Do not scrape or call Instagram APIs at runtime. Reels are stored as data: `instagramUrl`, `shortcode`, local `poster` image, optional local short `mp4`.
3. Do not ship alcohol/regulated items in sample catalogue.

## Performance budget (hard)
- Mobile Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO = 100, Best Practices ≥ 95.
- LCP < 2.5s, CLS < 0.1, INP < 200ms on throttled 4G.
- JS per route ≤ 150 KB gzipped (landing ≤ 120 KB). Check `next build` output.
- Images: `next/image`, AVIF/WebP, explicit width/height, `priority` only on LCP image, lazy elsewhere, blur placeholders.
- Fonts: `next/font`, max 2 families, `display: swap`, subset.
- Videos/reels: never autoload third-party iframes. Use the **facade pattern** (poster + play button; iframe mounts on click; one active at a time). Self-hosted loop clips ≤ 1.5 MB, muted, `preload="none"`, played only when in viewport (IntersectionObserver).
- No heavy animation libs beyond Framer Motion; prefer CSS transforms/opacity; respect `prefers-reduced-motion`.
- Server Components by default; `"use client"` only for interactive leaf components. Dynamic-import below-the-fold widgets.
- Cache: ISR for catalogue/pages, `revalidate` + on-demand revalidation from admin; HTTP caching headers for static assets.

## Code quality
- TypeScript strict, no `any`. ESLint + Prettier. Zod validation on every API input. Small components. No dead code, no TODO placeholders in shipped code.
- Server-side price calculation: never trust client prices/totals.
- Money as integer paise. Format ₹ with `Intl.NumberFormat('en-IN')`.
- Accessible: semantic HTML, focus states, alt text, 44px touch targets, keyboard-operable carousel, aria labels, contrast ≥ 4.5:1.

## Security
- Admin behind session auth (bcrypt, httpOnly secure cookies, CSRF-safe), rate-limit auth/checkout/pincode APIs.
- Payment provider interface; secrets only via env; verify webhook signatures; idempotent order creation.
- Sanitise gift messages (length ≤ 250, strip HTML). Security headers (CSP, X-Frame-Options except for Instagram embed origin, Referrer-Policy).
- External links to Instagram: `target="_blank" rel="noopener noreferrer"`.

## SEO (mandatory on every public page)
Unique `<title>` (≤60 chars) and meta description (≤155), canonical, OG/Twitter, single H1, JSON-LD (Organization, WebSite+SearchAction, Product+Offer, BreadcrumbList, FAQPage where relevant), `sitemap.xml`, `robots.txt`, `en-IN`, descriptive URLs, internal linking, 404 page, no duplicate content, admin/cart/checkout `noindex`.

## India-specific
INR only, GST-inclusive display, 6-digit PIN validation, state dropdown, +91 phone, COD option flag, delivery-date picker excluding blackout dates, policies pages (Terms, Privacy, Shipping, Refund/Cancellation, Contact, Grievance Officer) present in footer.

## Process
Work phase by phase (`phases.md`). After each phase: build passes, lint passes, tests pass, summarise what's done. Don't skip phases or leave stubs. If requirement is ambiguous, choose the simplest option, document it in `/docs/decisions.md`, continue.
