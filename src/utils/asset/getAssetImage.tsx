import { Image } from "@vellumlabs/cexplorer-sdk";
import { ADATokenName } from "@/constants/currencies";
import { alphabetWithNumbers } from "@/constants/alphabet";
import { getAssetFingerprint } from "@vellumlabs/cexplorer-sdk";
import { encodeAssetName } from "@vellumlabs/cexplorer-sdk";
import { generateImageUrl } from "../generateImageUrl";
import AdaIcon from "@/resources/images/icons/ada.webp";

export const getAssetImage = (tokenName: string, isNft = false, size = 20) => {
  const isAdaToken =
    tokenName === "lovelaces" ||
    tokenName === "lovelace" ||
    tokenName === ADATokenName ||
    tokenName?.toLowerCase().includes("lovelace");

  if (isAdaToken) {
    return (
      <img
        src={AdaIcon}
        alt='ADA'
        className='aspect-square shrink-0 rounded-max'
        height={size}
        width={size}
      />
    );
  }

  const fingerprint = getAssetFingerprint(tokenName);
  const encodedNameArr = encodeAssetName(tokenName).split("");

  return (
    <Image
      type='asset'
      height={size}
      width={size}
      className='aspect-square shrink-0 rounded-max'
      src={generateImageUrl(
        isNft ? fingerprint : tokenName,
        "ico",
        isNft ? "nft" : "token",
      )}
      fallbackletters={[...encodedNameArr]
        .filter(char => alphabetWithNumbers.includes(char.toLowerCase()))
        .join("")}
    />
  );
};
