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
  "addr1qxxj0zec9lth7hje8prg39r3x746g690qzuvxkgrk67q9w6m5stzjm2k2ypez2q0sxw48w4ummrexp4gd7p46v37q87s0rvfsp",
  "addr1qx2x4luvdwdsrlgzrdfmspuhxplvga7uxp2wz9nyut4czccjhtj0n2gl2vx2agq7q9qk4z4r6jr632u6waqyrvgxqzwsvw3fna",
  "addr1qyglvelh7cqju3y45judzxgfzrkjwvlpjh3flhz0lqfr4afdqlsn98zd05qrlgqyd3zhleg7p88zd523qj5533uu3d0qk0hpqv",
  "addr1qx4l2ya4p9ndhvsm0kkwyshn40jmyqrahcnwaafjm05jtgkmh7xmstlzjwxnprtd2w8yknht5u6sv5gmgj6c9xn06rmsxr3u3c",
  "addr1q9ft0p0huc7mz08040y7cw9zfd79gd5tcnuk95qey735j9f9k47suqdav47m0lw7k4fghh0c3uwe63zunykll5und70qg9szha",
  "addr1qyyegwcju83f773mxunjq4wh6hrxk289sjgmv3nsrau74madphptys5te8x0se97gmxxfx28jfg8r7e0rxlsw6qvh7ts76wlyh",
];

export const assetsForCheck = ["asset108xu02ckwrfc8qs9d97mgyh4kn8gdu9w8f5sxk"];

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
  "adb5f8168f006ac4d5e113ce9d846e814d211a1dd42a4595d531c175a3122827",
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
  "drep1qe2l8gw8v7ydswfp9twytxcc3wzwdq8npt55f3vnlgv2u8sx3nt",
  "drep1jnmmkfwpta0yuwjchw0gu6csh75vy62088egy9n67d0zc7sn83m",
  "drep1m8mnpykcjfyax5mcs42whu3dt347u8aq43x45ucs6dv3ztw0lez",
  "drep15mr008j83j7n0aet3rfpw92trx24gc7hjmjdrk50fh9xslp09mx",
  "drep13d6sxkyz6st9h65qqrzd8ukpywhr8swe9f6357qntgjqye0gttd",
  "drep16tsw66jtrver8ur3y3zzq2fl0m4swl4lwk88fvu8d4z4ydukrj0",
  "drep1g2d3y3skgr806wj2ryhhc5ca3akx6vmppde87jq7kgknjmv589e",
];

export const drepDeregistrationsPages = getArrayWithLength(30);

export const drepRegistrationPages = getArrayWithLength(30);

export const drepUpdatesPages = getArrayWithLength(12);

export const govActionListPages = getArrayWithLength(1);

export const govActionIds = [
  "dfdac5921ab657241fce58583d61bef59a369e01d2ba78191d6df6632a07fdfd#0",
  "73a4eb2148781c37ef37c90a33a1d3d00511a8eefe9cdfaa1ea593b090f23f96#0",
  "4b10e5793208cb8f228756e02113227c91602248eac4d992681a0ee760b6c4e2#0",
  "c21b00f90f18fce4003edf42b0b0d455126e01c946e80cc5341a9f9750caf795#0",
  "8845bfc37bb2f69e8f200fe28148b3dea3c4399b0c49ee0ed2bb4e349cab9eb7#0",
  "dc4c679c8cf1cec49817d4d2c1c96cd802ec8a047a11dc0b0bb125b5af0a76cd#0",
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
  "pool1qqqyv9pn9typyqwcxqk5ewpxy5p27g5j2ms58hpp2c2kuzs5z77",
  "pool1lhz4gsk5ezdl5s4mv2kxgrkhzzhad6me2v0xmwuyt845vensdlc",
  "pool1pshqcksxywy68lt04lw6uf35f4yssekh5dx2mxqmyrukke2z5y3",
  "pool1ewrm7y47s9hv6hxku9n5gfnsuspymp0qqpwgvgm9rvm37cek2h6",
  "pool15zrkyr0f80hxlt4scv72tej8l8zwrcphmrega9wutqchjekceal",
  "pool1ukeqarukv9gxwy9pt8jkr4qvad2yf87758g3xzemmvmtk8lrynp",
  "pool166dkk9kx5y6ug9tnvh0dnvxhwt2yca3g5pd5jaqa8t39cgyqqlr",
];

export const policyIds = [
  "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a",
  "a5bb0e5bb275a573d744a021f9b3bff73595468e002755b447e01559",
  "6acb7c816f839148e2140427b181662380e3074616cbcfb0e644df9a",
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
  "c3e28c36c3447315ba5a56f33da6a6ddc1770a876a8d9f0cb3a97c4c",
  "ea07b733d932129c378af627436e7cbc2ef0bf96e0036bb51b3bde6b",
  "0237cc313756ebb5bcfc2728f7bdc6a8047b471220a305aa373b278a",
  "1eae96baf29e27682ea3f815aba361a0c6059d45e4bfbe95bbd2f44a",
];

export const stakeHashes = [
  "stake1u9d6g93fd4t9zqu39q8cr82nh27da3unq65xlq6axglqrlgw7tf77",
  "stake1uyft4e8e4y04xr9w5q0qzst2323afpag4wd8wszpkyrqp8g4s4uh0",
  "stake1uyks0cfjn3xh6qpl5qzxc3tlu50qnn3x69gsf22gc7wgkhs0hfn5q",
  "stake1u8dmlrdc9l3f8rfs34k48rjtfm46wdgx2yd5fdvznfhapact9zemk",
  "stake1uyjm2lgwqx7k2ldhlh0t255tmhug78vag3wfjt0l6wfkl8s4kxfmr",
];

export const stakeDeregistrationsPages = getArrayWithLength(50);

export const stakeRegistrationsPages = getArrayWithLength(50);

export const withdrawalsPages = getArrayWithLength(50);

export const tokenDashboardTabs = ["tokens", "global_activity", "exchange"];

export const treasuryDonationTabs = ["dontations", "stats"];

export const txHashes = [
  "6b21e798732e71476ffe04740eed4008333f606c6662a3dce8deaa8d489c322a",
  "58ebfba6a70236c6f9069e41307044e7b6774ad8467bcb15c9e1fd0bcd0a36b3",
  "3efd4f2d728f3a5fe3124045e4b67beaa4785fff2f617b4494b53eca1ca193e5",
];
