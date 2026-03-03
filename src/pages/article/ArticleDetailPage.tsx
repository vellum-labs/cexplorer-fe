import { ArticleCard } from "@/components/article/ArticleCard";
import { Button, SafetyLinkModal } from "@vellumlabs/cexplorer-sdk";
import { Image } from "@vellumlabs/cexplorer-sdk";
import {
  BreadcrumbRaw,
  BreadcrumbItem,
  BreadcrumbList,
} from "@vellumlabs/cexplorer-sdk";
import { useFetchArticleDetail, useFetchArticleList } from "@/services/article";
import { formatDate, formatString } from "@vellumlabs/cexplorer-sdk";
import { renderArticleAuthor } from "@/utils/renderArticleAuthor";
import { getRouteApi, Link } from "@tanstack/react-router";
import parse from "html-react-parser";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import metadata from "../../../conf/metadata/en-metadata.json";
import { RandomDelegationModal } from "@/components/wallet/RandomDelegationModal";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { Twitter } from "@/resources/images/icons/Twitter";
import { Facebook } from "@/resources/images/icons/Facebook";
import { Instagram, LinkIcon } from "lucide-react";
import { isEmptySocial } from "@/utils/user/isEmptySocial";
import { resolveSocialUrl } from "@/utils/user/resolveSocialUrl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { markdownComponents } from "@/constants/markdows";
import { handleDelegation } from "@/utils/wallet/handleDelegation";
import { useWalletStore } from "@/stores/walletStore";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useLocaleStore } from "@vellumlabs/cexplorer-sdk";

