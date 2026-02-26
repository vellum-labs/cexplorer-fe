import type { useFetchPolicyDetail } from "@/services/policy";
import parse from "html-react-parser";
import type { FC } from "react";

import Attach from "@/resources/images/icons/attach.svg";
import { DiscordLogo } from "@vellumlabs/cexplorer-sdk";
import { TwitterLogo } from "@vellumlabs/cexplorer-sdk";

import { OverviewCard } from "@vellumlabs/cexplorer-sdk";
import { Image } from "@vellumlabs/cexplorer-sdk";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";
import { TimeDateIndicator } from "@vellumlabs/cexplorer-sdk";

import { formatNumber, formatString } from "@vellumlabs/cexplorer-sdk";

import { useFetchMiscBasic } from "@/services/misc";
import type { PolicyJson } from "@/types/assetsTypes";
import { getRouteApi, Link } from "@tanstack/react-router";
import { LockedPolicy, OpenPolicy } from "../asset/tabs/AssetTimelockTab";
import { AdaWithTooltip } from "@vellumlabs/cexplorer-sdk";
import { Badge } from "@vellumlabs/cexplorer-sdk";
import { WatchlistSection } from "../global/watchlist/WatchlistSection";
import { Tooltip } from "@vellumlabs/cexplorer-sdk";
import { configJSON } from "@/constants/conf";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface PolicyDetailOverviewProps {
  type: "nft" | "token";
  timelock: boolean;
  query: ReturnType<typeof useFetchPolicyDetail>;
  json?: PolicyJson;
}

