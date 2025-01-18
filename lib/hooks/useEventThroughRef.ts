import { useRef } from "react";

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
  // Store several state variables in the same ref
  const stateRef = useRef<InternalState<Target, Type>>(null!);
  const state = (stateRef.current ??= {});
  state.handler = handler;

  return target => {
    // Run the default ref logic
    ref && (typeof ref === "function" ? ref(target) : (ref.current = target));

    // Re-attach the event listener if the target changed
    if (target !== state.target) {
      function listener(this: Target, event: HTMLElementEventMap[Type]) {
        state.handler!.apply(this, [event]);
      }

      // Remove the old listener, and attach the new one
      state.target?.removeEventListener(type, state.listener! as never);
      target?.addEventListener(type, listener as never);
      state.target = target;
      state.listener = listener;
    }
  };
}

interface InternalState<Target extends HTMLElement, Type extends PassiveByDefaultEvent> {
  handler?: (this: Target, event: HTMLElementEventMap[Type]) => void;
  listener?: (this: Target, event: HTMLElementEventMap[Type]) => void;
  target?: Target | null;
}
