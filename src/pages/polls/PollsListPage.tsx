import { Badge } from "@/components/global/badges/Badge";
import Button from "@/components/global/Button";
import Modal from "@/components/global/Modal";
import PulseDot from "@/components/global/PulseDot";
import Tabs from "@/components/global/Tabs";
import DateCell from "@/components/table/DateCell";
import GlobalTable from "@/components/table/GlobalTable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { colors } from "@/constants/colors";
import { useFetchPollList } from "@/services/misc";
import { useFetchUserInfo } from "@/services/user";
import type { TableColumns } from "@/types/tableTypes";
import type { Poll } from "@/types/userTypes";
import { formatDate } from "@/utils/format/format";
import type { FileRoutesByPath } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import parse from "html-react-parser";
import { Info, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { PageBase } from "@/components/global/pages/PageBase";

const cropString = (str: string) => {
  if (str.length > 90) {
    return str.slice(0, 87) + "...";
  }
  return str;
};

const renderStatusBadge = (status: "available" | "closed") => {
  if (status === "available") {
    return (
      <Badge color='gray' className='gap-2'>
        <PulseDot />
        Live
      </Badge>
    );
  }
  return <Badge color='gray'>Closed</Badge>;
};

export const PollsListPage = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [totalItems, setTotalItems] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState(false);
  const { data: userData } = useFetchUserInfo();
  const nfts = userData?.data.membership.nfts;
  const listQuery = useFetchPollList();
  const items = listQuery.data?.data;

  const tabs = [
    {
      key: "all",
      label: "All",
      visible: true,
    },
    {
      key: "live",
      label: "Live",
      visible: true,
    },
    {
      key: "closed",
      label: "Closed",
      visible: true,
    },
  ];

  const columns: TableColumns<Poll> = [
    {
      key: "status",
      title: "Status",
      render: poll => renderStatusBadge(poll.state),
      visible: true,
      widthPx: 60,
    },
    {
      key: "proposal",
      title: "Governance proposal",
      render: poll => (
        <div className='flex flex-col'>
          <Link
            to='/polls/$poll'
            params={{ poll: poll.url }}
            className='mb-1 text-base font-medium text-primary'
          >
            {poll.name}
          </Link>
          <div className=''>{parse(cropString(poll.description))}</div>
        </div>
      ),
      visible: true,
      widthPx: 100,
    },
    {
      key: "unique_voters",
      title: "Unique voters",
      render: poll => {
        if (!poll.result) return "?";

        return (
          <span>
            {Object.values(poll.result).reduce((acc, curr) => {
              return acc + curr.count;
            }, 0)}
          </span>
        );
      },
      visible: true,
      widthPx: 60,
    },
    {
      key: "start_time",
      title: "Start time",
      render: poll => (
        <div className='flex flex-col'>
          <DateCell time={poll.date_start} />
          <span className='text-xs text-grayTextSecondary'>
            {formatDate(new Date(poll.date_start))}
          </span>
        </div>
      ),
      visible: true,
      widthPx: 60,
    },
    {
      key: "end_time",
      title: "End time",
      render: poll => (
        <div className='flex flex-col'>
          <DateCell time={poll.date_end} />
          <span className='text-xs text-grayTextSecondary'>
            {formatDate(new Date(poll.date_end))}
          </span>
        </div>
      ),
      visible: true,
      widthPx: 60,
    },
    {
      key: "voteNow",
      title: "Vote now",
      render: poll => (
        <>
          {poll.vote?.option ? (
            <p className=''>
              <span className='text-grayTextSecondary'>✓ Voted:</span>{" "}
              {poll.vote.option}
            </p>
          ) : (
            <Button
              variant='primary'
              size='sm'
              label='Vote now'
              href={
                `/polls/${poll.url}` as FileRoutesByPath[keyof FileRoutesByPath]["path"]
              }
              disabled={poll.state === "closed"}
            />
          )}
        </>
      ),
      visible: true,
      widthPx: 60,
    },
  ];

  useEffect(() => {
    if (items !== undefined && totalItems !== (items?.length ?? 0)) {
      setTotalItems(items?.length ?? 0);
    }
  }, [items, totalItems]);

  return (
    <>
      {openFaq && <FaqModal onClose={() => setOpenFaq(false)} />}
      <PageBase
        adsCarousel={false}
        metadataTitle='pollsPage'
        title='Cexplorer governance actions'
        breadcrumbItems={[{ label: "Voting" }]}
      >
        <section className='flex w-full max-w-desktop flex-col px-mobile pb-5 md:px-desktop'>
          <Tabs
            withPadding={false}
            items={tabs}
            onClick={activeTab => setActiveTab(activeTab)}
            mobileItemsCount={3}
          />
          <div className='-mt-8 mb-4 ml-auto flex items-center gap-4'>
            {nfts === 0 && (
              <Link
                to='/pro'
                className='gold-shimmer flex min-w-fit items-center gap-1 bg-purpleText bg-clip-text text-sm font-medium text-transparent underline hover:text-transparent'
              >
                Get Cexplorer PRO{" "}
                <Sparkles color={colors.purpleText} size={15} />
              </Link>
            )}
            <button
              onClick={() => setOpenFaq(true)}
              className='flex min-w-fit items-center gap-1 text-sm text-grayTextPrimary underline underline-offset-2'
            >
              How does it work? <Info size={15} />
            </button>
          </div>
          <GlobalTable
            type='default'
            totalItems={totalItems}
            itemsPerPage={20}
            scrollable
            query={listQuery}
            minContentWidth={1200}
            items={items?.filter(poll => {
              if (activeTab === "live") return poll.state === "available";
              if (activeTab === "closed") return poll.state === "closed";
              return true;
            })}
            columns={columns}
          />
        </section>
      </PageBase>
    </>
  );
};

