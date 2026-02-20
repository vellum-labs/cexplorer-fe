import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  my_name: string;
  createdAt: number;
}

interface BookmarkState {
  bookmarks: Bookmark[];
}

interface BookmarkActions {
  addBookmark: (title: string, url: string, my_name: string) => void;
  editBookmark: (id: string, my_name: string) => void;
  removeBookmark: (id: string) => void;
  getBookmarkByUrl: (url: string) => Bookmark | undefined;
}

export const useBookmarkStore = handlePersistStore<BookmarkState, BookmarkActions>(
  "bookmark_store",
  { bookmarks: [] },
  (set, get) => ({
    addBookmark: (title, url, my_name) =>
      set(state => {
        const newBookmark: Bookmark = {
          id: crypto.randomUUID(),
          title,
          url,
          my_name,
          createdAt: Date.now(),
        };
        state.bookmarks.push(newBookmark);
      }),
    editBookmark: (id, my_name) =>
      set(state => {
        const bookmark = state.bookmarks.find(b => b.id === id);
        if (bookmark) {
          bookmark.my_name = my_name;
        }
      }),
    removeBookmark: id =>
      set(state => {
        state.bookmarks = state.bookmarks.filter(b => b.id !== id);
      }),
    getBookmarkByUrl: url => {
      return get().bookmarks.find(b => b.url === url);
    },
  }),
);
