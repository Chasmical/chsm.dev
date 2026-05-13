import { useMemo } from "react";
import type { oEmbedResponse } from "@lib/oembed";
import YouTubeEmbed from "./youtube";

export interface EmbedProps {
  url: string;
  data: oEmbedResponse | string;
  // ...props
  className?: string;
  style?: React.CSSProperties;
}

export default function Embed({ url, data, ...props }: EmbedProps) {
  const embed = useMemo<oEmbedResponse>(
    () => (typeof data === "string" ? (JSON.parse(data) as oEmbedResponse) : data),
    [data],
  );

  if (embed.provider_name === "YouTube" && embed.type === "video") {
    return <YouTubeEmbed url={url} data={embed} {...props} />;
  } else {
    return <span style={{ color: "red" }}>{`Unsupported embed: ${url} (${embed.provider_name}, ${embed.type})`}</span>;
  }
}
