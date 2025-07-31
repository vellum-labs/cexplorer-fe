const getArrayWithLength = (length: number) =>
  Array.from({ length }, (_, i) => i + 1);

export const epochDetailsForCheck = getArrayWithLength(218);

export const drepListPagesForCheck = getArrayWithLength(9);
export const drepListColumnOrdersToTest: string[][] = [
  [
    "status",
    "drep_name",
    "voting_power",
    "voting_activity",
    "owner_stake",
    "average_stake",
    "registered",
    "delegators",
    "selected_vote",
    "top_delegator",
    "metadata",
    "spo",
  ],
  [
    "spo",
    "metadata",
    "top_delegator",
    "selected_vote",
    "delegators",
    "registered",
    "average_stake",
    "owner_stake",
    "voting_activity",
    "voting_power",
    "drep_name",
    "status",
  ],
  [
    "voting_activity",
    "selected_vote",
    "voting_power",
    "drep_name",
    "status",
    "owner_stake",
    "average_stake",
    "registered",
    "delegators",
    "top_delegator",
    "metadata",
    "spo",
  ],
  [
    "metadata",
    "spo",
    "drep_name",
    "status",
    "voting_power",
    "owner_stake",
    "average_stake",
    "registered",
    "voting_activity",
    "delegators",
    "selected_vote",
    "top_delegator",
  ],
  [
    "top_delegator",
    "status",
    "delegators",
    "spo",
    "registered",
    "voting_activity",
    "metadata",
    "drep_name",
    "owner_stake",
    "average_stake",
    "selected_vote",
    "voting_power",
  ],
];
export const txListPagesForCheck = getArrayWithLength(10);

export const assetListPagesForCheck = [
  ...Array.from({ length: 10 }, (_, i) => 1 + i),
  // ...Array.from({ length: 100 }, (_, i) => 45000 + i),
  // ...Array.from({ length: 100 }, (_, i) => 40000 + i),
  // ...Array.from({ length: 100 }, (_, i) => 35000 + i),
  // ...Array.from({ length: 100 }, (_, i) => 30000 + i),
  // ...Array.from({ length: 100 }, (_, i) => 25000 + i),
  // ...Array.from({ length: 100 }, (_, i) => 20000 + i),
  // ...Array.from({ length: 100 }, (_, i) => 15000 + i),
  // ...Array.from({ length: 100 }, (_, i) => 10000 + i),
  // ...Array.from({ length: 100 }, (_, i) => 5000 + i),
];

export const assetListColumnOrdersToTest: string[][] = [
  [
    "order",
    "type",
    "asset",
    "policy_id",
    "asset_minted",
    "mint_quantity",
    "mint_count",
  ],
  [
    "mint_count",
    "mint_quantity",
    "asset_minted",
    "policy_id",
    "asset",
    "order",
    "type",
  ],
  [
    "type",
    "asset",
    "asset_minted",
    "mint_quantity",
    "mint_count",
    "order",
    "policy_id",
  ],
  [
    "policy_id",
    "mint_count",
    "mint_quantity",
    "type",
    "order",
    "asset",
    "asset_minted",
  ],
  [
    "asset",
    "policy_id",
    "type",
    "asset_minted",
    "mint_quantity",
    "mint_count",
    "order",
  ],
];

export const blockListPagesForCheck = [
  176181, 166171, 156181, 146181, 136181, 126181, 116181, 100181, 90181, 50000,
  40000, 10, 5, 4, 3, 2, 1,
];
export const addressesForCheck = [
  "addr_test1vzpwq95z3xyum8vqndgdd9mdnmafh3djcxnc6jemlgdmswcve6tkw",
  "addr_test1vz09v9yfxguvlp0zsnrpa3tdtm7el8xufp3m5lsm7qxzclgmzkket",
  "addr_test1vz7xs7ceu4xx9n5xn57lfe86vrwddqpp77vjwq5ptlkh49cqy3wur",
  "addr_test1wz4h6068hs93n8j5ar88fgzz6sfnw8krng09xx0mmf36m8c7j9yap",
  "addr_test1qrc2ym7pwzkc9dj284paahsgu782dcsz3dgszpvdqf36szjvpmpraw365fayhrtpzpl4nulq6f9hhdkh4cdyh0tgnjxsaxg4ak",
  "addr_test1wp338kzp70sajpk44pldjyz8896g5yl9pnfrhugr6jyremsz6nwpp",
];

