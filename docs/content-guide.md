# Content Management & Brand Owner Guide — Little Luxe Hamper

Welcome to the Little Luxe Hamper Content Guide. This manual instructs brand administrators and marketing personnel on managing products, Instagram Reels, banners, and orders through the integrated Admin Panel without writing a single line of code.

---

## 1. Accessing the Admin Panel

1. Navigate to: `https://littleluxehamper.com/admin/login` (or `http://localhost:3000/admin/login` in development).
2. Enter your administrator credentials:
   - **Email**: `admin@littleluxehamper.com` (configured via `ADMIN_EMAIL`)
   - **Password**: Password configured in environment variables (default dev: `Admin@LittleLuxe2025!`)
3. Once logged in, you will be redirected to the **Admin Dashboard** with quick links to Products, Reels, Orders, Coupons, and Enquiries.

---

## 2. Replacing SAMPLE Hampers With Real Products

Every sample product seeded during initial setup is flagged with a **SAMPLE** tag so customers and admins know they are placeholders.

### Step-by-Step Replacement:
1. Go to **Admin > Products** (`/admin/products`).
2. You will see a banner listing active SAMPLE items.
3. To replace a sample:
   - Click **Edit** on a sample product.
   - Update the **Title**, **Slug**, and **Description** with your exact hamper curation.
   - Update **Price (₹)** and **MRP (₹)**.
   - Uncheck the **"Mark as Sample Data"** checkbox.
   - Upload or paste URLs for real photography (see image dimensions below).
   - Click **Save Changes**.
4. To add a new hamper from scratch:
   - Click **+ Add New Product** (`/admin/products/new`).
   - Fill in Title, Description, Short Summary, Occasions, Price, MRP, Inventory stock count, and whether COD is available.
   - Leave "Sample Data" unchecked.
   - Save.

### Recommended Product Image Dimensions:
- **Aspect Ratio**: 4:5 (portrait) or 1:1 (square).
- **Resolution**: `1200 x 1500 px` (portrait) or `1200 x 1200 px` (square).
- **Format**: WebP (preferred) or high-quality compressed JPEG (under 250 KB per image).
- **Lighting**: Bright, soft ambient lighting reflecting luxury aesthetic (marble backdrops, silk ribbons, warm highlights).

---

## 3. Adding & Managing Instagram Reels

Little Luxe Hamper uses a high-performance **Facade Pattern** for Instagram Reels:
- An ultra-fast, lightweight image poster is displayed initially.
- The actual heavy Instagram embed iframe is only loaded when a customer taps the play button.
- A "View Reel on Instagram" button opens the official post with analytics tracking parameters.

### Adding a New Reel:
1. Go to **Admin > Instagram Reels** (`/admin/reels`).
2. Click **+ Add New Reel**.
3. Fill in the fields:
   - **Title / Caption**: e.g. *"Handpacking the Royal Velvet Hamper"*.
   - **Instagram Post / Reel URL**: Copy the exact URL from Instagram:
     `https://www.instagram.com/reel/C3_aBcDeF12/`
   - **Poster Image**: Upload or link a high-resolution snapshot/thumbnail of the reel (`1080 x 1920 px`, 9:16 vertical ratio).
   - **Direct Video MP4 (Optional)**: If you host a local MP4 file, provide the URL to enable native background playing without iframe overhead.
   - **Link to Product (Optional)**: Associate this reel with a specific hamper so it automatically shows in that hamper's PDP gallery!
4. Click **Save Reel**.

---

## 4. Managing Coupons & Promotions

1. Go to **Admin > Coupons** (`/admin/coupons`).
2. Click **Create Coupon**.
3. Configure the discount rules:
   - **Code**: e.g. `DIWALI2026`, `FESTIVE10` (stored uppercase).
   - **Discount Type**: Percentage (`PERCENTAGE`) or Flat Rupee (`FLAT`).
   - **Value**: e.g., `15` for 15% off, or `500` for ₹500 off.
   - **Minimum Order Value (₹)**: e.g. ₹1,999.
   - **Max Discount (₹)** (for percentage discounts): e.g. ₹1,000 cap.
   - **Expiry Date**: Set future expiration date.
4. Active coupons will immediately be valid at checkout and cart!

---

## 5. Processing Orders & Tracking

1. Go to **Admin > Orders** (`/admin/orders`).
2. Filter orders by status: `PENDING`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
3. Click on any Order ID to inspect:
   - Customer shipping address & verified PIN.
   - Selected delivery date.
   - Custom gift card message & handwritten note.
   - Add-on items included.
4. When dispatched:
   - Enter Courier Name and Tracking Airway Bill (AWB) number.
   - Change status to **SHIPPED**.
   - Customer will see live tracking milestones on `/track-order`!
5. **CSV Export**: Click the **"Export CSV"** button at the top right of the Orders page to download spreadsheets for your packing and dispatch teams.

---

## 6. Corporate & Bulk Enquiries

1. Customers who submit inquiries on `/corporate-gifting` are stored under **Admin > Enquiries** (`/admin/enquiries`).
2. Review company names, hamper count requested (50–1,000+), budget per hamper, and contact details.
3. Click "Contact via WhatsApp" or Email to initiate direct B2B invoicing and custom branding samples.
