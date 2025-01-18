"use client";
import { useRef, useState } from "react";

export default function useDebounce<Args extends unknown[]>(
  callback: (...args: Args) => void | Promise<void>,
  waitMs: number,
): [state: DebounceState, run: (...args: Args) => void] {
  const [state, setState] = useState<DebounceState>("idle");

  const debouncerRef = useRef<ReturnType<typeof createDebouncer<Args>>>(null);
  const debounced = (debouncerRef.current ??= createDebouncer(setState));

  debounced.__callback = callback;
  debounced.__waitMs = waitMs;

  return [state, debounced];
}

export function useDebounceStateless<Args extends unknown[]>(
  callback: (...args: Args) => void | Promise<void>,
  waitMs: number,
): (...args: Args) => void {
  const debouncerRef = useRef<ReturnType<typeof createDebouncer<Args>>>(null);
  const debounced = (debouncerRef.current ??= createDebouncer());

  debounced.__callback = callback;
  debounced.__waitMs = waitMs;

  return debounced;
}

export type DebounceState = "idle" | "queued" | "running";

function createDebouncer<Args extends unknown[]>(setState?: (state: DebounceState) => void) {
  let queuedArgs: Args | undefined;
  let timeoutRef: NodeJS.Timeout | number = 0;
  let lastCallTime = -9e99;

  debounced.__callback = undefined! as (...args: Args) => void | Promise<void>;
  debounced.__waitMs = undefined! as number;

  return debounced;

  function debounced(...args: Args) {
    // set the queued args to the new args
    queuedArgs = args;

    // if currently running, do nothing else
    if (!lastCallTime) return;

    // clear the timeout, if waiting for the next call
    if (timeoutRef) clearTimeout(timeoutRef);

    // set "queued" state, and start the timeout for the queued call
    setState?.("queued");
    timeoutRef = setTimeout(popQueueAndRun, debounced.__waitMs);
  }
  function popQueueAndRun() {
    // Clear the timeout id
    timeoutRef = 0;
    // Pop the next queued arguments
    const nextArgs = queuedArgs!;
    queuedArgs = undefined;
    // Set the "running" state
    setState?.("running");
    // Set lastCallTime to 0, to indicate that the call is in progress
    lastCallTime = 0;

    try {
      // Run the callback
      const result = debounced.__callback(...nextArgs);
      // When it's finished, set the last call time
      result instanceof Promise ? result.then(setLastCallTime, setLastCallTime) : setLastCallTime();
    } catch (err) {
      setLastCallTime();
      throw err;
    }
  }
  function setLastCallTime() {
    lastCallTime = performance.now();
    // if there's already a next call queued, set "queued" state, and start the timeout again
    if (queuedArgs) {
      setState?.("queued");
      timeoutRef = setTimeout(popQueueAndRun, debounced.__waitMs);
    } else {
      // nothing else queued, set "idle" state
      setState?.("idle");
    }
  }
}
