import {
  addressesForCheck,
  assetsForCheck,
  blockDetailHashes,
  drepHashes,
  govActionIds,
  policyIds,
  poolsForCheck,
  scriptHashes,
  stakeHashes,
  txHashes,
} from "./page-errors.data";

export interface MobileTablePage {
  name: string;
  url: string;
  rowsToCheck?: number;

  clickTab?: string;
}


export const mobileTablePages: MobileTablePage[] = [

  { name: "Governance Actions list", url: "/gov/action/" },
  { name: "CC Members list", url: "/gov/cc/" },
  {
    name: "CC Governance Votes",
    url: "/gov/cc/",
    clickTab: "governance_vote",
  },
  { name: "Vote list", url: "/gov/vote/" },
  { name: "Constitution", url: "/gov/constitution/" },

 
  { name: "DRep list", url: "/drep/" },
  { name: "DRep registrations", url: "/drep/registrations" },
  { name: "DRep deregistrations", url: "/drep/deregistrations" },
  { name: "DRep updates", url: "/drep/updates" },

 
  { name: "Pool list", url: "/pool/" },
  { name: "Pool registrations", url: "/pool/registrations" },
  { name: "Pool deregistrations", url: "/pool/deregistrations" },
  { name: "Pool awards", url: "/pool-awards/" },
  { name: "Pool birthdays", url: "/pool-birthdays/" },
  { name: "Pool updates", url: "/pool-updates/" },
  { name: "New pools", url: "/new-pools/" },


  { name: "TX list", url: "/tx/" },
  { name: "Block list", url: "/block/" },


  { name: "Asset list", url: "/asset/" },

 
  { name: "Live delegations", url: "/live-delegations/" },
  { name: "Retired delegations", url: "/retired-delegations/" },
  { name: "Multi-pool delegations", url: "/multi-pool-delegations/" },
  { name: "Stake registrations", url: "/stake/registrations" },
  { name: "Stake deregistrations", url: "/stake/deregistrations" },
  { name: "Withdrawals", url: "/withdrawals/" },


  { name: "Contract interactions", url: "/contract/interactions" },
  { name: "Script list", url: "/script/" },
  { name: "Metadata list", url: "/metadata/" },
  { name: "Polls list", url: "/polls/" },
  { name: "Treasury donations", url: "/treasury/donation" },


  { name: "Analytics - Top addresses", url: "/analytics/account" },
  { name: "Analytics - Genesis", url: "/analytics/genesis" },

  ...drepHashes.slice(0, 2).map(hash => ({
    name: `DRep Gov Actions - ${hash.slice(0, 20)}...`,
    url: `/drep/${hash}?tab=governance_actions`,
  })),

 
  ...govActionIds.slice(0, 2).map(id => ({
    name: `Gov Action Voted - ${id.slice(0, 20)}...`,
    url: `/gov/action/${encodeURIComponent(id)}`,
  })),
  ...govActionIds.slice(0, 1).map(id => ({
    name: `Gov Action Status History - ${id.slice(0, 20)}...`,
    url: `/gov/action/${encodeURIComponent(id)}`,
    clickTab: "status_history",
  })),

  
  ...poolsForCheck.slice(0, 2).map(id => ({
    name: `Pool Detail About - ${id.slice(0, 20)}...`,
    url: `/pool/${id}`,
    clickTab: "about",
  })),

  
  ...txHashes.slice(0, 2).map(hash => ({
    name: `TX Detail - ${hash.slice(0, 16)}...`,
    url: `/tx/${hash}`,
  })),

  
  ...assetsForCheck.slice(0, 1).map(fp => ({
    name: `Asset Detail Mints - ${fp.slice(0, 20)}...`,
    url: `/asset/${fp}`,
    clickTab: "mints",
  })),

  
  ...addressesForCheck.slice(0, 2).map(addr => ({
    name: `Address UTXOs - ${addr.slice(0, 20)}...`,
    url: `/address/${addr}`,
    clickTab: "utxos",
  })),

  
  {
    name: "Epoch Detail Blocks - epoch 612",
    url: "/epoch/612",
    clickTab: "blocks",
  },

 
  ...scriptHashes.slice(0, 1).map(hash => ({
    name: `Script Detail Uses - ${hash.slice(0, 20)}...`,
    url: `/script/${hash}`,
    clickTab: "uses",
  })),

 
  ...stakeHashes.slice(0, 1).map(addr => ({
    name: `Stake Withdrawals - ${addr.slice(0, 20)}...`,
    url: `/stake/${addr}`,
    clickTab: "withdrawals",
  })),

 
  ...policyIds.slice(0, 1).map(id => ({
    name: `Policy Assets - ${id.slice(0, 20)}...`,
    url: `/policy/${id}`,
  })),

  
  ...blockDetailHashes.slice(0, 1).map(hash => ({
    name: `Block Detail - ${hash.slice(0, 20)}...`,
    url: `/block/${hash}`,
  })),
];
