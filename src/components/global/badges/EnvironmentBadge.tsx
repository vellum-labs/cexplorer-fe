import { configJSON } from "@/constants/conf";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";

export const EnvironmentBadge = () => {
  const { theme } = useThemeStore();
  const network = configJSON.network;

  if (network === "mainnet") {
    return null;
  }

  const styles = {
    dark: {
      border: "border-[#475467]",
      bg: "bg-[#1D2939]",
      text: "text-white",
    },
    light: {
      border: "border-[#E4E7EC]",
      bg: "bg-[#F9FAFB]",
      text: "text-[#344054]",
    },
  }[theme];

  return (
    <div
      className={`absolute left-[75px] top-[31px] flex w-fit items-center rounded-xl border ${styles.border} ${styles.bg} h-5 px-[6px] py-[2px]`}
    >
      <span
        className={`text-[10px] font-medium ${styles.text} whitespace-nowrap`}
      >
        {network}
      </span>
    </div>
  );
};
