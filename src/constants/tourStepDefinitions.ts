export type TooltipPosition = "below" | "above" | "left" | "right";

export interface TourStep {
  target: string | null;
  titleKey: string;
  descriptionKey: string;
  tooltipPosition: TooltipPosition;
}

export const DESKTOP_STEPS: TourStep[] = [
  {
    target: null,
    titleKey: "homepage.tour.welcome.title",
    descriptionKey: "homepage.tour.welcome.description",
    tooltipPosition: "below",
  },
  {
    target: "search-bar",
    titleKey: "homepage.tour.searchBar.title",
    descriptionKey: "homepage.tour.searchBar.description",
    tooltipPosition: "below",
  },
  {
    target: "customize-button",
    titleKey: "homepage.tour.customize.title",
    descriptionKey: "homepage.tour.customize.description",
    tooltipPosition: "below",
  },
  {
    target: "nav-settings",
    titleKey: "homepage.tour.settings.title",
    descriptionKey: "homepage.tour.settings.description",
    tooltipPosition: "below",
  },
  {
    target: "nav-wallet",
    titleKey: "homepage.tour.wallet.title",
    descriptionKey: "homepage.tour.wallet.description",
    tooltipPosition: "below",
  },
  {
    target: "nav-blockchain",
    titleKey: "homepage.tour.blockchain.title",
    descriptionKey: "homepage.tour.blockchain.description",
    tooltipPosition: "below",
  },
  {
    target: "nav-staking",
    titleKey: "homepage.tour.staking.title",
    descriptionKey: "homepage.tour.staking.description",
    tooltipPosition: "below",
  },
  {
    target: "nav-governance",
    titleKey: "homepage.tour.governance.title",
    descriptionKey: "homepage.tour.governance.description",
    tooltipPosition: "below",
  },
  {
    target: "nav-tokens",
    titleKey: "homepage.tour.tokens.title",
    descriptionKey: "homepage.tour.tokens.description",
    tooltipPosition: "below",
  },
  {
    target: "nav-education",
    titleKey: "homepage.tour.education.title",
    descriptionKey: "homepage.tour.education.description",
    tooltipPosition: "below",
  },
  {
    target: "nav-analytics",
    titleKey: "homepage.tour.analytics.title",
    descriptionKey: "homepage.tour.analytics.description",
    tooltipPosition: "below",
  },
  {
    target: "nav-more",
    titleKey: "homepage.tour.more.title",
    descriptionKey: "homepage.tour.more.description",
    tooltipPosition: "below",
  },
  {
    target: null,
    titleKey: "homepage.tour.finished.title",
    descriptionKey: "homepage.tour.finished.description",
    tooltipPosition: "below",
  },
];

export const TABLET_STEPS: TourStep[] = [
  {
    target: null,
    titleKey: "homepage.tour.welcome.title",
    descriptionKey: "homepage.tour.welcome.description",
    tooltipPosition: "below",
  },
  {
    target: "search-bar",
    titleKey: "homepage.tour.searchBar.title",
    descriptionKey: "homepage.tour.searchBar.description",
    tooltipPosition: "below",
  },
  {
    target: "customize-button",
    titleKey: "homepage.tour.customize.title",
    descriptionKey: "homepage.tour.customize.description",
    tooltipPosition: "below",
  },
  {
    target: "nav-settings",
    titleKey: "homepage.tour.settings.title",
    descriptionKey: "homepage.tour.settings.description",
    tooltipPosition: "below",
  },
  {
    target: "nav-wallet",
    titleKey: "homepage.tour.wallet.title",
    descriptionKey: "homepage.tour.wallet.description",
    tooltipPosition: "below",
  },
  {
    target: "tablet-menu",
    titleKey: "homepage.tour.mobileMenu.title",
    descriptionKey: "homepage.tour.mobileMenu.description",
    tooltipPosition: "below",
  },
  {
    target: null,
    titleKey: "homepage.tour.finished.title",
    descriptionKey: "homepage.tour.finished.description",
    tooltipPosition: "below",
  },
];

export const MOBILE_STEPS: TourStep[] = [
  {
    target: null,
    titleKey: "homepage.tour.welcome.title",
    descriptionKey: "homepage.tour.welcome.description",
    tooltipPosition: "above",
  },
  {
    target: "mobile-search",
    titleKey: "homepage.tour.searchBar.title",
    descriptionKey: "homepage.tour.searchBar.description",
    tooltipPosition: "above",
  },
  {
    target: "customize-button",
    titleKey: "homepage.tour.customize.title",
    descriptionKey: "homepage.tour.customize.description",
    tooltipPosition: "below",
  },
  {
    target: "mobile-settings",
    titleKey: "homepage.tour.settings.title",
    descriptionKey: "homepage.tour.settings.description",
    tooltipPosition: "above",
  },
  {
    target: "mobile-wallet",
    titleKey: "homepage.tour.wallet.title",
    descriptionKey: "homepage.tour.wallet.description",
    tooltipPosition: "above",
  },
  {
    target: "mobile-menu",
    titleKey: "homepage.tour.mobileMenu.title",
    descriptionKey: "homepage.tour.mobileMenu.description",
    tooltipPosition: "above",
  },
  {
    target: null,
    titleKey: "homepage.tour.finished.title",
    descriptionKey: "homepage.tour.finished.description",
    tooltipPosition: "above",
  },
];

const MD_BREAKPOINT = 768;
const XL_BREAKPOINT = 1280;

export function getTourSteps(): TourStep[] {
  const width = window.innerWidth;
  if (width >= XL_BREAKPOINT) return DESKTOP_STEPS;
  if (width >= MD_BREAKPOINT) return TABLET_STEPS;
  return MOBILE_STEPS;
}
