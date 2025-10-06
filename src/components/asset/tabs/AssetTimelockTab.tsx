import { Badge } from "@/components/global/badges/Badge";
import { JsonDisplay } from "@/components/global/JsonDisplay";
import { Tooltip } from "@/components/ui/tooltip";
import { colors } from "@/constants/colors";
import { useFetchMiscBasic } from "@/services/misc";
import type { NestedScript, PolicyJson } from "@/types/assetsTypes";
import { formatNumber } from "@/utils/format/format";
import { formatRemainingTime } from "@/utils/format/formatRemainingTime";
import { format } from "date-fns";
import parse from "html-react-parser";
import { LockIcon, LockOpen } from "lucide-react";
import { type FC } from "react";

export const AssetTimelockTab: FC<{ json: PolicyJson | undefined }> = ({
  json,
}) => {
  const { data } = useFetchMiscBasic();
  const currentSlot = data?.data.block.slot_no ?? 0;

  const evaluateScript = (
    script: PolicyJson | undefined,
    indentLevel: number = 0,
  ): [boolean, string] => {
    if (!script || !script.type) return [false, "Unknown script type"];

    const evaluate = (
      script: PolicyJson,
      ruleNumber: number = 1,
      indentLevel: number = 0,
    ): [boolean, string] => {
      const indent = "   ".repeat(indentLevel);
      switch (script.type) {
        case "sig": {
          return [
            false,
            `${indent} ${indentLevel <= 1 ? "Rule" : "Sub-rule"} #${ruleNumber}: Signed by key ${script.keyHash}`,
          ];
        }
        case "before": {
          return [
            script.slot < currentSlot,
            `${indent} ${indentLevel <= 1 ? "Rule" : "Sub-rule"} #${ruleNumber}: Before slot ${formatNumber(script.slot)} (current slot: ${formatNumber(currentSlot)})`,
          ];
        }
        case "after": {
          return [
            script.slot > currentSlot,
            `${indent} ${indentLevel <= 1 ? "Rule" : "Sub-rule"} #${ruleNumber}: After slot ${formatNumber(script.slot)} (current slot: ${formatNumber(currentSlot)})`,
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
            `${indent}<b>All rules must be met:</b>\n${allConditions}`,
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
            `${indent}<b>At least one rule must be met</b>:\n${anyConditions}`,
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
            `${indent}<b>At least ${script.required} rules must be met</b>:\n${atLeastConditions}`,
          ];
        }
        default:
          return [false, "Unknown script type"];
      }
    };

    return evaluate(script, 1, indentLevel);
  };

  const renderScript = (
    script: PolicyJson | undefined,
    ruleNumber: number = 1,
    indentLevel: number = 0,
  ) => {
    if (!script || !script.type) return null;

    if (
      script.type === "sig" ||
      script.type === "before" ||
      script.type === "after"
    ) {
      const targetDate = new Date();
      script.type !== "sig" &&
        targetDate.setSeconds(
          targetDate.getSeconds() +
            (script.slot > currentSlot
              ? script.slot - currentSlot
              : -(currentSlot - script.slot)),
        );
      const formattedDate = format(targetDate, "MMM dd yyyy, HH:mm:ss");

      return (
        <section className='flex flex-col gap-2 rounded-l bg-darker p-2 text-text-sm'>
          <div className='flex gap-1'>
            <span className='flex h-fit w-fit items-center gap-1/2 rounded-s border border-border bg-background px-1 py-1/4 text-text-xs font-medium'>
              {indentLevel <= 1
                ? `Rule #${ruleNumber}`
                : `Sub-rule #${ruleNumber}`}
            </span>
            <Badge color='blue'>
              {script.type.slice(0, 1).toUpperCase() + script.type.slice(1)}
            </Badge>
            {script.type === "sig" && (
              <Badge color='gray'>Keyhash: {script.keyHash}</Badge>
            )}
            {(script.type === "before" || script.type === "after") && (
              <>
                <Badge color='light'>Slot: {formatNumber(script.slot)}</Badge>
              </>
            )}
            {(script.type === "before" || script.type === "after") && (
              <>
                <Tooltip
                  content={<div className='min-w-[150px]'>{formattedDate}</div>}
                >
                  <Badge color='light'>
                    {script.slot > currentSlot && "In "}
                    {formatRemainingTime(
                      script.slot > currentSlot
                        ? script.slot - currentSlot
                        : currentSlot - script.slot,
                    )}
                    {script.slot < currentSlot && " ago"}
                  </Badge>
                </Tooltip>
              </>
            )}
          </div>
          <JsonDisplay data={script} isError={false} isLoading={false} />
        </section>
      );
    } else {
      return (script as NestedScript).scripts.map((s, index) => (
        <div key={index}>{renderScript(s, index + 1, indentLevel + 1)}</div>
      ));
    }
  };

  const [isLocked, conditions] = evaluateScript(json);

  return (
    <>
      <h3 className='mb-1'>Minting policy</h3>
      <section className='mb-2 flex gap-2 rounded-l bg-darker p-2 text-text-sm'>
        {isLocked ? (
          <LockIcon
            size={40}
            className='rounded-s border border-border bg-background p-1'
            color={colors.primary}
          />
        ) : (
          <LockOpen
            size={40}
            className='rounded-s border border-border bg-background p-1'
            color={colors.primary}
          />
        )}
        <div className='flex flex-col gap-1'>
          {isLocked ? <LockedPolicy /> : <OpenPolicy />}
          <div>
            {conditions.split("\n").map((line, index) => (
              <div
                key={index}
                style={{
                  marginLeft: `${(line.match(/^ */)?.[0].length ?? 0) * 5}px`,
                }}
              >
                {parse(line.trim())}
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className='flex flex-col gap-2'>{renderScript(json)}</div>
    </>
  );
};

export const OpenPolicy = () => {
  return (
    <div className='flex h-fit w-fit items-center gap-1/2 rounded-s border border-border bg-background px-1 py-1/4 text-text-xs font-medium'>
      Policy is open
    </div>
  );
};

export const LockedPolicy = () => {
  return (
    <div className='flex h-fit w-fit items-center gap-1/2 rounded-s border border-border bg-background px-1 py-1/4 text-text-xs font-medium'>
      Policy is locked
    </div>
  );
};
