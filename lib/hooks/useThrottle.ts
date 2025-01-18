"use client";
import { useRef, useState } from "react";

export default function useThrottle<Args extends unknown[]>(
  callback: (...args: Args) => void | Promise<void>,
  waitMs: number,
): [state: ThrottleState, run: (...args: Args) => void] {
  const [state, setState] = useState<ThrottleState>("idle");

  const throttlerRef = useRef<ReturnType<typeof createThrottler<Args>>>(null);
  const throttled = (throttlerRef.current ??= createThrottler(setState));

  throttled.__callback = callback;
  throttled.__waitMs = waitMs;

  return [state, throttled];
}

export function useThrottleStateless<Args extends unknown[]>(
  callback: (...args: Args) => void | Promise<void>,
  waitMs: number,
): (...args: Args) => void {
  const throttlerRef = useRef<ReturnType<typeof createThrottler<Args>>>(null);
  const throttled = (throttlerRef.current ??= createThrottler());

  throttled.__callback = callback;
  throttled.__waitMs = waitMs;

  return throttled;
}

export type ThrottleState = "idle" | "running" | "cooldown" | "queued";

function createThrottler<Args extends unknown[]>(setState?: (state: ThrottleState) => void) {
  let queuedArgs: Args | undefined;
  let timeoutRef: NodeJS.Timeout | number = 0;
  let lastCallTime = -9e99;

  throttled.__callback = undefined! as (...args: Args) => void | Promise<void>;
  throttled.__waitMs = undefined! as number;

  return throttled;

  function throttled(...args: Args) {
    const wasAlreadyQueued = !!queuedArgs;
    // set the queued args to the new args
    queuedArgs = args;

    // if currently running, or if the next call is already scheduled, do nothing else
    if (!lastCallTime || wasAlreadyQueued) return;

    // clear the timeout, if waiting to set "idle" state
    if (timeoutRef) clearTimeout(timeoutRef);

    // check if the next call is due
    const cooldownLeft = throttled.__waitMs - (performance.now() - lastCallTime);

    if (cooldownLeft <= 0) {
      // run it now with new args
      popQueueAndRun();
    } else {
      // set "queued" state, and start the timeout for the queued call
      setState?.("queued");
      timeoutRef = setTimeout(popQueueAndRun, cooldownLeft);
    }
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
      const result = throttled.__callback(...nextArgs);
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
      timeoutRef = setTimeout(popQueueAndRun, throttled.__waitMs);
    } else if (setState) {
      // when tracking state, set "cooldown" state, and start the timeout to set "idle" state
      setState("cooldown");
      timeoutRef = setTimeout(() => ((timeoutRef = 0), setState("idle")), throttled.__waitMs);
    }
  }
}
