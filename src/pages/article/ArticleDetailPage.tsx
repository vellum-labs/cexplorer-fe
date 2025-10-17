import { ArticleCard } from "@/components/article/ArticleCard";
import { Button } from "@vellumlabs/cexplorer-sdk";
import { Image } from "@/components/global/Image";
import TextInput from "@/components/global/inputs/TextInput";
import { SingleItemCarousel } from "@/components/global/SingleItemCarousel";
import {
  BreadcrumbRaw,
  BreadcrumbItem,
  BreadcrumbList,
} from "@vellumlabs/cexplorer-sdk";
import { webUrl } from "@/constants/confVariables";
import { useFetchArticleDetail, useFetchArticleList } from "@/services/article";
import type { ArticleListData } from "@/types/articleTypes";
import { formatDate } from "@/utils/format/format";
import { renderArticleAuthor } from "@/utils/renderArticleAuthor";
import { getRouteApi, Link } from "@tanstack/react-router";
import parse from "html-react-parser";
import { Check, Copy, Gift, Send } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import metadata from "../../../conf/metadata/en-metadata.json";
import DiscordLogo from "../../resources/images/icons/discord.svg";
import TelegramLogo from "../../resources/images/icons/telegram.svg";
import TwitterLogo from "../../resources/images/icons/twitter.svg";
import { RandomDelegationModal } from "@/components/wallet/RandomDelegationModal";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

