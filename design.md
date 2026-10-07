# design.md — UI/UX Design System

## Brand feel
"Soft luxury": warm, elegant, gift-box delight. Think blush + cream + gold accents, generous whitespace, editorial photography, ribbon motifs. Not loud, not cluttered. *(If client has a logo/palette, override tokens below.)*

## Tokens
```
--cream:#FBF6F1  --blush:#F3DDD6  --rose:#C9877C  --wine:#6B2D3C
--gold:#B8935A   --ink:#2A2024    --muted:#7A6A6E  --white:#FFFFFF
--success:#2E7D5B --error:#B3382C
Gradient (Instagram button): linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4)
Radius: 12px cards, 999px buttons/chips   Shadow: 0 8px 30px rgba(107,45,60,.10)
```
**Typography:** Headings — *Cormorant Garamond* or *Playfair Display* (600); Body/UI — *Inter* or *DM Sans* (400/500). Scale (mobile→desktop): H1 34→56, H2 26→40, body 16, small 14. Line-height 1.5 body, 1.15 headings.
**Spacing:** 4-pt grid; section padding 64/96px. **Container:** max 1240px.

## Layout & navigation
- **Mobile-first.** Sticky header: logo, search icon, cart (badge), hamburger. Bottom sticky "Add to cart" bar on PDP. Floating WhatsApp button (bottom-right, offset above PDP bar).
- **Desktop:** logo centre-left, mega-menu (Occasions / Budget / Categories / Corporate / Reels), search bar, cart.
- Announcement bar: free-shipping threshold + festival cut-off message.
- Footer: about, policies, social, contact, payment icons, newsletter, GSTIN/FSSAI placeholders.

## Landing page composition (top→bottom)
1. Hero: full-bleed lifestyle image (LCP, priority), headline, sub, CTAs "Shop hampers" + "Build your own", trust chips (Pan-India delivery • Handpacked • Secure payment).
2. Occasion tiles (circular/rounded images) — horizontal scroll on mobile.
3. **Reels strip** — "As seen on Instagram": 9:16 rounded cards, auto-drift marquee, play badge, product chip; tap → modal.
4. Bestsellers grid (2-col mobile, 4-col desktop).
5. Shop by budget chips (Under ₹999 / ₹1,999 / ₹2,999 / Premium).
6. How it works (3 steps with line icons).
7. Custom hamper banner (split layout).
8. Why us (packaging, personal note, tracking, support).
9. Testimonials/reviews carousel (SAMPLE flagged until real).
10. Instagram follow block with @handle and 6-image grid → profile.
11. FAQ accordion + newsletter + footer.

## Product page UX
- **Gallery:** large 4:5 image, swipe (touch/drag), arrows (desktop), dots, thumbnails; images first, then reel slide(s) with play overlay and "Reel" badge; transitions 250ms ease-out; preloads next slide only.
- **Under gallery:** Instagram-gradient pill button "View on Instagram ↗" (full width on mobile).
- Price block (₹, strike MRP, % off), delivery checker (PIN input + ETA), date picker, gift message textarea with counter, add-on checkboxes with thumbnails, primary CTA (wine/gold), secondary "Buy now", WhatsApp link, trust row, accordions, reviews, "Complete the gift" upsell.

## Motion
Subtle only: fade-up on scroll (opacity/translateY 16px, 400ms), card hover lift, button press scale .98, cart slide-over, marquee for reels (CSS, `animation-play-state` paused on hover). Hero may use slow Ken-Burns via CSS (transform only). All disabled under `prefers-reduced-motion`. No scroll-jacking, no heavy 3D, no layout-shifting animations.

## Components to build
Button, IconButton, Chip, Badge, Input/Select/Textarea, Accordion, Modal/Drawer, Toast, Skeleton, Carousel (scroll-snap + keyboard), Rating, PriceTag, ProductCard (hover second image desktop), ReelCard/Modal, Gallery, PincodeChecker, DatePicker, QuantityStepper, Stepper (checkout), Breadcrumbs, EmptyState, Pagination.

## States & feedback
Skeletons for lists, optimistic add-to-cart toast + mini-cart open, inline validation, clear error pages, disabled states, "Out of stock — notify me", payment test-mode banner.

## Accessibility & responsiveness
Breakpoints 360 / 640 / 768 / 1024 / 1280. Touch targets ≥44px. Visible focus ring (gold). Alt text on all images. Landmarks (header/nav/main/footer). Carousel has aria-roledescription and keyboard controls. Contrast ≥ 4.5:1 (check gold on cream — use wine for text).

## Imagery rules
Consistent warm tone, 4:5 product shots, 9:16 reel posters, WebP/AVIF, ≤120 KB per card image, ≤200 KB hero (mobile variant smaller). Generate tasteful CSS-gradient/SVG placeholders for SAMPLE data — no hotlinked stock images.

## Microcopy examples
"Little gifts, big feelings." • "Handpacked with love." • "Delivering across India." • Empty cart: "Your gift basket is waiting."
