/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const path = require("path");

function getConfig() {
  let configName = "preprod-stage";

  if (process.env.VITE_APP_CONFIG) {
    configName = process.env.VITE_APP_CONFIG;
  } else {
    const envPath = path.join(__dirname, "../../.env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const match = envContent.match(/VITE_APP_CONFIG=(.+)/);
      if (match) {
        configName = match[1].trim();
      }
    }
  }

  const configPath = path.join(__dirname, `../${configName}.json`);

  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  return config;
}

const configJSON = getConfig();
const API_URL = configJSON.api[0].endpoint;

const routes = [
  {
    path: "/about-us",
    title: "About Us | Cexplorer.io",
    description:
      "Discover the mission, vision, and team behind Cexplorer.io — the most advanced Cardano blockchain explorer designed for accuracy, speed, and transparency. Learn about our commitment to providing the best blockchain exploration experience for the Cardano community.",
    keywords:
      "Cexplorer team, Cardano explorer, blockchain analytics, mission, transparency, about Cexplorer, company vision, platform development",
    api: false,
  },
  {
    path: "/ada-price",
    title: "ADA Price | Cexplorer.io",
    description:
      "Track the real-time price of ADA with Cexplorer.io. Get comprehensive historical data, interactive charts, market trends, trading volume, and detailed price analytics across multiple exchanges and timeframes for informed trading decisions.",
    keywords:
      "ADA price, Cardano price, real-time ADA price, ADA market trends, Cexplorer, cryptocurrency price, market cap, trading volume",
    api: false,
  },
  {
    path: "/address/:address",
    title: "Address %address% detail | Cexplorer.io",
    description:
      "Comprehensive details of Cardano address %address%. View complete transaction history, current balance, tokens and NFTs held, delegation status, rewards earned, and interaction with smart contracts on the blockchain.",
    keywords:
      "address, blockchain, %address%, cexplorer, Cardano address, wallet address, transaction history, balance, address details",
    api: false,
  },
  {
    path: "/address/inspector",
    title: "Address Inspector | Cexplorer.io",
    description:
      "Advanced address inspection tool for in-depth analysis of Cardano addresses. Perform forensic investigation, visualize transaction flows, trace fund movements, and analyze address behavior patterns with powerful analytical tools.",
    keywords:
      "address, inspector, blockchain, address analysis, forensic tools, transaction tracing, Cardano inspector, fund tracking",
    api: false,
  },
  {
    path: "/ads",
    title: "Promotion & Advertising | Cexplorer.io",
    description:
      "Promote your Cardano stake pool, token, dRep, or NFT collection with Cexplorer.io. Access advertising options, PRO promotion packages, visibility boosts, and banner campaigns to reach thousands of active Cardano community members.",
    keywords:
      "Cardano advertising, Cexplorer ads, blockchain promotion, stake pool marketing, NFT promotion, dRep boost, banner ads, Cexplorer PRO",
    api: false,
  },
  {
    path: "/promotion",
    title: "Promotion | Cexplorer.io",
    description:
      "Promote your Cardano project with Cexplorer.io. Boost visibility for your stake pool, token, dRep, or NFT collection through targeted promotion packages and advertising options.",
    keywords:
      "Cardano promotion, Cexplorer promotion, blockchain advertising, stake pool promotion, token promotion, dRep promotion, NFT promotion",
    api: false,
  },
  {
    path: "/analytics",
    title: "Analytics | Cexplorer.io",
    description:
      "Dive into comprehensive blockchain analytics on Cexplorer.io. Explore interactive dashboards, network trends, transaction metrics, staking statistics, and actionable insights to make data-driven decisions about Cardano ecosystem participation.",
    keywords:
      "blockchain analytics, data insights, blockchain trends, Cexplorer, analytics dashboard, network metrics, data visualization",
    api: false,
  },
  {
    path: "/analytics/account",
    title: "Account Analytics | Cexplorer.io",
    description:
      "Advanced account analytics providing deep insights into Cardano account behavior. Analyze transaction patterns, balance fluctuations, staking rewards, portfolio composition, and compare performance against network averages.",
    keywords:
      "account, analytics, blockchain, account analysis, performance metrics, portfolio analytics, transaction patterns, balance tracking",
    api: false,
  },
  {
    path: "/analytics/network",
    title: "Network Analytics | Cexplorer.io",
    description:
      "Comprehensive Cardano network analytics with real-time and historical insights. Monitor transaction throughput, block production, active addresses, stake distribution, protocol parameters, and network health indicators.",
    keywords:
      "network, analytics, blockchain, cexplorer, network metrics, blockchain health, performance analysis, Cardano network statistics",
    api: false,
  },
  {
    path: "/analytics/pool",
    title: "Pool Analytics | Cexplorer.io",
    description:
      "In-depth stake pool analytics with performance metrics and competitive analysis. Compare pool returns, blocks produced, saturation levels, fees, delegator retention, and identify optimal pools for staking.",
    keywords:
      "pool, analytics, cexplorer, stake pool analytics, pool performance, pool comparison, delegation analysis, staking metrics",
    api: false,
  },
  {
    path: "/analytics/genesis",
    title: "Genesis Addresses | Cexplorer.io",
    description:
      "Explore the original Cardano genesis addresses from the blockchain launch. View initial ADA distribution, current balances, first and last activity timestamps, and track the historical allocation of ADA from the genesis block.",
    keywords:
      "genesis addresses, Cardano genesis, initial distribution, genesis block, ADA allocation, Cexplorer, blockchain launch, original addresses",
    api: false,
  },
  {
    path: "/api",
    title: "API Plans | Cexplorer.io",
    description:
      "Access Cardano blockchain data effortlessly with Cexplorer.io API. Choose from Starter, Basic, or PRO plans with flexible rate limits, comprehensive documentation, and priority support for developers building on Cardano.",
    keywords:
      "Cexplorer API, Cardano API, blockchain data, API plans, Cardano developer tools, Cexplorer PRO, NFT API access, blockchain analytics API",
    api: false,
  },
  {
    path: "/article",
    title: "Articles | Cexplorer.io",
    description:
      "Stay updated with the latest Cardano news, insights, and project highlights. Explore educational articles on blockchain technology, staking guides, governance tutorials, protocol developments, and ecosystem innovations.",
    keywords:
      "Cardano articles, Cexplorer news, blockchain insights, Cardano projects, staking, governance, Catalyst, Hydra, Midnight, Cardano ecosystem",
    api: false,
  },
  {
    path: "/article/:url",
    title: "%name%",
    description: "%description%",
    keywords: "%keywords%",
    api: `${API_URL}/article/detail?type=article&url=%url%&lng=%lng%`,
    image: "%image%"
  },
  {
    path: "/wiki",
    title: "Cardano Wiki | Cexplorer.io",
    description:
      "Learn about Cardano blockchain with comprehensive wiki articles. Explore short guides covering core mechanisms, staking, wallets, governance, smart contracts, and essential Cardano concepts explained in easy-to-understand format.",
    keywords:
      "Cardano wiki, blockchain guide, Cardano education, staking guide, wallet guide, Cardano tutorial, learn Cardano, blockchain basics, Cexplorer wiki",
    api: false,
  },
  {
    path: "/wiki/:url",
    title: "%name% | Wiki | Cexplorer.io",
    description: "%description%",
    keywords: "%keywords%",
    api: `${API_URL}/article/detail?type=wiki&url=%url%&lng=%lng%`,
  },
  {
    path: "/asset",
    title: "Assets | Cexplorer.io",
    description:
      "Comprehensive list of all native assets on the Cardano blockchain. Explore tokens and NFTs, search by name or policy, filter by categories, and view detailed information including supply, holders, and transaction history.",
    keywords:
      "assets, blockchain, cexplorer, Cardano assets, native tokens, NFTs, token list, digital assets, asset explorer",
    api: false,
  },
  {
    path: "/asset/:fingerprint",
    title: "Asset %fingerprint% | Cexplorer.io",
    description:
      "Detailed information about asset %fingerprint% on the Cardano blockchain. View comprehensive token metadata, minting policy details, complete transaction history, current holder distribution, and trading activity for this native asset.",
    keywords:
      "Cardano asset, %fingerprint%, token details, NFT details, asset fingerprint, Cexplorer, asset metadata, minting policy",
    api: false,
  },
  {
    path: "/asset/recent-nfts",
    title: "Recent NFTs | Cexplorer.io",
    description:
      "Explore the latest NFTs minted on the Cardano blockchain. Discover newly created collections, digital artwork, and unique assets in real-time as they are minted and launched on the network.",
    keywords:
      "recent NFTs, Cardano NFTs, latest NFTs, new NFT collections, blockchain NFTs, Cexplorer, newly minted NFTs, digital art",
    api: false,
  },
  {
    path: "/asset/recent-tokens",
    title: "Recent Tokens | Cexplorer.io",
    description:
      "Browse the newest native tokens created on the Cardano blockchain. Track fresh token launches, minting policies, and emerging projects entering the Cardano ecosystem with detailed information.",
    keywords:
      "recent tokens, Cardano tokens, new tokens, latest tokens, token launches, Cexplorer, native assets, token minting",
    api: false,
  },
  {
    path: "/block",
    title: "Blocks | Cexplorer.io",
    description:
      "View the complete list of blocks on the Cardano blockchain. Track block production in real-time, monitor timestamps, slot numbers, block sizes, transaction counts, and identify block producers across epochs.",
    keywords:
      "Cardano blocks, blockchain blocks, block explorer, block list, Cexplorer, block production, blockchain ledger",
    api: false,
  },
  {
    path: "/block/:hash",
    title: "Block %hash% | Cexplorer.io",
    description:
      "Detailed information about block %hash% on the Cardano blockchain. View block size, number of transactions, slot number, epoch, confirmation count, producing stake pool, and all transactions included in this block.",
    keywords:
      "block details, %hash%, Cardano block, block hash, block explorer, Cexplorer, block transactions, slot number",
    api: false,
  },
  {
    path: "/bots",
    title: "Bots & Integrations | Cexplorer.io",
    description:
      "Integrate Cexplorer.io with your favorite platforms using our bot ecosystem. Access Telegram bots for instant notifications, Discord integrations for community updates, and automated monitoring tools to track Cardano blockchain activity directly in your preferred messaging apps.",
    keywords:
      "Cexplorer bots, Telegram bot, Discord bot, blockchain notifications, Cardano integrations, automation tools, messaging integration",
    api: false,
  },
  {
    path: "/bounty",
    title: "Bounty Program | Cexplorer.io",
    description:
      "Join the Cexplorer.io bounty program and earn rewards for your contributions. Report bugs, identify security vulnerabilities, suggest new features, and help improve the platform while receiving compensation for valuable input.",
    keywords:
      "Cexplorer bounty, bug bounty, rewards program, blockchain bounty, Cardano contributions, security research, community rewards",
    api: false,
  },
  {
    path: "/brand-assets",
    title: "Brand Assets | Cexplorer.io",
    description:
      "Download official Cexplorer.io logos, brand guidelines, and marketing materials. Access high-resolution assets, color schemes, typography guidelines, and usage instructions for promotional content, partnerships, and media coverage.",
    keywords:
      "Cexplorer logo, brand assets, brand guidelines, marketing materials, press kit, Cexplorer branding, media resources",
    api: false,
  },
  {
    path: "/contact-us",
    title: "Contact Us | Cexplorer.io",
    description:
      "Get in touch with the Cexplorer.io team for any inquiries. Send feedback, ask questions, propose partnerships, request technical support, or discuss advertising opportunities through our contact channels.",
    keywords:
      "contact Cexplorer, support, feedback, partnership, customer service, Cexplorer team, inquiries, technical support",
    api: false,
  },
  {
    path: "/contract/interactions",
    title: "Smart Contract Interactions | Cexplorer.io",
    description:
      "Track smart contract interactions on the Cardano blockchain in real-time. Monitor Plutus script executions, contract calls, validator activity, and decentralized application transactions with detailed execution data and status information.",
    keywords:
      "smart contract interactions, Plutus contracts, DApp activity, contract executions, Cardano contracts, Cexplorer, script activity",
    api: false,
  },
  {
    path: "/contributors",
    title: "Contributors | Cexplorer.io",
    description:
      "Meet the contributors and supporters behind Cexplorer.io. Discover community members, developers, designers, content creators, and project partners who actively contribute to building and improving the most comprehensive Cardano blockchain explorer.",
    keywords:
      "Cexplorer contributors, community, developers, supporters, Cardano community, open source, project contributors, team members",
    api: false,
  },
  {
    path: "/datum",
    title: "Datum Viewer | Cexplorer.io",
    description:
      "Decode and view datum data from Cardano smart contracts with our powerful datum viewer. Analyze transaction metadata, Plutus script data structures, CBOR-encoded information, and contract state data in human-readable format.",
    keywords:
      "datum viewer, Plutus datum, smart contract data, transaction metadata, CBOR decoder, Cexplorer, datum decode, contract data",
    api: false,
  },
  {
    path: "/handle-dns",
    title: "$handle DNS | Cexplorer.io",
    description:
      "Explore and validate ADA Handles on Cardano. View recently minted handles, check handle availability, and resolve handles to their associated addresses and metadata using the Cardano Domain Name Service standard.",
    keywords:
      "$handle, ADA Handle, Cardano DNS, handle resolver, handle validator, domain name service, Cexplorer, handle lookup",
    api: false,
  },
  {
    path: "/dev",
    title: "Developer Tools | Cexplorer.io",
    description:
      "Access developer tools for building on Cardano. Explore address inspector, datum inspector, Cexplorer API, SDK, and connect with our community through Discord and GitHub.",
    keywords:
      "Cardano developer tools, address inspector, datum inspector, Cexplorer API, SDK, developer resources, blockchain tools, Cardano development",
    api: false,
  },
  {
    path: "/envs",
    title: "Environments | Cexplorer.io",
    description:
      "Comprehensive resources for developers building on Cardano. Access detailed API documentation, integration guides, code examples, SDKs in multiple languages, technical tutorials, and developer tools to accelerate your blockchain application development.",
    keywords:
      "Cardano developers, API documentation, developer tools, blockchain integration, SDK, Cexplorer API, developer resources, coding guides",
    api: false,
  },
  {
    path: "/devlog",
    title: "Development Log | Cexplorer.io",
    description:
      "Follow the latest Cexplorer.io platform updates and development progress. View detailed changelog with feature releases, improvements, bug fixes, performance optimizations, and technical enhancements being continuously deployed to the platform.",
    keywords:
      "Cexplorer devlog, changelog, platform updates, feature releases, development updates, technical news, version history, release notes",
    api: false,
  },
  {
    path: "/dex/swap/:hash",
    title: "DEX Swap %hash% | Cexplorer.io",
    description:
      "Detailed information about decentralized exchange swap transaction %hash% on Cardano. View swap amounts, tokens exchanged, exchange rates, liquidity pool details, slippage, fees, and complete transaction execution data.",
    keywords:
      "DEX swap, %hash%, Cardano DEX, swap transaction, liquidity pool, decentralized exchange, Cexplorer, token swap, AMM",
    api: false,
  },
  {
    path: "/donate",
    title: "Donate | Cexplorer.io",
    description:
      "Support Cexplorer.io development with your donation. Help us maintain and continuously improve the most comprehensive Cardano blockchain explorer, keeping it free and accessible for the entire community while adding new features and enhancements.",
    keywords:
      "donate, support Cexplorer, blockchain explorer funding, Cardano donations, community support, contribute, financial support",
    api: false,
  },
  {
    path: "/drep",
    title: "Delegated Representatives (DReps) | Cexplorer.io",
    description:
      "Explore all Delegated Representatives (DReps) in Cardano's decentralized governance system. View comprehensive DRep rankings by voting power, delegation amounts, participation rates, voting history, and governance contributions to inform your delegation decisions.",
    keywords:
      "DReps, Delegated Representatives, Cardano governance, voting power, governance delegations, Cexplorer, DRep list, governance delegates",
    api: false,
  },
  {
    path: "/drep/:hash",
    title: "DRep %hash% | Cexplorer.io",
    description:
      "Detailed profile of Delegated Representative %hash% on Cardano. View complete voting history, current delegations, voting power, governance participation statistics, proposals voted on, voting rationale, and DRep metadata including statements and credentials.",
    keywords:
      "DRep details, %hash%, Delegated Representative, Cardano governance, voting history, Cexplorer, DRep profile, governance votes",
    api: false,
  },
  {
    path: "/drep/deregistrations",
    title: "DRep Deregistrations | Cexplorer.io",
    description:
      "Track recent DRep deregistrations on the Cardano blockchain. Monitor Delegated Representatives who have withdrawn from governance participation, view deregistration transactions, and understand changes in the governance representative landscape.",
    keywords:
      "DRep deregistrations, governance withdrawals, Cardano DReps, deregistered representatives, Cexplorer, DRep retirement, governance changes",
    api: false,
  },
  {
    path: "/drep/registrations",
    title: "DRep Registrations | Cexplorer.io",
    description:
      "View the latest DRep registrations on Cardano blockchain. Discover new Delegated Representatives joining the governance system, review their credentials, mission statements, and metadata as they enter the decentralized governance ecosystem.",
    keywords:
      "DRep registrations, new DReps, Cardano governance, Delegated Representatives, governance participation, Cexplorer, new delegates",
    api: false,
  },
  {
    path: "/drep/updates",
    title: "DRep Updates | Cexplorer.io",
    description:
      "Track recent updates to DRep metadata and information on Cardano. Monitor changes in Delegated Representative profiles, metadata anchors, governance commitments, and credential updates to stay informed about your chosen representatives.",
    keywords:
      "DRep updates, metadata changes, governance updates, Delegated Representatives, profile updates, Cexplorer, DRep modifications",
    api: false,
  },
  {
    path: "/education",
    title: "Educational Resources | Cexplorer.io",
    description:
      "Learn about Cardano blockchain technology, staking mechanisms, on-chain governance, smart contracts, and DeFi protocols. Access comprehensive guides, step-by-step tutorials, and educational content designed for beginners through advanced users.",
    keywords:
      "Cardano education, blockchain tutorials, staking guide, governance learning, Cardano resources, Cexplorer, blockchain learning, educational content",
    api: false,
  },
  {
    path: "/epoch",
    title: "Epochs | Cexplorer.io",
    description:
      "Browse all Cardano blockchain epochs with complete historical data. Track epoch progress, view staking snapshots, monitor rewards distribution, analyze active stake pools, and review network parameter changes across the entire Cardano timeline.",
    keywords:
      "Cardano epochs, epoch history, staking epochs, network timeline, epoch data, Cexplorer, epoch list, blockchain epochs",
    api: false,
  },
  {
    path: "/epoch/:no",
    title: "Epoch %no% | Cexplorer.io",
    description:
      "Detailed information about Cardano epoch %no%. View total blocks produced, transaction count, staking snapshot data, rewards distribution, active stake pools, block producers, fees collected, and all epoch-specific protocol parameters.",
    keywords:
      "epoch %no%, Cardano epoch, epoch details, staking snapshot, epoch rewards, Cexplorer, epoch statistics, epoch data",
    api: false,
  },
  {
    path: "/epoch/calendar",
    title: "Epoch Calendar | Cexplorer.io",
    description:
      "Visualize Cardano epochs in an interactive calendar format. Track past, current, and upcoming epochs with precise timestamps, duration calculations, boundary transitions, and plan your staking activities around the epoch schedule.",
    keywords:
      "epoch calendar, Cardano timeline, epoch schedule, blockchain calendar, epoch dates, Cexplorer, epoch planning, time tracking",
    api: false,
  },
  {
    path: "/faq",
    title: "Frequently Asked Questions | Cexplorer.io",
    description:
      "Find answers to common questions about Cexplorer.io features, Cardano blockchain fundamentals, staking procedures, governance participation, NFT exploration, native tokens, and tips for effectively using the blockchain explorer.",
    keywords:
      "FAQ, Cexplorer help, common questions, Cardano FAQ, blockchain questions, support, help center, troubleshooting",
    api: false,
  },
  {
    path: "/gov",
    title: "Governance | Cexplorer.io",
    description:
      "Explore Cardano's on-chain decentralized governance system. Track all governance actions, monitor voting activity, review proposals, discover DReps, follow Constitutional Committee decisions, and participate in shaping Cardano's future through informed governance engagement.",
    keywords:
      "Cardano governance, on-chain governance, voting, proposals, DReps, Constitutional Committee, Cexplorer, decentralized governance, CIP-1694",
    api: false,
  },
  {
    path: "/gov/action",
    title: "Governance Actions | Cexplorer.io",
    description:
      "View all governance actions submitted on Cardano blockchain. Browse proposals by category including protocol parameter changes, treasury withdrawals, hard fork initiations, Constitutional Committee updates, and info actions with complete voting data.",
    keywords:
      "governance actions, Cardano proposals, voting actions, governance proposals, on-chain governance, Cexplorer, action list, proposal tracking",
    api: false,
  },
  {
    path: "/gov/action/:id",
    title: "Governance Action %id% | Cexplorer.io",
    description:
      "Detailed information about governance action %id% on Cardano. View complete proposal details, real-time voting results, proposer rationale, metadata documents, individual votes cast by DReps and SPOs, and current action status.",
    keywords:
      "governance action, %id%, proposal details, voting results, Cardano governance, Cexplorer, action status, vote tracking",
    api: false,
  },
  {
    path: "/gov/cc",
    title: "Constitutional Committee | Cexplorer.io",
    description:
      "Track the Cardano Constitutional Committee members and their governance activities. View committee composition, individual member voting records, participation rates, constitutional oversight decisions, and their role in Cardano's governance framework.",
    keywords:
      "Constitutional Committee, CC members, Cardano governance, committee voting, governance oversight, Cexplorer, constitutional oversight, committee members",
    api: false,
  },
  {
    path: "/gov/constitution",
    title: "Constitution | Cexplorer.io",
    description:
      "View the Cardano Constitution history including the current constitution, past constitutions, and proposed constitutional amendments. Track governance actions related to constitutional changes and their ratification status.",
    keywords:
      "Cardano Constitution, constitutional history, governance, constitutional amendments, Cexplorer, Cardano governance, constitution text",
    api: false,
  },
  {
    path: "/gov/cc/:coldKey",
    title: "CC Member %name% | Cexplorer.io",
    description:
      "Detailed profile of Constitutional Committee member %name% (cold key: %coldKey%) on Cardano. View complete voting history, hot keys, governance participation statistics, proposals voted on, status history, registration details, and term information.",
    keywords:
      "CC member details, %coldKey%, Constitutional Committee member, Cardano governance, voting history, Cexplorer, CC member profile, committee votes, governance oversight",
    api: false,
  },
  {
    path: "/gov/drep-vote",
    title: "DRep Votes | Cexplorer.io",
    description:
      "Browse all votes cast by Delegated Representatives on Cardano governance actions. Analyze DRep voting patterns, track individual voting decisions, compare voting behaviors, and understand how representatives participate in blockchain governance.",
    keywords:
      "DRep votes, Delegated Representative voting, governance votes, voting activity, Cardano governance, Cexplorer, voting patterns, DRep decisions",
    api: false,
  },
  {
    path: "/gov/power-thresholds",
    title: "Governance Power Thresholds | Cexplorer.io",
    description:
      "View the voting power thresholds required for different governance action types on Cardano. Understand quorum requirements, approval percentages, security parameters, and the voting power needed for each category of governance proposal to pass.",
    keywords:
      "governance thresholds, voting power, quorum requirements, governance parameters, Cardano governance, Cexplorer, voting thresholds, approval requirements",
    api: false,
  },
  {
    path: "/gov/vote",
    title: "Governance Votes | Cexplorer.io",
    description:
      "Track all governance votes cast on Cardano proposals in real-time. Monitor comprehensive voting activity from Delegated Representatives (DReps), Stake Pool Operators (SPOs), and Constitutional Committee members across all governance actions.",
    keywords:
      "governance votes, voting activity, Cardano voting, proposal votes, governance participation, Cexplorer, vote tracking, governance decisions",
    api: false,
  },
  {
    path: "/gov/vote/:hash",
    title: "Vote %hash% | Cexplorer.io",
    description:
      "Detailed information about governance vote transaction %hash% on Cardano. View voter identity and type, vote choice (Yes/No/Abstain), voting power contributed, governance action voted on, transaction timestamp, and complete on-chain vote data.",
    keywords:
      "vote details, %hash%, governance vote, voting transaction, Cardano governance, Cexplorer, vote transaction, voter information",
    api: false,
  },
  {
    path: "/groups",
    title: "Stake Pool Groups | Cexplorer.io",
    description:
      "Explore stake pool groups and multi-pool operators on Cardano blockchain. View group statistics, combined delegation amounts, aggregated performance metrics, pool portfolios, and understand decentralization through multi-pool operator analysis.",
    keywords:
      "stake pool groups, multi-pool operators, pool groups, group statistics, Cardano pools, Cexplorer, MPO, pool portfolios",
    api: false,
  },
  {
    path: "/groups/:url",
    title: "%groupName% Pool Group | Cexplorer.io",
    description:
      "Detailed information about %groupName% stake pool group on Cardano. View all pools operated by this group, combined statistics, total delegation across pools, individual pool performance, group rewards history, and operator information.",
    keywords:
      "%groupName%, stake pool group, multi-pool operator, group pools, delegation, Cexplorer, pool operator, group statistics",
    api: false,
  },
  {
    path: "/hardfork",
    title: "Hard Fork History | Cexplorer.io",
    description:
      "Track the complete history of Cardano hard forks and protocol upgrades. View major milestones including Byron, Shelley, Allegra, Mary, Alonzo, Babbage, Conway eras, upgrade dates, features introduced, and upcoming planned hard forks.",
    keywords:
      "Cardano hard forks, protocol upgrades, network upgrades, hard fork history, blockchain evolution, Cexplorer, protocol history, era transitions",
    api: false,
  },
  {
    path: "/live-delegations",
    title: "Live Delegations | Cexplorer.io",
    description:
      "Watch real-time delegation transactions on the Cardano blockchain as they happen. Monitor live stake delegation changes, pool selections, delegation amounts, re-delegation activity, and staking movements across the network in real-time.",
    keywords:
      "live delegations, real-time delegations, stake delegation, delegation transactions, live staking, Cexplorer, delegation feed, staking activity",
    api: false,
  },
  {
    path: "/metadata",
    title: "Transaction Metadata | Cexplorer.io",
    description:
      "Search and browse transaction metadata on the Cardano blockchain. Explore on-chain messages, transaction labels, structured JSON data, CIP-20 metadata, NFT metadata, and discover the rich information embedded in Cardano transactions.",
    keywords:
      "transaction metadata, on-chain metadata, blockchain messages, metadata search, Cardano metadata, Cexplorer, CIP-20, transaction labels",
    api: false,
  },
  {
    path: "/multi-pool-delegations",
    title: "Multi-Pool Delegations | Cexplorer.io",
    description:
      "View accounts delegating to multiple stake pools across different wallet addresses. Track diversified staking strategies, portfolio risk management, multi-pool delegation patterns, and how delegators spread their stake for decentralization.",
    keywords:
      "multi-pool delegation, diversified staking, multiple pools, delegation strategy, Cardano staking, Cexplorer, portfolio staking, delegation diversity",
    api: false,
  },
  {
    path: "/new-pools",
    title: "New Stake Pools | Cexplorer.io",
    description:
      "Discover the newest stake pools recently launched on Cardano blockchain. Browse freshly registered pools, view their metadata, learn about operators, check initial parameters, and support new SPOs entering the Cardano ecosystem.",
    keywords:
      "new stake pools, recent pools, pool registrations, new SPOs, Cardano pools, Cexplorer, fresh pools, pool launches",
    api: false,
  },
  {
    path: "/newsletter",
    title: "Newsletter | Cexplorer.io",
    description:
      "Subscribe to the Cexplorer.io newsletter and receive weekly Cardano ecosystem updates, platform feature announcements, governance highlights, protocol developments, staking insights, and comprehensive blockchain analytics delivered to your inbox.",
    keywords:
      "Cexplorer newsletter, Cardano updates, weekly newsletter, blockchain news, subscribe, Cexplorer updates, email subscription, ecosystem news",
    api: false,
  },
  {
    path: "/policy/:policyId",
    title: "Policy %policyId% | Cexplorer.io",
    description:
      "Detailed information about minting policy %policyId% on Cardano. View all assets minted under this policy, minting transactions, policy script details, token collection information, total supply, and whether the policy is time-locked or multi-signature.",
    keywords:
      "minting policy, %policyId%, policy details, token policy, NFT collection, asset policy, Cexplorer, policy script, minting info",
    api: false,
  },
  {
    path: "/polls",
    title: "Community Polls | Cexplorer.io",
    description:
      "Participate in Cardano community polls and surveys hosted on Cexplorer.io. Vote on ecosystem topics, share your opinions on platform features, engage with the blockchain community, and help shape community decisions through democratic polling.",
    keywords:
      "Cardano polls, community voting, surveys, community engagement, blockchain polls, Cexplorer, voting, community feedback",
    api: false,
  },
  {
    path: "/polls/:poll",
    title: "%pollTitle% | Cexplorer.io",
    description:
      "View results and detailed information for community poll: %pollTitle%. See comprehensive voting statistics, participation numbers, vote distribution, community sentiment analysis, and trending opinions on this important ecosystem topic.",
    keywords:
      "poll results, %pollTitle%, community voting, poll statistics, Cardano community, Cexplorer, voting results, poll data",
    api: false,
  },
  {
    path: "/pool",
    title: "Stake Pools | Cexplorer.io",
    description:
      "Browse all Cardano stake pools with advanced filtering and comparison tools. Compare pool performance metrics, fee structures, saturation levels, delegation amounts, reward history, and detailed pool statistics to find the optimal pool for your staking strategy.",
    keywords:
      "Cardano stake pools, pool list, pool comparison, staking pools, SPO, pool rankings, Cexplorer, pool directory, stake pool list",
    api: false,
  },
  {
    path: "/pool-awards",
    title: "Pool Awards | Cexplorer.io",
    description:
      "Discover award-winning and top-performing Cardano stake pools recognized by the community. View pools honored for exceptional performance, community contributions, innovation, reliability, and commitment to Cardano ecosystem growth and decentralization.",
    keywords:
      "stake pool awards, top pools, award-winning pools, best pools, pool recognition, Cexplorer, pool achievements, excellence awards",
    api: false,
  },
  {
    path: "/pool-birthdays",
    title: "Pool Birthdays | Cexplorer.io",
    description:
      "Celebrate stake pool anniversaries and operational milestones on Cardano. Track pool age since registration, view upcoming pool birthdays, recognize long-standing operators, and honor their continuous contribution to network decentralization and security.",
    keywords:
      "pool birthdays, pool anniversaries, pool age, stake pool milestones, Cardano pools, Cexplorer, pool celebration, operator loyalty",
    api: false,
  },
  {
    path: "/pool-list",
    title: "Pool List | Cexplorer.io",
    description:
      "Track recent stake pool  updates, parameter modifications, relay changes, and pool certificate updates on Cardano. Monitor pools adjusting their configuration, updating metadata, changing fees, or modifying operational parameters.",
    keywords: "pools, blockchain, cexplorer",
    api: false,
  },
  {
    path: "/pool-updates",
    title: "Pool Updates | Cexplorer.io",
    description:
      "Track recent stake pool metadata updates, parameter modifications, relay changes, and pool certificate updates on Cardano. Monitor pools adjusting their configuration, updating metadata, changing fees, or modifying operational parameters.",
    keywords:
      "pool updates, metadata updates, pool changes, certificate updates, stake pool updates, Cexplorer, parameter changes, pool modifications",
    api: false,
  },
  {
    path: "/pool/:id",
    title: "Pool %name% (%ticker%) | Cexplorer.io",
    description:
      "Detailed information about stake pool %poolName% with ticker %ticker%. View comprehensive performance metrics, lifetime blocks minted, current delegation, fee structure, rewards history, saturation level, pledge amount, and complete pool operational history.",
    keywords:
      "stake pool, %poolName%, %poolTicker%, pool details, pool performance, Cardano staking, Cexplorer, pool stats, delegation",
      api: `${API_URL}/pool/detail?pool_id=%id%`,


  },
  {
    path: "/pool/deregistrations",
    title: "Pool Deregistrations | Cexplorer.io",
    description:
      "Track stake pool retirements and deregistrations on Cardano blockchain. Monitor pools announcing shutdown, view planned retirement epochs, understand operator transitions, and identify pools delegators should move away from.",
    keywords:
      "pool deregistrations, pool retirements, retired pools, pool shutdown, Cardano pools, Cexplorer, pool retirement, SPO shutdown",
    api: false,
  },
  {
    path: "/pool/registrations",
    title: "Pool Registrations | Cexplorer.io",
    description:
      "View the latest stake pool registrations on Cardano blockchain. Discover new pools entering the network, review operator information, check initial pool parameters, and explore fresh staking opportunities from newly launched SPOs.",
    keywords:
      "pool registrations, new pools, pool launches, stake pool registration, Cardano SPOs, Cexplorer, pool creation, new operators",
    api: false,
  },
  {
    path: "/pot",
    title: "Rewards Pot | Cexplorer.io",
    description:
      "Track the Cardano rewards pot, treasury funds, and monetary reserves. Monitor available staking rewards, treasury balance, reserve distribution, protocol monetary parameters, and understand Cardano's economic model and reward funding mechanisms.",
    keywords:
      "rewards pot, Cardano treasury, reserves, protocol funds, monetary policy, reward reserves, Cexplorer, ADA reserves, treasury balance",
    api: false,
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Cexplorer.io",
    description:
      "Read the Cexplorer.io privacy policy and understand our data practices. Learn how we collect, use, store, and protect your personal data while you explore the Cardano blockchain, and review your privacy rights and our GDPR compliance.",
    keywords:
      "privacy policy, data protection, user privacy, Cexplorer privacy, data security, GDPR, privacy rights, data handling",
    api: false,
  },
  {
    path: "/pro",
    title: "Cexplorer PRO | Cexplorer.io",
    description:
      "Unlock premium features with Cexplorer PRO subscription. Get advanced analytics dashboards, priority API access with higher limits, enhanced stake pool promotion, custom alert notifications, exclusive tools, and dedicated support for power users.",
    keywords:
      "Cexplorer PRO, premium features, PRO subscription, advanced analytics, priority access, pool promotion, premium membership, exclusive features",
    api: false,
  },
  {
    path: "/profile",
    title: "User Profile | Cexplorer.io",
    description:
      "Manage your Cexplorer.io user account profile and preferences. Configure platform settings, organize watchlists, customize notifications, manage API keys, set alerts, and personalize your blockchain explorer experience for optimal workflow.",
    keywords:
      "user profile, account settings, Cexplorer account, watchlist, notifications, API keys, profile management, user preferences",
    api: false,
  },
  {
    path: "/retired-delegations",
    title: "Retired Pool Delegations | Cexplorer.io",
    description:
      "View delegations to retired and inactive stake pools that no longer produce blocks. Monitor stakes that need immediate redelegation to active pools for continued reward earning and identify delegators affected by pool retirements.",
    keywords:
      "retired delegations, inactive pools, retired pools, delegation warnings, redelegate, Cexplorer, pool retirement, inactive stakes",
    api: false,
  },
  {
    path: "/rewards-checker",
    title: "Rewards Checker | Cexplorer.io",
    description:
      "Check your Cardano staking rewards with our comprehensive rewards calculator. Enter your stake address to view complete reward history, expected upcoming rewards, current delegation status, ROA calculations, and detailed earnings analysis.",
    keywords:
      "rewards checker, staking rewards, ADA rewards, reward calculator, delegation rewards, Cexplorer, ROA calculator, earnings tracker",
    api: false,
  },
  {
    path: "/script",
    title: "Smart Contracts | Cexplorer.io",
    description:
      "Explore Plutus smart contracts deployed on Cardano blockchain. Browse script hashes, analyze contract types (PlutusV1, PlutusV2, PlutusV3), monitor executions, and track decentralized application activity across the network.",
    keywords:
      "smart contracts, Plutus scripts, contract scripts, DApp contracts, Cardano scripts, Cexplorer, Plutus, validators",
    api: false,
  },
  {
    path: "/script/:hash",
    title: "Script %hash% | Cexplorer.io",
    description:
      "Detailed information about smart contract script %hash% on Cardano. View script type and version, CBOR serialization, all transactions using this script, execution history, success rates, and associated decentralized applications.",
    keywords:
      "script details, %hash%, smart contract, Plutus script, script hash, Cardano contract, Cexplorer, script analysis",
    api: false,
  },
  {
    path: "/stake/:stakeAddr",
    title: "Stake Address %stakeAddr% | Cexplorer.io",
    description:
      "Detailed information about stake address %stakeAddr% on Cardano. View current delegation and pool selection, complete rewards history, controlled payment addresses, governance voting participation, withdrawal history, and all staking-related activity.",
    keywords:
      "stake address, %stakeAddr%, delegation, staking rewards, reward history, Cardano staking, Cexplorer, stake key, rewards account",
    api: false,
  },
  {
    path: "/stake/deregistrations",
    title: "Stake Deregistrations | Cexplorer.io",
    description:
      "Track recent stake address deregistrations on Cardano blockchain. Monitor accounts withdrawing from the staking system, recovering their registration deposits, and exiting active participation in network consensus.",
    keywords:
      "stake deregistrations, staking withdrawals, deregistered stakes, deposit recovery, Cardano staking, Cexplorer, stake key deregistration",
    api: false,
  },
  {
    path: "/stake/registrations",
    title: "Stake Registrations | Cexplorer.io",
    description:
      "View the latest stake address registrations on Cardano blockchain. Discover new participants joining the staking ecosystem, monitor network growth, and track fresh accounts beginning their staking journey on Cardano.",
    keywords:
      "stake registrations, new stakers, staking registrations, Cardano staking, new delegations, Cexplorer, stake key registration, new participants",
    api: false,
  },
  {
    path: "/status",
    title: "Network Status | Cexplorer.io",
    description:
      "Check Cardano blockchain network status and real-time health metrics. Monitor current epoch progress, block production rate, node synchronization status, network uptime, latest blocks, and comprehensive network statistics and performance indicators.",
    keywords:
      "network status, Cardano status, blockchain health, node status, network statistics, Cexplorer, network uptime, system status",
    api: false,
  },
  {
    path: "/swap",
    title: "Token Swap | Cexplorer.io",
    description:
      "Swap Cardano native tokens directly on Cexplorer.io with DexHunter integration. Trade ADA and native assets through decentralized exchanges with real-time price charts, market data, limit orders, and seamless wallet integration for secure token swapping.",
    keywords:
      "token swap, Cardano swap, DEX swap, DexHunter, token exchange, ADA swap, native asset swap, decentralized exchange, Cexplorer, token trading",
    api: false,
  },
  {
    path: "/terms",
    title: "Terms of Service | Cexplorer.io",
    description:
      "Read the Cexplorer.io terms of service and legal agreements. Understand platform usage policies, user responsibilities, acceptable use guidelines, disclaimers, and legal terms governing your use of the blockchain explorer.",
    keywords:
      "terms of service, user agreement, TOS, usage terms, legal terms, Cexplorer policies, legal agreement, service terms",
    api: false,
  },
  {
    path: "/tax-tool",
    title: "Tax Tool | Cexplorer.io",
    description:
      "Calculate and track your Cardano staking rewards for tax purposes. View withdrawal history with real-time exchange rates in multiple currencies, export detailed reports, and simplify your cryptocurrency tax reporting with comprehensive ADA rewards data.",
    keywords:
      "cardano, tax tool, staking rewards, withdrawals, tax reporting, ADA rewards, cexplorer, crypto tax, reward history, tax calculator",
    api: false,
  },
  {
    path: "/rewards-calculator",
    title: "Rewards Calculator | Cexplorer.io",
    description:
      "Calculate your potential Cardano rewards with our advanced rewards calculator. Estimate future ADA earnings based on stake amount, pool performance, and network parameters to make informed decisions.",
    keywords:
      "cardano, rewards calculator, ADA rewards calculator, rewards, ADA calculator, rewards estimator, cexplorer, cardano calculator",
    api: false,
  },
  {
    path: "/token/dashboard",
    title: "Token Dashboard | Cexplorer.io",
    description:
      "Comprehensive analytics dashboard for Cardano native tokens. Track ecosystem-wide token statistics, monitor market activity, analyze minting trends, view top tokens by metrics, and explore detailed native asset ecosystem data.",
    keywords:
      "token dashboard, Cardano tokens, token statistics, token metrics, native tokens, Cexplorer, token analytics, asset dashboard",
    api: false,
  },
  {
    path: "/treasury/donation",
    title: "Treasury Donations | Cexplorer.io",
    description:
      "View voluntary donations to the Cardano treasury fund. Track community contributions supporting ecosystem development, protocol funding, and treasury growth, showing the community's commitment to Cardano's decentralized funding model.",
    keywords:
      "treasury donations, Cardano treasury, voluntary donations, ecosystem funding, protocol donations, Cexplorer, community contributions, treasury support",
    api: false,
  },
  {
    path: "/treasury/projection",
    title: "Treasury Projection | Cexplorer.io",
    description:
      "Project Cardano treasury and reserves balance over the next 20 years. Simulate treasury growth based on transaction fees, governance withdrawals, and monetary policy parameters. Visualize long-term sustainability of Cardano's funding model.",
    keywords:
      "treasury projection, Cardano treasury, reserves projection, treasury calculator, monetary policy, treasury simulation, Cexplorer, ADA reserves forecast, treasury sustainability",
    api: false,
  },
  {
    path: "/tx",
    title: "Transactions | Cexplorer.io",
    description:
      "Browse all transactions on the Cardano blockchain in real-time. Track ADA transfers, smart contract interactions, token minting, stake delegation, governance votes, and all types of on-chain activity with advanced filtering options.",
    keywords:
      "Cardano transactions, blockchain transactions, tx explorer, transaction history, on-chain activity, Cexplorer, transaction list, tx feed",
    api: false,
  },
  {
    path: "/tx/:hash",
    title: "Transaction %hash% | Cexplorer.io",
    description:
      "Detailed information about transaction %hash% on Cardano blockchain. View all inputs and outputs, transaction fees, metadata, smart contract executions, certificates, withdrawals, minting operations, and complete transaction breakdown.",
    keywords:
      "transaction details, %hash%, tx hash, transaction explorer, Cardano transaction, Cexplorer, UTXO, tx info",
    api: false,
  },
  {
    path: "/wallet",
    title: "Compare Cardano Wallets | Cexplorer.io",
    description:
      "Compare Cardano wallets side by side. Explore features, supported platforms, hardware wallet compatibility, staking support, governance features, and integrations to find the best wallet for your needs.",
    keywords:
      "compare wallets, Cardano wallets, wallet comparison, best Cardano wallet, wallet features, hardware wallet, staking wallet, Cexplorer, wallet guide",
    api: false,
  },
  {
    path: "/watchlist",
    title: "Watchlist | Cexplorer.io",
    description:
      "Manage your personalized watchlist of addresses, stake pools, tokens, transactions, and governance actions. Set custom alerts, receive notifications, and efficiently monitor important blockchain entities and activity relevant to your interests.",
    keywords:
      "watchlist, address tracking, pool watchlist, favorites, monitoring, custom alerts, Cexplorer, saved items, tracking list",
    api: false,
  },
  {
    path: "/projects",
    title: "Projects | Cexplorer.io",
    description:
      "Explore Cardano ecosystem projects on Cexplorer.io. Browse projects built on the Cardano blockchain, view project details, and discover new initiatives in the ecosystem.",
    keywords:
      "Cardano projects, blockchain projects, Cardano ecosystem, project list, Cexplorer, Cardano development, ecosystem projects",
    api: false,
  },
  {
    path: "/projects/:id",
    title: "Project %id% | Cexplorer.io",
    description:
      "Detailed information about project %id% on Cardano. View project overview, team information, and related blockchain activity.",
    keywords:
      "Cardano project, %id%, project details, blockchain project, Cexplorer, project overview",
    api: false,
  },
  {
    path: "/withdrawals",
    title: "Staking Withdrawals | Cexplorer.io",
    description:
      "Track staking reward withdrawals on Cardano blockchain. Monitor accounts claiming their accumulated staking rewards, view withdrawal amounts, transaction history, and analyze reward claiming patterns across the network.",
    keywords:
      "staking withdrawals, reward claims, reward withdrawals, Cardano withdrawals, claimed rewards, Cexplorer, reward claims, withdrawal history",
    api: false,
  },
];

module.exports = {
  routes,
  API_URL,
};
