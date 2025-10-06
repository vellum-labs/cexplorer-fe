import { RewardsTab } from "@/components/address/tabs/RewardsTab";
import Button from "@/components/global/Button";
import TextInput from "@/components/global/inputs/TextInput";
import { colors } from "@/constants/colors";
import { Address } from "@/utils/address/getStakeAddress";
import { isValidAddress } from "@/utils/address/isValidAddress";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageBase } from "@/components/global/pages/PageBase";

export const RewardsCheckerPage = () => {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const handleSubmit = async () => {
    if (!isValidAddress(search)) {
      toast.error("Invalid address");
      return;
    }

    if (search.startsWith("stake")) {
      setSubmittedSearch(search);
      localStorage.setItem("rewards_checker_addr", search);
      return;
    }

    if (Address.from(search).stake) {
      localStorage.setItem(
        "rewards_checker_addr",
        Address.from(search).rewardAddress,
      );
      setSubmittedSearch(Address.from(search).rewardAddress);
    } else {
      toast.error("This address has no stake key");
    }
  };

  useEffect(() => {
    const checkerStorage = localStorage.getItem("rewards_checker_addr");

    if (checkerStorage) {
      setSubmittedSearch(checkerStorage);
      setSearch(checkerStorage);
    }
  }, []);

  return (
    <PageBase
      metadataTitle='rewardsChecker'
      title={<div className='flex items-center gap-1'>Rewards checker</div>}
      breadcrumbItems={[{ label: "Rewards checker" }]}
    >
      <section className='flex w-full flex-col items-center'>
        <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-5 px-mobile pb-3 pt-1.5 md:px-desktop xl:flex-nowrap xl:justify-start'></div>
      </section>
      <div className='w-full max-w-desktop px-mobile md:px-desktop'>
        <div className='mb-2 flex flex-col gap-2'>
          <div className='flex w-full items-center gap-1'>
            <TextInput
              value={search}
              onchange={value => setSearch(value)}
              placeholder='Search stake address...'
              wrapperClassName='w-full'
            />
            <Button
              variant='primary'
              leftIcon={<Search />}
              size='sm'
              className='h-[40px] max-w-[40px]'
              onClick={handleSubmit}
            />
          </div>
          {submittedSearch && (
            <Link
              to='/stake/$stakeAddr'
              params={{ stakeAddr: submittedSearch }}
              className='flex items-center gap-1 text-sm font-medium text-primary'
            >
              Address detail <ArrowRight color={colors.primary} size={15} />
            </Link>
          )}
        </div>
        <RewardsTab
          stakeAddress={submittedSearch}
          parentPage='rewardsChecker'
        />
      </div>
    </PageBase>
  );
};
