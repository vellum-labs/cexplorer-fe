import { alphabetWithNumbers } from "@/constants/alphabet";
import type { MiscBasicResponse } from "@/types/miscTypes";
import { generateImageUrl } from "@/utils/generateImageUrl";
import parse from "html-react-parser";
import type { ReactNode } from "react";
import { Image } from "../Image";

type Props = {
  className?: string;
  data: MiscBasicResponse["data"]["ads"][number]["data"];
};

const AdCard = ({ data, className }: Props) => {
  let img: ReactNode | null = null;
  const ident = String(data.link.split("/").pop());
  const identArr = String(ident.split(""));
  const titleArr = String(data.title.split(""));

  if (data.type === "pool") {
    img = (
      <Image
        src={generateImageUrl(ident, "ico", "pool")}
        type='pool'
        height={25}
        width={25}
        className='rounded-max'
      />
    );
  } else if (data.type === "asset" && data.text) {
    img = (
      <Image
        src={generateImageUrl(ident, "ico", "token")}
        type='asset'
        height={25}
        width={25}
        className='rounded-max'
        fallbackletters={[...titleArr, ...identArr]
          .filter(char => alphabetWithNumbers.includes(char.toLowerCase()))
          .slice(0, 3)
          .join("")}
      />
    );
  }

  return (
    <a
      href={data?.link}
      target='_blank'
      className={`z-2 relative flex h-[110px] w-full flex-col gap-1/2 rounded-l border border-border bg-cardBg px-2 py-1.5 hover:text-text ${className ? className : "shadow-md"}`}
    >
      <p className='w-fit rounded-l border border-border px-1 text-text-xs font-medium'>
        {data?.type.slice(0, 1).toUpperCase() + data?.type.slice(1)}
      </p>
      <div className='flex items-center gap-1'>
        {img}
        <p
          className={`block max-h-10 min-h-5 w-full overflow-hidden text-ellipsis whitespace-nowrap break-all ${data.text ? "text-sm" : "text-text-md"} font-bold hover:text-text`}
        >
          {data?.title}
        </p>
      </div>

      <p className='block w-full overflow-hidden text-ellipsis text-text-xs leading-tight text-grayTextPrimary'>
        {parse(data?.text)}
      </p>
    </a>
  );
};

export default AdCard;