export const ArticleDetailPage = () => {
  const { t } = useAppTranslation("common");
  const { locale } = useLocaleStore();
  const route = getRouteApi("/article/$url");
  const { url } = route.useParams();

  const { wallet } = useWalletStore();

  const [clickedUrl, setClickedUrl] = useState<string | null>(null);

  const detailQuery = useFetchArticleDetail(locale, "article", url);
  const listQuery = useFetchArticleList(locale, 0, 20);
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
        <section className='flex h-auto w-full justify-center p-3'>
          <div className='flex w-full flex-col gap-1.5 md:flex-row'>
            <div className='flex w-full max-w-desktop flex-col justify-center gap-1.5'>
              <div className='flex w-[calc(100%-72px)] flex-col justify-between gap-1.5'>
                <LoadingSkeleton height='40px' width='200px' rounded='md' />
                <div className='mb-auto'>
                  <LoadingSkeleton height='40px' width='100%' rounded='md' />
                  <LoadingSkeleton height='60px' width='100%' rounded='md' />
                </div>
                <LoadingSkeleton height='40px' width='150px' rounded='md' />
                <LoadingSkeleton height='40px' width='150px' rounded='md' />
              </div>
              <div className='flex w-full justify-end lg:w-[calc(100%-72px)]'>
                <LoadingSkeleton
                  height='300px'
                  width='100%'
                  className='md:h-[380px]'
                  rounded='md'
                />
              </div>
              <article className='my-3 w-full text-left lg:my-0 lg:w-[calc(100%-72px)]'>
                <LoadingSkeleton height='400px' width='100%' rounded='md' />
              </article>
            </div>
            <div className='flex w-[400px] flex-col gap-1.5'>
              <LoadingSkeleton height='36px' width='100%' rounded='md' />
              <LoadingSkeleton height='200px' width='100%' rounded='md' />
              <LoadingSkeleton height='100px' width='100%' rounded='md' />
              <LoadingSkeleton height='150px' width='100%' rounded='md' />
              <LoadingSkeleton height='150px' width='100%' rounded='md' />
              <LoadingSkeleton height='150px' width='100%' rounded='md' />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        {
          <title>
            {metadata.articleDetail.title.replace(
              "%article%",
              String(parse(data?.name ?? "")) || "Article",
            )}
          </title>
        }
      </Helmet>
      <main className='mx-auto flex min-h-minHeight w-full max-w-desktop flex-col items-center'>
        {openDelegationModal && (
          <RandomDelegationModal
            onClose={() => setOpenDelegationModal(false)}
          />
        )}
        <section className='flex h-auto w-full justify-center p-3'>
          <div className='flex w-full flex-col gap-1.5 md:flex-row'>
            <div className='flex w-full max-w-desktop flex-col justify-center gap-1.5'>
              <div className='flex w-[calc(100%-72px)] flex-col justify-between gap-1.5'>
                <BreadcrumbRaw className='mb-2 w-full'>
                  <BreadcrumbList className='flex items-center'>
                    <BreadcrumbItem>
                      <Link className='underline underline-offset-2' to='/'>
                        {t("articlePage.home")}
                      </Link>
                    </BreadcrumbItem>
                    /
                    <BreadcrumbItem>
                      <Link
                        className='underline underline-offset-2'
                        to={"/article"}
                      >
                        {t("articlePage.breadcrumb")}
                      </Link>
                    </BreadcrumbItem>
                    /
                    <BreadcrumbItem className='text-text'>
                      {t("articlePage.breadcrumbDetail")}
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
                  <span className='text-grayTextPrimary'>
                    {t("articlePage.published")}
                  </span>
                  <span>
                    {data?.pub_date ? formatDate(data?.pub_date) : "-"}
                  </span>
                </div>
              </div>
              <div className='flex w-full justify-end lg:w-[calc(100%-72px)]'>
                <Image
                  src={data?.image || ""}
                  className='h-[300px] w-full rounded-m object-cover md:h-[380px]'
                  height={380}
                />
              </div>
              <article className='[&>*]:text-base my-3 w-full text-left text-text-md lg:my-0 lg:w-[calc(100%-72px)] [&>h2]:my-2'>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents(setClickedUrl)}
                >
                  {data?.data[0]}
                </ReactMarkdown>
              </article>
            </div>
            <div className='flex w-[400px] flex-col gap-1.5'>
              <SocialsAndCopy stretchCopy />
              <div className='flex w-full flex-col gap-1.5 rounded-m border border-border bg-cardBg p-2'>
                <h3>{t("articlePage.author")}</h3>
                <h2>{renderArticleAuthor(data?.user_owner)}</h2>
                {(data?.user_owner?.pool?.meta?.ticker ||
                  data?.user_owner?.pool?.id) && (
                  <div className='flex w-full items-center justify-between gap-1.5 text-text-sm text-grayTextSecondary'>
                    <span className='inline-block text-nowrap'>
                      {t("articlePage.stakePool")}
                    </span>
                    {data?.user_owner?.pool?.meta?.ticker ? (
                      <Link
                        to='/pool/$id'
                        params={{ id: data.user_owner.pool.id }}
                        className='w-[60%] overflow-hidden text-ellipsis whitespace-nowrap text-right text-text-sm text-primary'
                      >
                        [{data.user_owner.pool.meta.ticker}]
                      </Link>
                    ) : data?.user_owner?.pool?.id ? (
                      <Link
                        to='/pool/$id'
                        params={{ id: data.user_owner.pool.id }}
                        className='w-[60%] overflow-hidden text-ellipsis whitespace-nowrap text-right text-text-sm text-primary'
                      >
                        {formatString(data.user_owner.pool.id, "long")}
                      </Link>
                    ) : (
                      <span className='w-[60%] text-right text-text-sm'>-</span>
                    )}
                  </div>
                )}
                {(data?.user_owner?.drep?.meta?.given_name ||
                  data?.user_owner?.drep?.id) && (
                  <div className='flex w-full items-center justify-between gap-1.5 text-text-sm text-grayTextSecondary [&>div]:w-[60%]'>
                    <span className='inline-block text-nowrap'>
                      {t("articlePage.drep")}
                    </span>
                    {data?.user_owner?.drep?.meta?.given_name ? (
                      <Link
                        to='/drep/$hash'
                        params={{ hash: data.user_owner.drep.id }}
                        className='w-[60%] overflow-hidden text-ellipsis whitespace-nowrap text-right text-text-sm text-primary'
                      >
                        {data.user_owner.drep.meta.given_name}
                      </Link>
                    ) : data?.user_owner?.drep?.id ? (
                      <Link
                        to='/drep/$hash'
                        params={{ hash: data.user_owner.drep.id }}
                        className='w-[60%] overflow-hidden text-ellipsis whitespace-nowrap text-right text-text-sm text-primary'
                      >
                        {formatString(data.user_owner.drep.id, "long")}
                      </Link>
                    ) : (
                      <span className='w-[60%] text-right text-text-sm'>-</span>
                    )}
                  </div>
                )}
                {data?.user_owner?.profile?.social &&
                  (!isEmptySocial(data.user_owner.profile.social.xcom) ||
                    !isEmptySocial(data.user_owner.profile.social.facebook) ||
                    !isEmptySocial(data.user_owner.profile.social.instagram) ||
                    !isEmptySocial(data.user_owner.profile.social.web)) && (
                    <div className='flex w-full items-center justify-between gap-1.5 text-text-sm text-grayTextSecondary'>
                      <span className='inline-block text-nowrap'>
                        {t("articlePage.socials")}
                      </span>
                      <div className='flex items-center gap-2'>
                        {!isEmptySocial(
                          data.user_owner.profile.social.xcom,
                        ) && (
                          <a
                            href={resolveSocialUrl(data.user_owner.profile.social.xcom, "xcom")}
                            target='_blank'
                            rel='nofollow noopener'
                          >
                            <Twitter size={20} color='#98A2B3' />
                          </a>
                        )}
                        {!isEmptySocial(
                          data.user_owner.profile.social.facebook,
                        ) && (
                          <a
                            href={resolveSocialUrl(data.user_owner.profile.social.facebook, "facebook")}
                            target='_blank'
                            rel='nofollow noopener'
                          >
                            <Facebook size={20} color='#98A2B3' />
                          </a>
                        )}
                        {!isEmptySocial(
                          data.user_owner.profile.social.instagram,
                        ) && (
                          <a
                            href={resolveSocialUrl(data.user_owner.profile.social.instagram, "instagram")}
                            target='_blank'
                            rel='nofollow noopener'
                          >
                            <Instagram size={20} color='#98A2B3' />
                          </a>
                        )}
                        {!isEmptySocial(data.user_owner.profile.social.web) && (
                          <a
                            href={resolveSocialUrl(data.user_owner.profile.social.web, "web")}
                            target='_blank'
                            rel='nofollow noopener'
                          >
                            <LinkIcon size={20} color='#98A2B3' />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                <div className='flex flex-wrap items-center gap-1'>
                  {data?.user_owner?.pool?.id && (
                    <Button
                      size='sm'
                      variant='primary'
                      label={
                        data?.user_owner?.pool?.meta?.ticker
                          ? t("articlePage.delegateTo", {
                              name: `[${data?.user_owner?.pool?.meta?.ticker}]`,
                            })
                          : t("articlePage.delegateToPool")
                      }
                      onClick={() => {
                        if (data?.user_owner?.pool?.id) {
                          handleDelegation(
                            {
                              ident: data?.user_owner?.pool?.id,
                              type: "pool",
                            },
                            wallet,
                          );
                        }
                      }}
                    />
                  )}
                  {data?.user_owner?.drep?.id && (
                    <Button
                      size='sm'
                      variant='primary'
                      label={t("articlePage.delegateToDrep")}
                      onClick={() => {
                        if (data?.user_owner?.drep?.id) {
                          handleDelegation(
                            {
                              ident: data?.user_owner?.drep?.id,
                              type: "drep",
                            },
                            wallet,
                          );
                        }
                      }}
                    />
                  )}
                </div>
              </div>
              <div className='flex w-full flex-col gap-2 rounded-m border border-border bg-cardBg p-2'>
                <h3>{t("articlePage.keywords")}</h3>
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
          </div>
        </section>
      </main>
      {clickedUrl && (
        <SafetyLinkModal
          url={clickedUrl}
          onClose={() => setClickedUrl(null)}
          warningText={t("sdk:safetyLink.warningText")}
          goBackLabel={t("sdk:safetyLink.goBackLabel")}
          visitLabel={t("sdk:safetyLink.visitLabel")}
        />
      )}
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
  const { t } = useAppTranslation();
  const [copied, setCopied] = useState(false);
  let timeout: NodeJS.Timeout;

  const handleCopy = () => {
    clearTimeout(timeout);
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    timeout = setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className={`flex h-9 gap-1/2 ${className}`}>
      <Button
        leftIcon={copied ? <Check size={15} /> : <Copy size={15} />}
        label={t("articlePage.copyLink")}
        className={stretchCopy ? "w-full max-w-full" : ""}
        variant='tertiary'
        size='sm'
        onClick={handleCopy}
      />
      <Button
        leftIcon={<Twitter size={20} color='#98A2B3' />}
        variant='tertiary'
        size='sm'
        onClick={handleShareX}
      />
      <Button
        leftIcon={<Facebook size={20} color='#98A2B3' />}
        variant='tertiary'
        size='sm'
        onClick={handleShareFacebook}
      />
    </div>
  );
};
