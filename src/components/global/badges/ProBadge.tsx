import { Link } from "@tanstack/react-router";

export const ProBadge = () => {
  return (
    <Link
      to='/pro'
      className={`text-righttext-text-xs flex w-fit items-center gap-1 rounded-full bg-gradient-to-r from-darkBlue to-purple-700 px-2 py-0.5 font-medium text-white hover:text-white`}
    >
      PRO
    </Link>
  );
};
