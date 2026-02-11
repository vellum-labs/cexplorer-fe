import type { WalletInfo, WalletType } from "@/types/walletTypes";
import { isAndroid, isFirefox, isIOS, isMobile } from "react-device-detect";
import { Coffee, UtensilsCrossed, Users, PartyPopper } from "lucide-react";
import EternlLogo from "../resources/images/wallet/eternl-small.png";
import FlintLogo from "../resources/images/wallet/flint.png";
import LaceLogo from "../resources/images/wallet/lacelogo.svg";
import MetamaskLogo from "../resources/images/wallet/metamask.svg";
import NufiLogo from "../resources/images/wallet/nufi-small.svg";
import YoroiLogo from "../resources/images/wallet/yoroi.svg";
import { supportedWallets } from "./confVariables";

export const DONATION_OPTIONS = [
  { value: 0, labelKey: "noThanks", icon: null },
  { value: 10, labelKey: "coffee", icon: Coffee },
  { value: 50, labelKey: "lunch", icon: UtensilsCrossed },
  { value: 100, labelKey: "teamDinner", icon: Users },
  { value: 1000, labelKey: "teambuilding", icon: PartyPopper },
] as const;

const walletInfos: Record<WalletType | WalletType, WalletInfo> = {
  lace: {
    name: "lace",
    icon: LaceLogo,
    unsuportedBrowsers: ["firefox", "safari"],
    hasMobileApp: false,
    extensionUrl:
      "https://chrome.google.com/webstore/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk",
  },
  flint: {
    name: "flint",
    icon: FlintLogo,
    unsuportedBrowsers: ["firefox", "safari"],
    hasMobileApp: true,
    extensionUrl: `${
      isAndroid
        ? "https://play.google.com/store/apps/details?id=io.dcspark.flintwallet&hl=en_US"
        : ""
    } ${
      isIOS
        ? "https://apps.apple.com/cz/app/dcspark-flint-wallet/id1619660885"
        : ""
    }
      ${
        !isAndroid && !isIOS
          ? "https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj"
          : ""
      }`,
  },
  yoroi: {
    name: "yoroi",
    icon: YoroiLogo,
    unsuportedBrowsers: ["safari"],
    hasMobileApp: true,
    extensionUrl: `${
      !isFirefox && !isMobile
        ? "https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb"
        : ""
    }
      ${isFirefox ? "https://addons.mozilla.org/cs/firefox/addon/yoroi/" : ""}
      ${
        isAndroid
          ? "https://play.google.com/store/apps/details?id=com.emurgo&hl=cs&gl=US"
          : ""
      }
      ${
        isIOS
          ? "https://apps.apple.com/us/app/emurgos-yoroi-cardano-wallet/id1447326389"
          : ""
      }`,
  },
  eternl: {
    name: "eternl",
    icon: EternlLogo,
    unsuportedBrowsers: ["firefox", "safari"],
    hasMobileApp: true,
    extensionUrl: ` ${
      !isMobile
        ? "https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka"
        : ""
    }
      ${
        isAndroid
          ? "https://play.google.com/store/apps/details?id=io.ccvault.v1.main&hl=cs&gl=US"
          : ""
      }
      ${
        isIOS
          ? "https://apps.apple.com/us/app/eternl-by-tastenkunst/id1603854385"
          : ""
      }`,
  },
  nufi: {
    name: "nufi",
    icon: NufiLogo,
    unsuportedBrowsers: ["firefox", "safari"],
    hasMobileApp: false,
    extensionUrl:
      "https://chrome.google.com/webstore/detail/nufi/gpnihlnnodeiiaakbikldcihojploeca",
  },
  nufiSSO: {
    name: "nufiSSO",
    icon: NufiLogo,
    unsuportedBrowsers: ["firefox", "safari"],
    hasMobileApp: false,
    extensionUrl:
      "https://chrome.google.com/webstore/detail/nufi/gpnihlnnodeiiaakbikldcihojploeca",
  },
  nufiSnap: {
    name: "metamask",
    icon: MetamaskLogo,
    unsuportedBrowsers: ["safari"],
    hasMobileApp: true,
    extensionUrl: `${
      isFirefox
        ? "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
        : isIOS
          ? "https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202"
          : isAndroid
            ? "https://play.google.com/store/apps/details?id=io.metamask"
            : "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
    }`,
  },
};

export const filteredSupportedWallets: WalletType[] = Object.entries(
  supportedWallets,
)
  .map(([key, wallet]) => {
    const features = wallet[0]["features"];
    if (
      features.some(feature => feature === "sign") &&
      features.some(feature => feature === "web3") &&
      (wallet[0].visible === true || (window?.cardano && window.cardano[key]))
    ) {
      return key as WalletType;
    }
    return undefined;
  })
  .filter(
    (wallet): wallet is WalletType =>
      wallet !== undefined && wallet !== "nufiSSO" && wallet !== "nufiSnap",
  )
  .sort((a, b) => supportedWallets[a][0].pos - supportedWallets[b][0].pos);

const filteredWalletInfos = Object.fromEntries(
  Object.entries(walletInfos).sort(
    ([key1], [key2]) =>
      filteredSupportedWallets.indexOf(key1 as WalletType) -
      filteredSupportedWallets.indexOf(key2 as WalletType),
  ),
);

export { filteredWalletInfos as walletInfos };
