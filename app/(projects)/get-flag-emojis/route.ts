import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { createHash } from "crypto";
import JSZip from "jszip";

const getFontHash = unstable_cache(
  async () => {
    const url = `https://github.com/Chasmical/flag-emojis-for-windows/releases/latest/download/Segoe.UI.Emoji.with.Twemoji.Flags.zip`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Segoe.UI.Emoji.with.Twemoji.Flags.zip (${res.status} ${res.statusText})`);

    const zip = await JSZip.loadAsync(await res.arrayBuffer());
    const fontData = await zip.file("Segoe.UI.Emoji.with.Twemoji.Flags.ttf")!.async("nodebuffer");
    return createHash("sha256").update(fontData).digest("hex");
  },
  undefined,
  { revalidate: 3600 },
);

export async function GET(_request: NextRequest) {
  let url = `https://raw.githubusercontent.com/Chasmical/flag-emojis-for-windows/main/scripts/install-script.ps1`;
  let res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`install-script.ps1 (${res.status} ${res.statusText}) `);
  let script = await res.text();

  const fontHash = await getFontHash();
  console.warn(`The hash is ${fontHash}`);

  let marker = "<THIS-NOTICE-WILL-BE-REMOVED-BY-THE-HOST-WEBSITE>";
  script = script.slice(script.indexOf(marker) + marker.length).trimStart();

  marker = "<THE-LATEST-HASH-WILL-BE-INSERTED-HERE-BY-THE-HOST-WEBSITE>";
  script = script.replace(marker, fontHash);

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/x-powershell",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
