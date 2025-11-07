import { PageBase } from "@/components/global/pages/PageBase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@vellumlabs/cexplorer-sdk";

const faq = [
  {
    msg: "Cexplorer.io is a comprehensive Cardano blockchain explorer designed to help users navigate the Cardano blockchain efficiently. We provide real-time data, advanced analytics, and in-depth insights, making us the go-to platform for everything happening on the Cardano blockchain. Beyond exploring, we also offer educational resources to keep you updated on the latest developments in the Cardano ecosystem.",
    title: "What is Cexplorer?",
  },
  {
    msg: "We've been around since the Incentivized Testnet, making Cexplorer one of the oldest and most trusted Cardano blockchain explorers. For years, we've been supporting the Cardano community with essential tools and insights for both users and developers.",
    title: "How long has Cexplorer.io been around?",
  },
  {
    msg: "Yes, Cexplorer is free for everyone! Our blockchain explorer, advanced analytics, and educational sections are all completely free to use. We also offer a Pro version for additional features like data exports, graph exports, API access, and advertising options.",
    title: "Is Cexplorer free to use?",
  },
  {
    msg: "Cexplorer provides a wealth of analytics across categories like blockchain, account, governance, staking, and dApp insights. You can explore key metrics such as Transactions Per Second (TPS), blockchain health, active accounts, dApp rank list, and many more. Our detailed data offers multiple perspectives, empowering you to make informed decisions and optimize your blockchain experience.",
    title: "What insights can I gain from Cexplorer's analytics sections?",
  },
  {
    msg: "Exporting data will be available to all Cexplorer PRO users.",
    title: "Can I export data & graphs from Cexplorer for analysis?",
  },
  {
    msg: "Cexplorer PRO is designed for those who want to unlock the full potential of our platform. With PRO, users gain access to exclusive features such as a featured slot, PRO-specific functionalities, a profile badge, and soon, governance voting and a basic API key. You can expect even more advanced tools and benefits in the future. Cexplorer PRO is perfect for users who want to take full advantage of everything our platform offers. More details about Cexplorer PRO and its benefits will be revealed soon—stay tuned!",
    title: "What is Cexplorer PRO?",
  },
  {
    msg: "Yes, Cexplorer offers a basic API for PRO users, and we're actively developing multiple API programs that will be revealed soon. In the meantime, developers can reach out to us via Discord or email at hello@cexplorer.io for any API requests. Stay tuned for exciting updates!",
    title: "Does Cexplorer have an API for developers?",
  },
  {
    msg: "We love hearing from our community! You can suggest a new feature by reaching out to us directly on Discord, sending an email, or using GitHub. Your feedback helps us improve Cexplorer, so don't hesitate to share your ideas!",
    title: "How do I suggest a new feature for Cexplorer?",
  },
];

export const FaqPage = () => {
  return (
    <PageBase
      metadataOverride={{ title: "FAQ | Cexplorer.io" }}
      title='Frequently asked questions'
      subTitle='Everything you need to know about the product and billing.'
      breadcrumbItems={[{ label: "FAQ" }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center px-mobile pb-3 md:px-desktop'>
        <Accordion
          type='single'
          collapsible
          className='mt-2 w-full max-w-[600px]'
        >
          {faq.map(item => (
            <AccordionItem
              key={item.title}
              value={item.title}
              className='border-b border-border'
            >
              <AccordionTrigger className='AccordionTrigger w-full py-3 text-left'>
                <span className='text-text-md font-medium'>{item.title}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className='flex flex-col pb-1.5 text-grayTextPrimary'>
                  {item.msg}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </PageBase>
  );
};
