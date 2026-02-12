import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useState, useCallback, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";

type ModalType = "add" | "edit" | "remove" | null;

export const useBookmark = () => {
  const routerState = useRouterState();
  const {
    bookmarks,
    addBookmark,
    editBookmark,
    removeBookmark,
    getBookmarkByUrl,
  } = useBookmarkStore();

  const [modalType, setModalType] = useState<ModalType>(null);

  const currentUrl = routerState.location.href;
  const currentBookmark = useMemo(
    () => getBookmarkByUrl(currentUrl),
    [currentUrl, bookmarks, getBookmarkByUrl],
  );
  const isBookmarked = !!currentBookmark;

  const handleBookmarkClick = useCallback(() => {
    if (isBookmarked) {
      setModalType("remove");
    } else {
      setModalType("add");
    }
  }, [isBookmarked]);

  const handleAddBookmark = useCallback(
    (name: string) => {
      const pageTitle = document.title || currentUrl;
      addBookmark(pageTitle, currentUrl, name);
      setModalType(null);
    },
    [currentUrl, addBookmark],
  );

  const handleEditBookmark = useCallback(
    (newName: string) => {
      if (currentBookmark) {
        editBookmark(currentBookmark.id, newName);
      }
      setModalType(null);
    },
    [currentBookmark, editBookmark],
  );

  const handleRemoveBookmark = useCallback(() => {
    if (currentBookmark) {
      removeBookmark(currentBookmark.id);
    }
    setModalType(null);
  }, [currentBookmark, removeBookmark]);

  const showRemoveModal = useCallback(() => {
    setModalType("remove");
  }, []);

  const closeModal = useCallback(() => {
    setModalType(null);
  }, []);

  return {
    isBookmarked,
    currentBookmark,
    modalType,
    handleBookmarkClick,
    handleAddBookmark,
    handleEditBookmark,
    handleRemoveBookmark,
    showRemoveModal,
    closeModal,
  };
};
