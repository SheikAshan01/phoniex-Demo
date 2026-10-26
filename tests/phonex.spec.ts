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

    // Verify hero copy reflects actual products
    await expect(page.locator("h1")).toContainText("Custom Mobile Skins");
    await expect(page.getByText("Precision 3M vinyl phone wraps").first()).toBeVisible();

    // Verify primary and secondary CTA buttons
    await expect(page.getByRole("link", { name: "Shop Mobile Skins" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Custom Studio" }).first()).toBeVisible();

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

  test("10. Homepage eliminates duplicate cards and verifies shipping consistency", async ({ page }) => {
    await page.goto("/");

    // Verify Featured section has 4 cards
    const featuredSection = page.locator("section:has-text('Featured Products')");
    await expect(featuredSection).toBeVisible();

    // Verify catalog section header shows "More Catalog Products" without duplicating featured items
    await expect(page.getByText("More Catalog Products")).toBeVisible();
    await expect(page.getByText("4 bestsellers featured above")).toBeVisible();

    // Check footer contains verified policy links
    await expect(page.locator("footer").getByRole("link", { name: /Shipping Policy/i })).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: /7-Day Replacement/i })).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: /Privacy Policy/i })).toBeVisible();

    // Ensure no public Admin Portal link in footer
    const publicAdminLink = page.locator("footer").getByRole("link", { name: /^Admin Portal$/i });
    await expect(publicAdminLink).toHaveCount(0);
  });

  test("11. Mobile and responsive layouts at 360px, 390px, 430px have zero horizontal overflow", async ({ page }) => {
    const viewports = [
      { width: 360, height: 740, label: "360px Android compact" },
      { width: 390, height: 844, label: "390px iPhone standard" },
      { width: 430, height: 932, label: "430px iPhone Pro Max" },
      { width: 768, height: 1024, label: "768px iPad tablet" },
      { width: 1280, height: 800, label: "1280px Desktop" },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");

      // Verify no horizontal overflow on document
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalOverflow, `Horizontal overflow detected at ${vp.label}`).toBe(false);

      // Verify main action buttons remain clickable
      const mainCta = page.getByRole("link", { name: /Shop Mobile Skins/i }).first();
      await expect(mainCta).toBeVisible();
    }
  });

  test("12. Verify all exact shop category routes and zero blocking loading state", async ({ page }) => {
    // 1. /shop — show all available products
    await page.goto("/shop");
    await expect(page.locator("h1")).toContainText("Store Catalog");
    await expect(page.getByText("Loading catalog...")).toHaveCount(0);
    const allCards = page.locator(".group.relative.bg-white");
    await expect(allCards).toHaveCount(12);

    // 2. /shop?category=tempered-glass — show only tempered glass
    await page.goto("/shop?category=tempered-glass");
    await expect(page.locator("h1")).toContainText("Store Catalog");
    await expect(page.getByText("Loading catalog...")).toHaveCount(0);
    await expect(page.getByText("PHONEX Unbreakable 9H Hybrid Screen Protector")).toBeVisible();
    await expect(page.getByText("28° Anti-Spy 9H Privacy Tempered Glass")).toBeVisible();
    await expect(page.getByText("PHONEX Turbo 65W GaN Fast Charger")).toHaveCount(0);

    // 3. /shop?category=accessories — show only accessories
    await page.goto("/shop?category=accessories");
    await expect(page.getByText("PHONEX Turbo 65W GaN Fast Charger")).toBeVisible();
    await expect(page.getByText("Heavy-Duty 100W Braided Type-C to Type-C Cable")).toBeVisible();
    await expect(page.getByText("PHONEX Bass Pro Magnetic Bluetooth Neckband")).toBeVisible();
    await expect(page.getByText("PHONEX Unbreakable 9H Hybrid Screen Protector")).toHaveCount(0);

    // 4. /shop?category=custom-skins — show only custom skins
    await page.goto("/shop?category=custom-skins");
    await expect(page.getByText("PHONEX Precision Custom Mobile Skin")).toBeVisible();
    await expect(page.getByText("Pro 3D Textured Carbon Fiber Skin")).toBeVisible();
    await expect(page.getByText("PHONEX Turbo 65W GaN Fast Charger")).toHaveCount(0);

    // 5. Invalid category fallback gracefully
    await page.goto("/shop?category=nonexistent-invalid");
    await expect(page.getByText(/not found/i)).toBeVisible();
    const browseAllBtn = page.getByRole("button", { name: /Browse All Products/i });
    await expect(browseAllBtn).toBeVisible();
    await browseAllBtn.click();
    await expect(page.getByText("PHONEX Precision Custom Mobile Skin")).toBeVisible();
  });

  test("13. Homepage category tiles navigate to correct shop URLs", async ({ page }) => {
    await page.goto("/");

    // Click Tempered Glass category tile
    const glassTile = page.locator("section:has-text('Shop by Category')").getByRole("link", { name: /Tempered Glass/i }).first();
    await glassTile.click();
    await expect(page).toHaveURL(/\/shop\?category=tempered-glass/);
    await expect(page.getByText("PHONEX Unbreakable 9H Hybrid Screen Protector").first()).toBeVisible();

    // Go back to home
    await page.goto("/");

    // Click Fast Chargers & Cables category tile
    const accessoriesTile = page.locator("section:has-text('Shop by Category')").getByRole("link", { name: /Fast Chargers & Cables/i }).first();
    await accessoriesTile.click();
    await expect(page).toHaveURL(/\/shop\?category=accessories/);
    await expect(page.getByText("PHONEX Turbo 65W GaN Fast Charger").first()).toBeVisible();

    // Go back to home
    await page.goto("/");

    // Click Custom Mobile Skins category tile
    const skinsTile = page.locator("section:has-text('Shop by Category')").getByRole("link", { name: /Custom Mobile Skins/i }).first();
    await skinsTile.click();
    await expect(page).toHaveURL(/\/shop\?category=custom-skins/);
    await expect(page.getByText("PHONEX Precision Custom Mobile Skin").first()).toBeVisible();
  });

  test("14. Product Detail Page mobile responsiveness at 360px, 390px, 430px", async ({ page }) => {
    const mobileWidths = [360, 390, 430];

    for (const w of mobileWidths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto("/product/customised-mobile-skin");
      await page.waitForLoadState("domcontentloaded");

      // Verify no horizontal overflow
      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow, `Overflow at ${w}px on PDP`).toBe(false);

      // Verify Model selector and Devices label exist cleanly
      await expect(page.getByText("Select Your Exact Phone Model *").first()).toBeVisible();
      await expect(page.getByText(/41\+ Devices/i).first()).toBeVisible();

      // Verify Add to Bag and Buy Now buttons are visible and clickable
      const addBtn = page.getByRole("button", { name: /Add to Bag/i }).first();
      await expect(addBtn).toBeVisible();
      const buyBtn = page.getByRole("button", { name: /Buy Now/i }).first();
      await expect(buyBtn).toBeVisible();
    }
  });

  test("15. Clean minimal login & registration page audit across all viewports", async ({ page }) => {
    // 1. Initial desktop view check
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");

    // Verify clean centered card heading & supporting text
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await expect(page.getByText("Sign in to your PHONEX account.")).toBeVisible();

    // Verify promotional panel features are REMOVED
    await expect(page.getByText(/500\+ Smartphone models supported/i)).not.toBeVisible();
    await expect(page.getByText(/Genuine 3M residue-free cast vinyl/i)).not.toBeVisible();

    // Verify standard form fields
    const identifierInput = page.locator("#auth-identifier");
    await expect(identifierInput).toBeVisible();
    await expect(identifierInput).toHaveAttribute("placeholder", "Enter your email or mobile number");

    const passwordInput = page.locator("#auth-password");
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Verify password visibility toggle
    const toggleBtn = page.getByRole("button", { name: /Show password/i });
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: /Hide password/i }).click();
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Verify primary Sign In button
    const signInBtn = page.locator("form").getByRole("button", { name: "Sign In", exact: true });
    await expect(signInBtn).toBeVisible();

    // Verify form validation
    await signInBtn.click();
    await expect(page.getByText(/Please enter your email address or 10-digit mobile number/i)).toBeVisible();

    // Verify tab switching to Create Account
    const createAccountTab = page.getByRole("button", { name: "Create Account" }).first();
    await createAccountTab.click();
    await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible();
    await expect(page.locator("#signup-name")).toBeVisible();
    await expect(page.locator("form").getByRole("button", { name: "Create Account", exact: true })).toBeVisible();

    // Switch back to Sign In
    const signInTab = page.getByRole("button", { name: "Sign In" }).first();
    await signInTab.click();
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await expect(page.locator("#signup-name")).not.toBeVisible();

    // Verify Forgot Password flow
    const forgotBtn = page.getByRole("button", { name: /Forgot password\?/i });
    await forgotBtn.click();
    await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
    await identifierInput.fill("9842109876");
    await page.getByRole("button", { name: "Send Recovery Link" }).click();
    await expect(page.getByText(/Recovery Instructions Sent/i)).toBeVisible();
    await page.getByRole("button", { name: /Back to Sign In/i }).click();
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

    // Verify subtle guest shopping link
    const guestLink = page.getByRole("link", { name: /Continue shopping as guest/i });
    await expect(guestLink).toBeVisible();
    await guestLink.click();
    await expect(page).toHaveURL(/\//);

    // Verify responsiveness across all requested viewports (360, 390, 430, 768, 1024, 1440)
    const viewports = [360, 390, 430, 768, 1024, 1440];
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp, height: 800 });
      await page.goto("/login");
      await page.waitForLoadState("domcontentloaded");

      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow, `Login page horizontal overflow at ${vp}px`).toBe(false);

      await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
      await expect(page.locator("#auth-identifier")).toBeVisible();
      await expect(page.locator("form").getByRole("button", { name: "Sign In", exact: true })).toBeVisible();
    }
  });
});

