import { test, expect, Page } from "@playwright/test";

/**
 * Czech Translation Test
 * Mocks Czech locale via localStorage before page load
 * Run with: yarn playwright test translations.spec.ts
 */

const MISSING_TRANSLATION_PATTERN = "MISSING:";

// Patterns that indicate untranslated keys (namespace.key format)
const TRANSLATION_KEY_PATTERNS = [
  /\bnavigation\.\w+/g,
  /\bcommon\.\w+/g,
  /\bpages\.\w+/g,
  /\berrors\.\w+/g,
  /\bsdk\.\w+/g,
  /\bshared\.\w+/g,
];

// All pages to check for missing translations
const pages = [
  // Main pages
  "/",
  "/ada-price/",
  "/about-us/",
  "/ads/",
  "/api/",
  "/analytics/",
  "/article/",
  "/bots/",
  "/brand-assets/",
  "/contact-us/",
  "/contributors/",
  "/dev/",
  "/devlog/",
  "/donate/",
  "/education/",
  "/faq/",
  "/groups/",
  "/hardfork/",
  "/newsletter/",
  "/pool-awards/",
  "/pool-birthdays/",
  "/pool-updates/",
  "/pot/",
  "/privacy/",
  "/pro/",
  "/rewards-calculator/",
  "/rewards-checker/",
  "/search/",
  "/status/",
  "/swap/",
  "/terms/",
  "/uplc/",
  "/wallet/",
  "/watchlist/",
  "/wiki/",

  // Pages with tabs
  "/analytics/account?tab=wallet_activity",
  "/analytics/account?tab=top_staking_accounts",
  "/analytics/account?tab=top_addresses",
  "/analytics/account?tab=wealth_composition",
  "/analytics/network?tab=transactions",
  "/analytics/network?tab=blocks",
  "/analytics/network?tab=health",
  "/analytics/pool?tab=pool_issues",
  "/analytics/pool?tab=average_pools",
  "/handle-dns/?tab=recently-minted",
  "/handle-dns/?tab=validator",
  "/pool-debug/?tab=debugger",
  "/pool-debug/?tab=cheatsheet",
  "/retired-delegations/?tab=live",
  "/retired-delegations/?tab=active",
  "/tax-tool/?tab=rewards",
  "/tax-tool/?tab=withdrawals",
  "/token/dashboard?tab=tokens",
  "/token/dashboard?tab=global_activity",
  "/token/dashboard?tab=exchange",
  "/treasury/donation?tab=dontations",
  "/treasury/donation?tab=stats",
  "/polls/?tab=all",
  "/polls/?tab=live",
  "/polls/?tab=closed",

  // List pages
  "/asset/",
  "/asset/?tab=token",
  "/asset/?tab=nft",
  "/block/",
  "/drep/",
  "/drep/deregistrations",
  "/drep/registrations",
  "/drep/updates",
  "/epoch/",
  "/epoch/calendar/",
  "/gov/action",
  "/live-delegations/",
  "/metadata/",
  "/new-pools/",
  "/pool",
  "/pool/registrations",
  "/pool/deregistrations",
  "/script",
  "/stake/deregistrations",
  "/stake/registrations",
  "/tx/",
  "/withdrawals/",
  "/contract/interactions/",
];

// Setup: Mock Czech locale in localStorage BEFORE any page script runs
test.beforeEach(async ({ page }) => {
  // This script runs before the page loads
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "locale-store",
      JSON.stringify({ state: { locale: "cs" } })
    );
  });
});

async function checkTranslations(page: Page, url: string) {
  // Navigate to page (localStorage is already set with Czech locale)
  await page.goto(url);

  // Wait for preloader to disappear
  const preloader = page.locator("#preloader");
  if ((await preloader.count()) > 0) {
    await expect(preloader).toHaveCount(0, { timeout: 30000 });
  }

  // Wait for skeletons to disappear
  const skeletons = page.locator('[data-testid="skeleton"], .skeleton');
  if ((await skeletons.count()) > 0) {
    await expect(skeletons).toHaveCount(0, { timeout: 30000 });
  }

  // Get all visible text from the page
  const bodyText = await page.locator("body").innerText();

  // Check 1: MISSING: placeholder from i18n.ts
  const hasMissingPlaceholder = bodyText.includes(MISSING_TRANSLATION_PATTERN);
  if (hasMissingPlaceholder) {
    const matches = bodyText.match(/MISSING: \[[^\]]+\]/g) || [];
    console.error(`Missing translation placeholders on ${url}:`, matches);
  }

  // Check 2: Raw translation keys (e.g., "navigation.analytics")
  const foundRawKeys: string[] = [];
  for (const pattern of TRANSLATION_KEY_PATTERNS) {
    const matches = bodyText.match(pattern) || [];
    foundRawKeys.push(...matches);
  }

  if (foundRawKeys.length > 0) {
    console.error(`Raw translation keys found on ${url}:`, foundRawKeys);
  }

  // Assertions
  expect(
    hasMissingPlaceholder,
    `Page ${url} contains MISSING: placeholders`
  ).toBeFalsy();

  expect(
    foundRawKeys.length,
    `Page ${url} contains raw translation keys: ${foundRawKeys.join(", ")}`
  ).toBe(0);
}

test.describe("Czech translation coverage", () => {
  for (const pageUrl of pages) {
    test(`CS: ${pageUrl}`, async ({ page }) => {
      await checkTranslations(page, pageUrl);
    });
  }
});
