# Production Go-Live Checklist & Runbook — Little Luxe Hamper

This guide details the step-by-step procedure for transitioning Little Luxe Hamper (`@little_luxehamper`) from local development/staging to production.

---

## 1. Environment & Database Configuration

### 1.1 Transitioning from SQLite to PostgreSQL
1. Create a managed PostgreSQL database (e.g. Supabase, Neon, AWS RDS, or Railway).
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Seed initial production taxonomies (cities, categories, admin user):
   ```bash
   npm run db:seed
   ```

### 1.2 Production Environment Variables (`.env.production`)
Configure all environment variables securely:
```ini
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://littleluxehamper.com
DATABASE_URL="postgresql://user:password@host:5432/littleluxehamper?sslmode=require"

# Admin Authentication
ADMIN_EMAIL=owner@littleluxehamper.com
ADMIN_PASSWORD_HASH="$2a$10$..." # Generate via bcryptjs
SESSION_SECRET="secure-random-32-byte-hex-string"

# Live Payment Gateway (Razorpay)
PAYMENT_PROVIDER=razorpay
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_live_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"

# Logistics & Shipping (Shiprocket)
SHIPPING_PROVIDER=shiprocket
SHIPROCKET_EMAIL="logistics@littleluxehamper.com"
SHIPROCKET_PASSWORD="your_shiprocket_password"
SHIPROCKET_PICKUP_PINCODE="110001"

# Analytics & Marketing
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_META_PIXEL_ID="XXXXXXXXXXXXXXX"
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
```

---

## 2. Payment Gateway Activation (Razorpay)

1. **KYC & Account Activation**:
   - Complete Razorpay Merchant onboarding with registered Business Entity details (LLP / Private Limited / Sole Proprietorship).
   - Submit GSTIN certificate, PAN, cancelled cheque, and website URL for compliance verification.
2. **API Keys**:
   - Generate Live API Key and Secret from Razorpay Dashboard > Settings > API Keys.
   - Set `PAYMENT_PROVIDER="razorpay"`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET`.
3. **Webhooks Setup**:
   - Go to Razorpay Dashboard > Settings > Webhooks > Add New Webhook.
   - Webhook URL: `https://littleluxehamper.com/api/payments/webhook`
   - Secret: Enter a generated string matching `RAZORPAY_WEBHOOK_SECRET`.
   - Subscribed Events:
     - `payment.captured`
     - `payment.failed`
     - `order.paid`
4. **Test Payment**:
   - Perform a live transaction of ₹1 (or ₹100) using UPI / Credit Card, verify order status transitions to `PAID`, and issue a refund from the dashboard.

---

## 3. Shipping & Logistics Automation (Shiprocket)

1. **Account Setup & API User**:
   - Register at Shiprocket.in and complete KYC.
   - Generate API credentials under Shiprocket Dashboard > Settings > API > Configure.
   - Enter credentials in `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD`.
2. **Pickup Location Setup**:
   - Register the physical studio/warehouse pickup address under Shiprocket > Pickup Locations.
   - Verify warehouse pincode matches `SHIPROCKET_PICKUP_PINCODE`.
3. **Courier Rule Configuration**:
   - Enable preferred express couriers: Bluedart Air, Delhivery Air, DTDC for rapid pan-India gifting transit.
   - Configure fragile item handling tags on airway bills.

---

## 4. Custom Domain & DNS Setup

1. **Apex & Subdomain Records**:
   - Recommended Registrar: Cloudflare / Namecheap / GoDaddy.
   - If deploying to **Vercel**:
     - `A` Record: `@` -> `76.76.21.21`
     - `CNAME` Record: `www` -> `cname.vercel-dns.com`
2. **SSL / TLS**:
   - Ensure Full (Strict) SSL encryption is enabled.
   - Verify HSTS headers are served.
3. **Redirects**:
   - Ensure `http://` redirects to `https://`.
   - Ensure `littleluxehamper.com` redirects canonically or aliases `www.littleluxehamper.com`.

---

## 5. Analytics & Conversion Tracking

1. **Google Analytics 4 (GA4)**:
   - Create a GA4 property and web data stream.
   - Supply `NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"`.
   - Verify page views, purchase events, and enhanced e-commerce funnels.
2. **Meta Pixel & Conversions API**:
   - Create Pixel in Meta Business Suite for Instagram & Facebook Ads.
   - Supply `NEXT_PUBLIC_META_PIXEL_ID`.
   - Set up Standard Events: `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`.

---

## 6. Indian Regulatory & Legal Compliance Checklist

- [ ] **GST Compliance**: Verify all product prices are marked as inclusive of GST (e.g. 18% on gift hampers, 5% or 12% on food contents).
- [ ] **FSSAI License**: Hamper contains food items (artisanal chocolates, dry fruits, teas). Ensure the Brand FSSAI Registration number is updated in the footer and policy pages.
- [ ] **Grievance Officer**: Verify the name, email, and phone of the designated Grievance Officer is live under `/policies/grievance` per India Consumer Protection (E-Commerce) Rules 2020.
- [ ] **Legal Policies**: Confirm Return/Refund, Shipping, Terms of Service, and Privacy Policies are active and accurately describe return terms (non-returnable perishable food items, 24-hour damage replacement window).
- [ ] **WhatsApp Business Support**: Verify WhatsApp floating icon links directly to official verified WhatsApp Business account (`https://wa.me/919876543210`).
