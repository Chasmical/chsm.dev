import { generateFeed } from "..";
import { NextResponse } from "next/server";

export async function GET() {
  const feed = await generateFeed();

  return new NextResponse(feed.atom1(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
