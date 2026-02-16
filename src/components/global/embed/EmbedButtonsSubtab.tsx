import type { FC } from "react";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface EmbedButtonsSubtabProps {
  entityType: "pools" | "dreps";
  entityId: string;
  displayName: string;
}

export const EmbedButtonsSubtab: FC<EmbedButtonsSubtabProps> = ({
  entityType,
  entityId,
  displayName,
}) => {
  const { t } = useAppTranslation("pages");
  const entityUrl = `https://cexplorer.io/${entityType.slice(0, entityType.length - 1)}/${entityId}?action=delegate`;

  const buttonLabel =
    entityType === "pools"
      ? `Delegate to [${displayName}]`
      : `Delegate to ${displayName}`;

  const delegationButtonCode = `<a href="${entityUrl}" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; padding: 8px 16px; background-color: #1ba3e0; color: white; border: 2px solid #1ba3e0; border-radius: 8px; text-decoration: none; font-family: 'Inter', sans-serif; font-weight: 500; font-size: 14px; line-height: 20px; transition: transform 150ms; box-sizing: border-box;" onmouseover="this.style.transform='scale(1.01)'" onmouseout="this.style.transform='scale(1)'">${buttonLabel}</a>`;

  const titleKey =
    entityType === "pools"
      ? "pools.detailPage.embed.spoDelegationButton"
      : "dreps.detailPage.embed.drepDelegationButton";

  const previewKey = `${entityType}.detailPage.embed.preview`;

  const delegateToLabel =
    entityType === "pools"
      ? t("pools.detailPage.delegateTo", { ticker: displayName })
      : t("dreps.detailPage.delegateTo", { name: displayName });

  return (
    <div className='flex flex-col gap-2 pt-4'>
      <div className='flex flex-col gap-4 md:flex-row md:gap-6'>
        <div className='flex flex-1 flex-col gap-2'>
          <span className='text-text-sm font-medium'>{t(titleKey)}</span>
          <div className='relative rounded-m border border-border bg-darker p-3 pr-10'>
            <pre className='overflow-x-auto whitespace-pre-wrap break-all text-text-sm text-grayTextPrimary'>
              {delegationButtonCode}
            </pre>
            <div className='absolute right-2 top-2'>
              <Copy copyText={delegationButtonCode} />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <span className='text-text-sm font-medium'>{t(previewKey)}</span>
          <a
            href={entityUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex w-fit items-center justify-center rounded-[8px] border-2 border-darkBlue bg-darkBlue px-[16px] py-[8px] text-text-sm font-medium text-white duration-150 hover:scale-[101%] hover:text-white active:scale-[98%]'
          >
            {delegateToLabel}
          </a>
        </div>
      </div>
    </div>
  );
};
