import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import DarkLogo from "@/resources/images/navbar_logo_dark.svg";
import LightLogo from "@/resources/images/navbar_logo_light.svg";

const GraphWatermark = ({
  size = 450,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  const { theme } = useThemeStore();
  return (
    <img
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 ${className}`}
      src={theme === "light" ? DarkLogo : LightLogo}
      width={size}
      alt='Cexplorer logo'
    />
  );
};

export default GraphWatermark;