export const ArticleDetailPage = () => {
  const route = getRouteApi("/article/$url");
  const { url } = route.useParams();

  const detailQuery = useFetchArticleDetail("en", "article", url);
  const listQuery = useFetchArticleList("en", 0, 20);
  const data = detailQuery.data;
  const otherArticles =
    listQuery.data?.pages
      .flatMap(page => page.data.data)
      .filter(article => article.name !== data?.name)
      .slice(0, 3) || [];
  const [openDelegationModal, setOpenDelegationModal] = useState(false);

  if (detailQuery.isLoading) {
    return (
      <main className='mx-auto flex min-h-minHeight w-full max-w-desktop flex-col items-center'>
        <section className='flex h-auto w-full justify-center bg-gradient-to-b from-bannerGradient to-darker p-3'>
          <div className='flex w-full max-w-desktop flex-col-reverse justify-center gap-1.5 md:flex-row'>
            <div className='flex w-full flex-col justify-between gap-1.5 md:w-[40%]'>
              <LoadingSkeleton height='40px' width='200px' rounded='md' />
              <div className='mb-auto flex flex-col gap-2'>
                <LoadingSkeleton height='40px' width='100%' rounded='md' />
                <LoadingSkeleton height='60px' width='100%' rounded='md' />
              </div>
              <LoadingSkeleton height='60px' width='150px' rounded='md' />
              <LoadingSkeleton height='40px' width='150px' rounded='md' />
            </div>
            <div className='flex w-full justify-end md:w-[60%]'>
              <LoadingSkeleton
                height='300px'
                width='100%'
                className='md:h-[380px]'
                rounded='md'
              />
            </div>
          </div>
        </section>
        <section className='flex w-full max-w-desktop flex-col gap-1.5 p-mobile md:p-desktop lg:flex-row'>
          <div className='flex w-full flex-wrap items-center justify-between gap-2 lg:hidden'>
            <LoadingSkeleton height='30px' width='200px' rounded='md' />
            <LoadingSkeleton height='36px' width='280px' rounded='md' />
          </div>
          <article className='my-3 w-full text-left lg:my-0 lg:w-[calc(100%-300px)]'>
            <LoadingSkeleton height='400px' width='100%' rounded='md' />
          </article>
          <div className='hidden w-[300px] flex-col gap-1.5 lg:flex'>
            <LoadingSkeleton height='100px' width='100%' rounded='md' />
            <LoadingSkeleton height='150px' width='100%' rounded='md' />
            <LoadingSkeleton height='200px' width='100%' rounded='md' />
            <LoadingSkeleton height='200px' width='100%' rounded='md' />
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {
          <title>
            {metadata.articleDetail.title.replace(
              "%article%",
              String(parse(data?.name ?? "")) || "Article",
            )}
          </title>
        }
        <meta
          name='description'
          content={metadata.articleDetail.description.replace(
            "%description%",
            data?.description || "",
          )}
        />
        <meta
          name='keywords'
          content={metadata.articleDetail.keywords.replace(
            "%keywords%",
            data?.keywords || "",
          )}
        />
        <meta
          property='og:title'
          content={metadata.articleDetail.title.replace(
            "%article%",
            String(parse(data?.name ?? "")) || "Article",
          )}
        />
        <meta
          property='og:description'
          content={metadata.articleDetail.description.replace(
            "%description%",
            data?.description || "",
          )}
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
      <main className='mx-auto flex min-h-minHeight w-full max-w-desktop flex-col items-center'>
        {openDelegationModal && (
          <RandomDelegationModal
            onClose={() => setOpenDelegationModal(false)}
          />
        )}
        <section className='flex h-auto w-full justify-center bg-gradient-to-b from-bannerGradient to-darker p-3'>
          <div className='flex w-full max-w-desktop flex-col-reverse justify-center gap-1.5 md:flex-row'>
            <div className='flex w-full flex-col justify-between gap-1.5 md:w-[40%]'>
              <BreadcrumbRaw className='mb-2 w-full'>
                <BreadcrumbList className='flex items-center'>
                  <BreadcrumbItem>
                    <Link className='underline underline-offset-2' to='/'>
                      Home
                    </Link>
                  </BreadcrumbItem>
                  /
                  <BreadcrumbItem>
                    <Link
                      className='underline underline-offset-2'
                      to={"/article"}
                    >
                      Articles
                    </Link>
                  </BreadcrumbItem>
                  /
                  <BreadcrumbItem className='text-text'>
                    Article detail
                  </BreadcrumbItem>
                </BreadcrumbList>
              </BreadcrumbRaw>
              {data && (
                <div className='mb-auto'>
                  <h2>{parse(data?.name || "")}</h2>
                  <p className='text-grayTextPrimary'>
                    {parse(data?.description || "")}
                  </p>
                </div>
              )}
              <div className='flex flex-col text-text-sm'>
                {renderArticleAuthor(data?.user_owner)}
              </div>
              <div className='flex flex-col text-text-sm'>
                <span className='text-grayTextPrimary'>Published</span>
                <span>{data?.pub_date ? formatDate(data?.pub_date) : "-"}</span>
              </div>
            </div>
            <div className='flex w-full justify-end md:w-[60%]'>
              <Image
                src={data?.image || ""}
                className='h-[300px] w-full rounded-m object-cover md:h-[380px]'
                height={380}
              />
            </div>
          </div>
        </section>
        <section className='flex w-full max-w-desktop flex-col gap-1.5 p-mobile md:p-desktop lg:flex-row'>
          <div className='flex w-full flex-wrap items-center justify-between gap-2 lg:hidden'>
            <div className='order-2 flex gap-1/2 text-text-sm leading-tight text-grayTextPrimary'>
              <span className='font-medium'>Keywords:</span>
              <span className=''>{data?.keywords}</span>
            </div>
            <SocialsAndCopy className='order-1 ml-auto block min-w-fit lg:hidden' />
          </div>
          <article className='[&>*]:text-base my-3 w-full text-left text-text-md lg:my-0 lg:w-[calc(100%-300px)] [&>p]:my-4'>
            {parse(data?.data[0] || "")}
          </article>
          <div className='hidden w-[300px] flex-col gap-1.5 lg:flex'>
            <SocialsAndCopy stretchCopy />
            {/* <div className='flex w-full flex-col gap-2 rounded-m border border-border bg-cardBg p-2'>
              <h3>Support author</h3>
              <p className='text-text-sm text-grayTextPrimary'>
                You can support the article author by delegating to their stake
                pool.
              </p>
              <Button
                label='Delegate to our pool'
                variant='primary'
                size='sm'
                onClick={() => setOpenDelegationModal(true)}
              />
            </div> */}
            {/* <NewsletterForm /> */}
            <div className='flex w-full flex-col gap-2 rounded-m border border-border bg-cardBg p-2'>
              <h3>Keywords</h3>
              <p className='text-text-sm text-grayTextPrimary'>
                {data?.keywords}
              </p>
            </div>
            {otherArticles.map(article => (
              <ArticleCard
                key={article.url + article.pub_date}
                article={article}
              />
            ))}
          </div>
          <div className='flex flex-wrap gap-1.5 lg:hidden'>
            <SingleItemCarousel
              items={otherArticles}
              isLoading={listQuery.isLoading}
              card={ArticleCardWrapper}
              className='h-full basis-[300px] md:max-w-[300px]'
            />
            <div className='flex w-full min-w-[230px] shrink grow basis-[280px] flex-col gap-2 rounded-m border border-border bg-cardBg p-2'>
              <Gift
                className='rounded-m border border-border bg-background p-1'
                size={40}
              />
              <h3>Support author</h3>
              <p className='text-text-sm text-grayTextPrimary'>
                You can support the article author by delegating to their stake
                pool.
              </p>
              <Button
                label='Delegate to our pool'
                variant='primary'
                size='sm'
                onClick={() => setOpenDelegationModal(true)}
                className='mt-auto'
              />
            </div>
            <NewsletterForm />
          </div>
        </section>
      </main>
    </>
  );
};

const SocialsAndCopy = ({
  className,
  stretchCopy,
}: {
  className?: string;
  stretchCopy?: boolean;
}) => {
  const [copied, setCopied] = useState(false);
  let timeout: NodeJS.Timeout;

  const handleCopy = () => {
    clearTimeout(timeout);
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    timeout = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex h-9 gap-1/2 ${className}`}>
      <Button
        leftIcon={copied ? <Check size={15} /> : <Copy size={15} />}
        label='Copy link'
        className={stretchCopy ? "w-full max-w-full" : ""}
        variant='tertiary'
        size='sm'
        onClick={handleCopy}
      />
      <Button
        leftIcon={<img src={TelegramLogo} />}
        variant='tertiary'
        size='sm'
      />
      <Button
        leftIcon={<img src={DiscordLogo} />}
        variant='tertiary'
        size='sm'
      />
      <Button
        leftIcon={<img src={TwitterLogo} />}
        variant='tertiary'
        size='sm'
      />
    </div>
  );
};

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  return (
    <div className='flex w-full min-w-[230px] shrink grow basis-[280px] flex-col gap-2 rounded-m border border-border bg-cardBg p-2'>
      <Send
        className='rounded-m border border-border bg-background p-1'
        size={40}
      />
      <h3>Weekly newsletter</h3>
      <p className='text-text-sm text-grayTextPrimary'>
        No spam. Just the latest releases and tips, interesting articles, and
        exclusive interviews in your inbox every week.
      </p>
      <TextInput
        placeholder='Your e-mail address'
        value={email}
        onchange={value => setEmail(value)}
        inputClassName='bg-background'
      />
      <Button
        label='Subscribe'
        variant='primary'
        size='sm'
        className='mt-auto'
      />
    </div>
  );
};

const ArticleCardWrapper = ({ item }: { item: ArticleListData }) => {
  return <ArticleCard article={item} className='h-full' />;
};
