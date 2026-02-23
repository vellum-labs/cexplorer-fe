import test, { expect, type Page } from "@playwright/test";

export function buildUrl(
  path: string,
  idOrPage: number,
  queryParams?: Record<string, string | number>,
  usePageParam: boolean = true,
): string {
  const params = new URLSearchParams();
  if (usePageParam) {
    params.set("page", String(idOrPage));
  }
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      params.set(key, String(value));
    }
  }
  return params.toString() ? `${path}?${params.toString()}` : `${path}`;
}

export async function getFirstDetailHref(
  browser: any,
  listUrl: string,
  linkSelector: string = "tbody a[href]",
): Promise<string> {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(listUrl);
  await waitForRender(page);
  const href = await page
    .locator(linkSelector)
    .first()
    .getAttribute("href", { timeout: 10000 })
    .catch(() => null);
  await page.close();
  await context.close();
  if (!href)
    throw new Error(
      `No link found at "${listUrl}" with selector "${linkSelector}"`,
    );
  return href;
}

export async function waitForRender(page: any) {
  const preloader = page.locator("#preloader");
  if (await preloader.count()) {
    await expect(preloader).toHaveCount(0, { timeout: 50000 });
  }
  const skeletons = page.locator('[data-testid="skeleton"], .skeleton');
  if (await skeletons.count()) {
    await expect(skeletons).toHaveCount(0, { timeout: 50000 });
  }
}

export async function checkPage(
  browser: any,
  url: string,
  close: boolean = true,
): Promise<any> {
  const context = await browser.newContext();
  const page = await context.newPage();

  await test.step(`Check ${url}`, async () => {
    await page.goto(url);
    await waitForRender(page);
    await expect(page.locator("text=Something went wrong")).toHaveCount(0);
    await expect(page.locator("body")).toBeVisible();

    const bodyText = await page.locator("body").innerText();
    const forbiddenPatterns: [string, RegExp][] = [
      ["NaN", /\bNaN\b/],
      ["undefined", /\bundefined\b/],
      // Exclude proper nouns like "Infinity Rising 1" (pool names)
      ["Infinity", /\bInfinity\b(?!\s+[A-Z])/],
    ];

    for (const [name, pattern] of forbiddenPatterns) {
      expect(pattern.test(bodyText), `Page body contains "${name}"`).toBeFalsy();
    }
  });

  if (close) {
    await page.close();
    await context.close();
    return;
  }

  return { context, page };
}

