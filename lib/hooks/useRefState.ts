import { useRef, useState } from "react";

export type RefState<T> = {
  current: T;
  readonly setValue: (newValue: T | ((oldValue: T) => T)) => T;
};

/**
 * A combination of `useRef` and `useState`.
 *
 * Triggers a re-render like `useState`, but also provides a `current` property like `useRef`.
 */

export default function useRefState<T>(initialState: T | (() => T)): RefState<T> {
  const ref = useRef<RefState<T>>(undefined);
  const state = useState<T>(initialState);
  return (ref.current ??= initRef(state));
}

function initRef<T>([initialState, setState]: [T, (newValue: T) => void]): RefState<T> {
  let state = initialState;

  return {
    get current() {
      return state;
    },
    set current(newValue: T) {
      setState((state = newValue));
    },
    setValue: newValue => {
      state = typeof newValue === "function" ? (newValue as (oldValue: T) => T)(state) : newValue;
      setState(state);
      return state;
    },
  };
}
