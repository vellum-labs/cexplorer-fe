import type { NavigationOptions } from "@/types/navigationTypes";
import type { FileRoutesByPath } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import type dynamicIconImports from "lucide-react/dynamicIconImports";
import type { SetStateAction } from "react";
import Icon from "../global/Icon";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

type Props = {
  label: string;
  icon: keyof typeof dynamicIconImports;
  items: NavigationOptions;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  href?: FileRoutesByPath[keyof FileRoutesByPath]["path"];
};

const MobileMenuAccordionItem = ({
  label,
  icon,
  items,
  setIsOpen,
  href,
}: Props) => {
  return (
    <AccordionItem value={label} className='mt-1.5'>
      <AccordionTrigger>
        <Icon name={icon} size={20} />
        {}
        {href ? (
          <Link
            className='text-base underline'
            to={href}
            onClick={() => setIsOpen(false)}
          >
            {label}
          </Link>
        ) : (
          <span className='text-base'>{label}</span>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div className='flex flex-col'>
          {Object.entries(items).map((item, i) => {
            return item[1].href ? (
              <Link
                key={item[0] + i}
                className='ml-[31px] border-b border-border py-1.5 last:border-none last:pb-0 hover:text-primary'
                to={item[1].href}
                onClick={() => setIsOpen(false)}
              >
                {item[1].label}
              </Link>
            ) : (
              <button
                key={item[0] + i}
                className='ml-[31px] border-b border-border py-1.5 last:border-none last:pb-0 hover:text-primary'
                onClick={() => {
                  item[1].onClick();
                }}
              >
                {item[1].label}
              </button>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default MobileMenuAccordionItem;
