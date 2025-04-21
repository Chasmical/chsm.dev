import { generateFeed } from "..";
import { NextResponse } from "next/server";

export async function GET() {
  const feed = await generateFeed();

  return new NextResponse(feed.json1(), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
