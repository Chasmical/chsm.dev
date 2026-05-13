import { useRef } from "react";

export interface LatestRefObject<T> {
  readonly current: T;
}

export default function useLatest<T>(value: T): LatestRefObject<T> {
  const ref = useRef(value);
  // eslint-disable-next-line react-hooks/refs
  ref.current = value;
  return ref;
}