export const assetsForCheck = ["asset1pgvs20f7qyhp5gd4p8c4ctl9q9jj5h6fdhvc55"];

export const analyticsAccountTabs = [
  "wallet_activity",
  "top_staking_accounts",
  "top_addresses",
  "wealth_composition",
];

export const analyticsNetworkTabs = [
  "transactions",
  "blocks",
  "health",
  "energy_consumption",
  "block_versions",
  "storage",
];

export const analyticsPoolsTabs = ["pool_issues", "average_pools"];

export const articleIds = [
  "test-article-2",
  "test-article",
  "test-article-3",
  "wanchain-bridge-connects-cardano-with-many-l1s-and-l2s",
  "can-cardano-be-bigger-than-bitcoin",
  "name",
  "aaa-name-s",
  "name-1",
  "vote-in-intersect-board-and-committees-elections",
  "a-legally-enforceable-cardano-contract-was-signed",
  "cardano-s-partner-chain-framework-correlates-with-the-trend",
];

export const blockDetailHashes = [
  "f3df8dc7e33d9f0caabb473759067d6548ddd6066340ec389cddc2344e406e21",
];

export const contractInteractionsPages = [
  ...getArrayWithLength(100),
  ...Array.from({ length: 100 }, (_, i) => 19000 + i),
  ...Array.from({ length: 100 }, (_, i) => 18000 + i),
  ...Array.from({ length: 100 }, (_, i) => 17000 + i),
  ...Array.from({ length: 100 }, (_, i) => 16000 + i),
  ...Array.from({ length: 100 }, (_, i) => 15000 + i),
  ...Array.from({ length: 100 }, (_, i) => 14000 + i),
  ...Array.from({ length: 100 }, (_, i) => 13000 + i),
  ...Array.from({ length: 100 }, (_, i) => 12000 + i),
  ...Array.from({ length: 100 }, (_, i) => 10000 + i),
  ...Array.from({ length: 100 }, (_, i) => 8000 + i),
  ...Array.from({ length: 100 }, (_, i) => 6000 + i),
  ...Array.from({ length: 100 }, (_, i) => 4000 + i),
  ...Array.from({ length: 100 }, (_, i) => 2000 + i),
  ...Array.from({ length: 100 }, (_, i) => 1000 + i),
];

export const inlineDatums = [
  "d87a9fd8799f581c9dc0a95d1a343ef38043994c4ff7b8f1f8f860339ee351bc0cb8a650d8799fd8799f1a000a21141b0000019717555c40ffffffff",
];

export const dexSwapHashes = [
  "718376f90a2ba007d35670643a5c35d911464e6415f30f28ad10c52051766d99",
];

export const drepHashes = [
  "drep1t0l0yz6rzvw9e2rss344v8h57w26m5fqr85u0frlw4k5gashtw9",
  "drep1yle2vhc5g0de4rr2k739f8taxj5e66cq5ypv78w8xh7sgv0x0lu",
  "drep1wcl0w4np7rxceraptxne67dlaru6w6rchk407uq9nrhquq6gltn",
  "drep1r9p7c7lcexft8r6lyypxxfytx6sm82k9rv3n7wksutshq6grz8v",
  "drep1df2uxemkj2j7gtwmj84455jv523kne57e8956v9sywu9jaq57f4",
  "drep1symc604gnd50plqfj393lyljl6u9zvv0r9he3wjq98v2sz3vtkp",
  "drep1hq6ucgx2w3m5tw63s6zrvzggffammekajdgyh3clncufsdgqyvu",
];

export const drepDeregistrationsPages = getArrayWithLength(30);

export const drepRegistrationPages = getArrayWithLength(30);

export const drepUpdatesPages = getArrayWithLength(12);

export const govActionListPages = getArrayWithLength(1);

export const govActionIds = [
  "40c2a42fe324759a640dcfddbc69ef2e3b7fe5a998af8d6660359772bf44c9dc#0",
  "0f20e19828fe09f2a40b14fbce148f274afae8f1f84707d8c4e828b808ffadc4#0",
  "191398f38ef05515ddca265020d607fbb85c5651813f2429b38160fd491d9f8f#0",
  "584a873b84d689bb577bd9b9edc11b19b25ca820dddad82003e56dd776bbcc74#0",
  "be1640dd2b3485e94703be5683c804d5051d96c12e1eaacc17c30e74de580ce5#0",
  "f7185203dbeb64e09644eafbc304beb1e183d065d32565584f835958585759a9#0",
];