export async function checkTableColumn(
  page: Page,
  headerText: string,
  expectedAlign: "left" | "right" | "center" = "left",
  allowedMargin: number,
) {
  const allHeaders = page.locator("thead th");
  const headersCount = await allHeaders.count();
  let headerIndex = -1;

  for (let i = 0; i < headersCount; i++) {
    const cell = allHeaders.nth(i);
    const text = (await cell.innerText()).trim();
    if (text === headerText) {
      headerIndex = i;
      break;
    }
  }

  expect(headerIndex).toBeGreaterThan(-1);

  const headerCell = allHeaders.nth(headerIndex);

  const columnIndex = await headerCell.evaluate(el => {
    const row = el.parentElement;
    if (!row) return -1;
    return Array.from(row.children).indexOf(el);
  });

  expect(columnIndex).toBeGreaterThan(-1);

  const headerCheck = await headerCell.evaluate(el => {
    const node = el.firstElementChild || el;
    const cellRect = el.getBoundingClientRect();
    const textRect = node.getBoundingClientRect();

    const clipped =
      textRect.width > cellRect.width ||
      textRect.right > cellRect.right + 1 ||
      textRect.left < cellRect.left - 1;

    return { clipped, text: el.textContent };
  });

  expect(headerCheck.clipped).toBeFalsy();

  const cellSelector = `tbody tr td:nth-child(${columnIndex + 1})`;
  const cells = page.locator(cellSelector);
  const count = await cells.count();
  expect(count).toBeGreaterThan(0);

  let previousBottom = -Infinity;

  for (let i = 0; i < count; i++) {
    const cell = cells.nth(i);

    const result = await cell.evaluate(
      (el, params) => {
        const { expected, prevBottom, allowedMargin, MIN_PIXEL_MARGIN } =
          params;

        const textNode = el.firstElementChild || el;
        const cellRect = el.getBoundingClientRect();
        const textRect = textNode.getBoundingClientRect();

        const diffLeft = Math.abs(textRect.left - cellRect.left);
        const diffRight = Math.abs(textRect.right - cellRect.right);
        const diffCenter = Math.abs(
          (textRect.left + textRect.right) / 2 -
            (cellRect.left + cellRect.right) / 2,
        );

        const leftThreshold = Math.max(
          cellRect.width * allowedMargin,
          MIN_PIXEL_MARGIN,
        );
        const rightThreshold = Math.max(
          cellRect.width * allowedMargin,
          MIN_PIXEL_MARGIN,
        );
        const centerThreshold = Math.max(
          cellRect.width * allowedMargin,
          MIN_PIXEL_MARGIN,
        );

        let alignOk = false;
        if (expected === "left") alignOk = diffLeft <= leftThreshold;
        if (expected === "right") alignOk = diffRight <= rightThreshold;
        if (expected === "center") alignOk = diffCenter <= centerThreshold;

        const overlaps = cellRect.top < prevBottom - 1;

        return { alignOk, overlaps, cellRect, textRect };
      },
      {
        expected: expectedAlign,
        prevBottom: previousBottom,
        allowedMargin,
        MIN_PIXEL_MARGIN: allowedMargin,
      },
    );

    previousBottom = result.cellRect.bottom;

    if (!result.alignOk || result.overlaps) {
      console.warn(`❌ Cell issue at row ${i + 1} for "${headerText}"`);
      console.warn({
        alignOk: result.alignOk,
        overlaps: result.overlaps,
        cell: result.cellRect,
        text: result.textRect,
      });
    }

    expect(result.alignOk).toBeTruthy();
    expect(result.overlaps).toBeFalsy();
  }
}

export async function checkTableHeadersNoOverlap(page: Page) {
  const headers = await page.$$("thead th");
  const table = await page.$("table");
  if (!table) throw new Error("Table not found");

  const tableRect = await table.evaluate(el => {
    const r = el.getBoundingClientRect();
    return {
      left: r.left,
      right: r.right,
    };
  });

  for (let i = 0; i < headers.length; i++) {
    const th = headers[i];

    const thRect = await th.evaluate(el => {
      const r = el.getBoundingClientRect();
      return {
        left: r.left,
        right: r.right,
      };
    });

    const descendants = await th.$$(":scope *");

    for (const node of descendants) {
      const { tag, text, rectLeft, rectRight, scrollWidth, clientWidth } =
        await node.evaluate(el => {
          const r = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            text: el.textContent,
            rectLeft: r.left,
            rectRight: r.right,
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
          };
        });

      const trimmedText = text?.trim() || "";

      if (scrollWidth > clientWidth + 1) {
        console.warn(
          `❌ Overflow inside header: "${trimmedText}" [${tag}] is visually clipped\n` +
            `scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`,
        );
      }
      expect(
        scrollWidth,
        `Header child "${tag}" ("${trimmedText}") is visually clipped`,
      ).toBeLessThanOrEqual(clientWidth + 1);

      if (rectLeft < thRect.left - 1 || rectRight > thRect.right + 1) {
        console.warn(
          `❌ Header child "${tag}" ("${trimmedText}") overflows parent cell\n` +
            `child: [${rectLeft} → ${rectRight}], cell: [${thRect.left} → ${thRect.right}]`,
        );
      }
      expect(
        rectLeft,
        `Header child "${tag}" ("${trimmedText}") is outside the cell on the left`,
      ).toBeGreaterThanOrEqual(thRect.left - 1);
      expect(
        rectRight,
        `Header child "${tag}" ("${trimmedText}") is outside the cell on the right`,
      ).toBeLessThanOrEqual(thRect.right + 1);

      if (rectLeft < tableRect.left - 1 || rectRight > tableRect.right + 1) {
        console.warn(
          `❌ Header child "${tag}" ("${trimmedText}") overflows table boundaries\n` +
            `child: [${rectLeft} → ${rectRight}], table: [${tableRect.left} → ${tableRect.right}]`,
        );
      }
      expect(
        rectLeft,
        `Header child "${tag}" ("${trimmedText}") is outside the table on the left`,
      ).toBeGreaterThanOrEqual(tableRect.left - 1);
      expect(
        rectRight,
        `Header child "${tag}" ("${trimmedText}") is outside the table on the right`,
      ).toBeLessThanOrEqual(tableRect.right + 1);

      await node.dispose();
    }
  }
}