export const PolicyDetailOverview: FC<PolicyDetailOverviewProps> = ({
  type,
  query,
  timelock,
  json,
}) => {
  const { t } = useAppTranslation("common");
  const route = getRouteApi("/policy/$policyId");
  const { policyId } = route.useParams();

  const { market } = configJSON;

  const marketEnable =
    type === "nft" ? market[0].nft[0].active : market[0].token[0].active;

  const isRegistered = query.data?.data?.collection?.name;

  const { data } = useFetchMiscBasic();
  const currentSlot = data?.data.block.slot_no ?? 0;
  const stats = query.data?.data?.policy?.stats;

  const evaluateScript = (
    script: PolicyJson | undefined,
    indentLevel: number = 0,
  ): [boolean, string] => {
    if (!script || !script.type) return [false, t("asset.unknownScriptType")];

    const evaluate = (
      script: PolicyJson,
      ruleNumber: number = 1,
      indentLevel: number = 0,
    ): [boolean, string] => {
      const indent = "   ".repeat(indentLevel);
      const ruleLabel = indentLevel <= 1 ? t("asset.rule") : t("asset.subRule");
      switch (script.type) {
        case "sig": {
          return [
            false,
            `${indent} ${ruleLabel} #${ruleNumber}: ${t("asset.signedByKey")} ${script.keyHash}`,
          ];
        }
        case "before": {
          return [
            script.slot < currentSlot,
            `${indent} ${ruleLabel} #${ruleNumber}: ${t("asset.beforeSlot", { slot: formatNumber(script.slot), currentSlot: formatNumber(currentSlot) })}`,
          ];
        }
        case "after": {
          return [
            script.slot > currentSlot,
            `${indent} ${ruleLabel} #${ruleNumber}: ${t("asset.afterSlot", { slot: formatNumber(script.slot), currentSlot: formatNumber(currentSlot) })}`,
          ];
        }
        case "all": {
          const allResults = script.scripts.map((s, index) =>
            evaluate(s, index + 1, indentLevel + 1),
          );
          const someLocked = allResults.some(([locked]) => locked);
          const allConditions = allResults
            .map(([, condition]) => condition)
            .join("\n");
          return [
            someLocked,
            `${indent}${t("asset.allRulesMustBeMet")}\n${allConditions}`,
          ];
        }
        case "any": {
          const anyResults = script.scripts.map((s, index) =>
            evaluate(s, index + 1, indentLevel + 1),
          );
          const anyLocked = anyResults.every(([locked]) => locked);
          const anyConditions = anyResults
            .map(([, condition]) => condition)
            .join("\n");
          return [
            anyLocked,
            `${indent}${t("asset.atLeastOneRuleMustBeMet")}\n${anyConditions}`,
          ];
        }
        case "atLeast": {
          const atLeastResults = script.scripts.map((s, index) =>
            evaluate(s, index + 1, indentLevel + 1),
          );
          const atLeastLocked =
            atLeastResults.filter(([locked]) => locked).length >=
            script.required;
          const atLeastConditions = atLeastResults
            .map(([, condition]) => condition)
            .join("\n");
          return [
            atLeastLocked,
            `${indent}${t("asset.atLeastNRulesMustBeMet", { count: script.required })}\n${atLeastConditions}`,
          ];
        }
        default:
          return [false, t("asset.unknownScriptType")];
      }
    };

    return evaluate(script, 1, indentLevel);
  };

  const [isLocked] = evaluateScript(json);

  const overview = [
    {
      label: t("policy.name"),
      value: query.data?.data?.collection?.name ?? "-",
      visible: !!isRegistered,
    },
    {
      label: t("policy.floorPrice"),
      value: query.data?.data?.collection?.stats?.floor ? (
        <AdaWithTooltip data={query.data?.data?.collection?.stats?.floor} />
      ) : (
        "-"
      ),
      visible: type === "nft" && marketEnable,
    },
    {
      label: t("policy.price"),
      value: t("policy.tbd"),
      visible: type === "token" && marketEnable,
    },
    {
      label: t("policy.royalties"),
      value: query.data?.data?.collection?.stats?.royalties?.rate
        ? `${query.data?.data?.collection?.stats?.royalties?.rate * 100}%`
        : "-",
      visible: type === "nft",
    },
    {
      label: t("policy.owners"),
      value: formatNumber(query.data?.data?.collection?.stats?.owners),
      visible: !!isRegistered,
    },
    {
      label: t("policy.volume"),
      value: query.data?.data?.collection?.stats?.volume ? (
        <AdaWithTooltip data={query.data?.data?.collection?.stats?.volume} />
      ) : (
        "-"
      ),
      visible: marketEnable,
    },
  ];

  const blockchain = [
    {
      label: t("policy.policyId"),
      value: query.data?.data?.id
        ? formatString(query.data?.data?.id, "long")
        : "-",
    },
    {
      label: t("policy.policyLock"),
      value: (
        <Tooltip
          hide={!timelock}
          content={
            <div className='flex flex-col gap-1.5'>
              {isLocked ? <LockedPolicy /> : <OpenPolicy />}
              {parse(evaluateScript(json, 0)[1])}
            </div>
          }
        >
          {timelock ? (
            <Link
              to='/policy/$policyId'
              params={{
                policyId: policyId,
              }}
              search={
                {
                  tab: "timelock",
                } as any
              }
              className='text-primary'
            >
              {isLocked ? t("policy.locked") : t("policy.open")}
            </Link>
          ) : (
            t("policy.none")
          )}
        </Tooltip>
      ),
    },
    {
      label: t("policy.firstMint"),
      value: query.data?.data?.policy?.last_mint ? (
        <TimeDateIndicator time={query.data?.data?.policy?.first_mint} />
      ) : (
        "-"
      ),
    },
    {
      label: t("policy.lastMint"),
      value: query.data?.data?.policy?.last_mint ? (
        <TimeDateIndicator time={query.data?.data?.policy?.last_mint} />
      ) : (
        "-"
      ),
    },
    {
      label: t("policy.lastEpochActivity"),
      value: stats ? (
        <div className='flex flex-col'>
          <Badge color='blue'>{t("policy.recently")}</Badge>
          <div className='flex flex-wrap items-center gap-1/2'>
            {stats?.total_address && (
              <span className='text-[10px]'>
                {t("policy.activeAddresses")}: {stats?.total_address}
              </span>
            )}
            {stats?.total_asset_volume && (
              <span className='text-[10px]'>
                | {t("policy.assetVolume")}: {stats?.total_asset_volume}
              </span>
            )}
            {stats?.total_count && (
              <span className='text-[10px]'>
                | {t("policy.txs")}: {stats?.total_count}
              </span>
            )}
          </div>
        </div>
      ) : (
        <Badge color='yellow'>{t("policy.inPastTime")}</Badge>
      ),
      visible:
        !!query.data?.data?.policy?.quantity &&
        query.data?.data?.policy?.quantity > 100,
    },
    {
      label: t("policy.mintCount"),
      value: query.data?.data?.policy?.mintc
        ? formatNumber(query.data?.data?.policy?.mintc)
        : "-",
    },
  ];

  return (
    <section className='flex w-full flex-col items-center'>
      <div className='flex w-full max-w-desktop justify-end px-mobile md:px-desktop'>
        <WatchlistSection
          ident={policyId}
          isLoading={query.isLoading}
          collection={query?.data?.data?.collection?.url}
        />
      </div>
      <div className='flex w-full max-w-desktop flex-grow flex-wrap gap-3 px-mobile pt-1.5 md:px-desktop xl:flex-nowrap xl:justify-start'>
        <div className='flex grow basis-[980px] flex-wrap items-stretch gap-3'>
          {query.isLoading ? (
            <>
              <LoadingSkeleton
                rounded='lg'
                height='300px'
                className='flex-grow basis-[390px] md:flex-shrink-0'
              />
              <LoadingSkeleton
                rounded='lg'
                height='300px'
                className='flex-grow basis-[390px] md:flex-shrink-0'
              />
              {type === "token" && (
                <LoadingSkeleton
                  rounded='lg'
                  height='300px'
                  className='flex-grow basis-[390px] md:flex-shrink-0'
                />
              )}
            </>
          ) : (
            query.data?.data && (
              <>
                <div className='flex-grow basis-[390px] md:flex-shrink-0'>
                  <OverviewCard
                    title={t("policy.overview")}
                    overviewList={overview}
                    startContent={
                      // TODO: Make this visible
                      false && (
                        <div className='flex h-full w-full flex-col gap-2 pt-1.5 lg:w-fit'>
                          <Image
                            className='aspect-square rounded-max'
                            height={160}
                            width={160}
                          />
                          <div className='flex w-[180px] justify-center gap-4'>
                            <img
                              src={TwitterLogo}
                              alt='X'
                              height={24}
                              width={24}
                            />
                            <img
                              src={DiscordLogo}
                              alt='X'
                              height={24}
                              width={24}
                            />
                            <img src={Attach} alt='X' height={24} width={24} />
                          </div>
                        </div>
                      )
                    }
                    labelClassname='min-w-[135px] text-nowrap'
                    className='h-fit md:h-full'
                  />
                </div>
                <div className='flex-grow basis-[350px] md:flex-shrink-0'>
                  <OverviewCard
                    title={t("policy.blockchain")}
                    overviewList={blockchain}
                    labelClassname='text-nowrap min-w-[130px]'
                    className='h-full'
                  />
                </div>
              </>
            )
          )}
        </div>
      </div>
    </section>
  );
};
