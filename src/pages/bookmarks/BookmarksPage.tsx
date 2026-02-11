import { PageBase } from "@/components/global/pages/PageBase";
import { useBookmarkStore, type Bookmark } from "@/stores/bookmarkStore";
import { useBookmarksTableStore } from "@/stores/tables/bookmarksTableStore";
import { bookmarksTableOptions } from "@/constants/tables/bookmarksTableOptions";
import {
  EmptyState,
  EditBookmarkModal,
  RemoveBookmarkModal,
  GlobalTable,
  TableSearchInput,
  TableSettingsDropdown,
  Badge,
} from "@vellumlabs/cexplorer-sdk";
import {
  Bookmark as BookmarkIcon,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { formatString } from "@vellumlabs/cexplorer-sdk";

export const BookmarksPage = () => {
  const { t } = useAppTranslation();
  const { bookmarks, editBookmark, removeBookmark } = useBookmarkStore();
  const { columnsVisibility, rows, setColumnVisibility, setRows } =
    useBookmarksTableStore();
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [removingBookmark, setRemovingBookmark] = useState<Bookmark | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (newName: string) => {
    if (editingBookmark) {
      editBookmark(editingBookmark.id, newName);
      setEditingBookmark(null);
    }
  };

  const handleRemove = () => {
    if (removingBookmark) {
      removeBookmark(removingBookmark.id);
      setRemovingBookmark(null);
    }
  };

  const getPageType = (url: string): string => {
    const segment = url.split("/")[1];
    switch (segment) {
      case "address":
        return t("bookmarksPage.types.address");
      case "pool":
        return t("bookmarksPage.types.pool");
      case "tx":
        return t("bookmarksPage.types.transaction");
      case "block":
        return t("bookmarksPage.types.block");
      case "asset":
        return t("bookmarksPage.types.asset");
      case "stake":
        return t("bookmarksPage.types.stake");
      case "drep":
        return t("bookmarksPage.types.drep");
      case "policy":
        return t("bookmarksPage.types.policy");
      case "article":
        return t("bookmarksPage.types.article");
      case "wiki":
        return t("bookmarksPage.types.wiki");
      case "epoch":
        return t("bookmarksPage.types.epoch");
      case "script":
        return t("bookmarksPage.types.script");
      default:
        return t("bookmarksPage.types.page");
    }
  };

  const filteredBookmarks = useMemo(() => {
    const sorted = [...bookmarks].sort((a, b) => b.createdAt - a.createdAt);
    if (!searchQuery.trim()) return sorted;
    const query = searchQuery.toLowerCase();
    return sorted.filter(
      bookmark =>
        bookmark.my_name.toLowerCase().includes(query) ||
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query),
    );
  }, [bookmarks, searchQuery]);

  const columns: {
    key: string;
    title: React.ReactNode;
    visible: boolean;
    widthPx: number;
    render: (item: Bookmark) => React.ReactNode;
  }[] = [
    {
      key: "type",
      title: <p>{t("bookmarksPage.columns.type")}</p>,
      visible: columnsVisibility.type,
      widthPx: 120,
      render: (item: Bookmark) => (
        <Badge color='gray' className='whitespace-nowrap'>
          {getPageType(item.url)}
        </Badge>
      ),
    },
    {
      key: "my_name",
      title: <p>{t("bookmarksPage.columns.my_name")}</p>,
      visible: columnsVisibility.my_name,
      widthPx: 250,
      render: (item: Bookmark) => (
        <span className='font-medium text-text'>{item.my_name}</span>
      ),
    },
    {
      key: "url",
      title: <p>{t("bookmarksPage.columns.url")}</p>,
      visible: columnsVisibility.url,
      widthPx: 400,
      render: (item: Bookmark) => (
        <Link
          to={item.url as any}
          className='flex items-center gap-1 text-primary'
          title={item.url}
        >
          {formatString(item.url, "longer")}
          <ExternalLink size={14} className='shrink-0' />
        </Link>
      ),
    },
    {
      key: "actions",
      title: <p className='text-right'>{t("bookmarksPage.columns.actions")}</p>,
      visible: true,
      widthPx: 100,
      render: (item: Bookmark) => (
        <div className='flex justify-end gap-2'>
          <button
            type='button'
            onClick={e => {
              e.stopPropagation();
              setEditingBookmark(item);
            }}
            className='p-1 text-primary'
            aria-label={t("bookmarksPage.edit")}
          >
            <Pencil size={18} />
          </button>
          <button
            type='button'
            onClick={e => {
              e.stopPropagation();
              setRemovingBookmark(item);
            }}
            className='p-1 text-red-500'
            aria-label={t("bookmarksPage.remove")}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const mockQuery = {
    isLoading: false,
    isError: false,
    data: filteredBookmarks,
    refetch: () => Promise.resolve({ data: filteredBookmarks }),
  } as any;

  return (
    <PageBase
      metadataTitle='bookmarks'
      title={t("bookmarksPage.title")}
      breadcrumbItems={[{ label: t("bookmarksPage.breadcrumb") }]}
      bookmarkButton={false}
    >
      <section className='flex w-full max-w-desktop flex-col px-mobile pb-3 md:px-desktop'>
        {bookmarks.length > 0 ? (
          <>
            <div className='mb-2 flex w-full flex-col justify-between gap-1 md:flex-row md:items-center'>
              <h3 className='text-nowrap'>
                {filteredBookmarks.length}{" "}
                {filteredBookmarks.length === 1
                  ? t("bookmarksPage.bookmarkSingular")
                  : t("bookmarksPage.bookmarkPlural")}
              </h3>
              <div className='flex gap-1'>
                <TableSearchInput
                  placeholder={t("bookmarksPage.searchPlaceholder")}
                  value={searchQuery}
                  onchange={setSearchQuery}
                  wrapperClassName='md:w-[320px] w-full'
                  showSearchIcon
                />
                <TableSettingsDropdown
                  rows={rows}
                  setRows={setRows}
                  rowsLabel={t("common:table.rows")}
                  columnsOptions={bookmarksTableOptions.map(item => ({
                    label: t(`bookmarksPage.columns.${item.key}`),
                    isVisible: columnsVisibility[item.key],
                    onClick: () =>
                      setColumnVisibility(
                        item.key,
                        !columnsVisibility[item.key],
                      ),
                  }))}
                />
              </div>
            </div>
            <GlobalTable
              type='default'
              query={mockQuery}
              items={filteredBookmarks}
              columns={columns}
              totalItems={filteredBookmarks.length}
              itemsPerPage={rows}
              pagination={filteredBookmarks.length > rows}
              scrollable
              disableDrag
              minContentWidth={800}
              renderDisplayText={(count, total) =>
                t("common:table.displaying", { count, total })
              }
              noItemsLabel={t("common:table.noItems")}
            />
          </>
        ) : (
          <EmptyState
            icon={<BookmarkIcon size={24} />}
            primaryText={t("bookmarksPage.emptyPrimary")}
            secondaryText={t("bookmarksPage.emptySecondary")}
          />
        )}
      </section>
      {editingBookmark && (
        <EditBookmarkModal
          onClose={() => setEditingBookmark(null)}
          onSave={handleEdit}
          currentName={editingBookmark.my_name}
          title={t("bookmark.editModal.title")}
          description={t("bookmark.editModal.description")}
          currentNameLabel={t("bookmark.editModal.currentNameLabel")}
          newNameLabel={t("bookmark.editModal.newNameLabel")}
          newNamePlaceholder={t("bookmark.editModal.newNamePlaceholder")}
          cancelLabel={t("bookmark.editModal.cancelLabel")}
          saveLabel={t("bookmark.editModal.saveLabel")}
        />
      )}
      {removingBookmark && (
        <RemoveBookmarkModal
          onClose={() => setRemovingBookmark(null)}
          onRemove={handleRemove}
          bookmarkName={removingBookmark.my_name}
          title={t("bookmark.removeModal.title")}
          description={t("bookmark.removeModal.description")}
          nameLabel={t("bookmark.removeModal.nameLabel")}
          cancelLabel={t("bookmark.removeModal.cancelLabel")}
          removeLabel={t("bookmark.removeModal.removeLabel")}
        />
      )}
    </PageBase>
  );
};
