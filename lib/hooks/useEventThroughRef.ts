import useLatest from "@lib/hooks/useLatest";

type PassiveByDefaultEvent = "wheel" | "touchstart" | "touchmove";

/**
 * A work-around for attaching event listeners for events, that are passive by default in React.
 *
 * Attaches the event listener as soon as the element sets its ref.
 */

export default function useEventThroughRef<Target extends HTMLElement, Type extends PassiveByDefaultEvent>(
  ref: React.Ref<Target>,
  type: Type,
  handler: (this: Target, event: HTMLElementEventMap[Type]) => void,
): React.Ref<Target> {
  const handlerRef = useLatest(handler);

  return target => {
    // Run the default ref logic
    let defaultCleanup: void | (() => void);
    ref && (typeof ref === "function" ? (defaultCleanup = ref(target)) : (ref.current = target));

    function listener(this: Target, event: HTMLElementEventMap[Type]) {
      handlerRef.current.apply(this, [event]);
    }
    // Attach an event listener to the target
    target?.addEventListener(type, listener as never);

    // On clean-up, remove the event listener, and run the default clean-up as well
    return () => {
      target?.removeEventListener(type, listener as never);
      defaultCleanup?.();
    };
  };
}
