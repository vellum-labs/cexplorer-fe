import { test, expect } from "@playwright/test";
import {
  txHashToTest,
  mandatoryTabs,
  optionalTabs,
  viewportSizes,
} from "./tx-detail.data";
import {
  waitForTxPageLoad,
  checkNoErrors,
  checkNoForbiddenText,
  checkBreadcrumbs,
  checkTxHashDisplayed,
  checkOverviewCard,
  checkMandatoryTabs,
  checkTabExists,
  switchTab,
  checkCopyButton,
  checkResponsiveness,
  openTxDetailPage,
  checkTransactionSize,
  checkMintedByCard,
  isTransactionNotFound,
} from "./tx-detail.helpers";

test.describe("TX Detail Page - Core Functionality", () => {
  test("should load transaction page successfully", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    await checkNoErrors(page);
    await expect(page.locator("body")).toBeVisible();

    await page.close();
    await context.close();
  });

  test("should display correct transaction hash", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    await checkTxHashDisplayed(page, txHashToTest);

    await page.close();
    await context.close();
  });

  test("should not contain forbidden text patterns", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    await checkNoForbiddenText(page);

    await page.close();
    await context.close();
  });

  test("should display breadcrumb navigation", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    await checkBreadcrumbs(page);

    await page.close();
    await context.close();
  });

  test("should display Transaction Overview card with all fields", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    await checkOverviewCard(page);

    await page.close();
    await context.close();
  });

  test("should display transaction size information", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    await checkTransactionSize(page);

    await page.close();
    await context.close();
  });

  test("should display minted by information", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    await checkMintedByCard(page);

    await page.close();
    await context.close();
  });

  test("should have copy functionality for transaction hash", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    await checkCopyButton(page);

    await page.close();
    await context.close();
  });
});

test.describe("TX Detail Page - Tab Navigation", () => {
  test("should display mandatory tabs", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    await checkMandatoryTabs(page, mandatoryTabs);

    await page.close();
    await context.close();
  });

  test("should switch to Content tab successfully", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    await switchTab(page, "Content");
    await checkNoErrors(page);

    await page.close();
    await context.close();
  });

  test("should switch to Overview tab successfully", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    await switchTab(page, "Overview");
    await checkNoErrors(page);

    await page.close();
    await context.close();
  });
});

test.describe("TX Detail Page - Optional Tabs", () => {
  for (const tabName of optionalTabs) {
    test(`should work with ${tabName} tab if exists`, async ({ browser }) => {
      const { page, context } = await openTxDetailPage(browser, txHashToTest);

      await waitForTxPageLoad(page);

      if (await isTransactionNotFound(page)) {
        await page.close();
        await context.close();
        test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
        return;
      }

      const hasTab = await checkTabExists(page, tabName);
      if (hasTab) {
        await switchTab(page, tabName);
        await checkNoErrors(page);
      }

      await page.close();
      await context.close();
    });
  }
});

test.describe("TX Detail Page - URL and Navigation", () => {
  test("should open specific tab via URL parameter", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest, "content");

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    const url = page.url();
    expect(url).toContain("tab=content");

    await page.close();
    await context.close();
  });

  test("should handle invalid transaction hash gracefully", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, "0000000000000000000000000000000000000000000000000000000000000000");

    await page.waitForLoadState("networkidle");

    const isNotFound = await isTransactionNotFound(page);
    expect(isNotFound).toBeTruthy();

    await page.close();
    await context.close();
  });
});

test.describe("TX Detail Page - Responsiveness", () => {
  test("should display correctly on mobile viewport", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    await checkResponsiveness(page, viewportSizes.mobile);
    await checkNoErrors(page);

    await page.close();
    await context.close();
  });

  test("should display correctly on tablet viewport", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    await checkResponsiveness(page, viewportSizes.tablet);
    await checkNoErrors(page);

    await page.close();
    await context.close();
  });

  test("should display correctly on desktop viewport", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    await waitForTxPageLoad(page);

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    await checkResponsiveness(page, viewportSizes.desktop);
    await checkNoErrors(page);

    await page.close();
    await context.close();
  });
});

test.describe("TX Detail Page - Performance", () => {
  test("should load within acceptable time", async ({ browser }) => {
    const { page, context } = await openTxDetailPage(browser, txHashToTest);

    const startTime = Date.now();
    await waitForTxPageLoad(page);
    const loadTime = Date.now() - startTime;

    if (await isTransactionNotFound(page)) {
      await page.close();
      await context.close();
      test.skip(true, `Transaction ${txHashToTest} not found in this environment`);
      return;
    }

    expect(loadTime).toBeLessThan(15000);

    await page.close();
    await context.close();
  });
});
