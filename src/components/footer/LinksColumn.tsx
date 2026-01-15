import type { FooterLinks } from "@/types/footerTypes";
import { Link } from "@tanstack/react-router";

type Props = {
  header: string;
  links: FooterLinks;
};

const LinksColumn = ({ header, links }: Props) => {
  return (
    <div className='flex flex-col gap-1'>
      <p className='text-[12px] text-grayTextPrimary'>{header}</p>
      {links.map((link, index) => (
        <Link
          to={link.href}
          key={index}
          target={link.target}
          className='text-text-sm font-medium'
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default LinksColumn;
