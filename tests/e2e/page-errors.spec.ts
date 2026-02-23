import { test } from "@playwright/test";

import {
  addressesForCheck,
  analyticsAccountTabs,
  analyticsNetworkTabs,
  analyticsPoolsTabs,
  articleIds,
  assetListPagesForCheck,
  assetsForCheck,
  blockListPagesForCheck,
  contractInteractionsPages,
  dexSwapHashes,
  drepDeregistrationsPages,
  drepHashes,
  drepListPagesForCheck,
  drepRegistrationPages,
  drepUpdatesPages,
  epochDetailsForCheck,
  govActionIds,
  govActionListPages,
  govCcPagesForCheck,
  govVotePagesForCheck,
  groupsNames,
  handleDnsTabs,
  poolDebugTabs,
  taxToolTabs,
  inlineDatums,
  liveDelegationsPages,
  metadataPages,
  multiPoolDelegationsPages,
  newPoolPages,
  policyIds,
  poolListPages,
  poolsForCheck,
  txListPagesForCheck,
  pollsTabs,
  pollsNames,
  poolRegistrationsPages,
  poolDeregistrationsPages,
  poolAwardsPage,
  poolBirthdays,
  poolUpdates,
  retiredDelegationsTabs,
  scriptPages,
  scriptHashes,
  stakeHashes,
  stakeDeregistrationsPages,
  stakeRegistrationsPages,
  tokenDashboardTabs,
  treasuryDonationTabs,
  txHashes,
  wikiPagesForCheck,
  withdrawalsPages,
} from "./page-errors.data";

import {
  buildUrl,
  checkPage,
  getFirstDetailHref,
} from "./page-errors.helpers";

