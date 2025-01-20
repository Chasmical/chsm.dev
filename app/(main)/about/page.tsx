/* eslint-disable react/jsx-key */
import { Charm, Playpen_Sans } from "next/font/google";
import VerticalTextCarousel from "@components/Specialized/VerticalTextCarousel";
import Link from "@components/Common/Link";
import styles from "./page.module.scss";

const charm = Charm({ subsets: ["latin"], style: ["normal"], weight: "400" });
const playpenSans = Playpen_Sans({ subsets: ["latin"], style: ["normal"], weight: "400" });

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* TODO: remove env condition when finished */}
      {process.env.NODE_ENV === "development" && (
        <>
          <TitleCarouselSection />
        </>
      )}

      <p>
        <Link href="/blog">{"⇒ Go to Blog"}</Link>
      </p>
      <p>
        <Link href="/markdown">{"⇒ Go to Markdown demo"}</Link>
      </p>
    </div>
  );
}

function TitleCarouselSection() {
  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselPrefix}>
        {"Hi. I'm "}
        <span className={styles.name}>{"Kaz"}</span>
        {", "}
      </div>

      <VerticalTextCarousel
        options={[
          "a software developer",
          "a full-stack web developer",
          "a game modder",
          <>
            {"the creator of "}
            <Link href="https://chasmical.github.io/RogueLibs">{"RogueLibs"}</Link>
          </>,
          "the one who made this website",
          "a meticulous perfectionist",
          <span className={styles.brokenText}>
            {[..."a god-awful web-designer"].map((letter, i) => (
              <span key={i} style={{ ["--i" as never]: i + 587 }}>
                {letter}
              </span>
            ))}
          </span>,
          "a microoptimization expert",
          <span data-item-id="48779" data-req-method="secretApiMethod">
            {"an accidental hacker"}
          </span>,
          <span style={{ fontFamily: "var(--mono-font)" }}>{"a programming enthusiast"}</span>,
          "a proficient web surfer",
          <span
            className={charm.className}
            style={{ fontSize: "1.1em", transform: "scale(1.15, 1)", transformOrigin: "left" }}
          >
            {"a picky media connoisseur"}
          </span>,
          "a guy that does the group project",
          <span className={styles.wikiText}>
            {"a "}
            <a href="https://tvtropes.org/pmwiki/pmwiki.php/Main/InHarmsWay" target="_blank">
              {"veteran"}
            </a>{" "}
            <a href="https://en.wikipedia.org/wiki/Wiki_rabbit_hole" target="_blank">
              {"wiki walker"}
            </a>
            <sup>
              <a href="https://knowyourmeme.com/memes/citation-needed" target="_blank">
                {"[citation needed]"}
              </a>
            </sup>
          </span>,
          "an introverted furry",
          <span className={playpenSans.className}>{"an easily distracted oddball"}</span>,
          "an indecisive team lead",
          "a beginner font designer",
          "a metal nerdcore music enjoyer",
          "an aspiring game dev",
        ]}
      />
    </div>
  );
}
