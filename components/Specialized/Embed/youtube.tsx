"use client";
import { useMemo, useState } from "react";
import type { oEmbedVideoResponse } from "@lib/oembed";
import styles from "./youtube.module.scss";
import clsx from "clsx";

export interface YouTubeEmbedProps {
  url: string;
  data: oEmbedVideoResponse | string;
  className?: string;
  // ...props
  style?: React.CSSProperties;
}

export default function YouTubeEmbed({ url: _url, data, className, ...props }: YouTubeEmbedProps) {
  const [embed, width, height] = useMemo(() => {
    const embed = typeof data === "string" ? (JSON.parse(data) as oEmbedVideoResponse) : data;

    // Sometimes YouTube provides weird sizes here, so we'll adjust them for 16:9 ratio
    const width = embed.thumbnail_width ?? embed.width;
    const height = (width / 16) * 9;

    // Correct the <iframe>'s dimensions as well
    embed.html = embed.html.replace(
      `width="${embed.width}" height="${embed.height}"`,
      `width="${width}" height="${height}"`,
    );

    return [embed, width, height];
  }, [data]);

  props.style = { ...props.style, width, height };

  const [active, setActive] = useState(false);

  if (active) {
    // Return the provided <iframe> HTML
    return (
      <div
        role="panel"
        className={clsx(styles.embed, className)}
        {...props}
        dangerouslySetInnerHTML={{ __html: embed.html }}
      />
    );
  }

  // Return a placeholder thumbnail, to prevent tracking
  return (
    <div role="panel" className={clsx(styles.embed, className)} {...props}>
      {embed.thumbnail_url && (
        <AdaptiveThumbnail
          url={embed.thumbnail_url}
          width={width}
          height={height}
          alt={embed.title}
          onClick={() => setActive(true)}
        />
      )}
      <div className={styles.gradient} />
      <div className={styles.title}>{embed.title}</div>
      <div className={styles.playButton}>
        <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
          <path
            d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
            fill="#f00"
          />
          <path d="M 45,24 27,14 27,34" fill="#fff" />
        </svg>
      </div>
      <div className={styles.optionsButton}>
        <svg height="100%" viewBox="-5 -5 36 36" width="100%">
          <path
            d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            fill="#fff"
          ></path>
        </svg>
      </div>
      <div className={styles.channelLogo}></div>
    </div>
  );
}

interface AdaptiveThumbnailProps {
  url: string;
  width: number;
  height: number;
  alt?: string;
  onClick?: () => void;
}

function AdaptiveThumbnail({ url, ...props }: AdaptiveThumbnailProps) {
  const [thumbnails, setThumbnails] = useState(() => ({
    hq: url, // default, 480x360
    sd: url?.replace("hqdefault", "sddefault"), // 640x480
    max: url?.replace("hqdefault", "maxresdefault"), // 1280x720
  }));

  const fallbackThumbnail = (img: HTMLImageElement) => {
    const ratio = window.devicePixelRatio;
    const [width, height] = [img.naturalWidth, img.naturalHeight];

    // Check for the 404 fallback 120x90 image that YouTube serves
    if (Math.abs(width * ratio - 120) < 1 && Math.abs(height * ratio - 90) < 1) {
      console.warn("YouTube thumbnail not found: " + img.src);

      setThumbnails(prev => {
        if (prev.max != prev.sd) {
          return { ...prev, max: prev.sd };
        }
        if (prev.sd != prev.hq) {
          return { ...prev, max: prev.hq, sd: prev.hq };
        }
        return prev;
      });
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      ref={img => void (img?.complete && fallbackThumbnail(img))}
      className={styles.thumbnail}
      srcSet={`${thumbnails.hq}, ${thumbnails.sd} 1.3x, ${thumbnails.max} 2x`}
      src={thumbnails.max}
      onLoad={ev => fallbackThumbnail(ev.currentTarget)}
      {...props}
    />
  );
}
