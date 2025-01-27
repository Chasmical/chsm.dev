import type { Metadata } from "next";
import Link from "@components/Common/Link";
import styles from "./layout.module.scss";
import { SupabaseProvider } from "@lib/hooks/useSupabaseSession";

export default function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <ClientProviders>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.navbarLinks}>
            <h2>{"chsm.dev"}</h2>
            <Link href="/">{"Main page"}</Link>
            {/* <Link href="/subtext">{"Subtext"}</Link> */}
            <Link href="/blog">{"Blog"}</Link>
          </div>
        </nav>
      </header>

      {children}

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <div>
            <h4>{"Resources"}</h4>
            <Link href="/about">{"About chsm.dev"}</Link>
            <Link href="https://github.com/Chasmical/chsm.dev">{"GitHub repo"}</Link>
          </div>
          <div>
            <h4>{"Subtext extension"}</h4>
            {"Work-In-Progress"}
            {/* <Link href="/subtext">{"About Subtext"}</Link>
            <Link href="/subtext/packs/6">{"Sub packs"}</Link>
            <Link href="/subtext/collections/1">{"Sub collections"}</Link> */}
          </div>
          <div>
            <h4>{"My socials"}</h4>
            <Link href="https://discord.com/users/511178002277597185">{"Discord"}</Link>
            <Link href="https://github.com/Chasmical">{"GitHub"}</Link>
            <Link href="https://bsky.app/profile/chsm.dev">{"Bluesky"}</Link>
          </div>
          <div>
            <h4>{"Tools and utilities"}</h4>
            <Link href="/markdown">{"Markdown demo"}</Link>
            <Link href="/tools">{"Various tools"}</Link>
          </div>
        </div>
        <div className={styles.footerCopyright}>
          {`Copyright © ${new Date().getUTCFullYear()} Chasmical`}
          <div />
        </div>
      </footer>
    </ClientProviders>
  );
}

async function ClientProviders({ children }: React.PropsWithChildren) {
  return <SupabaseProvider>{children}</SupabaseProvider>;
}

const title = "chsm.dev";
const description = "A personal website for a bunch of stupid stuff";

export const metadata: Metadata = {
  title: { default: title, template: `%s | ${title}` },
  description,
  generator: "Next.js",
  applicationName: title,
  keywords: [],
  authors: [{ name: "Chasmical", url: "/user/Chasmical" }],
  creator: "Chasmical",
  formatDetection: { email: false, address: false, telephone: false },

  openGraph: {
    type: "website",
    title: { default: title, template: `%s | ${title}` },
    description,
    locale: "en",
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: { default: title, template: `%s | ${title}` },
    description,
    images: [],
  },
  robots: {
    index: true,
    follow: true,
  },
};
