import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@lib/database/server";

interface RouteProps {
  params: Promise<{ name: string }>;
}

async function getEmojiUrl(fileName: string) {
  if (!fileName.endsWith(".png")) return;
  const emojiName = fileName.slice(0, -4);

  // Fetch the list with available emoji names
  const supabase = createServerSupabase("anonymous");
  const { publicUrl } = supabase.storage.from("emojis").getPublicUrl(".names.txt").data;
  const res = await fetch(publicUrl, { next: { revalidate: 86400 } });
  const namesSeparatedBySemicolons = await res.text();

  // Validate the specified emoji name, and return its url
  if (namesSeparatedBySemicolons.includes(";" + emojiName + ";")) {
    return supabase.storage.from("emojis").getPublicUrl(fileName).data.publicUrl;
  }
}

export async function GET(_request: NextRequest, { params: paramsPromise }: RouteProps) {
  // Resolve params, validate the emoji name and get its url
  const params = await paramsPromise;
  const emojiUrl = (await getEmojiUrl(params.name)) || notFound();

  // Fetch the emoji file
  const res = await fetch(emojiUrl, { next: { revalidate: 86400 } });
  if (!res.ok) notFound();
  const blob = await res.blob();

  // Copy some headers from the original response
  const copyHeaders = ["Content-Length", "Date", "Etag", "Last-Modified"];
  const origHeaders = Object.fromEntries(copyHeaders.map(k => [k, res.headers.get(k)]));

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
      ...origHeaders,
    },
  });
}