export async function checkTableCellChildrenNotOverflow(
  page: Page,
  rowIndex = 0,
  columnIndex = 0,
) {
  const cell = await page.$(
    `tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${columnIndex + 1})`,
  );
  if (!cell)
    throw new Error(
      `Cell not found at row ${rowIndex + 1}, column ${columnIndex + 1}`,
    );

  const cellRect = await cell.evaluate(el => {
    const r = el.getBoundingClientRect();
    return {
      left: r.left,
      right: r.right,
      top: r.top,
      bottom: r.bottom,
      width: r.width,
      height: r.height,
    };
  });

  const textRects = await cell.evaluate(el => {
    function getTextRects(node: ChildNode) {
      const rects: any = [];
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim()) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const clientRects = Array.from(range.getClientRects());
        for (const r of clientRects) {
          rects.push({
            left: r.left,
            right: r.right,
            top: r.top,
            bottom: r.bottom,
            text: node.nodeValue,
          });
        }
      }
      node.childNodes &&
        Array.from(node.childNodes).forEach(n =>
          rects.push(...getTextRects(n)),
        );
      return rects;
    }
    return getTextRects(el);
  });

  const EPSILON = 0.5;
  for (const rect of textRects) {
    const leftOverflow = rect.left < cellRect.left - EPSILON;
    const rightOverflow = rect.right > cellRect.right + EPSILON;
    const topOverflow = rect.top < cellRect.top - EPSILON;
    const bottomOverflow = rect.bottom > cellRect.bottom + EPSILON;

    if (leftOverflow || rightOverflow || topOverflow || bottomOverflow) {
      console.warn(
        `❌ Text "${rect.text.trim()}" overflows cell [row ${rowIndex + 1}, col ${columnIndex + 1}]`,
      );
    }

    expect(
      leftOverflow,
      `Text "${rect.text.trim()}" overflows left in cell [row ${rowIndex + 1}, col ${columnIndex + 1}]`,
    ).toBeFalsy();
    expect(
      rightOverflow,
      `Text "${rect.text.trim()}" overflows right in cell [row ${rowIndex + 1}, col ${columnIndex + 1}]`,
    ).toBeFalsy();
    expect(
      topOverflow,
      `Text "${rect.text.trim()}" overflows top in cell [row ${rowIndex + 1}, col ${columnIndex + 1}]`,
    ).toBeFalsy();
    expect(
      bottomOverflow,
      `Text "${rect.text.trim()}" overflows bottom in cell [row ${rowIndex + 1}, col ${columnIndex + 1}]`,
    ).toBeFalsy();
  }
}

