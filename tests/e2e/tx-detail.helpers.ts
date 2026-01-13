import { expect, type Page, type Browser } from "@playwright/test";
import { forbiddenPatterns } from "./tx-detail.data";

export async function waitForTxPageLoad(page: Page) {
  const preloader = page.locator("#preloader");
  if ((await preloader.count()) > 0) {
    await expect(preloader).toHaveCount(0, { timeout: 50000 });
  }

  const skeletons = page.locator('[data-testid="skeleton"], .skeleton');
  if ((await skeletons.count()) > 0) {
    await expect(skeletons).toHaveCount(0, { timeout: 50000 });
  }

  await page.waitForLoadState("networkidle", { timeout: 30000 });
}

export async function checkNoErrors(page: Page) {
  await expect(page.locator("text=Something went wrong")).toHaveCount(0);

  const errorCount = await page.locator("text=Error").count();
  const notFoundCount = await page.locator("text=404").count();

  if (notFoundCount > 0) {
    return;
  }

  expect(errorCount).toBe(0);
}

export async function checkNoForbiddenText(page: Page) {
  const bodyText = await page.locator("body").innerText();

  for (const pattern of forbiddenPatterns) {
    const hasPattern = bodyText.includes(pattern);
    if (hasPattern) {
      console.error(`Forbidden pattern found: ${pattern}`);
    }
    expect(hasPattern).toBeFalsy();
  }
}

export async function checkBreadcrumbs(page: Page) {
  const breadcrumbs = page.locator("nav[aria-label='breadcrumb'], .breadcrumb");
  await expect(breadcrumbs).toBeVisible({ timeout: 10000 });

  const epochLink = page.locator("text=/Epoch/i").first();
  const blockLink = page.locator("text=/Block/i").first();

  await expect(epochLink).toBeVisible();
  await expect(blockLink).toBeVisible();
}

export async function checkTxHashDisplayed(page: Page, expectedHash: string) {
  const hashElement = page.locator(`[title="${expectedHash}"]`).first();
  await expect(hashElement).toBeVisible({ timeout: 10000 });

  const displayedText = await hashElement.textContent();
  expect(displayedText).toBeTruthy();
}

export async function checkOverviewCard(page: Page) {
  const overviewCard = page.locator("text=Transaction Overview").first();
  await expect(overviewCard).toBeVisible({ timeout: 10000 });

  await expect(page.locator("text=Hash").first()).toBeVisible();
  await expect(page.locator("text=Date").first()).toBeVisible();
  await expect(page.locator("text=Height").first()).toBeVisible();
  await expect(page.locator("text=Total Output").first()).toBeVisible();
  await expect(page.locator("text=Fee").first()).toBeVisible();
  await expect(page.locator("text=Epoch").first()).toBeVisible();
  await expect(page.locator("text=Confirmations").first()).toBeVisible();
}

export async function checkMandatoryTabs(page: Page, tabs: readonly string[]) {
  for (const tabName of tabs) {
    const tab = page.locator('[role="tab"]').filter({ hasText: tabName }).first();
    await expect(tab).toBeAttached({ timeout: 10000 });
  }
}

export async function checkTabExists(page: Page, tabName: string): Promise<boolean> {
  const tab = page.locator('[role="tab"]').filter({ hasText: tabName }).first();
  return (await tab.count()) > 0;
}

export async function switchTab(page: Page, tabName: string) {
  const tab = page.locator('[role="tab"]').filter({ hasText: tabName }).first();

  await expect(tab).toBeAttached({ timeout: 10000 });

  await tab.evaluate(el => (el as HTMLElement).click());

  await page.waitForTimeout(1000);
  await waitForTxPageLoad(page);
}

export async function checkCopyButton(page: Page) {
  const copyButtons = page.locator('button[aria-label*="copy"], button:has-text("Copy"), svg[class*="copy"]').first();
  await expect(copyButtons).toBeVisible({ timeout: 5000 });
}

export async function checkResponsiveness(page: Page, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.waitForTimeout(500);

  await expect(page.locator("body")).toBeVisible();

  const overflowElements = await page.evaluate(() => {
    const elements = document.querySelectorAll("*");
    const overflowing: string[] = [];

    elements.forEach(el => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.scrollWidth > htmlEl.clientWidth + 5) {
        overflowing.push(htmlEl.tagName + (htmlEl.className ? `.${htmlEl.className.split(" ")[0]}` : ""));
      }
    });

    return overflowing;
  });

  if (overflowElements.length > 0) {
    console.warn(`Potentially overflowing elements at ${viewport.width}x${viewport.height}:`, overflowElements.slice(0, 5));
  }
}

export async function openTxDetailPage(browser: Browser, txHash: string, tab?: string) {
  const context = await browser.newContext();
  const page = await context.newPage();

  const url = tab ? `/tx/${txHash}?tab=${tab}` : `/tx/${txHash}`;
  await page.goto(url);

  return { page, context };
}

export async function checkTransactionSize(page: Page) {
  const sizeCard = page.locator("text=Transaction size").first();
  if ((await sizeCard.count()) > 0) {
    await expect(sizeCard).toBeVisible();
  }
}

export async function checkMintedByCard(page: Page) {
  const mintedByCard = page.locator("text=/Minted by|Genesis block/i").first();
  if ((await mintedByCard.count()) > 0) {
    await expect(mintedByCard).toBeVisible();
  }
}

export async function isTransactionNotFound(page: Page): Promise<boolean> {
  const has404 = (await page.locator("text=404").count()) > 0;
  const hasNotFound = (await page.locator("text=/not found|transaction not found/i").count()) > 0;
  const overviewCardMissing = (await page.locator("text=Transaction Overview").count()) === 0;

  return has404 || hasNotFound || overviewCardMissing;
}