test(`About us`, async ({ browser }) => {
  const url = buildUrl("/about-us/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Api`, async ({ browser }) => {
  const url = buildUrl("/api/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Ada price`, async ({ browser }) => {
  const url = buildUrl("/ada-price/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Ads`, async ({ browser }) => {
  const url = buildUrl("/ads/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Analytics`, async ({ browser }) => {
  const url = buildUrl("/analytics/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Article`, async ({ browser }) => {
  const url = buildUrl("/article/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Aricle details", () => {
  for (const articleId of articleIds) {
    test(`Article ${articleId}`, async ({ browser }) => {
      const url = buildUrl("/article/" + articleId, 0, undefined, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Analytics/account", () => {
  for (const tab of analyticsAccountTabs) {
    test(`Analytics account - ${tab} tab`, async ({ browser }) => {
      const url = buildUrl("/analytics/account", 0, { tab }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Analytics/network", () => {
  for (const tab of analyticsNetworkTabs) {
    test(`Analytics network - ${tab} tab`, async ({ browser }) => {
      const url = buildUrl("/analytics/network", 0, { tab }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Analytics/pool", () => {
  for (const tab of analyticsPoolsTabs) {
    test(`Analytics pool - ${tab} tab`, async ({ browser }) => {
      const url = buildUrl("/analytics/pool", 0, { tab }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Address detail/assets tab", () => {
  for (const address of addressesForCheck) {
    test(`Address ${address} - assets`, async ({ browser }) => {
      const url = buildUrl("/address/" + address, 0, { tab: "assets" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Address detail/defi tab", () => {
  for (const address of addressesForCheck) {
    test(`Address ${address} - defi`, async ({ browser }) => {
      const url = buildUrl("/address/" + address, 0, { tab: "defi" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Address detail/transactions tab", () => {
  for (const address of addressesForCheck) {
    test(`Address ${address} - transactions`, async ({ browser }) => {
      const url = buildUrl(
        "/address/" + address,
        0,
        { tab: "transactions" },
        false,
      );
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Address detail/utxos tab", () => {
  for (const address of addressesForCheck) {
    test(`Address ${address} - utxos`, async ({ browser }) => {
      const url = buildUrl("/address/" + address, 0, { tab: "utxos" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Asset list", () => {
  for (const assetPage of assetListPagesForCheck) {
    test(`Asset – ${assetPage} page`, async ({ browser }) => {
      const url = buildUrl("/asset/", assetPage, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Asset list/token tab", () => {
  for (const page of assetListPagesForCheck) {
    test(`Asset - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/asset/", page, { tab: "token" });
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Asset list/nft tab", () => {
  for (const page of assetListPagesForCheck) {
    test(`Asset - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/asset/", page, { tab: "nft" });
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Asset detail/stats tab", () => {
  for (const asset of assetsForCheck) {
    test(`Asset ${asset} - assets`, async ({ browser }) => {
      const url = buildUrl("/asset/" + asset, 0, { tab: "Stats" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Asset detail/transactions tab", () => {
  for (const asset of assetsForCheck) {
    test(`Asset ${asset} - assets`, async ({ browser }) => {
      const url = buildUrl(
        "/asset/" + asset,
        0,
        { tab: "transactions" },
        false,
      );
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Asset detail/mints tab", () => {
  for (const asset of assetsForCheck) {
    test(`Asset ${asset} - assets`, async ({ browser }) => {
      const url = buildUrl("/asset/" + asset, 0, { tab: "mints" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Asset detail/metadata tab", () => {
  for (const asset of assetsForCheck) {
    test(`Asset ${asset} - assets`, async ({ browser }) => {
      const url = buildUrl("/asset/" + asset, 0, { tab: "metadata" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Asset detail/owners tab", () => {
  for (const asset of assetsForCheck) {
    test(`Asset ${asset} - assets`, async ({ browser }) => {
      const url = buildUrl("/asset/" + asset, 0, { tab: "owners" }, false);
      await checkPage(browser, url);
    });
  }
});

test(`Block detail - first from list`, async ({ browser }) => {
  const href = await getFirstDetailHref(browser, "/block/");
  await checkPage(browser, href);
});

test.describe.parallel("Block list", () => {
  for (const page of blockListPagesForCheck) {
    test(`Block - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/block/", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test(`Bots`, async ({ browser }) => {
  const url = buildUrl("/bots/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Bounty`, async ({ browser }) => {
  const url = buildUrl("/bounty/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Brand assets`, async ({ browser }) => {
  const url = buildUrl("/brand-assets/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Contact us`, async ({ browser }) => {
  const url = buildUrl("/contact-us/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Contract interactions", () => {
  for (const page of contractInteractionsPages) {
    test(`Contract interactions - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/contract/interactions/", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test(`Contributors`, async ({ browser }) => {
  const url = buildUrl("/contributors/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Datum", () => {
  for (const inlineDatum of inlineDatums) {
    test(`Datum - ${inlineDatum}`, async ({ browser }) => {
      const url = buildUrl("/datum/", 0, { datum: inlineDatum }, false);
      await checkPage(browser, url);
    });
  }
});

test(`Dev`, async ({ browser }) => {
  const url = buildUrl("/dev/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Devlog`, async ({ browser }) => {
  const url = buildUrl("/devlog/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Dex swap detail", () => {
  for (const hash of dexSwapHashes) {
    test(`Dex swap - ${hash} hash`, async ({ browser }) => {
      const url = buildUrl("/dex/swap/" + hash, 0, undefined, false);
      await checkPage(browser, url);
    });
  }
});

test(`Donate`, async ({ browser }) => {
  const url = buildUrl("/donate/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Drep detail", () => {
  for (const hash of drepHashes) {
    test(`Drep detail - ${hash} hash`, async ({ browser }) => {
      const url = buildUrl("/drep/" + hash, 0, undefined, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Drep list", () => {
  for (const drepPage of drepListPagesForCheck) {
    test(`Drep - ${drepPage} page`, async ({ browser }) => {
      const url = buildUrl("/drep/", drepPage, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Drep deregestration", () => {
  for (const page of drepDeregistrationsPages) {
    test(`Drep deregistration - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/drep/deregistrations", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Drep regestration", () => {
  for (const page of drepRegistrationPages) {
    test(`Drep registration - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/drep/registrations", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Drep updates", () => {
  for (const page of drepUpdatesPages) {
    test(`Drep updates - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/drep/updates", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test(`Education`, async ({ browser }) => {
  const url = buildUrl("/education/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Envs`, async ({ browser }) => {
  const url = buildUrl("/envs/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Epoch calendar`, async ({ browser }) => {
  const url = buildUrl("/epoch/calendar/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Epoch detail/analytics tab", () => {
  for (const epochId of epochDetailsForCheck) {
    test(`Epoch ${epochId} - analytics`, async ({ browser }) => {
      const url = buildUrl("/epoch/" + epochId, 0, { tab: "analytics" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Epoch detail/blocks tab", () => {
  for (const epochId of epochDetailsForCheck) {
    test(`Epoch ${epochId} - blocks`, async ({ browser }) => {
      const url = buildUrl("/epoch/" + epochId, 0, { tab: "blocks" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Epoch detail/parameters tab", () => {
  for (const epochId of epochDetailsForCheck) {
    test(`Epoch ${epochId} - parameters`, async ({ browser }) => {
      const url = buildUrl(
        "/epoch/" + epochId,
        0,
        { tab: "parameters" },
        false,
      );
      await checkPage(browser, url);
    });
  }
});

test(`Epoch List - Just render (for while)`, async ({ browser }) => {
  const url = buildUrl("/epoch/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Faq`, async ({ browser }) => {
  const url = buildUrl("/faq/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Gov`, async ({ browser }) => {
  const url = buildUrl("/gov/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Gov action list", () => {
  for (const page of govActionListPages) {
    test(`Gov action - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/gov/action", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Gov action detail", () => {
  for (const id of govActionIds) {
    test(`Gov action detail - ${id} id`, async ({ browser }) => {
      const url = buildUrl("/gov/action/" + id, 0, undefined, false);
      await checkPage(browser, url);
    });
  }
});

test(`Groups`, async ({ browser }) => {
  const url = buildUrl("/groups/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Group detail", () => {
  for (const name of groupsNames) {
    test(`Group detail - ${name}`, async ({ browser }) => {
      const url = buildUrl("/groups/" + name, 0, undefined, false);
      await checkPage(browser, url);
    });
  }
});

test(`Hardfork`, async ({ browser }) => {
  const url = buildUrl("/hardfork/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Live delegations", () => {
  for (const page of liveDelegationsPages) {
    test(`Live delegations - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/live-delegations/", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Metadata", () => {
  for (const page of metadataPages) {
    test(`Metadata - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/metadata/", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("New pools", () => {
  for (const page of newPoolPages) {
    test(`New Pools - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/new-pools/", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test(`Newsletter`, async ({ browser }) => {
  const url = buildUrl("/newsletter/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Policy detail/assets tab", () => {
  for (const policy of policyIds) {
    test(`Policy ${policy} `, async ({ browser }) => {
      const url = buildUrl("/policy/" + policy, 0, { tab: "assets" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Policy detail/owners tab", () => {
  for (const policy of policyIds) {
    test(`Policy ${policy} `, async ({ browser }) => {
      const url = buildUrl("/policy/" + policy, 0, { tab: "owners" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Policy detail/mint tab", () => {
  for (const policy of policyIds) {
    test(`Policy ${policy} `, async ({ browser }) => {
      const url = buildUrl("/policy/" + policy, 0, { tab: "mint" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Policy detail/analytics tab", () => {
  for (const policy of policyIds) {
    test(`Policy ${policy} `, async ({ browser }) => {
      const url = buildUrl("/policy/" + policy, 0, { tab: "analytics" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Policy detail/tx tab", () => {
  for (const policy of policyIds) {
    test(`Policy ${policy} `, async ({ browser }) => {
      const url = buildUrl("/policy/" + policy, 0, { tab: "tx" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Polls", () => {
  for (const polls of pollsTabs) {
    test(`Polls ${polls} tab`, async ({ browser }) => {
      const url = buildUrl("/polls/", 0, { tab: polls }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Polls detail", () => {
  for (const poll of pollsNames) {
    test(`Polls detail ${poll} `, async ({ browser }) => {
      const url = buildUrl("/polls/" + poll, 0, undefined, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool list", () => {
  for (const page of poolListPages) {
    test(`Pool - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/pool", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool detail performance tab", () => {
  for (const pool of poolsForCheck) {
    test(`Pool ${pool} `, async ({ browser }) => {
      const url = buildUrl("/pool/" + pool, 0, { tab: "performance" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool detail blocks tab", () => {
  for (const pool of poolsForCheck) {
    test(`Pool ${pool} `, async ({ browser }) => {
      const url = buildUrl("/pool/" + pool, 0, { tab: "blocks" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool detail rewards tab", () => {
  for (const pool of poolsForCheck) {
    test(`Pool ${pool} `, async ({ browser }) => {
      const url = buildUrl("/pool/" + pool, 0, { tab: "rewards" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool detail delegators tab newcomers subtab", () => {
  for (const pool of poolsForCheck) {
    test(`Pool ${pool} `, async ({ browser }) => {
      const url = buildUrl(
        "/pool/" + pool,
        0,
        { tab: "delegators", subTab: "newcomers" },
        false,
      );
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool detail delegators tab migrations subtab", () => {
  for (const pool of poolsForCheck) {
    test(`Pool ${pool} `, async ({ browser }) => {
      const url = buildUrl(
        "/pool/" + pool,
        0,
        { tab: "delegators", subTab: "migrations" },
        false,
      );
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool detail delegators tab structure subtab", () => {
  for (const pool of poolsForCheck) {
    test(`Pool ${pool} `, async ({ browser }) => {
      const url = buildUrl(
        "/pool/" + pool,
        0,
        { tab: "delegators", subTab: "structure" },
        false,
      );
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool detail about tab", () => {
  for (const pool of poolsForCheck) {
    test(`Pool ${pool} `, async ({ browser }) => {
      const url = buildUrl("/pool/" + pool, 0, { tab: "about" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool detail awards tab", () => {
  for (const pool of poolsForCheck) {
    test(`Pool ${pool} `, async ({ browser }) => {
      const url = buildUrl("/pool/" + pool, 0, { tab: "awards" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool registrations", () => {
  for (const page of poolRegistrationsPages) {
    test(`Pool registrations - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/pool/registrations", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool deregistrations", () => {
  for (const page of poolDeregistrationsPages) {
    test(`Pool deregistrations - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/pool/deregistrations", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool awards", () => {
  for (const page of poolAwardsPage) {
    test(`Pool awards - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/pool-awards", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool birthdays", () => {
  for (const page of poolBirthdays) {
    test(`Pool birthdays - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/pool-birthdays", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool updates", () => {
  for (const page of poolUpdates) {
    test(`Pool updates - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/pool-updates", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Pool debug", () => {
  for (const tab of poolDebugTabs) {
    test(`Pool debug - ${tab} tab`, async ({ browser }) => {
      const url = buildUrl("/pool-debug/", 0, { tab }, false);
      await checkPage(browser, url);
    });
  }
});

test(`Pots`, async ({ browser }) => {
  const url = buildUrl("/pot/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Privacy`, async ({ browser }) => {
  const url = buildUrl("/privacy/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Pro`, async ({ browser }) => {
  const url = buildUrl("/pro/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Rewards checker`, async ({ browser }) => {
  const url = buildUrl("/rewards-checker/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Retired delegations", () => {
  for (const tab of retiredDelegationsTabs) {
    test(`Retired delegations - ${tab} tab`, async ({ browser }) => {
      const url = buildUrl("/retired-delegations/", 0, { tab }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Script", () => {
  for (const page of scriptPages) {
    test(`Script - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/script", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Script detail", () => {
  for (const hash of scriptHashes) {
    test(`Script detail - ${hash} hash`, async ({ browser }) => {
      const url = buildUrl("/script/" + hash, 0, undefined, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Stake detail/assets tab", () => {
  for (const address of stakeHashes) {
    test(`Stake ${address}`, async ({ browser }) => {
      const url = buildUrl("/stake/" + address, 0, { tab: "assets" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Stake detail/withdrawals tab", () => {
  for (const address of stakeHashes) {
    test(`Stake ${address}`, async ({ browser }) => {
      const url = buildUrl(
        "/stake/" + address,
        0,
        { tab: "withdrawals" },
        false,
      );
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Stake detail/addresses tab", () => {
  for (const address of stakeHashes) {
    test(`Stake ${address}`, async ({ browser }) => {
      const url = buildUrl("/stake/" + address, 0, { tab: "addresses" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Stake detail/delegations tab", () => {
  for (const address of stakeHashes) {
    test(`Stake ${address}`, async ({ browser }) => {
      const url = buildUrl(
        "/stake/" + address,
        0,
        { tab: "delegations" },
        false,
      );
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Stake detail/rewards tab", () => {
  for (const address of stakeHashes) {
    test(`Stake ${address}`, async ({ browser }) => {
      const url = buildUrl("/stake/" + address, 0, { tab: "rewards" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Stake detail/defi tab", () => {
  for (const address of stakeHashes) {
    test(`Stake ${address}`, async ({ browser }) => {
      const url = buildUrl("/stake/" + address, 0, { tab: "defi" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Stake deregistrations", () => {
  for (const page of stakeDeregistrationsPages) {
    test(`Stake deregistrations - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/stake/deregistrations", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Stake registrations", () => {
  for (const page of stakeRegistrationsPages) {
    test(`Stake registrations - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/stake/registrations", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test(`Status`, async ({ browser }) => {
  const url = buildUrl("/status/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Terms`, async ({ browser }) => {
  const url = buildUrl("/terms/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Token dashboard", () => {
  for (const tab of tokenDashboardTabs) {
    test(`Token dashboard - ${tab}`, async ({ browser }) => {
      const url = buildUrl("/token/dashboard", 0, { tab }, false);
      await checkPage(browser, url);
    });
  }
});

test(`Treasury`, async ({ browser }) => {
  const url = buildUrl("/treasury/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Treasury donation", () => {
  for (const tab of treasuryDonationTabs) {
    test(`Treasury donation - ${tab}`, async ({ browser }) => {
      const url = buildUrl("/treasury/donation", 0, { tab }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Tx detail/overview tab", () => {
  for (const hash of txHashes) {
    test(`Tx detail - ${hash}`, async ({ browser }) => {
      const url = buildUrl("/tx/" + hash, 0, { tab: "overview" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Tx detail/content tab", () => {
  for (const hash of txHashes) {
    test(`Tx detail - ${hash}`, async ({ browser }) => {
      const url = buildUrl("/tx/" + hash, 0, { tab: "content" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Tx detail/metadata tab", () => {
  for (const hash of txHashes) {
    test(`Tx detail - ${hash}`, async ({ browser }) => {
      const url = buildUrl("/tx/" + hash, 0, { tab: "metadata" }, false);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Tx detail/trading tab", () => {
  for (const hash of txHashes) {
    test(`Tx detail - ${hash}`, async ({ browser }) => {
      const url = buildUrl("/tx/" + hash, 0, { tab: "trading" }, false);
      await checkPage(browser, url);
    });
  }
});

test(`Wallet`, async ({ browser }) => {
  const url = buildUrl("/wallet/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Watchlist`, async ({ browser }) => {
  const url = buildUrl("/watchlist/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Withdrawals", () => {
  for (const page of withdrawalsPages) {
    test(`Withdrawals - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/withdrawals/", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test.describe.parallel("Tx list", () => {
  for (const page of txListPagesForCheck) {
    test(`Tx - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/tx/", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test(`Address inspector`, async ({ browser }) => {
  const url = buildUrl("/address/inspector", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Analytics genesis`, async ({ browser }) => {
  const url = buildUrl("/analytics/genesis", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Asset recent tokens`, async ({ browser }) => {
  const url = buildUrl("/asset/recent-tokens", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Asset recent NFTs`, async ({ browser }) => {
  const url = buildUrl("/asset/recent-nfts", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Gov constitution`, async ({ browser }) => {
  const url = buildUrl("/gov/constitution/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Gov power thresholds`, async ({ browser }) => {
  const url = buildUrl("/gov/power-thresholds/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Gov drep vote`, async ({ browser }) => {
  const url = buildUrl("/gov/drep-vote", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Gov vote list", () => {
  for (const page of govVotePagesForCheck) {
    test(`Gov vote - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/gov/vote/", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test(`Gov vote detail - first from list`, async ({ browser }) => {
  const href = await getFirstDetailHref(browser, "/gov/vote/");
  await checkPage(browser, href);
});

test.describe.parallel("Gov CC list", () => {
  for (const page of govCcPagesForCheck) {
    test(`Gov CC - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/gov/cc/", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test(`Gov CC detail - first from list`, async ({ browser }) => {
  const href = await getFirstDetailHref(browser, "/gov/cc/");
  await checkPage(browser, href);
});

test.describe.parallel("Handle DNS", () => {
  for (const tab of handleDnsTabs) {
    test(`Handle DNS - ${tab} tab`, async ({ browser }) => {
      const url = buildUrl("/handle-dns/", 0, { tab }, false);
      await checkPage(browser, url);
    });
  }
});

test(`Multi pool delegations`, async ({ browser }) => {
  const url = buildUrl("/multi-pool-delegations/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Multi pool delegations pages", () => {
  for (const page of multiPoolDelegationsPages) {
    test(`Multi pool delegations - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/multi-pool-delegations/", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test(`Pay`, async ({ browser }) => {
  const url = buildUrl("/pay/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Profile`, async ({ browser }) => {
  const url = buildUrl("/profile/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Promotion`, async ({ browser }) => {
  const url = buildUrl("/promotion/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Rewards calculator`, async ({ browser }) => {
  const url = buildUrl("/rewards-calculator/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Search`, async ({ browser }) => {
  const url = buildUrl("/search/", 0, undefined, false);
  await checkPage(browser, url);
});

test(`Swap`, async ({ browser }) => {
  const url = buildUrl("/swap/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Tax tool", () => {
  for (const tab of taxToolTabs) {
    test(`Tax tool - ${tab} tab`, async ({ browser }) => {
      const url = buildUrl("/tax-tool/", 0, { tab }, false);
      await checkPage(browser, url);
    });
  }
});

test(`Treasury projection`, async ({ browser }) => {
  const url = buildUrl("/treasury/projection", 0, undefined, false);
  await checkPage(browser, url);
});

test(`UPLC`, async ({ browser }) => {
  const url = buildUrl("/uplc/", 0, undefined, false);
  await checkPage(browser, url);
});

test.describe.parallel("Wiki list", () => {
  for (const page of wikiPagesForCheck) {
    test(`Wiki - ${page} page`, async ({ browser }) => {
      const url = buildUrl("/wiki/", page, undefined);
      await checkPage(browser, url);
    });
  }
});

test(`Wiki detail - first from list`, async ({ browser }) => {
  const href = await getFirstDetailHref(browser, "/wiki/");
  await checkPage(browser, href);
});
