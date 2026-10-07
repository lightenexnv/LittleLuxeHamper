# phases.md — Build plan (execute in order; all in one run)

## Phase 0 — Foundation
Init Next.js+TS+Tailwind, ESLint/Prettier, env validation, Prisma schema + migrations, folder structure, design tokens, fonts, base layout, SEO helpers.
**Exit:** `npm run build` passes, tokens applied, DB migrates.

## Phase 1 — Data & seed
Seed SAMPLE products/collections/reels/add-ons/coupons/pincodes. Admin-flagged `isSample`.
**Exit:** seed runs idempotently; shop data renders.

## Phase 2 — Core storefront
Header/footer/announcement, Home (all sections incl. **Reels strip**), Shop, Collections, Search/filters, ProductCard.
**Exit:** responsive, LCP image prioritised, Lighthouse mobile ≥ 90 on Home.

## Phase 3 — Product page + reels
Gallery (images→reel slide), ReelCard/ReelModal facade, **Instagram button**, pincode checker, delivery date, gift message, add-ons, related, JSON-LD.
**Exit:** E2E: swipe to reel, play, click Instagram button (new tab, UTM).

## Phase 4 — Cart & checkout & dummy payment
Zustand cart, mini-cart, server pricing, coupons, 3-step checkout, DummyPaymentProvider (success/fail/pending), order creation, confirmation, track-order, emails.
**Exit:** E2E purchase passes; failure path leaves cart intact.

## Phase 5 — Content & SEO pages
About, FAQ, policies, contact, corporate-gifting, build-your-hamper, `/gifts/*`, `/send-gifts-to/*`, blog (3 starter MDX posts), sitemap/robots/OG images, structured data validation.
**Exit:** SEO = 100, sitemap lists all, no duplicate titles.

## Phase 6 — Admin
Auth, products/reels/collections/coupons/orders/enquiries, image upload + optimisation, revalidation hooks, CSV export.
**Exit:** owner can add a product with reel and see it live without code.

## Phase 7 — Integrations (adapter-ready, flagged off)
Implement `RazorpayProvider` + `ShiprocketProvider` behind env flags with webhook handlers and docs in `/docs/go-live.md`; analytics (GA4, Pixel, consent), WhatsApp button, newsletter.
**Exit:** switching `PAYMENT_PROVIDER=razorpay` requires only keys.

## Phase 8 — Hardening & QA
Performance pass (bundle analysis, image audit), accessibility audit, security headers/rate limits, 404/500 pages, unit+E2E tests, Lighthouse CI.
**Exit:** all budgets in `rules.md` met; README accurate.

## Phase 9 — Handoff
`/docs/go-live.md` (Razorpay, Shiprocket, domain, GA4, Search Console, FSSAI/GST reminders), `/docs/content-guide.md` (adding products & reels), list of everything still SAMPLE.

## Post-launch (not in this run)
Reviews import, WhatsApp automation, account area, Google Merchant feed, A/B tests, regional pages, subscription reminders.
