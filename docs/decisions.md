# Technical & Business Decisions — Little Luxe Hamper

## 1. Stack & Architecture Defaults
- **Framework**: Next.js 14+ (App Router, TypeScript) with Tailwind CSS.
- **ORM & Database**: Prisma with SQLite (`file:./dev.db`) for lightweight local development, migration, and testing without requiring an external PostgreSQL instance; configured to easily switch to PostgreSQL for production deployment.
- **State Management**: Zustand for cart persistence (`localStorage`), mini-cart drawer state, and filter states.
- **Validation**: Zod for all API route requests, checkout payload validation, environment variables, and admin actions.
- **Icons**: Lucide React for consistent, lightweight feather icons.
- **Fonts**: `next/font/google` using Cormorant Garamond (headings) and Inter (body/UI) with `display: swap`.

## 2. Seed Data & Sample Content
- 14 realistic sample hampers across 6 collections: Festive (Diwali/Bhai Dooj), Birthdays, Anniversaries, Pamper/Self-Care, Corporate, and Newborn/Baby Shower.
- Local SVG/gradient posters generated for product photos and Instagram reels.
- Every sample record is explicitly flagged `isSample = true` and clearly highlighted in the Admin Dashboard with a banner indicating "SAMPLE data — replace before launch".
- Sample pincodes include 65+ major Indian metros and Tier-1 cities with serviceable status and ETA days.
- Coupons seeded: `WELCOME10` (10% off), `FREESHIP` (Free shipping above ₹999), and `DIWALI15` (15% off).

## 3. Reels & Instagram Integration
- Reels are loaded strictly via metadata (`instagramUrl`, `shortcode`, `posterUrl`, optional `videoUrl`).
- Facade pattern implemented: displays high-res local poster with Play icon overlay; only on click does the Instagram embed iframe mount (or local video player play).
- Product gallery swipes through high-res product images and concludes with the Reel slide.
- "View on Instagram" gradient button below gallery launches the reel in a new tab with `utm_source=instagram&utm_medium=pdp_button&utm_campaign=reel_showcase`.
- Auto-scrolling horizontal reels strip on the landing page pauses on hover/touch and disables auto-scroll when `prefers-reduced-motion` is active.

## 4. Payment & Shipping Providers
- Pluggable `PaymentProvider` interface with `DummyPaymentProvider` active by default (`PAYMENT_PROVIDER="dummy"`). Dummy modal features explicit Test Mode banner and lets users test Success, Failure, and Pending states.
- `RazorpayPaymentProvider` fully implemented with HMAC signature verification and webhook handler, switchable via environment variables.
- Pluggable `ShippingProvider` interface with `MockShippingProvider` active by default (`SHIPPING_PROVIDER="mock"`) and `ShiprocketShippingProvider` fully implemented.

## 5. Security & SEO
- Admin authentication uses secure session cookies with `bcryptjs` password hashing and constant-time secret comparison.
- Strict Security Headers: Content-Security-Policy (with frame-src allowing `https://www.instagram.com`), X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- SEO: Semantic JSON-LD (Organization, WebSite, Product, BreadcrumbList, FAQPage) on all public pages, unique `<title>` (≤60 chars) and meta descriptions (≤155 chars), dynamic `sitemap.xml` and `robots.txt` blocking admin and checkout.
