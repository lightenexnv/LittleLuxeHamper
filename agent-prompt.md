# MASTER PROMPT — paste this to the AI coding agent (with all .md files in the project root)

**Role:** You are a principal full-stack engineer, e-commerce architect, UI/UX designer and technical-SEO specialist.

**Mission:** Build the complete, production-ready e-commerce website for **Little Luxe Hamper** (Instagram: @little_luxehamper), a premium gifting-hamper brand serving all of India, in one continuous run.

**Step 1 — Read.** Read in this order before writing code: `readme.md`, `rules.md`, `prd.md`, `design.md`, `architecture.md`, `phases.md`, `business-report.md`. Treat `rules.md` as hard constraints and `prd.md` as the source of truth for features.

**Step 2 — Plan.** Output a brief plan (≤30 lines) mapping phases to deliverables. Record any assumptions in `/docs/decisions.md`. Do not stop to ask questions; choose sensible defaults.

**Step 3 — Build** every phase in `phases.md` sequentially until all exit criteria pass. Do not leave stubs, TODOs or lorem ipsum. Specifically ensure:
1. Product page: image gallery that swipes through images, then shows the Instagram **reel slide** (poster+play facade, embed mounted on click), plus a **"View on Instagram"** button below the gallery that opens the reel URL in a new tab with UTM params.
2. Landing page: beautiful animated, auto-scrolling **Instagram reels strip** (facade, pause on hover, reduced-motion safe).
3. Fast: meet every performance budget in `rules.md`; show bundle sizes and Lighthouse results at the end.
4. Full purchase flow with a **dummy payment gateway** (test-mode banner, success/failure/pending) built behind a `PaymentProvider` interface, with Razorpay and Shiprocket adapters implemented but disabled by env flags.
5. SEO complete per `rules.md` (metadata, JSON-LD, sitemap, robots, programmatic gift/city pages, blog).
6. Admin panel so the owner can add products, images, reels, collections, coupons and manage orders without code.
7. India specifics: INR/GST-inclusive, PIN checker, COD flag, policy pages.

**Step 4 — Seed data.** Use clearly-marked SAMPLE data (no fake testimonials presented as real, no hotlinked images). Generate local placeholder posters/images (SVG/gradient). Make replacing them trivial via admin.

**Step 5 — Verify.** Run lint, type-check, unit tests, Playwright E2E (home → PDP → swipe to reel → Instagram button → cart → checkout → dummy payment success), `next build`, and Lighthouse mobile. Fix failures. 

**Step 6 — Handoff.** Produce `/docs/go-live.md` and `/docs/content-guide.md`; update `readme.md`; print a final report: what was built, how to run, test results, performance numbers, list of SAMPLE items to replace, and next steps (Razorpay keys, Shiprocket account, domain, GA4).

**Quality bar:** boutique-luxe aesthetic per `design.md`, mobile-first, accessible, secure, no dead code. If any requirement conflicts, priority order: `rules.md` > `prd.md` > `design.md` > `architecture.md`.
