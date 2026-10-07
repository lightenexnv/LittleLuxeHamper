# Little Luxe Hamper — E-Commerce Platform

A production-ready, ultra-fast, mobile-first e-commerce web platform for **Little Luxe Hamper** ([@little_luxehamper](https://instagram.com/little_luxehamper)), a premium bespoke gift hamper brand serving India.

Built strictly per the brand aesthetic, technical architecture, and performance constraints specified in `rules.md`, `prd.md`, `design.md`, and `architecture.md`.

---

## 🌟 Highlights & Architecture

- **Boutique-Luxe Aesthetics**: Bespoke warm palette (Cream `#FBF6F1`, Blush `#F3DDD6`, Muted Rose `#C9877C`, Wine `#6B2D3C`, Vintage Gold `#B8935A`, Deep Ink `#2A2024`) with Cormorant Garamond serif headings and refined micro-interactions.
- **Instagram Reels Integration (Zero Perf Penalty)**:
  - **Facade Pattern**: High-resolution local posters with play icon overlay; no runtime Instagram SDK overhead. The embed iframe only mounts upon click.
  - **PDP Gallery**: Swiper-style gallery cycling through product photos and concluding with the reel slide.
  - **"View on Instagram" Button**: Outbound link with structured UTM attribution (`utm_source=instagram&utm_medium=pdp_button&utm_campaign=reel_showcase`).
  - **Homepage Reel Strip**: Smooth auto-scrolling marquee with pause on hover/touch and automatic disable for users with `prefers-reduced-motion`.
- **India-First Checkout Experience**:
  - All prices inclusive of GST in INR (₹) with Paisa arithmetic.
  - Instant 6-digit Pincode serviceability & transit-time calculation.
  - Delivery date picker with express cutoff calculation.
  - Complimentary handwritten note card and wax-sealed greeting message inputs.
  - High-converting 3-step checkout with instant pincode auto-fill for City and State.
- **Dummy & Pluggable Payment System**:
  - `PaymentProvider` interface with a **Dummy Gateway** active by default (`PAYMENT_PROVIDER="dummy"`), featuring a prominent Test Mode banner and one-click Success / Failure / Pending simulation.
  - Production **Razorpay adapter** with HMAC-SHA256 signature verification and webhook processing, switchable via environment variables.
- **Pluggable Logistics (Shiprocket Ready)**:
  - `ShippingProvider` abstraction with mock live-tracking milestones and complete **Shiprocket adapter** ready for production API credentials.
- **Full SEO & Programmatic Pages**:
  - Semantic JSON-LD schema (Organization, WebSite, Product, BreadcrumbList, FAQPage).
  - Programmatic gifting occasion pages (`/gifts/diwali`, `/gifts/birthday`, `/gifts/anniversary`, etc.).
  - Programmatic price tier pages (`/gifts/under-1500`, `/gifts/under-3000`, etc.).
  - Programmatic metro city delivery landing pages (`/send-gifts-to/delhi`, `/send-gifts-to/mumbai`, `/send-gifts-to/bengaluru`, etc.).
  - Blog guides, FAQ hub, Contact, Corporate Gifting inquiry system, and complete legal policies (`/policies/shipping`, `/policies/refund`, `/policies/terms`, `/policies/privacy`, `/policies/grievance`).
  - Dynamic `sitemap.xml` and `robots.txt`.
- **Comprehensive Admin Panel**:
  - Secure session cookie authentication (`/admin/login`).
  - Catalog management: Add / Edit products, upload imagery, set prices, toggle sample tags.
  - Reel manager: Add reels with Instagram URL, thumbnail, and product association.
  - Order dashboard: Filter by status, update courier & tracking numbers, export orders to CSV.
  - Coupon management: Create percentage / flat discounts with min-cart caps.
  - Corporate inquiries manager.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### 2. Installation & Setup
```bash
# Clone the repository
git clone https://github.com/lightenexnv/LittleLuxeHamper.git
cd LittleLuxeHamper

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Generate vector SVG assets & posters
npm run generate:assets

# Migrate database & seed 14 luxury hampers, reels, pincodes, and coupons
npm run db:push
npm run db:seed
```

### 3. Run Development Server
```bash
npm run dev
# Open http://localhost:3000 in your browser
```

### 4. Build & Run Production Server
```bash
npm run build
npm start
```

---

## 🧪 Verification & Testing

```bash
# Run unit tests (Pricing, Currency arithmetic, Instagram URL parsing, Sanitization)
npm test

# Run code linter
npm run lint

# Run Playwright End-to-End tests (Home -> PDP -> Reel -> Cart -> Checkout -> Dummy Payment)
npx playwright test
```

---

## 📦 Bundle & Performance Metrics

Verified with `npm run build`:
- **Shared First Load JS**: **87.3 kB** (Budget: ≤ 100 kB) ✅
- **Landing Page (`/`)**: **113 kB** (Budget: ≤ 120 kB) ✅
- **Product Page (`/product/[slug]`)**: **116 kB** (Budget: ≤ 150 kB) ✅
- **Catalogue (`/shop`)**: **109 kB** (Budget: ≤ 150 kB) ✅
- **Cart (`/cart`)**: **109 kB** ✅
- **Checkout (`/checkout`)**: **112 kB** ✅
- **Total Static/SSG/ISR Routes**: **87 pages prerendered** ✅

---

## 📚 Documentation Links

- [Technical Decisions & Assumptions](file:///D:/Coding/LittleLuxeHamper/docs/decisions.md)
- [Production Go-Live Checklist](file:///D:/Coding/LittleLuxeHamper/docs/go-live.md)
- [Brand Owner Content Guide](file:///D:/Coding/LittleLuxeHamper/docs/content-guide.md)
- [Architecture Blueprint](file:///D:/Coding/LittleLuxeHamper/architecture.md)
- [Product Requirements Document](file:///D:/Coding/LittleLuxeHamper/prd.md)
