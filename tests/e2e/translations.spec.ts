import { test, expect, Page } from "@playwright/test";


const MISSING_TRANSLATION_PATTERN = "MISSING:";


const TRANSLATION_KEY_PATTERNS = [
  /\bnavigation\.\w+/g,
  /\bcommon\.\w+/g,
  /\bpages\.\w+/g,
  /\berrors\.\w+/g,
  /\bsdk\.\w+/g,
  /\bshared\.\w+/g,
];


const pages = [
 
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


  "/address/inspector",
  "/asset/recent-nfts",
  "/asset/recent-tokens",
  "/bounty/",
  "/datum/",
  "/envs/",
  "/gov/",
  "/gov/cc/",
  "/gov/constitution/",
  "/gov/drep-vote",
  "/gov/power-thresholds/",
  "/gov/vote/",
  "/multi-pool-delegations/",
  "/profile/",
  "/promotion/",
  "/treasury/",
  "/treasury/projection",


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



const API_BASE = "https://api-mainnet-stage.cexplorer.io/v1";

async function fetchFirstId(
  apiPath: string,
  extract: (json: any) => string | undefined,
): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}${apiPath}`);
    const json = await res.json();
    return extract(json) ?? null;
  } catch {
    return null;
  }
}

interface DetailPageConfig {
  name: string;
  api: string;
  extract: (json: any) => string | undefined;
  url: (id: string) => string;
}

const detailPages: DetailPageConfig[] = [
  {
    name: "/block/$hash",
    api: "/block/list?limit=1",
    extract: (j) => j.data?.data?.[0]?.hash,
    url: (id) => `/block/${id}`,
  },
  {
    name: "/tx/$hash",
    api: "/tx/list?limit=1",
    extract: (j) => j.data?.data?.[0]?.hash,
    url: (id) => `/tx/${id}`,
  },
  {
    name: "/pool/$id",
    api: "/pool/list?limit=1",
    extract: (j) => j.data?.data?.[0]?.pool_id,
    url: (id) => `/pool/${id}`,
  },
  {
    name: "/epoch/$no",
    api: "/epoch/list",
    extract: (j) => String(j.data?.data?.[0]?.no),
    url: (id) => `/epoch/${id}`,
  },
  {
    name: "/drep/$hash",
    api: "/gov/drep_list?limit=1",
    extract: (j) => j.data?.data?.[0]?.hash?.view,
    url: (id) => `/drep/${id}`,
  },
  {
    name: "/script/$hash",
    api: "/script/list?limit=1",
    extract: (j) => j.data?.data?.[0]?.hash,
    url: (id) => `/script/${id}`,
  },
  {
    name: "/stake/$stakeAddr",
    api: "/tx/filter?type=stake_key_registrations&limit=1",
    extract: (j) => j.data?.data?.[0]?.data?.view,
    url: (id) => `/stake/${id}`,
  },
  {
    name: "/gov/action/$id",
    api: "/gov/gov_action_proposal_list?limit=1",
    extract: (j) => j.data?.data?.[0]?.ident?.id,
    url: (id) => `/gov/action/${id}`,
  },
  {
    name: "/gov/cc/$coldKey",
    api: "/gov/committee_detail?id=4",
    extract: (j) => j.data?.member?.[0]?.ident?.cold,
    url: (id) => `/gov/cc/${id}`,
  },
  {
    name: "/gov/vote/$hash",
    api: "/gov/vote?limit=1",
    extract: (j) => j.data?.data?.[0]?.proposal?.ident?.id,
    url: (id) => `/gov/vote/${id}`,
  },
  {
    name: "/polls/$poll",
    api: "/misc/gw/gov",
    extract: (j) => j.data?.[0]?.url,
    url: (id) => `/polls/${id}`,
  },
  {
    name: "/pool-debug/$poolId",
    api: "/pool/list?limit=1",
    extract: (j) => j.data?.data?.[0]?.pool_id,
    url: (id) => `/pool-debug/${id}`,
  },
  {
    name: "/article/$url",
    api: "/article/list?type=article&limit=1&lng=en",
    extract: (j) => j.data?.data?.[0]?.url,
    url: (id) => `/article/${id}`,
  },
  {
    name: "/groups/$url",
    api: "/analytics/group_list",
    extract: (j) => j.data?.data?.[0]?.url,
    url: (id) => `/groups/${id}`,
  },
  {
    name: "/wiki/$url",
    api: "/article/list?type=wiki&limit=1&lng=en",
    extract: (j) => j.data?.data?.[0]?.url,
    url: (id) => `/wiki/${id}`,
  },
  {
    name: "/dex/swap/$hash",
    api: "/defi/order?limit=1",
    extract: (j) => j.data?.data?.[0]?.tx_hash,
    url: (id) => `/dex/swap/${id}`,
  },
];

interface UiDetailPageConfig {
  name: string;
  listUrl: string;
  linkSelector: string;
}

const uiDetailPages: UiDetailPageConfig[] = [
  {
    name: "/asset/$fingerprint",
    listUrl: "/asset/",
    linkSelector: 'a[href*="/asset/asset"]',
  },
  {
    name: "/address/$address",
    listUrl: "/tx/",
    linkSelector: 'a[href*="/address/addr"]',
  },
  {
    name: "/policy/$policyId",
    listUrl: "/asset/",
    linkSelector: 'a[href*="/policy/"]',
  },
];

test.beforeEach(async ({ page }) => {
 await page.addInitScript(() => {
    window.localStorage.setItem(
      "locale-store",
      JSON.stringify({ state: { locale: "cs" } })
    );
  });
});

async function checkTranslations(page: Page, url: string) {
 await page.goto(url);

  const preloader = page.locator("#preloader");
  if ((await preloader.count()) > 0) {
    await expect(preloader).toHaveCount(0, { timeout: 30000 });
  }

  const skeletons = page.locator('[data-testid="skeleton"], .skeleton');
  if ((await skeletons.count()) > 0) {
    await expect(skeletons).toHaveCount(0, { timeout: 30000 });
  }

  const bodyText = await page.locator("body").innerText();

  const hasMissingPlaceholder = bodyText.includes(MISSING_TRANSLATION_PATTERN);
  if (hasMissingPlaceholder) {
    const matches = bodyText.match(/MISSING: \[[^\]]+\]/g) || [];
    console.error(`Missing translation placeholders on ${url}:`, matches);
  }

 const foundRawKeys: string[] = [];
  for (const pattern of TRANSLATION_KEY_PATTERNS) {
    const matches = bodyText.match(pattern) || [];
    foundRawKeys.push(...matches);
  }

  if (foundRawKeys.length > 0) {
    console.error(`Raw translation keys found on ${url}:`, foundRawKeys);
  }

   expect(
    hasMissingPlaceholder,
    `Page ${url} contains MISSING: placeholders`
  ).toBeFalsy();

  expect(
    foundRawKeys.length,
    `Page ${url} contains raw translation keys: ${foundRawKeys.join(", ")}`
  ).toBe(0);
}

async function waitForPageRender(page: Page) {
  const preloader = page.locator("#preloader");
  if ((await preloader.count()) > 0) {
    await expect(preloader).toHaveCount(0, { timeout: 30000 });
  }
  const skeletons = page.locator('[data-testid="skeleton"], .skeleton');
  if ((await skeletons.count()) > 0) {
    await expect(skeletons).toHaveCount(0, { timeout: 30000 });
  }
}



test.describe("Czech translation coverage", () => {
  for (const pageUrl of pages) {
    test(`CS: ${pageUrl}`, async ({ page }) => {
      await checkTranslations(page, pageUrl);
    });
  }
});



test.describe("Czech translation coverage — detail pages (API)", () => {
  for (const dp of detailPages) {
    test(`CS: ${dp.name} (dynamic)`, async ({ page }) => {
      const id = await fetchFirstId(dp.api, dp.extract);
      test.skip(!id, `No data from API for ${dp.name}`);
      await checkTranslations(page, dp.url(id!));
    });
  }
});



test.describe("Czech translation coverage — detail pages (UI)", () => {
  for (const dp of uiDetailPages) {
    test(`CS: ${dp.name} (dynamic)`, async ({ page }) => {
      await page.goto(dp.listUrl);
      await waitForPageRender(page);

      const link = page.locator(dp.linkSelector).first();
      const href = (await link.count()) > 0
        ? await link.getAttribute("href")
        : null;
      test.skip(!href, `No detail link found on ${dp.listUrl} for ${dp.name}`);
      await checkTranslations(page, href!);
    });
  }
});
