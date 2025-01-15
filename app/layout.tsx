import type { Metadata, Viewport } from "next";
import { inter, JetBrains_Mono_NL } from "@app/fonts";
import "./global.scss";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "chsm.dev",
  description: "A personal website for a bunch of stupid stuff",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#fbb946", // var(--color-accent)
};

const fontsClassName = clsx(inter.variable, JetBrains_Mono_NL.variable);

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={fontsClassName}>
      <body>{children}</body>
    </html>
  );
}
