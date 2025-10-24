import type { MiscSearch } from "@/types/miscTypes";
import type { FC } from "react";
import { Modal } from "@vellumlabs/cexplorer-sdk";
import { TextInput } from "@vellumlabs/cexplorer-sdk";
import { Button } from "@vellumlabs/cexplorer-sdk";

import { useState } from "react";
import { useLocaleStore } from "@vellumlabs/cexplorer-sdk";
import { useDebounce } from "@vellumlabs/cexplorer-sdk";
import { useFetchMiscSearch } from "@/services/misc";
import { useThemeStore } from "@vellumlabs/cexplorer-sdk";
import { Link } from "@tanstack/react-router";
import { formatString } from "@vellumlabs/cexplorer-sdk";
import { Copy } from "@vellumlabs/cexplorer-sdk";
import { ActionTypes } from "@vellumlabs/cexplorer-sdk";

interface DisplayVoteModalProps {
  onClose: () => void;
  onDisplay?: (value: string) => void;
}

export const DisplayVoteModal: FC<DisplayVoteModalProps> = ({
  onClose,
  onDisplay,
}) => {
  const { locale } = useLocaleStore();
  const { theme } = useThemeStore();

  const [focused, setFocused] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useDebounce(search.toLowerCase());

  const {
    data: queryData,
    isLoading,
    isFetching,
  } = useFetchMiscSearch(
    debouncedSearch ? debouncedSearch : undefined,
    "gov_action_proposal",
    locale,
  );

  const data = queryData?.data as MiscSearch;

  const hasData =
    search &&
    data &&
    Array.isArray(data) &&
    data.length &&
    !isLoading &&
    !isFetching;

  const noResult =
    !isLoading &&
    !isFetching &&
    search &&
    Array.isArray(data) &&
    (data as any).length === 0;

  return (
    <Modal minWidth='95%' maxWidth='600px' maxHeight='95%' onClose={onClose}>
      <TextInput
        value={search}
        onchange={value => setSearch(value)}
        placeholder='Search governance action ID...'
        showSearchIcon={!focused}
        inputClassName={`w-full bg-background`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCapitalize='off'
      />
      <div
        className={`flex h-[220px] w-full items-center justify-center py-1 ${!data ? "items-center justify-center" : ""}`}
      >
        {!search && (
          <span className='px-1.5 py-1.5 text-center text-text-sm'>
            Looks like you're missing a Gov Action ID. Enter one to find
            results!
          </span>
        )}
        {search && !data && (
          <div className='flex h-[150px] w-full items-center justify-center'>
            <div
              className={`loader h-[40px] w-[40px] border-[4px] ${theme === "light" ? "border-[#F2F4F7] border-t-darkBlue" : "border-[#475467] border-t-[#5EDFFA]"} border-t-[4px]`}
            ></div>
          </div>
        )}
        {noResult && (
          <span className='px-1.5 py-1.5 text-center text-text-sm'>
            No results. Check your input and try again.
          </span>
        )}
        {!!hasData && (
          <div className='flex h-full w-full flex-col'>
            <div className='flex h-full w-full justify-between gap-1.5 border-b border-border p-1.5 text-text-sm text-text'>
              <div>Type</div>
              {data[0]?.extra?.type ? (
                <ActionTypes title={data[0]?.extra?.type as any} />
              ) : (
                "-"
              )}
            </div>
            <div className='flex h-full w-full justify-between gap-1.5 border-b border-border p-1.5 text-text-sm text-text'>
              <div>Title</div>
              {data[0]?.title ? (
                <div className='flex items-center gap-2'>
                  <Link
                    to='/gov/action/$id'
                    params={{
                      id: (data as MiscSearch)[0]?.url
                        .replace("/gov/action/", "")
                        .replace("#", "%23"),
                    }}
                    className='text-primary'
                  >
                    <span className='inline-block max-w-[500px]'>
                      {data[0]?.title.split(" ")[0].length < 40
                        ? data[0]?.title
                        : formatString(data[0]?.title, "long")}
                    </span>
                  </Link>
                  <Copy copyText={data[0]?.title} />
                </div>
              ) : (
                "-"
              )}
            </div>
            <div className='flex h-full w-full justify-between gap-1.5 border-b border-border p-1.5 text-text-sm text-text'>
              <div>ID</div>
              {(data[0]?.extra as any)?.id ? (
                <div className='flex items-center gap-1'>
                  <Link
                    to='/gov/action/$id'
                    params={{
                      id: (data[0] as MiscSearch)?.url
                        .replace("/gov/action/", "")
                        .replace("#", "%23"),
                    }}
                    className='text-primary'
                  >
                    <span>
                      {formatString((data[0]?.extra as any)?.id, "longer")}
                    </span>
                  </Link>
                  <Copy copyText={(data[0]?.extra as any)?.id} />
                </div>
              ) : (
                "-"
              )}
            </div>
            <div className='flex h-full w-full justify-between gap-1.5 border-b border-border p-1.5 text-text-sm text-text'>
              <span>Ident</span>
              {data[0]?.ident ? (
                <div className='flex items-center gap-1'>
                  <span>{formatString(data[0]?.ident, "longer")}</span>
                  <Copy
                    copyText={data[0]?.ident}
                    className='translate-y-[2px]'
                  />
                </div>
              ) : (
                "-"
              )}
            </div>
          </div>
        )}
      </div>
      <div className='flex w-full items-center justify-end gap-1'>
        <Button variant='tertiary' size='md' label='Cancel' onClick={onClose} />
        <Button
          variant='primary'
          size='md'
          label='Add governance action'
          disabled={!hasData}
          onClick={() => {
            if (onDisplay) {
              onDisplay((data as any)[0]?.extra?.id);
            }

            if (onClose) {
              onClose();
            }
          }}
        />
      </div>
    </Modal>
  );
};
