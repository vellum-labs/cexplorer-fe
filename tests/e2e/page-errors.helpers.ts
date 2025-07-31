import test, { expect } from "@playwright/test";

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

    const forbiddenPatterns = ["NaN", "undefined", "Infinity"];
    const bodyText = await page.locator("body").innerText();

    for (const pattern of forbiddenPatterns) {
      expect(bodyText.includes(pattern)).toBeFalsy();
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
  page,
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

export async function checkTableHeadersNoOverlap(page) {
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
  page,
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
    function getTextRects(node) {
      const rects: any = [];
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") {
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