const faq = [
  {
    question: "Who can vote?",
    answer:
      "Anyone can participate in governance votes! Voting power is based on the number of Cexplorer PRO NFTs you hold. Each NFT equals one vote.",
  },
  {
    question: "How is voting power calculated?",
    answer: (
      <p>
        A snapshot of voting power is taken at the end of the voting period.
        <br />
        This means that even if you don’t hold any NFTs when you cast your vote,
        it will still count as long as you acquire NFTs before the voting period
        ends.
      </p>
    ),
  },
  {
    question: "Can I vote multiple times?",
    answer:
      "No, each wallet's vote is counted once per proposal. The weight of your vote is determined by the number of NFTs held at the time of the snapshot.",
  },
  {
    question: "What types of proposals will be voted on?",
    answer:
      "Proposals may include feature upgrades, platform direction, or other significant changes to Cexplorer.",
  },
  {
    question: "Who can submit proposals?",
    answer: (
      <p>
        Currently, only the Cexplorer team can submit proposals for voting.
        <br />
        Ideas are proposed based on community feedback. Your voice helps guide
        the platform’s direction.
      </p>
    ),
  },
  {
    question: "How do I share my ideas or feedback for governance proposals?",
    answer: (
      <p>
        You can submit your feedback and ideas through suggest a new feature or
        via our Discord The team regularly reviews input to craft meaningful
        proposals.
      </p>
    ),
  },
  {
    question: "What happens after a proposal is approved?",
    answer:
      "Once a proposal passes, the team begins implementing the changes. Timelines and progress will be shared transparently with the community.",
  },
];

const FaqModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal minWidth='95%' maxWidth='600px' maxHeight='95%' onClose={onClose}>
      <h3 className='mt-4'>Voting FAQ</h3>
      <Accordion
        type='single'
        collapsible
        className='mt-4 w-full max-w-[600px]'
      >
        {faq?.map(item => (
          <AccordionItem
            key={item.question}
            value={item.question}
            className='border-b border-border text-sm'
          >
            <AccordionTrigger className='AccordionTrigger w-full py-5 text-left'>
              <span className='text-base font-medium'>{item.question}</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-col pb-3 text-left text-grayTextPrimary'>
                {item.answer}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Modal>
  );
};
