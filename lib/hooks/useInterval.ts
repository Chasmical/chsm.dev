import { useEffect } from "react";
import useLatest from "@lib/hooks/useLatest";

/**
 * Calls the specified function with an adjustable interval. Unlike `setInterval`, the function is called immediately on start as well.
 */

export default function useInterval(callback: () => number): void {
  const callbackRef = useLatest(callback);

  useEffect(() => {
    let timeoutRef: NodeJS.Timeout | number = 0;

    const next = () => {
      const delayMs = callbackRef.current();
      timeoutRef = setTimeout(next, delayMs);
    };
    next();

    return () => clearTimeout(timeoutRef);
  }, []);
}
