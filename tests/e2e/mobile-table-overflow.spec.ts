import { test, expect } from "@playwright/test";

import {
  waitForRender,
  checkTableHeadersNoOverlap,
  checkTableCellChildrenNotOverflow,
  checkTableCellElementsNotOverflow,
  checkTableVisibleCellsNotClippedByViewport,
} from "./page-errors.helpers";
import { mobileTablePages } from "./mobile-table-overflow.data";

const VIEWPORTS = [
  { name: "iPhone SE", width: 365, height: 667 },
  { name: "iPhone 14", width: 390, height: 844 },
  { name: "iPad", width: 768, height: 1024 },
] as const;

const MAX_ROWS_DEFAULT = 3;

for (const viewport of VIEWPORTS) {
  test.describe(`Mobile table overflow - ${viewport.name} (${viewport.width}px)`, () => {
    for (const tablePage of mobileTablePages) {
      test(tablePage.name, async ({ browser }) => {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
        });
        const page = await context.newPage();

        await page.goto(tablePage.url);
        await waitForRender(page);

        const ERROR_PATTERNS = [
          "This page doesn't exist",
          "Something went wrong",
          "Page not found",
        ];
        const bodyText = await page.locator("body").innerText();
        for (const pattern of ERROR_PATTERNS) {
          expect(
            bodyText.includes(pattern),
            `Page "${tablePage.name}" (${tablePage.url}) shows error: "${pattern}"`,
          ).toBeFalsy();
        }

        if (tablePage.clickTab) {
          const tabButton = page.locator(
            `[data-key="${tablePage.clickTab}"], [data-tab="${tablePage.clickTab}"]`,
          );
          const tabLocator = (await tabButton.count())
            ? tabButton.first()
            : page.locator(`role=tab`).filter({ hasText: new RegExp(tablePage.clickTab.replace(/_/g, " "), "i") });

          if (await tabLocator.count()) {
            await tabLocator.first().click();
            await waitForRender(page);
          }
        }

        const table = page.locator("table");
        if ((await table.count()) === 0) {
          await page.close();
          await context.close();
          return;
        }

        await expect(table.first()).toBeVisible({ timeout: 15000 });

        await checkTableHeadersNoOverlap(page);

        const columnCount = await page.locator("thead th").count();
        const tbodyRows = page.locator("tbody tr");
        const rowCount = Math.min(
          await tbodyRows.count(),
          tablePage.rowsToCheck ?? MAX_ROWS_DEFAULT,
        );

        for (let row = 0; row < rowCount; row++) {
          for (let col = 0; col < columnCount; col++) {
            await checkTableCellChildrenNotOverflow(page, row, col);
            await checkTableCellElementsNotOverflow(page, row, col);
          }
        }

        await checkTableVisibleCellsNotClippedByViewport(page);

        await page.close();
        await context.close();
      });
    }
  });
}
