import { Facebook } from "@/resources/images/icons/Facebook";
import { Twitter } from "@/resources/images/icons/Twitter";
import { Copy, Share, X } from "lucide-react";
import { toast } from "sonner";
import Dropdown from "./dropdowns/Dropdown";

export const ShareButton = () => {
  const options = [
    {
      label: (
        <div className='flex items-center gap-2'>
          <Copy size={15} />
          Copy URL
        </div>
      ),
      onClick: () => {
        navigator.clipboard.writeText(window.location.href);
        toast("Successfully copied", {
          action: {
            label: <X size={15} className='stroke-text' />,
            onClick: () => undefined,
          },
        });
      },
    },
    {
      label: (
        <div className='flex items-center gap-2'>
          <Twitter size={15} />
          Share on X
        </div>
      ),
      href: `https://x.com/intent/tweet?text=${window.location.href}`,
    },
    {
      label: (
        <div className='flex items-center gap-2'>
          <Facebook size={15} />
          Share on Facebook
        </div>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
    },
  ];
  return (
    <Dropdown
      id='share'
      hideChevron
      closeOnSelect
      label={<Share size={17} className='' />}
      disableHover
      options={options as any}
      triggerClassName='border border-border rounded-lg h-8 px-1'
      wrapperClassname='z-0'
      width='200px'
    />
  );
};
