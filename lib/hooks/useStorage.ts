"use client";
import { SetStateAction, useMemo, useSyncExternalStore } from "react";
import useLatestCallback from "./useLatestCallback";

/**
 * The storage hooks return undefined when any of the parameters is invalid (storageArea is null, or key is falsey),
 * and return (string | null) for actual keys-values that can be manipulated in the given storageArea.
 *
 * During server-side rendering the hooks always return undefined.
 */

export function useLocalStorage<Key extends string | null | undefined>(key: Key) {
  return useStorage(typeof window === "undefined" ? null : window.localStorage, key);
}
export function useSessionStorage<Key extends string | null | undefined>(key: Key) {
  return useStorage(typeof window === "undefined" ? null : window.sessionStorage, key);
}

export default function useStorage<Key extends string | null | undefined>(
  storageArea: Storage | null,
  key: Key,
): [
  value: Key extends "" | null | undefined ? undefined : string | null,
  setValue: (newValue: SetStateAction<string | null | undefined>) => void,
] {
  const slot = useMemo(() => createStorageSlot(storageArea, key), [storageArea, key]);
  return useStorageSlot(slot) as never;
}

export function useStorageSlot(
  slot: StorageSlot,
): [value: string | null | undefined, setValue: (newValue: SetStateAction<string | null | undefined>) => void] {
  // Note: during server-side rendering, (() => undefined) gets called instead of slot.get
  const value = useSyncExternalStore(slot.listen, slot.get, () => undefined);
  const setter = useLatestCallback(slot.set);
  return [value, setter];
}

export interface StorageSlot {
  readonly get: () => string | null | undefined;
  readonly set: (newValue: SetStateAction<string | null | undefined>) => void;
  readonly listen: (onChange: () => void) => () => void;
}

const noopStorageSlot: StorageSlot = {
  get: () => undefined,
  set: () => {},
  listen: () => () => {},
};

export function createStorageSlot(storageArea: Storage | null, key: string | null | undefined): StorageSlot {
  if (!storageArea) {
    // Throw error if called from server-side (or if storageArea is not provided)
    const throwError = (): never => {
      throw new Error(
        typeof window === "undefined"
          ? "Cannot use localStorage and sessionStorage on the server!"
          : "storageArea argument was not provided to the storage hook!",
      );
    };
    return { get: throwError, set: throwError, listen: throwError };
  }
  // If the key is falsey ("" | null | undefined), return a no-op slot that always returns undefined
  if (!key) return noopStorageSlot;

  return {
    get: () => {
      return storageArea.getItem(key);
    },
    set: newValue => {
      // Get old value from the storage and determine the new value
      const oldValue = storageArea.getItem(key);
      if (typeof newValue === "function") newValue = newValue(oldValue);
      // If the value hasn't changed, do nothing
      newValue ??= null;
      if (newValue === oldValue) return;

      // If the value is null, remove it from storage; otherwise, set it
      newValue === null ? storageArea.removeItem(key) : storageArea.setItem(key, newValue);
      // Default "storage" event is only sent to **other** tabs, so we need to simulate one for this tab
      window.dispatchEvent(new StorageEvent("storage", { key, oldValue, newValue, storageArea }));
    },
    listen: onChange => {
      const listener = (event: StorageEvent) => {
        event.storageArea === storageArea && event.key === key && onChange();
      };
      window.addEventListener("storage", listener);
      return () => window.removeEventListener("storage", listener);
    },
  };
}
