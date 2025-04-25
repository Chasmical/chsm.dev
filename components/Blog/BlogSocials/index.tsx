import Link from "@components/Common/Link";
import RssIcon from "./icons/rss";
import GitHubIcon from "./icons/github";
import styles from "./index.module.scss";

export default function BlogSocials() {
  return (
    <div className={styles.container}>
      <h4>{"Follow me or this blog on:"}</h4>
      <div className={styles.socialsList}>
        <Link className={styles.socialLink} href="/blog/rss.xml" blank>
          <RssIcon size="1.5em" />
          {"RSS Feed"}
        </Link>
        <Link className={styles.socialLink} href="https://github.com/Chasmical">
          <GitHubIcon size="1.5em" />
          {"GitHub"}
        </Link>
      </div>
    </div>
  );
}
