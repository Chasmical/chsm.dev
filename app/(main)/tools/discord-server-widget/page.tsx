"use client";
import { useEffect, useMemo, useState } from "react";
import { useThrottleStateless } from "@lib/hooks/useThrottle";
import { CodeBlock } from "@components/Common/Code";
import Link from "@components/Common/Link";
import styles from "./page.module.scss";

export default function DiscordServerWidgetTool() {
  const [input, setInput] = useState("766725034445635634");

  const [guildId, setGuildId] = useState(input);
  const [widgetData, setWidgetData] = useState<DiscordGuildWidget>();

  const fetchWidgetAsync = useThrottleStateless(async (id: string) => {
    if (Number.isNaN(parseInt(id))) {
      setGuildId("");
      setWidgetData(undefined);
    } else {
      setGuildId(id);
      const res = await fetch(`https://discord.com/api/guilds/${id}/widget.json`, { cache: "no-cache" });
      setWidgetData(await res.json());
    }
  }, 1000);

  useEffect(() => fetchWidgetAsync(input), [input]);

  return (
    <div className={styles.panel}>
      <div className={styles.firstCol}>
        <h2>{"Discord Server Widget Generator"}</h2>
        <p>
          {"A tool for previewing Discord's server widgets."}
          <br />
          {"Can also be used to get invites through server IDs."}
        </p>

        <div className={styles.inputs}>
          <label>{"Server ID:"}</label>
          <input type="text" value={input} onChange={ev => setInput(ev.target.value)} />
        </div>
        {guildId && (
          <>
            {widgetData?.name && (
              <h2>
                <Link href={widgetData.instant_invite}>{widgetData.name}</Link>
              </h2>
            )}

            <div>
              <iframe
                className={styles.widget}
                src={`https://discord.com/widget?id=${guildId}&theme=dark`}
                width="400"
                height="500"
                allowtransparency="true"
                frameBorder="0"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
              />
            </div>
          </>
        )}
      </div>
      <div className={styles.secondCol}>
        <GuildWidgetJsons id={guildId} data={widgetData} />
      </div>
    </div>
  );
}

function GuildWidgetJsons({ id: inputId, data }: { id: string; data?: DiscordGuildWidget }) {
  const id = data ? (data.id ?? inputId) : inputId;

  const jsonGuild = useMemo(() => {
    return JSON.stringify({ ...data, members: undefined, channels: undefined }, null, 4);
  }, [data]);

  const jsonChannels = useMemo(() => {
    if (!data?.channels) return "";
    return [
      "[",
      ...data.channels
        .sort((a, b) => a.position - b.position)
        .map(
          (ch, i, arr) =>
            `  { "position": ${ch.position}, "name": "${ch.name}", "id": "${ch.id}" }${i + 1 < arr.length ? "," : ""}`,
        ),
      "]",
    ].join("\n");
  }, [data]);

  const jsonUsers = useMemo(() => {
    if (!data?.members) return "";
    return JSON.stringify(data?.members ?? [], null, 2);
  }, [data]);

  return (
    <>
      <CodeBlock lang="json" highlighter="prism" nonums title={`/api/guilds/${id}/widget.json`}>
        {jsonGuild}
      </CodeBlock>
      {jsonChannels && (
        <CodeBlock lang="json" highlighter="prism" nonums title={`/api/guilds/${id}/widget.json (channels)`}>
          {jsonChannels}
        </CodeBlock>
      )}
      {jsonUsers && (
        <CodeBlock lang="json" highlighter="prism" nonums title={`/api/guilds/${id}/widget.json (members)`}>
          {jsonUsers}
        </CodeBlock>
      )}
    </>
  );
}

interface DiscordGuildWidget {
  id: string;
  instant_invite: string;
  name: string;
  presence_count: number;

  members: {
    id: string;
    status: string;
    username: string;
    discriminator: string;
    avatar: null;
    avatar_url: string;
    game?: { name: string };
  }[];
  channels: {
    id: string;
    name: string;
    position: number;
  }[];
}

declare module "react" {
  interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
    allowtransparency?: `${boolean}`;
  }
}