export async function checkTableCellElementsNotOverflow(
  page: Page,
  rowIndex = 0,
  columnIndex = 0,
) {
  const cell = await page.$(
    `tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${columnIndex + 1})`,
  );
  if (!cell)
    throw new Error(
      `Cell not found at row ${rowIndex + 1}, column ${columnIndex + 1}`,
    );

  const results = await cell.evaluate((el: HTMLElement) => {
    const cellRect = el.getBoundingClientRect();
    const issues: {
      tag: string;
      label: string;
      left: boolean;
      right: boolean;
      top: boolean;
      bottom: boolean;
    }[] = [];
    const EPSILON = 0.5;

    const children = el.querySelectorAll("button, a, svg, img, [data-testid]");
    for (const child of Array.from(children) as Element[]) {
      const r = child.getBoundingClientRect();
      // Skip invisible elements (hidden, zero-size)
      if (r.width === 0 || r.height === 0) continue;

      const tag = child.tagName;
      const label =
        child.getAttribute("aria-label") ||
        child.getAttribute("data-testid") ||
        child.textContent?.trim().slice(0, 20) ||
        tag;

      const leftOverflow = r.left < cellRect.left - EPSILON;
      const rightOverflow = r.right > cellRect.right + EPSILON;
      const topOverflow = r.top < cellRect.top - EPSILON;
      const bottomOverflow = r.bottom > cellRect.bottom + EPSILON;

      if (leftOverflow || rightOverflow || topOverflow || bottomOverflow) {
        issues.push({
          tag,
          label,
          left: leftOverflow,
          right: rightOverflow,
          top: topOverflow,
          bottom: bottomOverflow,
        });
      }
    }
    return issues;
  });

  for (const issue of results) {
    const loc = `[row ${rowIndex + 1}, col ${columnIndex + 1}]`;
    if (issue.left)
      console.warn(
        `❌ Element <${issue.tag}> "${issue.label}" overflows left ${loc}`,
      );
    if (issue.right)
      console.warn(
        `❌ Element <${issue.tag}> "${issue.label}" overflows right ${loc}`,
      );
    if (issue.top)
      console.warn(
        `❌ Element <${issue.tag}> "${issue.label}" overflows top ${loc}`,
      );
    if (issue.bottom)
      console.warn(
        `❌ Element <${issue.tag}> "${issue.label}" overflows bottom ${loc}`,
      );

    expect(
      issue.left,
      `Element <${issue.tag}> "${issue.label}" overflows left ${loc}`,
    ).toBeFalsy();
    expect(
      issue.right,
      `Element <${issue.tag}> "${issue.label}" overflows right ${loc}`,
    ).toBeFalsy();
    expect(
      issue.top,
      `Element <${issue.tag}> "${issue.label}" overflows top ${loc}`,
    ).toBeFalsy();
    expect(
      issue.bottom,
      `Element <${issue.tag}> "${issue.label}" overflows bottom ${loc}`,
    ).toBeFalsy();
  }
}

export async function checkTableVisibleCellsNotClippedByViewport(page: Page) {
  const results = await page.evaluate(() => {
    const vw = window.innerWidth;
    const issues: {
      row: number;
      col: number;
      text: string;
      cellRight: number;
      viewportWidth: number;
    }[] = [];
    const EPSILON = 1;

    const rows = document.querySelectorAll("tbody tr");
    // Check first 3 rows only for performance
    const maxRows = Math.min(rows.length, 3);

    for (let r = 0; r < maxRows; r++) {
      const cells = rows[r].querySelectorAll("td");
      for (let c = 0; c < cells.length; c++) {
        const cell = cells[c];
        const cellRect = cell.getBoundingClientRect();

        // Only check cells that are partially visible (left edge is in viewport)
        if (cellRect.left >= vw || cellRect.right <= 0) continue;

        // Cell starts in viewport but extends beyond right edge
        if (cellRect.left < vw && cellRect.right > vw + EPSILON) {
          // Check if the table has a scrollable container
          let parent = cell.parentElement as HTMLElement | null;
          let hasScroll = false;
          while (parent) {
            const style = window.getComputedStyle(parent);
            if (
              style.overflowX === "auto" ||
              style.overflowX === "scroll"
            ) {
              hasScroll = true;
              break;
            }
            parent = parent.parentElement;
          }

          // If no scrollable container, the content is truly clipped
          if (!hasScroll) {
            const text =
              cell.textContent?.trim().slice(0, 30) || `col ${c + 1}`;
            issues.push({
              row: r + 1,
              col: c + 1,
              text,
              cellRight: Math.round(cellRect.right),
              viewportWidth: vw,
            });
          }
        }
      }
    }
    return issues;
  });

  for (const issue of results) {
    console.warn(
      `❌ Cell [row ${issue.row}, col ${issue.col}] "${issue.text}" ` +
        `is clipped by viewport (cellRight=${issue.cellRight}px > viewport=${issue.viewportWidth}px) ` +
        `and has no scrollable container`,
    );
    expect(
      true,
      `Cell [row ${issue.row}, col ${issue.col}] "${issue.text}" ` +
        `extends beyond viewport (${issue.cellRight}px > ${issue.viewportWidth}px) without scroll container`,
    ).toBeFalsy();
  }
}
