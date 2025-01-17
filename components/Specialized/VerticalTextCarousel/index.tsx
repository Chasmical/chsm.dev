"use client";
import { useEffect, useRef, useState } from "react";
import useLatest from "@lib/hooks/useLatest";
import useEvent from "@lib/hooks/useEvent";
import styles from "./index.module.scss";
import clsx from "clsx";

const optionViewOffset = 3;

interface VerticalTextCarouselProps {
  options: React.ReactNode[];
}
export default function VerticalTextCarousel({ options }: VerticalTextCarouselProps) {
  const lastScrollTime = useRef(0);
  const optionsLength = useLatest(options.length);

  const [scrollPos, setScrollPos] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsBlockRef = useRef<HTMLDivElement>(null);

  const smoothScrollListBy = (diff: number) => {
    setScrollPos(oldPos => {
      let next = oldPos + diff;
      // If new position is within range, return it
      if (next >= 0 && next < optionsLength.current) return next;

      // Temporarily suppress the movement animation
      const optionsBlock = optionsBlockRef.current!;
      optionsBlock.style.transition = "none";

      // Normalize the scroll position
      if (next < 0) next += optionsLength.current;
      if (next >= optionsLength.current) next -= optionsLength.current;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          optionsBlock.style.removeProperty("transition");
          setScrollPos(next);
        });
      });

      return next + (diff > 0 ? -1 : 1);
    });
  };

  useEffect(() => {
    let timeoutRef: NodeJS.Timeout | number = 0;

    const idleScroll = () => {
      if (performance.now() - lastScrollTime.current < 3000) {
        timeoutRef = setTimeout(idleScroll, 100);
      } else {
        smoothScrollListBy(1);
        timeoutRef = setTimeout(idleScroll, 2500);
      }
    };

    timeoutRef = setTimeout(idleScroll, 2000);
    return () => clearTimeout(timeoutRef);
  }, []);

  const tryManualScroll = (down: boolean) => {
    const curTime = performance.now();
    if (curTime - lastScrollTime.current < 600) return;
    lastScrollTime.current = curTime;
    smoothScrollListBy(down ? 1 : -1);
  };

  useEvent(containerRef.current, "wheel", ev => {
    ev.preventDefault();
    ev.stopPropagation();
    tryManualScroll(ev.deltaY > 0);
  });
  useEvent(containerRef.current, "keydown", ev => {
    if (ev.code === "ArrowUp" || ev.code === "ArrowDown") {
      ev.preventDefault();
      ev.stopPropagation();
      tryManualScroll(ev.code === "ArrowDown");
    }
  });

  const items = options.map((opt, i) => {
    return (
      <div className={clsx(styles.option, i === scrollPos && styles.selected)} key={i}>
        {opt}
      </div>
    );
  });

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} tabIndex={0} className={styles.container} style={{ "--scroll-offset": scrollPos }}>
        <div ref={optionsBlockRef} className={styles.options}>
          {items.slice(items.length - optionViewOffset)}
          {items}
          {items.slice(0, optionViewOffset + optionViewOffset)}
        </div>
        <div className={styles.mask} />
        <div className={styles.shadowTop} />
        <div className={styles.shadowBottom} />
      </div>
    </div>
  );
}

declare module "csstype" {
  interface Properties {
    "--scroll-offset"?: number;
  }
}
