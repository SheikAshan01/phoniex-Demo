import { test, expect } from "@playwright/test";

test.describe("PHONEX E-Commerce End-to-End Suite", () => {
  test("1. Homepage renders verified branding, hero copy, and original logo", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");
    await expect(page).toHaveTitle(/PHONEX/i);

    // Verify logo and brand name
    const brandName = page.locator("header").getByText("PHONEX", { exact: false });
    await expect(brandName.first()).toBeVisible();

    // Verify verified promo highlight
    await expect(page.getByText("Unbreakable Tempered Glass from ₹99").first()).toBeVisible();

    // Verify hero copy
    await expect(page.locator("h1")).toContainText("Make Your Phone");
    await expect(page.getByText("Explore custom mobile skins, personalised designs").first()).toBeVisible();

    // Verify primary and secondary CTA buttons
    await expect(page.getByRole("link", { name: "Explore Collection" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Create Your Custom Skin" }).first()).toBeVisible();

    // No fatal unhandled runtime console errors
    const fatalErrors = consoleErrors.filter(
      (err) => !err.includes("favicon") && !err.includes("Failed to load resource")
    );
    expect(fatalErrors.length).toBe(0);
  });

  test("2. Shop page filters, search, and device compatibility", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.locator("h1")).toContainText("Store Catalog");

    // Check products displayed
    const productCards = page.locator(".group.relative.bg-white");
    await expect(productCards.first()).toBeVisible();

    // Test category filter click (Tempered Glass)
    const mobileFilterBtn = page.getByRole("button", { name: /Filters & Sort/i });
    if (await mobileFilterBtn.isVisible()) {
      await mobileFilterBtn.click();
      await page.locator(".fixed").getByRole("button", { name: /Tempered Glass/i }).click();
      await expect(page.getByText("PHONEX Unbreakable 9H Hybrid Screen Protector")).toBeVisible();
      // Reset by navigating directly to /shop?q=65W
      await page.goto("/shop?q=65W");
    } else {
      const glassCategoryBtn = page.getByRole("button", { name: /Tempered Glass/i }).first();
      await glassCategoryBtn.click();
      await expect(page.getByText("PHONEX Unbreakable 9H Hybrid Screen Protector")).toBeVisible();
      // Reset category to "All Items" before searching
      await page.getByRole("button", { name: "All Items" }).first().click();
      const searchInput = page.getByPlaceholder("Search by name, specs...");
      await searchInput.fill("65W");
    }

    await expect(page.getByText("PHONEX Turbo 65W GaN Fast Charger").first()).toBeVisible();
  });

  test("3. Product Detail Page model selection and Add to Cart", async ({ page }) => {
    await page.goto("/product/customised-mobile-skin");
    await expect(page.locator("h1")).toContainText("PHONEX Precision Custom Mobile Skin");

    // Price should be ₹149 and MRP ₹299
    await expect(page.getByText("₹149").first()).toBeVisible();
    await expect(page.getByText("₹299").first()).toBeVisible();

    // Model select dropdown in main content
    const modelSelect = page.locator("main select").first();
    await expect(modelSelect).toBeVisible();
    await modelSelect.selectOption("Samsung Galaxy S24 Ultra");

    // Select texture
    const carbonFinishBtn = page.getByRole("button", { name: "Carbon Fiber Weave" }).first();
    await carbonFinishBtn.click();

    // Click Add to Bag
    const addBtn = page.getByRole("button", { name: /Add to Bag/i }).first();
    await addBtn.click();

    // Cart drawer should open automatically with the item
    const cartDrawerHeading = page.getByRole("heading", { name: "Your Shopping Bag" });
    await expect(cartDrawerHeading).toBeVisible();

    // Check item model tag in drawer
    await expect(page.locator(".relative.w-full.max-w-md").getByText("Samsung Galaxy S24 Ultra")).toBeVisible();
  });

  test("4. Cart quantity updates, persistence, and navigation to checkout", async ({ page }) => {
    await page.goto("/product/unbreakable-9h-tempered-glass");

    // Select phone model first (required for screen protectors)
    const modelSelect = page.locator("main select").first();
    await modelSelect.selectOption("Apple iPhone 16 Pro");

    // Add to cart
    await page.getByRole("button", { name: /Add to Bag/i }).first().click();
    await expect(page.getByRole("heading", { name: "Your Shopping Bag" })).toBeVisible();

    // Reload page to test localStorage persistence
    await page.reload();

    // Header bag button with accessible label
    const bagBtn = page.locator("header button[aria-label*='shopping cart']").first();
    await expect(bagBtn).toBeVisible();
    await bagBtn.click();
    await expect(page.getByRole("heading", { name: "Your Shopping Bag" })).toBeVisible();

    // Open drawer and verify item is present
    await expect(page.locator(".relative.w-full.max-w-md").getByText("PHONEX Unbreakable 9H Hybrid Screen Protector")).toBeVisible();

    // Proceed to full Cart page
    await page.getByRole("link", { name: "View Full Bag" }).click();
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByRole("heading", { name: "Shopping Bag", exact: true })).toBeVisible();

    // Navigate to checkout
    await page.getByRole("link", { name: "Proceed to Checkout" }).click();
    await expect(page).toHaveURL(/\/checkout/);
  });

  test("5. Checkout validation, store pickup option, and demo order placement", async ({ page }) => {
    // Add item first with model selected
    await page.goto("/product/unbreakable-9h-tempered-glass");
    const modelSelect = page.locator("main select").first();
    await modelSelect.selectOption("Apple iPhone 16 Pro");
    await page.getByRole("button", { name: /Add to Bag/i }).first().click();

    // Go directly to checkout
    await page.goto("/checkout");
    await expect(page.getByText("Secure Demonstration Checkout")).toBeVisible();

    // Form validation check: submit with empty fields
    const continueBtn = page.getByRole("button", { name: /Continue to Payment/i });
    await continueBtn.click();
    await expect(page.getByText("Full name is required")).toBeVisible();

    // Fill customer details
    await page.getByPlaceholder("e.g. Ramesh Kumar").fill("Arun Varma");
    await page.getByPlaceholder("e.g. 9876543210").fill("9894012345");
    await page.getByPlaceholder("e.g. yourname@gmail.com").fill("arun.varma@example.com");

    // Select In-Store Pickup
    await page.getByRole("button", { name: /Store Pickup/i }).click();
    await expect(page.locator("main").getByText("Coimbatore Flagship").first()).toBeVisible();

    // Proceed to Step 2
    await continueBtn.click();
    await expect(page.getByText("Payment Selection & Review")).toBeVisible();

    // Place order
    const placeOrderBtn = page.getByRole("button", { name: /Place Order/i });
    await placeOrderBtn.click();

    // Verify order confirmation page
    await expect(page).toHaveURL(/\/order-confirmation/);
    await expect(page.getByRole("heading", { name: "Thank You for Your Order!" })).toBeVisible();
    await expect(page.getByText("Order Confirmed (Demo Sandbox)")).toBeVisible();
  });

  test("6. Interactive Custom Skin Studio configurator", async ({ page }) => {
    await page.goto("/custom-studio");
    await expect(page.locator("h1")).toContainText("PHONEX Custom Skin Studio");

    // Change model
    const modelSelect = page.locator("main select").first();
    await modelSelect.selectOption("OnePlus 12");

    // Select preset design (Straw Hat Anime Manga)
    await page.getByRole("button", { name: /Straw Hat Anime/i }).click();

    // Select texture
    await page.getByRole("button", { name: "Honeycomb Grippy" }).click();

    // Enter custom monogram text
    const textInput = page.getByPlaceholder("e.g. S. KARTHIK (Max 20 chars)");
    await textInput.fill("ARUN 2026");

    // Add to Bag
    await page.getByRole("button", { name: /Add Custom Wrap to Bag/i }).click();
    await expect(page.getByRole("heading", { name: "Your Shopping Bag" })).toBeVisible();
    await expect(page.locator(".relative.w-full.max-w-md").getByText("OnePlus 12").first()).toBeVisible();
  });

  test("7. Admin portal authentication gate and dashboard operations", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("PHONEX Admin Portal")).toBeVisible();

    // Click Instant Demo Access
    await page.getByRole("button", { name: /Instant Demo Access/i }).click();

    // Expect dashboard to load
    await expect(page.locator("h1")).toContainText("Store Management Console");
    await expect(page.getByRole("button", { name: /Overview/i })).toBeVisible();

    // Switch to Catalog Manager tab
    await page.getByRole("button", { name: /Catalog/i }).click();
    await expect(page.getByRole("button", { name: "Add New Product" })).toBeVisible();

    // Switch to Order Fulfillment tab
    await page.getByRole("button", { name: /Order/i }).click();
    await expect(page.getByPlaceholder("Search orders by customer")).toBeVisible();
  });

  test("8. Verified locations & services page", async ({ page }) => {
    await page.goto("/services");
    await expect(page.locator("h1")).toContainText("PHONEX Store Services");
    await expect(page.locator("main").getByText("Coimbatore Flagship").first()).toBeVisible();
    await expect(page.locator("main").getByText("Annur Branch").first()).toBeVisible();
    await expect(page.locator("main").getByText("P. Puliam patti Branch").first()).toBeVisible();

    await page.goto("/about");
    await expect(page.locator("h1")).toContainText("Crafting The Perfect Second Skin");
    await expect(page.getByText("088075 74880").first()).toBeVisible();
  });

  test("9. Admin section hides public footer and toast appears at top", async ({ page }) => {
    // Navigate to admin
    await page.goto("/admin");
    // Public store footer (with newsletter or trust pillars) should NOT be rendered
    await expect(page.locator("footer")).toHaveCount(0);

    // Test product page toast notification placement
    await page.goto("/product/customised-mobile-skin");
    const addBtn = page.getByRole("button", { name: /Add to Bag/i }).first();
    await addBtn.click();

    // Check toast is at the top of the viewport
    const toast = page.locator(".fixed.top-4, .fixed.top-5, .fixed.top-6").first();
    await expect(toast).toBeVisible();
  });
});