export const groupsNames = [
  "test-group-1",
  "group-1",
  "group-2",
  "group-3",
  "group-4",
  "opice",
  "test-group-e",
];

export const liveDelegationsPages = getArrayWithLength(30);

export const metadataPages = getArrayWithLength(30);

export const newPoolPages = getArrayWithLength(20);

export const poolListPages = getArrayWithLength(40);

export const poolsForCheck = [
  "pool13m26ky08vz205232k20u8ft5nrg8u68klhn0xfsk9m4gsqsc44v",
  "pool1e0arfuamnymdkmjztvkryasxv9d8u8key27ajgc4mquz2nr8mk9",
  "pool1upqfyzqpk6wkpsvw90qqrpr9tjyemh484wk4em69anwpu586ehq",
  "pool107k26e3wrqxwghju2py40ngngx2qcu48ppeg7lk0cm35jl2aenx",
  "pool1cmkjkxmk8hsf4dwxy6cng06arcvyk5du06jk6nxu2fj7kckv070",
  "pool12qj4pk9sr6mxxwnfj9hvujf0r2d8c4t8tkwcafnrjdpxqep69ck",
  "pool19d8wgkqn7pc33y0uy2t5vx0922nvzv0a5999ejj0fjdyxjxdfve",
];

export const policyIds = [
  "2f8a9c89cfedfe0a8b399ba73d272689ca204306b6884c34fb16e4a1",
  "8c319e69795f02d45ac1ba7d7c4b9198f881621ee78449dacd4d4feb",
  "f421a52241861a6e7db670944432a49687cd73a36c73c59fb0bafee5",
];

export const pollsTabs = ["all", "live", "closed"];

export const pollsNames = [
  "poll-24-25",
  "poll-test-3",
  "poll-test-2",
  "poll-test-1",
  "hour-test-poll",
  "nice-poll",
];

export const poolRegistrationsPages = getArrayWithLength(27);

export const poolDeregistrationsPages = getArrayWithLength(6);

export const poolAwardsPage = getArrayWithLength(129);

export const poolBirthdays = getArrayWithLength(1);

export const poolUpdates = getArrayWithLength(22);

export const scriptPages = getArrayWithLength(30);

export const retiredDelegationsTabs = ["live", "active"];

export const scriptHashes = [
  "575cd86d5c4fa7720d420ea27ddbaa194815362974bcde5ec5cb59e6",
  "a1e301ba23ea1d4c990484b3a03cb2dd531d41ab3254ed146716a55a",
  "6398de8bd177d8f84c8f87d2f0d19c16b7a638fc01db3ba257cf7219",
  "eb0c967cbd3c39bb91a3f6227beb12e77cd8215ec2db09dc0f6552cc",
];

export const stakeHashes = [
  "stake_test1uzrvw62pn24xw0yk8ksyuj6m4ezg6jgw9n4vjqktstjd5aspv59nv",
  "stake_test17zv7yxr3hyxksh9jd3qhz9562nj76nex7wwlc9smxhaczyszgtxrj",
  "stake_test1upgxfdn3vdx3fjud2sl8rhvwksm6glhmg7cty2yzsekyyrgm428xq",
  "stake_test17rhka4r6dyt68ja7k3jkr6y98k5kjdphjntxz2ze3g627tqtlqdeh",
  "stake_test17psajmusqzl46vja59e93msxj0se63quanhxfqjj38hxklglcp8y8",
];

export const stakeDeregistrationsPages = getArrayWithLength(50);

export const stakeRegistrationsPages = getArrayWithLength(50);

export const withdrawalsPages = getArrayWithLength(50);

export const tokenDashboardTabs = ["tokens", "global_activity", "exchange"];

export const treasuryDonationTabs = ["dontations", "stats"];

export const txHashes = [
  "5e99af8217844c637ebc2ecbcfff01d6912167ac4ef3d12f50e2d8ba2b38b63f",
  "c153f89c9ba9a9621e3642b669e6691d74ac1d04d7b3a5caac2009632dac7965",
  "d7f29b2ecabfcbe8ac826b158fe077bc7ac2adbcf155b431757c39a145bde9a8",
];
