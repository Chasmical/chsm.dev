import { useRef } from "react";

export default function useLatestCallback<T extends (...args: never) => unknown>(func: T): T {
  const ref = useRef<T & { current: T }>(undefined);
  const latest = (ref.current ??= createRefCallback<T>());
  latest.current = func;
  return latest as never;
}

function createRefCallback<T extends (...args: never) => unknown>(): T & { current: T } {
  ref.current = undefined! as T;
  return ref as never;

  function ref(this: unknown, ...args: never) {
    ref.current.apply(this, args);
  }
}
