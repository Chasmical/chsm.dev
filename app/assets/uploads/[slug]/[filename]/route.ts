import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@lib/database/server";

interface RouteProps {
  params: Promise<{ slug: string; filename: string }>;
}

export async function GET(_request: NextRequest, { params: paramsPromise }: RouteProps) {
  const params = await paramsPromise;

  const supabase = createServerSupabase("SERVICE_ROLE", { revalidate: 3600 });
  const { data } = await supabase.from("uploads").select("*").eq("slug", params.slug).maybeSingle();

  if (!data || data.filename !== params.filename) notFound();

  // TODO: think of better uploaded asset paths (/assets/uploads/fdghbvef/Image.png is a bit long)
  // TODO: maybe add a route in blog/[...slug]/, to allow use like ![](./Image.png) (then link/reference uploads to posts?)

  const { publicUrl } = supabase.storage.from("uploads").getPublicUrl(params.slug).data;

  const res = await fetch(publicUrl, { next: { revalidate: 3600 } });

  const blob = await res.blob();

  // Since files are stored in the bucket without extensions, try to infer the type from the filename
  let contentType = res.headers.get("Content-Type")!;
  if (contentType === "binary/octet-stream") {
    const extension = params.filename.slice(params.filename.lastIndexOf(".")).toLowerCase();

    const inferredType = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".mp3": "audio/mp3",
      ".mp4": "video/mp4",
    }[extension];

    if (inferredType) contentType = inferredType;
  }

  // Copy some headers from the original response
  const copyHeaders = ["Content-Length", "Date", "Etag", "Last-Modified"];
  const origHeaders = Object.fromEntries(copyHeaders.map(h => [h, res.headers.get(h)]));

  return new NextResponse(blob, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
      ...origHeaders,
    },
  });
}
