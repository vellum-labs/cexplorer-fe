import type { FC } from "react";
import DelegationModal from "./DelegationModal";
import { supportedPools } from "@/constants/confVariables";
import { useFetchPoolDetail } from "@/services/pools";

interface RandomDelegationModalProps {
  onClose: () => void;
}

export const RandomDelegationModal: FC<RandomDelegationModalProps> = ({
  onClose,
}) => {
  const randomPool =
    supportedPools[Math.floor(Math.random() * supportedPools.length)];

  const poolQuery = useFetchPoolDetail(randomPool, undefined);

  return <DelegationModal onClose={onClose} poolQuery={poolQuery} />;
};
