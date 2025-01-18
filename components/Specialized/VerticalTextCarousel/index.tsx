"use client";
import { useRef } from "react";
import useInterval from "@lib/hooks/useInterval";
import useRefState from "@lib/hooks/useRefState";
import useEventThroughRef from "@lib/hooks/useEventThroughRef";
import styles from "./index.module.scss";

const scrollViewOffset = 3;

export interface VerticalTextCarouselProps {
  options: React.ReactNode[];
}

export default function VerticalTextCarousel({ options }: VerticalTextCarouselProps) {
  const scrollPos = useRefState(0);
  const lastManualScrollTime = useRef(-1000);

  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  const smoothScrollView = (diff = 1) => {
    let newPos = scrollPos.current + diff;

    // If new position is outside the normalized view, handle the transition
    if (newPos < 0 || newPos >= options.length) {
      // Normalize the scroll position
      newPos -= Math.floor(newPos / options.length) * options.length;

      // Store the target position, and revert to previous position
      const targetPos = newPos;
      newPos -= diff;

      // Temporarily suppress the movement animation
      const viewStyle = viewRef.current!.style;
      const origTransition = viewStyle.transition;
      viewStyle.transition = "none";

      // After one animation frame, set to the actual target position, for the proper animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            viewStyle.transition = origTransition;
            scrollPos.setValue(targetPos);
          });
        });
      });
    }

    scrollPos.setValue(newPos);
  };

  useInterval(() => {
    // Wait for 3s after last manual scroll before auto-scrolling
    // (for on page load, see lastManualScrollTime initial value)
    if (performance.now() - lastManualScrollTime.current > 3000 && document.visibilityState !== "hidden") {
      // Scroll once every 2.5s
      smoothScrollView();
      return 2500;
    }
    // Wait until auto-scroll activates
    return 100;
  });

  const tryScrollManually = (down: boolean) => {
    // Rate limit to one manual scroll per 0.4s
    const curTime = performance.now();
    if (curTime - lastManualScrollTime.current < 400) return;
    lastManualScrollTime.current = curTime;

    // Make the manual scrolls' animation more responsive
    viewRef.current!.style.transition = "transform 0.35s ease-out";
    setTimeout(() => viewRef.current!.style.removeProperty("transition"), 350);
    smoothScrollView(down ? 1 : -1);
  };

  // "wheel" event is passive by default in React and cannot be prevented, so useEventThroughRef is needed
  const setContainerRef = useEventThroughRef(containerRef, "wheel", ev => {
    ev.preventDefault();
    tryScrollManually(ev.deltaY > 0);
  });
  const onKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.code === "ArrowUp" || ev.code === "ArrowDown") {
      ev.preventDefault();
      tryScrollManually(ev.code === "ArrowDown");
    }
  };

  const optionElements = options.map((option, i) => (
    <div key={i} className={styles.option} data-current={i === scrollPos.current ? true : undefined}>
      {typeof option === "string" ? <span>{option}</span> : option}
    </div>
  ));

  return (
    <div className={styles.wrapper}>
      <div
        ref={setContainerRef}
        tabIndex={0}
        className={styles.container}
        style={{ "--scroll-offset": scrollPos.current }}
        onKeyDown={onKeyDown}
      >
        <div ref={viewRef} className={styles.options}>
          {/* insert "fake" over-scroll elements on both sides */}
          {optionElements.slice(optionElements.length - scrollViewOffset)}
          {optionElements}
          {optionElements.slice(0, scrollViewOffset)}
        </div>
        <div className={styles.outline} />
      </div>
    </div>
  );
}

declare module "csstype" {
  interface Properties {
    "--scroll-offset"?: number;
  }
}
