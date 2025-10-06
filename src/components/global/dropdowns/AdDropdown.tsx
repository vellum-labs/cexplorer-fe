import type { DropdownOption } from "@/types/commonTypes";
import type dynamicIconImports from "lucide-react/dynamicIconImports";
import Icon from "../Icon";
import Dropdown from "./Dropdown";

interface Props {
  label: string;
  icon: keyof typeof dynamicIconImports;
  options: DropdownOption[];
}

const AdDropdown = ({ label, options, icon }: Props) => {
  return (
    <div className='flex justify-end rounded-md border border-border'>
      <Dropdown
        id={label}
        width='200px'
        label={
          <div className='group flex h-[40px] w-full shrink grow items-center justify-between gap-1 rounded-md border-border bg-background px-1.5 py-1.5'>
            <Icon name={icon} size={18} />
            <span>{label}</span>
          </div>
        }
        options={options}
        triggerClassName='pr-1.5 bg-background rounded-md'
      />
    </div>
  );
};

export default AdDropdown;
