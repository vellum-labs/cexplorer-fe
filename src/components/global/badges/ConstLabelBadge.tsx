import { Tooltip } from "@/components/ui/tooltip";
import { useMiscConst } from "@/hooks/useMiscConst";
import { useFetchMiscBasic } from "@/services/misc";
import { findLabel } from "@/utils/findLabel";
import { Badge } from "./Badge";

interface Props {
  type: "metadatum" | "sc";
  name: number | string | undefined;
  className?: string;
}

const ConstLabelBadge = ({ type, name, className }: Props) => {
  const { data: basicData } = useFetchMiscBasic();
  const miscConst = useMiscConst(basicData?.data.version.const);
  const label = findLabel(type, name, miscConst);

  if (!label) return null;

  return (
    <Tooltip content={label}>
      <Badge color='blue' className={className}>
        {label.split(" ")[0]}
      </Badge>
    </Tooltip>
  );
};

export default ConstLabelBadge;
