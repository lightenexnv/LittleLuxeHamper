import { test, expect } from "@playwright/test";

test.describe("Full E-Commerce Customer Journey", () => {
  test("Home -> PDP -> Swipe to Reel -> Instagram Button -> Cart -> Checkout -> Dummy Payment Success", async ({
    page,
  }) => {
    // 1. Visit Home Page
    await page.goto("/");
    await expect(page).toHaveTitle(/Little Luxe Hamper/i);

    // Verify Reels strip is rendered
    const reelsHeading = page.getByRole("heading", { name: /Unboxing Real Emotions/i });
    await expect(reelsHeading).toBeVisible();

    // 2. Navigate to PDP
    const firstProduct = page.locator("a[href^='/product/']").first();
    await firstProduct.click();

    // Verify PDP title and gallery
    await expect(page.locator("h1")).toBeVisible();

    // 3. Navigate gallery to reel slide (Next button or thumbnail)
    const nextBtn = page.getByRole("button", { name: /Next slide/i });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
    }

    // 4. Verify "View Reel on Instagram" or profile button below gallery
    const igButton = page.locator('[data-testid="pdp-instagram-button"]');
    await expect(igButton).toBeVisible();
    const href = await igButton.getAttribute("href");
    expect(href).toContain("utm_source");

    // 5. Add to Basket
    const addToBasketBtn = page.getByRole("button", { name: /Add To Gift Basket/i }).first();
    await addToBasketBtn.click();

    // 6. Go to Checkout
    await page.goto("/checkout");

    // 7. Step 1: Contact
    await page.fill('input[placeholder*="Siddharth Verma"]', "Pooja Mehta");
    await page.fill('input[placeholder*="name@example.com"]', "pooja.mehta@example.com");
    await page.fill('input[placeholder*="98765 43210"]', "9876543210");
    await page.getByRole("button", { name: /Continue to Shipping Address/i }).click();

    // 8. Step 2: Address
    await page.fill('input[placeholder*="House / Flat No"]', "Flat 402, Royale Palms, 12th Main");
    await page.fill('input[placeholder*="6-digit PIN"]', "560001");
    // Wait for auto-pincode lookup or enter city/state
    await page.waitForTimeout(500);
    const cityInput = page.locator('input[placeholder="City"]');
    if ((await cityInput.inputValue()) === "") {
      await cityInput.fill("Bengaluru");
      await page.locator('input[placeholder="State"]').fill("Karnataka");
    }
    await page.getByRole("button", { name: /Continue to Payment Method/i }).click();

    // 9. Step 3: Payment
    const payBtn = page.getByRole("button", { name: /Pay ₹.*Securely/i });
    await expect(payBtn).toBeVisible();
    await payBtn.click();

    // 10. Dummy Payment Modal in Test Mode
    const testModeBanner = page.getByText(/TEST MODE/i);
    await expect(testModeBanner).toBeVisible();

    const simulateSuccessBtn = page.getByRole("button", { name: /Simulate Payment SUCCESS/i });
    await expect(simulateSuccessBtn).toBeVisible();
    await simulateSuccessBtn.click();

    // 11. Confirmation Page
    await expect(page).toHaveURL(/.*\/order\/.*\/confirmation/);
    await expect(page.getByRole("heading", { name: /Thank You/i })).toBeVisible();
    await expect(page.getByText(/Order Reference:/i)).toBeVisible();
  });
});
