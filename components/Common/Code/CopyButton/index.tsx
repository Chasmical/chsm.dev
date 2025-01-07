"use client";
import { useRef } from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface CodeCopyButtonProps {
  float?: boolean;
  icon: React.ReactNode;
}

export default function CodeCopyButton({ float, icon }: CodeCopyButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const copyContents = () => {
    const pre = buttonRef.current!.closest("[role=panel]")!.querySelector("pre")!;
    const content = pre.textContent;
    if (content) navigator.clipboard.writeText(content);
  };

  return (
    <button ref={buttonRef} className={clsx(styles.copyButton, float && styles.floating)} onClick={copyContents}>
      {icon}
    </button>
  );
}
