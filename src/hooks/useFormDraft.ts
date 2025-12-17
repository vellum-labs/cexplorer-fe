import { useCallback, useEffect, useRef } from "react";

const DRAFT_PREFIX = "admin_draft_";

export function useFormDraft<T extends object>(
  key: string,
  formState: T,
  setFormState: React.Dispatch<React.SetStateAction<T>>,
  serverData: T | undefined,
) {
  const storageKey = `${DRAFT_PREFIX}${key}`;
  const isInitialized = useRef(false);
  const serverDataLoaded = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormState(parsed);
      }
    } catch (e) {
      console.error("Failed to load draft from localStorage:", e);
    }
  }, [storageKey, setFormState]);

  useEffect(() => {
    if (!serverData || serverDataLoaded.current) return;
    serverDataLoaded.current = true;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const isDifferent =
          JSON.stringify(parsed) !== JSON.stringify(serverData);
        if (isDifferent) {
          return;
        }
      }
      setFormState(serverData);
    } catch (e) {
      setFormState(serverData);
    }
  }, [serverData, storageKey, setFormState]);

  useEffect(() => {
    if (!isInitialized.current) return;

    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(formState));
      } catch (e) {
        console.error("Failed to save draft to localStorage:", e);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [formState, storageKey]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.error("Failed to clear draft from localStorage:", e);
    }
  }, [storageKey]);

  const hasDraft = useCallback(() => {
    if (!serverData) return false;
    return JSON.stringify(formState) !== JSON.stringify(serverData);
  }, [formState, serverData]);

  const discardDraft = useCallback(() => {
    if (serverData) {
      setFormState(serverData);
      clearDraft();
    }
  }, [serverData, setFormState, clearDraft]);

  return { clearDraft, hasDraft, discardDraft };
}
