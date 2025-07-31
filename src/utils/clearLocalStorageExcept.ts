export const clearLocalStorageExcept = (exceptions: string[]) => {
  for (const key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      if (!exceptions.includes(key)) {
        localStorage.removeItem(key);
      }
    }
  }
};
