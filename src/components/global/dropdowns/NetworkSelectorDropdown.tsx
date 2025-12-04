import { Dropdown } from "@vellumlabs/cexplorer-sdk";
import { ChevronDown } from "lucide-react";

import { networks } from "@/constants/networks";

export const NetworkSelectorDropdown = () => {
  const currentNetwork = networks.find(n => n.isActive) || networks[0];

  const networkOptions = networks.map(network => ({
    label: (
      <a
        href={network.url}
        className='flex w-full flex-col'
        target={network.isActive ? undefined : "_blank"}
        rel={network.isActive ? undefined : "noopener noreferrer"}
      >
        <span
          className={`font-medium ${network.isActive ? "text-primary" : ""}`}
        >
          {network.label}
        </span>
        <span className='text-text-xs text-grayTextPrimary'>{network.url}</span>
      </a>
    ),
    onClick: () => undefined,
  }));

  return (
    <Dropdown
      id='networkSelector'
      disableHover
      hideChevron
      label={
        <div className='flex items-center gap-1/2 rounded-m border border-border px-2 py-1 text-text-sm'>
          <span className='capitalize'>
            {currentNetwork.label.split(" ")[0]}
          </span>
          <ChevronDown size={14} />
        </div>
      }
      options={networkOptions}
      width='220px'
      poppoverClassname='border border-border !p-0 !w-[220px]'
    />
  );
};
